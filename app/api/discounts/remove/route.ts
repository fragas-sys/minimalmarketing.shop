import { db } from '@/lib/db';
import { discounts } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Desativar todos os descontos
    await db.update(discounts).set({ isActive: false });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao remover desconto:', error);
    return NextResponse.json(
      { error: 'Erro ao remover desconto' },
      { status: 500 }
    );
  }
}
