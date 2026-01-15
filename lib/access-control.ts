import { db } from '@/lib/db';
import { userAssets, productModules } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/auth';

export interface AccessResult {
  hasAccess: boolean;
  reason: 'not_purchased' | 'expired' | 'inactive' | 'valid';
  expiryDate?: Date;
  isActive?: boolean;
  userAssetId?: string;
}

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Obter sessão autenticada ou lançar erro
 * Valida o token JWT do cookie e retorna os dados do usuário
 */
export async function getAuthenticatedSession(): Promise<SessionPayload> {
  const cookieStore = cookies();
  const token = cookieStore.get('session')?.value;

  if (!token) {
    throw new Error('No session token found');
  }

  const payload = await verifyToken(token);

  if (!payload) {
    throw new Error('Invalid session token');
  }

  return payload as SessionPayload;
}

/**
 * Verificar se usuário tem acesso ativo a um produto específico
 *
 * Validações realizadas:
 * 1. Verifica se existe userAsset para o userId e productId
 * 2. Verifica se isActive === true
 * 3. Verifica se expiryDate > new Date()
 *
 * Princípio fail-safe: se qualquer validação falhar, negar acesso
 *
 * @param userId - ID do usuário
 * @param productId - ID do produto
 * @returns AccessResult com informações sobre o acesso
 */
export async function verifyUserProductAccess(
  userId: string,
  productId: string
): Promise<AccessResult> {
  try {
    // 1. Buscar userAsset do usuário para este produto
    const userAsset = await db.query.userAssets.findFirst({
      where: (assets, { eq, and }) =>
        and(
          eq(assets.userId, userId),
          eq(assets.productId, productId)
        ),
    });

    // 2. Verificar se existe (usuário não comprou o produto)
    if (!userAsset) {
      console.log(`[ACCESS_DENIED] User ${userId} has not purchased product ${productId}`);
      return {
        hasAccess: false,
        reason: 'not_purchased',
      };
    }

    // 3. Verificar se está ativo
    if (!userAsset.isActive) {
      console.log(`[ACCESS_DENIED] User ${userId} has inactive access to product ${productId}`);
      return {
        hasAccess: false,
        reason: 'inactive',
        expiryDate: userAsset.expiryDate,
        isActive: false,
        userAssetId: userAsset.id,
      };
    }

    // 4. Verificar se não expirou
    const now = new Date();
    const expiryDate = new Date(userAsset.expiryDate);

    if (expiryDate <= now) {
      console.log(`[ACCESS_DENIED] User ${userId} access to product ${productId} has expired (${expiryDate.toISOString()})`);
      return {
        hasAccess: false,
        reason: 'expired',
        expiryDate: userAsset.expiryDate,
        isActive: true,
        userAssetId: userAsset.id,
      };
    }

    // 5. Todas as validações passaram - acesso válido
    console.log(`[ACCESS_GRANTED] User ${userId} has valid access to product ${productId} (expires: ${expiryDate.toISOString()})`);
    return {
      hasAccess: true,
      reason: 'valid',
      expiryDate: userAsset.expiryDate,
      isActive: true,
      userAssetId: userAsset.id,
    };
  } catch (error) {
    console.error('[ACCESS_ERROR] Error verifying product access:', error);
    // Fail-safe: em caso de erro, negar acesso
    return {
      hasAccess: false,
      reason: 'not_purchased',
    };
  }
}

/**
 * Verificar se usuário tem acesso a um módulo específico
 * Valida através do produto associado ao módulo
 *
 * @param userId - ID do usuário
 * @param moduleId - ID do módulo
 * @returns AccessResult com informações sobre o acesso
 */
export async function verifyUserModuleAccess(
  userId: string,
  moduleId: string
): Promise<AccessResult> {
  try {
    // 1. Buscar o módulo para obter o productId
    const module = await db.query.productModules.findFirst({
      where: (modules, { eq }) => eq(modules.id, moduleId),
    });

    if (!module) {
      console.log(`[ACCESS_DENIED] Module ${moduleId} not found`);
      return {
        hasAccess: false,
        reason: 'not_purchased',
      };
    }

    // 2. Verificar acesso ao produto associado
    return await verifyUserProductAccess(userId, module.productId);
  } catch (error) {
    console.error('[ACCESS_ERROR] Error verifying module access:', error);
    // Fail-safe: em caso de erro, negar acesso
    return {
      hasAccess: false,
      reason: 'not_purchased',
    };
  }
}

/**
 * Verificar se usuário tem acesso a um material específico
 * Valida através do módulo e produto associados
 *
 * @param userId - ID do usuário
 * @param materialId - ID do material
 * @returns AccessResult com informações sobre o acesso
 */
export async function verifyUserMaterialAccess(
  userId: string,
  materialId: string
): Promise<AccessResult> {
  try {
    // 1. Buscar o material para obter o moduleId
    const material = await db.query.productMaterials.findFirst({
      where: (materials, { eq }) => eq(materials.id, materialId),
    });

    if (!material) {
      console.log(`[ACCESS_DENIED] Material ${materialId} not found`);
      return {
        hasAccess: false,
        reason: 'not_purchased',
      };
    }

    // 2. Verificar acesso ao módulo (que por sua vez verifica o produto)
    return await verifyUserModuleAccess(userId, material.moduleId);
  } catch (error) {
    console.error('[ACCESS_ERROR] Error verifying material access:', error);
    // Fail-safe: em caso de erro, negar acesso
    return {
      hasAccess: false,
      reason: 'not_purchased',
    };
  }
}

/**
 * Helper para logging de tentativas de acesso
 * Útil para auditoria e detecção de tentativas de acesso não autorizado
 */
export function logAccessAttempt(params: {
  userId: string;
  resourceType: 'product' | 'module' | 'material';
  resourceId: string;
  success: boolean;
  reason?: string;
}) {
  const timestamp = new Date().toISOString();
  const status = params.success ? '✅ GRANTED' : '❌ DENIED';

  console.log(`[ACCESS_LOG] ${timestamp} - ${status}`, {
    userId: params.userId,
    resourceType: params.resourceType,
    resourceId: params.resourceId,
    reason: params.reason || 'valid',
  });
}
