import { db } from '@/lib/db';
import { orders } from '@/drizzle/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allOrders = await db.select().from(orders);
    return NextResponse.json(allOrders);
  } catch (error) {
    console.error('Erro ao buscar ordens:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar ordens' },
      { status: 500 }
    );
  }
}
