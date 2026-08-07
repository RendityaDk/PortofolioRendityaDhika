import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function addLinks() {
  await db.update(schema.projects)
    .set({ link: 'https://github.com/RendityaDk' });
    
  console.log('Link dummy berhasil ditambahkan ke semua proyek!');
}

addLinks().catch(console.error);
