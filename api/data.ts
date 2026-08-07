import type { VercelRequest, VercelResponse } from '@vercel/node';
import { db } from '../db';
import { projects, experiences, educations, profile, creativeWorks } from '../db/schema';
import { asc } from 'drizzle-orm';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const allProjects = await db.select().from(projects).orderBy(asc(projects.createdAt));
    const allExperiences = await db.select().from(experiences).orderBy(asc(experiences.createdAt));
    const allEducations = await db.select().from(educations).orderBy(asc(educations.createdAt));
    const allCreatives = await db.select().from(creativeWorks).orderBy(asc(creativeWorks.createdAt));
    
    const profileData = await db.select().from(profile).limit(1);
    const profileObject = profileData.length > 0 ? profileData[0] : null;

    return res.status(200).json({
      projects: allProjects,
      experiences: allExperiences,
      educations: allEducations,
      creatives: allCreatives,
      profile: profileObject,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
