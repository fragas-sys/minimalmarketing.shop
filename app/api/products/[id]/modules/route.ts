import { db } from '@/lib/db';
import { productModules, productMaterials } from '@/drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { nanoid } from 'nanoid';
import { requireAuth, forbidden, internalError } from '@/lib/api-middleware';
import { verifyUserProductAccess } from '@/lib/access-control';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // 1. VALIDAR AUTENTICAÇÃO
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { userId } = auth;

    console.log(`[MODULES_API] User ${userId} requesting modules for product ${productId}`);

    // 2. VALIDAR ACESSO AO PRODUTO (SEGURANÇA CRÍTICA)
    const access = await verifyUserProductAccess(userId, productId);

    if (!access.hasAccess) {
      const messages = {
        not_purchased: 'Você não tem acesso a este produto',
        expired: 'Seu acesso a este produto expirou',
        inactive: 'Seu acesso a este produto está inativo',
        valid: '', // não será usado
      };

      console.log(`[MODULES_API] Access denied for user ${userId} to product ${productId}: ${access.reason}`);
      return forbidden(messages[access.reason], access.reason);
    }

    // 3. BUSCAR MÓDULOS (apenas se tem acesso válido)
    console.log(`[MODULES_API] Access granted, fetching modules for product ${productId}`);

    const modules = await db
      .select()
      .from(productModules)
      .where(eq(productModules.productId, productId));

    // 4. BUSCAR MATERIAIS PARA CADA MÓDULO
    const modulesWithMaterials = await Promise.all(
      modules.map(async (module) => {
        const materials = await db
          .select()
          .from(productMaterials)
          .where(eq(productMaterials.moduleId, module.id));
        return {
          ...module,
          materials,
        };
      })
    );

    console.log(`[MODULES_API] Returning ${modulesWithMaterials.length} modules for user ${userId}`);

    return NextResponse.json(modulesWithMaterials);
  } catch (error) {
    console.error('[MODULES_API_ERROR] Error fetching modules:', error);
    return internalError('Erro ao buscar módulos');
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // 1. VALIDAR AUTENTICAÇÃO
    const auth = await requireAuth(req);
    if (auth instanceof NextResponse) return auth;

    const { userId, user } = auth;

    // 2. VALIDAR SE É ADMIN (apenas admins podem criar módulos)
    if (user.role !== 'ADMIN') {
      console.log(`[MODULES_API] User ${userId} (${user.role}) attempted to create module without permission`);
      return forbidden('Apenas administradores podem criar módulos');
    }

    console.log(`[MODULES_API] Admin ${userId} creating module for product ${productId}`);

    // 3. CRIAR MÓDULO
    const body = await req.json();
    const { title, description, order } = body;

    const newModule = {
      id: nanoid(),
      productId,
      title,
      description: description || null,
      order: order || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(productModules).values(newModule);

    console.log(`[MODULES_API] Module ${newModule.id} created successfully by admin ${userId}`);

    return NextResponse.json(newModule, { status: 201 });
  } catch (error) {
    console.error('[MODULES_API_ERROR] Error creating module:', error);
    return internalError('Erro ao criar módulo');
  }
}
