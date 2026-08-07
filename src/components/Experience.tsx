import React from 'react';
import { useData } from '../context/DataContext';

const Experience = () => {
  const { experiences } = useData();

  return (
    <section id="experience" className="min-h-screen py-24 px-6 flex flex-col justify-center">
      <div className="max-w-4xl mx-auto w-full space-y-16">
        <div>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Experience</h2>
          <p className="text-secondary text-lg">My professional journey so far.</p>
        </div>

        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
          {experiences.map((exp, index) => (
            <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-border bg-surface shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                <div className="w-3 h-3 bg-accent rounded-full"></div>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-surface/50 border border-border backdrop-blur-sm hover:border-accent/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-2">
                  <h3 className="text-xl font-bold text-primary">{exp.role}</h3>
                  <span className="text-sm text-accent font-medium mt-1 sm:mt-0">{exp.period}</span>
                </div>
                <div className="text-muted font-medium mb-4">{exp.organization}</div>
                <p className="text-secondary mb-4 leading-relaxed">{exp.description}</p>
                <ul className="list-disc list-inside text-secondary text-sm space-y-1">
                  {exp.achievements.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
