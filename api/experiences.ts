import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../db';
import { experiences } from '../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { id, role, organization, period, description, achievements } = req.body;
      
      await db.insert(experiences)
        .values({ id, role, organization, period, description, achievements })
        .onConflictDoUpdate({
          target: experiences.id,
          set: { role, organization, period, description, achievements }
        });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error saving experience:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id || typeof id !== 'string') return res.status(400).json({ error: 'ID required' });

      await db.delete(experiences).where(eq(experiences.id, id));
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting experience:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
