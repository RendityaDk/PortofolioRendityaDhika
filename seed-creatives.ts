import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './db/schema';
import * as dotenv from 'dotenv';
dotenv.config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function seedCreatives() {
  console.log('Seeding creative works...');

  const initialCreatives = [
    { id: 'cw_1', title: 'Instagram Content', category: 'Social Media', imageUrl: '' },
    { id: 'cw_2', title: 'Event Promotions', category: 'Campaign', imageUrl: '' },
    { id: 'cw_3', title: 'Story Designs', category: 'Visual Content', imageUrl: '' },
    { id: 'cw_4', title: 'Digital Campaigns', category: 'Strategy', imageUrl: '' }
  ];

  for (const creative of initialCreatives) {
    await db.insert(schema.creativeWorks)
      .values(creative)
      .onConflictDoUpdate({
        target: schema.creativeWorks.id,
        set: creative
      });
  }

  console.log('Creative works successfully seeded!');
}

seedCreatives().catch(console.error);
