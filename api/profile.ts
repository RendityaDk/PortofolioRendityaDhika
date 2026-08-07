import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../db';
import { profile } from '../db/schema';
import { eq } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    try {
      const { profilePhotoUrl, tagline, title, aboutText, skills, contactEmail, instagramUrl, tiktokUrl, linkedinUrl, githubUrl, basedIn, educationCard, focusCard, interestsCard } = req.body;
      
      const dataToSave = {
        id: '1',
        profilePhotoUrl,
        tagline,
        title,
        aboutText,
        skills,
        contactEmail,
        instagramUrl,
        tiktokUrl,
        linkedinUrl,
        githubUrl,
        basedIn,
        educationCard,
        focusCard,
        interestsCard
      };

      await db.insert(profile)
        .values(dataToSave)
        .onConflictDoUpdate({
          target: profile.id,
          set: dataToSave
        });

      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error saving profile:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
