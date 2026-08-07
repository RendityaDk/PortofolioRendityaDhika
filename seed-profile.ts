import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seedProfile() {
  console.log('Populating default profile data...');

  const defaultSkills = [
    {
      title: 'Development',
      skills: ['React', 'JavaScript', 'TypeScript', 'HTML', 'CSS', 'Tailwind CSS', 'Flutter', 'Kotlin']
    },
    {
      title: 'Tools',
      skills: ['Git', 'GitHub', 'Figma', 'VS Code', 'Android Studio', 'Vercel']
    },
    {
      title: 'Creative & Communication',
      skills: ['Social Media Management', 'Content Planning', 'Content Strategy', 'Copywriting', 'Digital Communication', 'Visual Content']
    }
  ];

  await db.insert(schema.profile)
    .values({
      id: '1',
      tagline: "Hi, I'm Renditya.",
      title: "Informatics Student at Universitas Islam Indonesia.\nWeb & Mobile Developer · Social Media Specialist",
      aboutText: "I'm Renditya Dhika Pramana Putra, an Informatics student at Universitas Islam Indonesia with an interest in building digital experiences through web and mobile development.\n\nAlongside development, I also work with social media and digital communication, allowing me to approach projects from both technical and creative perspectives.",
      skills: defaultSkills,
      contactEmail: 'hello@example.com'
    })
    .onConflictDoUpdate({
      target: schema.profile.id,
      set: {
        tagline: "Hi, I'm Renditya.",
        title: "Informatics Student at Universitas Islam Indonesia.\nWeb & Mobile Developer · Social Media Specialist",
        aboutText: "I'm Renditya Dhika Pramana Putra, an Informatics student at Universitas Islam Indonesia with an interest in building digital experiences through web and mobile development.\n\nAlongside development, I also work with social media and digital communication, allowing me to approach projects from both technical and creative perspectives.",
        skills: defaultSkills,
        contactEmail: 'hello@example.com'
      }
    });

  console.log('Profile seeded successfully!');
}

seedProfile().catch(console.error);
