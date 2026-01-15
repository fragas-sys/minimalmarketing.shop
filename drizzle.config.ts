import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';

// Load .env.local
dotenv.config({ path: '.env.local' });

export default {
  schema: './drizzle/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
