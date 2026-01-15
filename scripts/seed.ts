import dotenv from 'dotenv';
import { db } from '../lib/db';
import { users, products } from '../drizzle/schema';
import { mockProducts, mockUsers } from '../data/mockData';

// Load .env.local
dotenv.config({ path: '.env.local' });

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // 1. Popular produtos
    // Nota: Usuários agora são criados via página de registro
    console.log('📦 Inserindo produtos...');
    for (const product of mockProducts) {
      await db.insert(products).values({
        id: product.id,
        slug: product.slug,
        name: product.name,
        description: product.description,
        shortDescription: product.shortDescription,
        price: product.price,
        originalPrice: product.originalPrice,
        type: product.type as 'course' | 'templates' | 'ai_prompts',
        category: product.category,
        image: product.image,
        isActive: product.isActive,
        badge: product.badge,
        soldCount: product.soldCount,
        accessDuration: product.accessDuration,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }).onConflictDoNothing();
    }
    console.log('✅ Produtos inseridos:', mockProducts.length);

    console.log('🎉 Seed completado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao fazer seed:', error);
    process.exit(1);
  }
}

seed();
