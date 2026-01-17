import { NextRequest, NextResponse } from 'next/server';
import {
  getAuthenticatedSession,
  verifyUserProductAccess,
  SessionPayload,
  AccessResult,
} from '@/lib/access-control';

/**
 * Interface de resultado de autenticação bem-sucedida
 */
export interface AuthResult {
  userId: string;
  user: SessionPayload;
}

/**
 * Interface de resultado de validação de acesso ao produto
 */
export interface ProductAccessResult extends AuthResult {
  access: AccessResult;
}

/**
 * Middleware para validar autenticação
 *
 * Valida a sessão JWT do cookie e retorna os dados do usuário.
 * Se não autenticado, retorna NextResponse com status 401.
 *
 * @param request - NextRequest object
 * @returns AuthResult ou NextResponse (erro)
 *
 * @example
 * const auth = await requireAuth(request);
 * if (auth instanceof NextResponse) return auth; // erro
 * const { userId, user } = auth; // sucesso
 */
export async function requireAuth(
  request: NextRequest
): Promise<AuthResult | NextResponse> {
  try {
    const user = await getAuthenticatedSession();

    return {
      userId: user.userId,
      user,
    };
  } catch (error) {
    console.error('[AUTH_ERROR] Authentication failed:', error);
    return unauthorized('Autenticação necessária');
  }
}

/**
 * Middleware para validar autenticação + acesso ao produto
 *
 * Valida a sessão JWT e verifica se o usuário tem acesso ao produto especificado.
 * Se não autenticado, retorna 401.
 * Se autenticado mas sem acesso, retorna 403.
 *
 * @param request - NextRequest object
 * @param productId - ID do produto a validar acesso
 * @returns ProductAccessResult ou NextResponse (erro)
 *
 * @example
 * const auth = await requireProductAccess(request, productId);
 * if (auth instanceof NextResponse) return auth; // erro
 * const { userId, user, access } = auth; // sucesso
 */
export async function requireProductAccess(
  request: NextRequest,
  productId: string
): Promise<ProductAccessResult | NextResponse> {
  try {
    // 1. Validar autenticação
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { userId, user } = authResult;

    // 2. Validar acesso ao produto
    const access = await verifyUserProductAccess(userId, productId);

    if (!access.hasAccess) {
      const messages = {
        not_purchased: 'Você não tem acesso a este produto',
        expired: 'Seu acesso a este produto expirou',
        inactive: 'Seu acesso a este produto está inativo',
      };

      // Garantir que reason não seja 'valid' (type guard)
      const reason = access.reason !== 'valid' ? access.reason : 'not_purchased';
      return forbidden(messages[reason], reason);
    }

    // 3. Retornar resultado com acesso válido
    return {
      userId,
      user,
      access,
    };
  } catch (error) {
    console.error('[ACCESS_ERROR] Product access validation failed:', error);
    return unauthorized('Erro ao validar acesso');
  }
}

/**
 * Middleware para validar se usuário é ADMIN
 *
 * Valida a sessão JWT e verifica se o role é 'ADMIN'.
 * Se não autenticado, retorna 401.
 * Se autenticado mas não é admin, retorna 403.
 *
 * @param request - NextRequest object
 * @returns AuthResult ou NextResponse (erro)
 *
 * @example
 * const auth = await requireAdmin(request);
 * if (auth instanceof NextResponse) return auth; // erro
 * const { userId, user } = auth; // sucesso - usuário é admin
 */
export async function requireAdmin(
  request: NextRequest
): Promise<AuthResult | NextResponse> {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    const { user } = authResult;

    if (user.role !== 'ADMIN') {
      console.log(`[ACCESS_DENIED] User ${user.userId} attempted admin action without permission`);
      return forbidden('Apenas administradores podem realizar esta ação');
    }

    return authResult;
  } catch (error) {
    console.error('[ADMIN_ERROR] Admin validation failed:', error);
    return unauthorized('Erro ao validar permissões');
  }
}

/**
 * Helper para retornar erro 401 Unauthorized
 *
 * @param message - Mensagem de erro (opcional)
 * @returns NextResponse com status 401
 */
export function unauthorized(message?: string): NextResponse {
  return NextResponse.json(
    {
      error: message || 'Não autenticado',
      code: 'UNAUTHORIZED',
    },
    { status: 401 }
  );
}

/**
 * Helper para retornar erro 403 Forbidden
 *
 * @param message - Mensagem de erro (opcional)
 * @param reason - Razão específica da negação (opcional)
 * @returns NextResponse com status 403
 */
export function forbidden(
  message?: string,
  reason?: 'not_purchased' | 'expired' | 'inactive'
): NextResponse {
  return NextResponse.json(
    {
      error: message || 'Acesso negado',
      code: 'FORBIDDEN',
      ...(reason && { reason }),
    },
    { status: 403 }
  );
}

/**
 * Helper para retornar erro 404 Not Found
 *
 * @param message - Mensagem de erro (opcional)
 * @returns NextResponse com status 404
 */
export function notFound(message?: string): NextResponse {
  return NextResponse.json(
    {
      error: message || 'Recurso não encontrado',
      code: 'NOT_FOUND',
    },
    { status: 404 }
  );
}

/**
 * Helper para retornar erro 500 Internal Server Error
 *
 * @param message - Mensagem de erro (opcional)
 * @returns NextResponse com status 500
 */
export function internalError(message?: string): NextResponse {
  return NextResponse.json(
    {
      error: message || 'Erro interno do servidor',
      code: 'INTERNAL_ERROR',
    },
    { status: 500 }
  );
}

/**
 * Helper para extrair e validar parâmetros de rota
 *
 * @param params - Objeto de parâmetros da rota
 * @param paramName - Nome do parâmetro a extrair
 * @returns Valor do parâmetro ou NextResponse (erro)
 *
 * @example
 * const productId = getRouteParam(params, 'id');
 * if (productId instanceof NextResponse) return productId; // erro
 * // usar productId
 */
export function getRouteParam(
  params: Record<string, string | string[]> | undefined,
  paramName: string
): string | NextResponse {
  if (!params || !params[paramName]) {
    return NextResponse.json(
      {
        error: `Parâmetro '${paramName}' é obrigatório`,
        code: 'MISSING_PARAM',
      },
      { status: 400 }
    );
  }

  const value = params[paramName];

  if (Array.isArray(value)) {
    return NextResponse.json(
      {
        error: `Parâmetro '${paramName}' deve ser único`,
        code: 'INVALID_PARAM',
      },
      { status: 400 }
    );
  }

  return value;
}
