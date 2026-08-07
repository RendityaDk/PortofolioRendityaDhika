import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Projects = () => {
  const { projects } = useData();
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current!.children, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });

      gsap.from(gridRef.current!.children, {
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [projects]);

  return (
    <section id="projects" ref={sectionRef} className="min-h-screen py-24 px-6 flex flex-col justify-center">
      <div className="max-w-6xl mx-auto w-full space-y-16">
        <div ref={headerRef}>
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Selected Work</h2>
          <p className="text-secondary text-lg">A collection of projects bridging code and creative direction.</p>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className={`group relative rounded-3xl overflow-hidden bg-surface border border-border p-8 flex flex-col justify-end ${project.colSpan} hover:border-accent/50 transition-colors duration-500 cursor-pointer`}
            >
              {/* Background image if provided */}
              {project.imageUrl && (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700 mix-blend-overlay"
                  style={{ backgroundImage: `url(${project.imageUrl})` }}
                ></div>
              )}
              
              {/* Fallback pattern if no image */}
              {!project.imageUrl && (
                <div className="absolute inset-0 bg-surface-light opacity-50 group-hover:scale-105 transition-transform duration-700"></div>
              )}

              <div className="relative z-20 space-y-3 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-accent text-sm font-medium tracking-wide mb-2 block">
                      {project.category}
                    </span>
                    <h3 className="text-2xl font-bold text-primary mb-2">
                      {project.title}
                    </h3>
                  </div>
                </div>
                <p className="text-secondary text-sm pb-2">
                  {project.tech}
                </p>
                {project.link && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 text-sm font-medium text-background bg-accent px-4 py-2 rounded-full hover:bg-white transition-colors w-max shadow-lg"
                  >
                    View Project
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 17V7H7"/></svg>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
