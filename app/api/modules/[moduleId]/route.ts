import { db } from '@/lib/db';
import { productModules } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    const body = await req.json();
    const { title, description, order } = body;

    await db
      .update(productModules)
      .set({
        title: title || undefined,
        description: description || undefined,
        order: order !== undefined ? order : undefined,
        updatedAt: new Date(),
      })
      .where(eq(productModules.id, params.moduleId));

    const updated = await db
      .select()
      .from(productModules)
      .where(eq(productModules.id, params.moduleId));

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Erro ao atualizar módulo:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar módulo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { moduleId: string } }
) {
  try {
    await db
      .delete(productModules)
      .where(eq(productModules.id, params.moduleId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar módulo:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar módulo' },
      { status: 500 }
    );
  }
}
