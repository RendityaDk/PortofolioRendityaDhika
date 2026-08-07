import React from 'react';
import { useData } from '../context/DataContext';

const Education = () => {
  const { educations } = useData();

  return (
    <section id="education" className="py-24 px-6 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full space-y-16">
        <div className="text-center md:text-left">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Education</h2>
          <p className="text-secondary text-lg">Academic background.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...educations].sort((a, b) => {
            const isNowA = a.period.toLowerCase().includes('sekarang') || a.period.toLowerCase().includes('present');
            const isNowB = b.period.toLowerCase().includes('sekarang') || b.period.toLowerCase().includes('present');
            
            if (isNowA && !isNowB) return 1;
            if (!isNowA && isNowB) return -1;

            const yearA = parseInt(a.period.match(/\d{4}/)?.[0] || '0', 10);
            const yearB = parseInt(b.period.match(/\d{4}/)?.[0] || '0', 10);
            return yearA - yearB;
          }).map((edu, index) => (
            <div 
              key={index} 
              className="bg-surface/50 p-8 rounded-3xl border border-border backdrop-blur-sm hover:border-accent/30 transition-colors"
            >
              <h3 className="text-2xl font-bold text-primary mb-2">{edu.institution}</h3>
              <p className="text-secondary mb-4">{edu.major}</p>
              <div className="inline-block px-4 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium">
                {edu.period}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Education;
