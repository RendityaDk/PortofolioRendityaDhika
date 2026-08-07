import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seedProjects() {
  console.log('Menambahkan link proyek...');

  const newProjects = [
    {
      id: 'proj_zeno',
      title: 'Aplikasi Zeno',
      category: 'Mobile / Web App',
      tech: 'React, TypeScript',
      colSpan: 'md:col-span-1 md:row-span-1',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      link: 'https://github.com/RendityaDk'
    },
    {
      id: 'proj_pss',
      title: 'Aplikasi PSS Sleman',
      category: 'Mobile Application',
      tech: 'Flutter, Dart',
      colSpan: 'md:col-span-1 md:row-span-1',
      imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=800&auto=format&fit=crop',
      link: 'https://github.com/RendityaDk'
    },
    {
      id: 'proj_serenify',
      title: 'UI/UX Serenify',
      category: 'UI/UX Design',
      tech: 'Figma, Prototyping',
      colSpan: 'md:col-span-1 md:row-span-1',
      imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=800&auto=format&fit=crop',
      link: 'https://github.com/RendityaDk'
    }
  ];

  for (const proj of newProjects) {
    await db.insert(schema.projects)
      .values(proj)
      .onConflictDoUpdate({
        target: schema.projects.id,
        set: proj
      });
  }

  console.log('Proyek berhasil diupdate!');
}

seedProjects().catch(console.error);
