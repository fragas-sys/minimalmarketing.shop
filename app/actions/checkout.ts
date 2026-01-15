'use server';

import Stripe from 'stripe';
import { db } from '@/lib/db';
import { orders, products } from '@/drizzle/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { applyDiscountToProducts } from '@/lib/discount-helpers';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

export async function createCheckoutSession(
  userId: string,
  productIds: string[]
) {
  try {
    // 1. VALIDAÇÕES INICIAIS
    if (!userId || !productIds || productIds.length === 0) {
      throw new Error('Parâmetros inválidos');
    }

    // 2. BUSCAR PRODUTOS VÁLIDOS NO BANCO
    const validProducts = await db
      .select()
      .from(products)
      .where(and(
        eq(products.isActive, true),
        inArray(products.id, productIds)
      ));

    if (validProducts.length === 0) {
      throw new Error('Nenhum produto válido encontrado');
    }

    // 3. VERIFICAR SE USUÁRIO JÁ POSSUI PEDIDOS PENDENTES PARA ESTES PRODUTOS
    const existingPendingOrders = await db
      .select()
      .from(orders)
      .where(and(
        eq(orders.userId, userId),
        eq(orders.status, 'PENDING'),
        inArray(orders.productId, productIds)
      ));

    // Remover pedidos pendentes antigos (cleanup)
    if (existingPendingOrders.length > 0) {
      const oldOrderIds = existingPendingOrders.map(o => o.id);
      await db
        .delete(orders)
        .where(inArray(orders.id, oldOrderIds));

      console.log(`🧹 Removidos ${oldOrderIds.length} pedidos pendentes antigos`);
    }

    // 4. APLICAR DESCONTOS
    const productsList = validProducts.map(p => ({
      id: p.id,
      category: p.category,
      price: p.price,
    }));

    const discountsMap = await applyDiscountToProducts(productsList);

    // 5. CRIAR PEDIDOS PENDENTES COM PREÇOS CORRETOS
    const orderIds: string[] = [];
    const orderDetails: Array<{
      productId: string;
      productName: string;
      originalPrice: number;
      finalPrice: number;
      hasDiscount: boolean;
      discountPercentage: number;
    }> = [];

    for (const product of validProducts) {
      const discountInfo = discountsMap.get(product.id)!;
      const orderId = nanoid();

      await db.insert(orders).values({
        id: orderId,
        userId,
        productId: product.id,
        amount: discountInfo.finalPrice, // Preço COM desconto
        status: 'PENDING',
      });

      orderIds.push(orderId);
      orderDetails.push({
        productId: product.id,
        productName: product.name,
        originalPrice: discountInfo.originalPrice,
        finalPrice: discountInfo.finalPrice,
        hasDiscount: discountInfo.hasDiscount,
        discountPercentage: discountInfo.discountPercentage,
      });

      console.log(`📦 Pedido criado: ${product.name} - ${discountInfo.hasDiscount ? `${discountInfo.originalPrice} → ${discountInfo.finalPrice} (-${discountInfo.discountPercentage}%)` : discountInfo.finalPrice}`);
    }

    // 6. CRIAR LINE ITEMS PARA STRIPE COM PREÇOS CORRETOS
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      validProducts.map(product => {
        const discountInfo = discountsMap.get(product.id)!;

        return {
          price_data: {
            currency: 'brl',
            product_data: {
              name: product.name,
              description: product.shortDescription,
              images: [product.image],
              metadata: {
                productId: product.id,
                originalPrice: discountInfo.originalPrice.toString(),
                ...(discountInfo.hasDiscount && {
                  discountApplied: 'true',
                  discountPercentage: discountInfo.discountPercentage.toString(),
                }),
              },
            },
            unit_amount: discountInfo.finalPrice, // Preço COM desconto em centavos
          },
          quantity: 1,
        };
      });

    // 7. CALCULAR TOTAIS
    const totalOriginal = orderDetails.reduce((sum, o) => sum + o.originalPrice, 0);
    const totalFinal = orderDetails.reduce((sum, o) => sum + o.finalPrice, 0);
    const totalSavings = totalOriginal - totalFinal;
    const hasAnyDiscount = totalSavings > 0;

    // 8. CRIAR CHECKOUT SESSION
    console.log('💳 Criando Stripe Checkout Session...');

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/carrinho`,
      metadata: {
        userId,
        orderIds: orderIds.join(','),
        totalOriginal: totalOriginal.toString(),
        totalFinal: totalFinal.toString(),
        hasDiscount: hasAnyDiscount.toString(),
        ...(hasAnyDiscount && {
          totalSavings: totalSavings.toString(),
        }),
      },
      // Configurações adicionais de segurança
      billing_address_collection: 'required',
      locale: 'pt-BR',
      customer_email: undefined, // O Stripe solicitará o email
    });

    console.log('✅ Session criada:', session.id);

    // 9. ATUALIZAR ORDERS COM SESSION ID
    console.log('🔄 Atualizando orders com sessionId:', session.id);
    console.log('📝 OrderIds a atualizar:', orderIds);

    await db
      .update(orders)
      .set({
        stripeCheckoutSessionId: session.id,
        updatedAt: new Date(),
      })
      .where(inArray(orders.id, orderIds));

    console.log('✅ Orders atualizadas');

    // Verificar se atualizou corretamente
    const updatedOrders = await db
      .select()
      .from(orders)
      .where(inArray(orders.id, orderIds));

    console.log('🔍 Verificando orders atualizadas:', updatedOrders.map(o => ({
      id: o.id,
      sessionId: o.stripeCheckoutSessionId,
      status: o.status,
    })));

    console.log('\n✅ ===== CHECKOUT COMPLETO =====');
    console.log('📊 Resumo:', {
      sessionId: session.id,
      orderIds,
      totalOriginal,
      totalFinal,
      savings: totalSavings,
      productsCount: validProducts.length,
    });
    console.log('================================\n');

    return {
      sessionId: session.id,
      url: session.url,
      orderIds,
      totalFinal,
      hasDiscount: hasAnyDiscount,
    };
  } catch (error) {
    console.error('❌ Erro ao criar checkout:', error);
    throw error;
  }
}
