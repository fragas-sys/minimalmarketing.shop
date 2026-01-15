import { db } from '@/lib/db';
import { productMaterials } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { materialId: string } }
) {
  try {
    const body = await req.json();

    await db
      .update(productMaterials)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(productMaterials.id, params.materialId));

    const updated = await db
      .select()
      .from(productMaterials)
      .where(eq(productMaterials.id, params.materialId));

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('Erro ao atualizar material:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar material' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { materialId: string } }
) {
  try {
    await db
      .delete(productMaterials)
      .where(eq(productMaterials.id, params.materialId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar material:', error);
    return NextResponse.json(
      { error: 'Erro ao deletar material' },
      { status: 500 }
    );
  }
}
