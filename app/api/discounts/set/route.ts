import { db } from '@/lib/db';
import { discounts } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { nanoid } from 'nanoid';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, percentage, category } = body;

    // Validação básica
    if (!type || percentage === undefined || percentage < 0 || percentage > 100) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos' },
        { status: 400 }
      );
    }

    // Desativar todos os descontos anteriores
    await db.update(discounts).set({ isActive: false });

    // Criar novo desconto
    const newDiscount = {
      id: nanoid(),
      type,
      percentage,
      category: category || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(discounts).values(newDiscount);

    return NextResponse.json(newDiscount, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar desconto:', error);
    return NextResponse.json(
      { error: 'Erro ao criar desconto' },
      { status: 500 }
    );
  }
}
