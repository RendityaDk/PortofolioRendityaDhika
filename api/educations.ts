import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../db';
import { educations } from '../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { id, institution, major, period } = req.body;
      
      await db.insert(educations)
        .values({ id, institution, major, period })
        .onConflictDoUpdate({
          target: educations.id,
          set: { institution, major, period }
        });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error saving education:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id || typeof id !== 'string') return res.status(400).json({ error: 'ID required' });

      await db.delete(educations).where(eq(educations.id, id));
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting education:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
