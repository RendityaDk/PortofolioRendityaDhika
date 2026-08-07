import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function restore() {
  await db.update(schema.projects)
    .set({ imageUrl: 'https://gh9mxa3kcurl4i2k.public.blob.vercel-storage.com/The%20Jackals.png', link: '' })
    .where(eq(schema.projects.id, 'proj_zeno'));

  await db.update(schema.projects)
    .set({ imageUrl: 'https://gh9mxa3kcurl4i2k.public.blob.vercel-storage.com/Logo-PSS.png', link: '' })
    .where(eq(schema.projects.id, 'proj_pss'));

  await db.update(schema.projects)
    .set({ imageUrl: 'https://gh9mxa3kcurl4i2k.public.blob.vercel-storage.com/Serenify%20Poster.png', link: '' })
    .where(eq(schema.projects.id, 'proj_serenify'));

  console.log('Gambar berhasil direstorasi dan link di-reset!');
}

restore().catch(console.error);
