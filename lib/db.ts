import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '@/drizzle/schema';

// Load environment variables in non-Next.js contexts (like scripts)
if (!process.env.DATABASE_URL) {
  try {
    require('dotenv').config({ path: '.env.local' });
  } catch (e) {
    // Ignore if dotenv is not available
  }
}

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { schema });
