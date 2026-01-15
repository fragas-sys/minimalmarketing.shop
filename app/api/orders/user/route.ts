import { db } from '@/lib/db';
import { userAssets, products, orders } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, internalError } from '@/lib/api-middleware';

export async function GET(request: NextRequest) {
  try {
    // 1. VALIDAR AUTENTICAÇÃO (CRÍTICO - não confiar em userId da query)
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const { userId } = auth;

    console.log(`[ORDERS_API] Fetching orders for user ${userId}`);

    // 2. BUSCAR PRODUTOS DO USUÁRIO AUTENTICADO
    // Usar userId da SESSÃO, não da query (segurança crítica)
    const userProducts = await db
      .select({
        id: userAssets.id,
        userId: userAssets.userId,
        productId: userAssets.productId,
        orderId: userAssets.orderId,
        purchaseDate: userAssets.purchaseDate,
        expiryDate: userAssets.expiryDate,
        isActive: userAssets.isActive,
        product: products,
        amount: orders.amount,
      })
      .from(userAssets)
      .innerJoin(products, eq(userAssets.productId, products.id))
      .innerJoin(orders, eq(userAssets.orderId, orders.id))
      .where(eq(userAssets.userId, userId));

    // 3. FILTRAR APENAS PRODUTOS COM ACESSO VÁLIDO
    // Validar isActive e expiryDate no retorno
    const now = new Date();
    const validProducts = userProducts.map(p => ({
      ...p,
      // Adicionar flags para o frontend
      hasValidAccess: p.isActive && new Date(p.expiryDate) > now,
      isExpired: new Date(p.expiryDate) <= now,
    }));

    console.log(`[ORDERS_API] Found ${validProducts.length} products for user ${userId}`);

    return NextResponse.json(validProducts);
  } catch (error) {
    console.error('[ORDERS_API_ERROR] Error fetching user orders:', error);
    return internalError('Erro ao buscar produtos');
  }
}
