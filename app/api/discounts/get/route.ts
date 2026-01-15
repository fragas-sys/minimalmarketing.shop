import { db } from '@/lib/db';
import { discounts } from '@/drizzle/schema';
import { eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Buscar o desconto ativo no banco de dados
    const activeDiscount = await db
      .select()
      .from(discounts)
      .where(eq(discounts.isActive, true))
      .limit(1);

    if (!activeDiscount || activeDiscount.length === 0) {
      return NextResponse.json(null);
    }

    const discount = activeDiscount[0];

    return NextResponse.json({
      type: discount.type as 'general' | 'category',
      percentage: discount.percentage,
      category: discount.category || undefined,
      isActive: discount.isActive,
    });
  } catch (error) {
    console.error('Erro ao buscar desconto:', error);
    return NextResponse.json(null);
  }
}
