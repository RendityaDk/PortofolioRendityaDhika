import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../db';
import { creativeWorks } from '../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { id, title, category, imageUrl } = req.body;
      
      await db.insert(creativeWorks)
        .values({ id, title, category, imageUrl })
        .onConflictDoUpdate({
          target: creativeWorks.id,
          set: { title, category, imageUrl }
        });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error saving creative work:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id || typeof id !== 'string') return res.status(400).json({ error: 'ID required' });

      await db.delete(creativeWorks).where(eq(creativeWorks.id, id));
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting creative work:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
