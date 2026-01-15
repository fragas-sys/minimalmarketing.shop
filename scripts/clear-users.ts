import dotenv from 'dotenv';
import { db } from '../lib/db';
import { users, orders, userAssets } from '../drizzle/schema';

// Load .env.local
dotenv.config({ path: '.env.local' });

async function clearUsers() {
  console.log('🗑️  Limpando dados de usuários...');

  try {
    // Limpar em ordem (devido às foreign keys)
    await db.delete(userAssets);
    console.log('✅ userAssets limpo');

    await db.delete(orders);
    console.log('✅ orders limpo');

    await db.delete(users);
    console.log('✅ users limpo');

    console.log('🎉 Dados limpos com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao limpar dados:', error);
    process.exit(1);
  }
}

clearUsers();
