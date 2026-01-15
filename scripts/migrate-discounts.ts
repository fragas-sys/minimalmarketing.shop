import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import path from 'path';

const migrationSource = path.join(process.cwd(), './drizzle/migrations');

async function runMigrations() {
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client);

  console.log('Running migrations from:', migrationSource);

  try {
    await migrate(db, { migrationsFolder: migrationSource });
    console.log('✓ Migrations completed successfully');
  } catch (error) {
    console.error('✗ Migration error:', error);
    process.exit(1);
  }

  await client.end();
}

runMigrations();
