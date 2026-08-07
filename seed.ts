import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seed() {
  console.log('Seeding data...');

  await db.insert(schema.educations).values([
    {
      id: 'edu1',
      institution: 'SMAN 1 Wates',
      major: 'IPA', // Assuming based on typical high school
      period: '2020 - 2023'
    },
    {
      id: 'edu2',
      institution: 'Universitas Islam Indonesia (UII)',
      major: 'Informatika',
      period: '2023 - sekarang'
    }
  ]).onConflictDoNothing();

  await db.insert(schema.experiences).values([
    {
      id: 'exp1',
      role: 'Ketua Biro Usaha',
      organization: 'Himpunan Mahasiswa Informatika (HMIF)',
      period: '2024 - 2025',
      description: 'Memimpin biro usaha himpunan.',
      achievements: []
    },
    {
      id: 'exp2',
      role: 'Bagian Sosial Media',
      organization: 'Tim 100 FTI UII',
      period: '2025',
      description: 'Mengelola sosial media FTI.',
      achievements: []
    },
    {
      id: 'exp3',
      role: 'Koor Creative Social Media',
      organization: 'Marcomm FTI',
      period: '2025 - sekarang',
      description: 'Mengkoordinasi strategi kreatif media sosial.',
      achievements: []
    }
  ]).onConflictDoNothing();

  await db.insert(schema.projects).values([
    {
      id: 'proj1',
      title: 'Portofolio Web',
      category: 'Web Development',
      tech: 'React, Tailwind, GSAP',
      colSpan: 'md:col-span-2 md:row-span-1',
      imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop'
    }
  ]).onConflictDoNothing();

  await db.insert(schema.profile).values([
    {
      id: '1',
      profilePhotoUrl: 'https://images.unsplash.com/photo-1600486913747-55e5470d6f40?q=80&w=800&auto=format&fit=crop'
    }
  ]).onConflictDoNothing();

  console.log('Seeding completed!');
}

seed().catch(console.error);
