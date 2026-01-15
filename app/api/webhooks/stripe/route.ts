import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/db';
import { orders, userAssets, processedWebhooks } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-12-15.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  console.log('\n🔔 ===== WEBHOOK RECEIVED =====');
  console.log('📅 Timestamp:', new Date().toISOString());

  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  console.log('📦 Body length:', body.length);
  console.log('🔑 Signature present:', !!signature);
  console.log('🔐 Webhook secret configured:', !!webhookSecret);

  if (!signature) {
    console.error('❌ Stripe signature missing');
    return NextResponse.json({ error: 'Signature missing' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    // 1. VALIDAR ASSINATURA DO WEBHOOK (Segurança crítica)
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('✅ Signature validated successfully');
  } catch (err: any) {
    console.error('⚠️ Webhook signature verification failed:', err.message);
    console.error('🔍 Webhook secret (first 10 chars):', webhookSecret.substring(0, 10));
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // 2. PROCESSAR EVENTO
  try {
    console.log('📨 Event type:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('📨 Webhook recebido:', {
        type: event.type,
        sessionId: session.id,
        paymentStatus: session.payment_status,
        metadata: session.metadata,
      });

      // 3. VALIDAR PAGAMENTO FOI APROVADO
      if (session.payment_status !== 'paid') {
        console.log('⚠️ Pagamento não aprovado ainda:', session.payment_status);
        return NextResponse.json({ received: true });
      }

      // 4. VERIFICAR IDEMPOTÊNCIA (Prevenir processamento duplicado)
      const existingWebhook = await db.query.processedWebhooks.findFirst({
        where: (webhooks, { eq }) => eq(webhooks.id, session.id),
      });

      if (existingWebhook) {
        console.log('⚠️ Webhook já processado anteriormente:', session.id);
        return NextResponse.json({ received: true, alreadyProcessed: true });
      }

      // 5. VALIDAR METADATA
      if (!session.metadata?.userId || !session.metadata?.orderIds) {
        console.error('❌ Metadata inválida no webhook:', session.metadata);
        throw new Error('Metadata inválida');
      }

      const { userId, orderIds } = session.metadata;
      const orderIdArray = orderIds.split(',');

      console.log('🔍 Processando pedidos:', {
        userId,
        orderCount: orderIdArray.length,
        orderIds: orderIdArray,
      });

      // 6. BUSCAR PEDIDOS NO BANCO
      console.log('🔍 Buscando pedidos com sessionId:', session.id);

      const dbOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.stripeCheckoutSessionId, session.id));

      console.log('📊 Pedidos encontrados:', dbOrders.length);

      if (dbOrders.length === 0) {
        console.error('❌ Nenhum pedido encontrado para session:', session.id);
        console.log('🔍 Tentando buscar todos os pedidos recentes...');

        // Debug: Listar últimos 5 pedidos
        const recentOrders = await db
          .select()
          .from(orders)
          .limit(5);

        console.log('📋 Últimos 5 pedidos no banco:', recentOrders.map(o => ({
          id: o.id,
          sessionId: o.stripeCheckoutSessionId,
          status: o.status,
        })));

        throw new Error('Orders not found');
      }

      // 7. VALIDAR CONSISTÊNCIA
      if (dbOrders.length !== orderIdArray.length) {
        console.warn('⚠️ Número de pedidos não bate:', {
          expected: orderIdArray.length,
          found: dbOrders.length,
        });
      }

      // 8. PROCESSAR CADA PEDIDO
      const purchaseDate = new Date();
      const processedOrders: string[] = [];

      for (const order of dbOrders) {
        try {
          // Buscar informações do produto
          const productData = await db.query.products.findFirst({
            where: (products, { eq }) => eq(products.id, order.productId),
          });

          if (!productData) {
            console.error('❌ Produto não encontrado:', order.productId);
            continue;
          }

          // Calcular data de expiração
          const accessDuration = productData.accessDuration || 365;
          const expiryDate = new Date(purchaseDate);
          expiryDate.setDate(expiryDate.getDate() + accessDuration);

          // Atualizar status do pedido
          await db
            .update(orders)
            .set({
              status: 'PAID',
              stripePaymentIntentId: session.payment_intent as string,
              purchaseDate,
              expiryDate,
              updatedAt: new Date(),
            })
            .where(eq(orders.id, order.id));

          console.log(`✅ Pedido atualizado: ${order.id}`);

          // Verificar se já existe acesso (prevenção de duplicatas)
          const existingAccess = await db.query.userAssets.findFirst({
            where: (assets, { eq, and }) =>
              and(
                eq(assets.userId, order.userId),
                eq(assets.productId, order.productId),
                eq(assets.isActive, true)
              ),
          });

          if (existingAccess) {
            console.log(`⚠️ Usuário já possui acesso ativo: User ${order.userId} - Product ${order.productId}`);

            // Atualizar data de expiração existente (estender acesso)
            const newExpiryDate = new Date(existingAccess.expiryDate);
            newExpiryDate.setDate(newExpiryDate.getDate() + accessDuration);

            await db
              .update(userAssets)
              .set({
                expiryDate: newExpiryDate,
              })
              .where(eq(userAssets.id, existingAccess.id));

            console.log(`🔄 Acesso estendido até: ${newExpiryDate.toISOString()}`);
          } else {
            // Criar novo acesso
            await db.insert(userAssets).values({
              id: nanoid(),
              userId: order.userId,
              productId: order.productId,
              orderId: order.id,
              purchaseDate,
              expiryDate,
              isActive: true,
            });

            console.log(`🎉 Novo acesso criado: User ${order.userId} - Product ${order.productId} (${productData.name})`);
          }

          processedOrders.push(order.id);
        } catch (orderError) {
          console.error(`❌ Erro ao processar pedido ${order.id}:`, orderError);
          // Continua processando outros pedidos mesmo se um falhar
        }
      }

      // 9. MARCAR WEBHOOK COMO PROCESSADO
      await db.insert(processedWebhooks).values({
        id: session.id,
        eventType: 'checkout.session.completed',
      });

      console.log('✅ Webhook processado com sucesso:', {
        sessionId: session.id,
        userId,
        processedOrders: processedOrders.length,
        totalOrders: dbOrders.length,
      });

      return NextResponse.json({
        received: true,
        processed: true,
        ordersProcessed: processedOrders.length,
      });
    }

    // Outros tipos de eventos
    console.log(`📨 Evento ignorado: ${event.type}`);
    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('❌ Webhook processing error:', {
      error: err.message,
      stack: err.stack,
      event: event?.type,
    });

    // Retornar 500 para que o Stripe tente novamente
    return NextResponse.json(
      { error: 'Internal server error', message: err.message },
      { status: 500 }
    );
  }
}
