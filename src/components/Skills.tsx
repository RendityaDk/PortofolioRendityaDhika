import React from 'react';
import { useData } from '../context/DataContext';

const Skills = () => {
  const { profile } = useData();
  
  // Fallback skills if empty
  const defaultCategories = [
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

  const displayCategories = profile.skills && profile.skills.length > 0 ? profile.skills : defaultCategories;

  return (
    <section id="skills" className="min-h-screen py-24 px-6 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full space-y-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Expertise</h2>
          <p className="text-secondary text-lg">A balanced skill set across engineering and design.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayCategories.map((category, index) => (
            <div key={index} className="space-y-6">
              <h3 className="text-xl font-semibold text-primary pb-4 border-b border-border">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-3">
                {category.skills.map((skill, idx) => (
                  <span 
                    key={idx} 
                    className="px-4 py-2 bg-surface rounded-full border border-border text-secondary text-sm hover:text-primary hover:border-accent transition-colors cursor-default"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
