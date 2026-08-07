import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Project {
  id: string;
  title: string;
  category: string;
  tech: string;
  colSpan: string;
  imageUrl?: string;
  link?: string;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface Education {
  id: string;
  institution: string;
  major: string;
  period: string;
}

export interface CreativeWork {
  id: string;
  title: string;
  category: string;
  imageUrl?: string;
}

export interface SkillCategory {
  title: string;
  skills: string[];
}

export interface ProfileSettings {
  id?: string;
  profilePhotoUrl?: string;
  tagline?: string;
  title?: string;
  aboutText?: string;
  skills?: SkillCategory[];
  contactEmail?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  basedIn?: string;
  educationCard?: string;
  focusCard?: string;
  interestsCard?: string;
}

interface DataContextType {
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  experiences: Experience[];
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>;
  educations: Education[];
  setEducations: React.Dispatch<React.SetStateAction<Education[]>>;
  creatives: CreativeWork[];
  setCreatives: React.Dispatch<React.SetStateAction<CreativeWork[]>>;
  profile: ProfileSettings;
  setProfile: React.Dispatch<React.SetStateAction<ProfileSettings>>;
  refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider = ({ children }: { children: ReactNode }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [creatives, setCreatives] = useState<CreativeWork[]>([]);
  const [profile, setProfile] = useState<ProfileSettings>({});

  const refreshData = async () => {
    try {
      const response = await fetch('/api/data');
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
        setExperiences(data.experiences || []);
        setEducations(data.educations || []);
        setCreatives(data.creatives || []);
        setProfile(data.profile || {});
      }
    } catch (error) {
      console.error('Failed to fetch data from API:', error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <DataContext.Provider value={{ 
      projects, setProjects, 
      experiences, setExperiences, 
      educations, setEducations, 
      creatives, setCreatives,
      profile, setProfile,
      refreshData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
