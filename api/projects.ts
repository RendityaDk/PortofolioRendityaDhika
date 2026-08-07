import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../db';
import { projects } from '../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { id, title, category, tech, colSpan, imageUrl } = req.body;
      
      // Upsert: Try to insert, if exists, update.
      await db.insert(projects)
        .values({ id, title, category, tech, colSpan, imageUrl })
        .onConflictDoUpdate({
          target: projects.id,
          set: { title, category, tech, colSpan, imageUrl }
        });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error saving project:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id || typeof id !== 'string') return res.status(400).json({ error: 'ID required' });

      await db.delete(projects).where(eq(projects.id, id));
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting project:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
