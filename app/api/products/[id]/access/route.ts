import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, internalError } from '@/lib/api-middleware';
import { verifyUserProductAccess, logAccessAttempt } from '@/lib/access-control';

/**
 * API endpoint para validar acesso do usuário a um produto
 *
 * GET /api/products/[id]/access
 *
 * Retorna informações sobre o acesso do usuário ao produto:
 * - hasAccess: boolean indicando se usuário tem acesso válido
 * - reason: motivo do resultado (valid, not_purchased, expired, inactive)
 * - expiryDate: data de expiração do acesso (se aplicável)
 * - isActive: se o acesso está ativo (se aplicável)
 *
 * Este endpoint é usado pelo frontend para validar acesso antes de
 * renderizar conteúdo protegido (módulos, materiais, etc.)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // 1. VALIDAR AUTENTICAÇÃO
    const auth = await requireAuth(request);
    if (auth instanceof NextResponse) return auth;

    const { userId } = auth;

    console.log(`[ACCESS_API] Validating access for user ${userId} to product ${productId}`);

    // 2. VERIFICAR ACESSO AO PRODUTO
    const access = await verifyUserProductAccess(userId, productId);

    // 3. LOG DA TENTATIVA DE ACESSO (AUDITORIA)
    logAccessAttempt({
      userId,
      resourceType: 'product',
      resourceId: productId,
      success: access.hasAccess,
      reason: access.reason,
    });

    // 4. RETORNAR RESULTADO DA VALIDAÇÃO
    return NextResponse.json({
      hasAccess: access.hasAccess,
      reason: access.reason,
      ...(access.expiryDate && { expiryDate: access.expiryDate }),
      ...(access.isActive !== undefined && { isActive: access.isActive }),
      ...(access.userAssetId && { userAssetId: access.userAssetId }),
    });
  } catch (error) {
    console.error('[ACCESS_API_ERROR] Error validating product access:', error);
    return internalError('Erro ao validar acesso');
  }
}
