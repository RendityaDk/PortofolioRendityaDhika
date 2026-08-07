import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useData } from '../context/DataContext';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const { profile } = useData();
  const sectionRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate text content
      gsap.from(contentRef.current!.children, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out'
      });

      // Animate cards
      gsap.from(cardsRef.current!.children, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power3.out'
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="min-h-screen py-24 px-6 flex flex-col justify-center relative">
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div ref={contentRef} className="space-y-8">
          <h2 className="text-4xl md:text-5xl font-bold text-primary">
            More than just <br />
            <span className="text-muted">writing code.</span>
          </h2>
          <p className="text-secondary text-lg leading-relaxed whitespace-pre-line">
            {profile.aboutText || "I'm Renditya Dhika Pramana Putra, an Informatics student at Universitas Islam Indonesia with an interest in building digital experiences through web and mobile development.\n\nAlongside development, I also work with social media and digital communication, allowing me to approach projects from both technical and creative perspectives."}
          </p>
        </div>

        <div ref={cardsRef} className="grid grid-cols-2 gap-6">
          <div className="bg-surface/50 p-6 rounded-2xl border border-border backdrop-blur-sm">
            <h3 className="text-sm uppercase tracking-wider text-muted mb-2">Based In</h3>
            <p className="text-primary font-medium text-lg">{profile.basedIn || "Yogyakarta, Indonesia"}</p>
          </div>
          <div className="bg-surface/50 p-6 rounded-2xl border border-border backdrop-blur-sm">
            <h3 className="text-sm uppercase tracking-wider text-muted mb-2">Education</h3>
            <p className="text-primary font-medium text-lg">{profile.educationCard || "Universitas Islam Indonesia"}</p>
          </div>
          <div className="bg-surface/50 p-6 rounded-2xl border border-border backdrop-blur-sm">
            <h3 className="text-sm uppercase tracking-wider text-muted mb-2">Focus</h3>
            <p className="text-primary font-medium text-lg">{profile.focusCard || "Web & Mobile Dev"}</p>
          </div>
          <div className="bg-surface/50 p-6 rounded-2xl border border-border backdrop-blur-sm">
            <h3 className="text-sm uppercase tracking-wider text-muted mb-2">Interests</h3>
            <p className="text-primary font-medium text-lg">{profile.interestsCard || "Digital Communication"}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
