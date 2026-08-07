import React from 'react';
import { useData } from '../context/DataContext';

const Creative = () => {
  const { creatives } = useData();

  return (
    <section id="creative" className="min-h-screen py-24 px-6 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full space-y-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Creative Work</h2>
          <p className="text-secondary text-lg max-w-2xl mx-auto">
            Beyond development, I specialize in digital communication, social media strategy, and visual storytelling.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {creatives.map((work, index) => (
            <div 
              key={work.id || index} 
              className="group relative aspect-square rounded-2xl overflow-hidden bg-surface border border-border flex items-end p-6 cursor-pointer hover:border-accent/50 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-surface-light opacity-30 group-hover:opacity-10 transition-opacity duration-500 z-0"></div>
              
              {work.imageUrl && (
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105 opacity-80 mix-blend-overlay z-0"
                  style={{ backgroundImage: `url(${work.imageUrl})` }}
                ></div>
              )}
              
              <div className="relative z-10 w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-accent text-sm font-medium mb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">{work.category}</p>
                <h3 className="text-xl font-bold text-primary">{work.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Creative;
