import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function check() {
  const all = await db.select().from(schema.projects);
  console.log(JSON.stringify(all, null, 2));
}

check().catch(console.error);
