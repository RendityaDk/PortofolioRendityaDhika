import React, { useEffect, useRef } from 'react';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Experience from '../components/Experience';
import Creative from '../components/Creative';
import Education from '../components/Education';
import Contact from '../components/Contact';
import { useData } from '../context/DataContext';
import { gsap } from 'gsap';

const Home = () => {
  const { profile } = useData();
  const heroRef = useRef<HTMLElement>(null);
  const textRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Filter out any null/undefined refs (e.g., if profile photo is not loaded yet)
      const validRefs = textRefs.current.filter(Boolean);
      
      if (validRefs.length > 0) {
        // Intro animation
        gsap.fromTo(
          validRefs,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            delay: 0.2
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, [profile.profilePhotoUrl]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-center">
        <nav className="bg-surface/50 backdrop-blur-md border border-border px-8 py-3 rounded-full hidden md:flex items-center gap-8 shadow-2xl">
          <a href="#home" className="text-secondary hover:text-primary transition-colors text-sm tracking-wide">Home</a>
          <a href="#about" className="text-secondary hover:text-primary transition-colors text-sm tracking-wide">About</a>
          <a href="#skills" className="text-secondary hover:text-primary transition-colors text-sm tracking-wide">Skills</a>
          <a href="#projects" className="text-secondary hover:text-primary transition-colors text-sm tracking-wide">Projects</a>
          <a href="#experience" className="text-secondary hover:text-primary transition-colors text-sm tracking-wide">Experience</a>
          <a href="#contact" className="text-secondary hover:text-primary transition-colors text-sm tracking-wide">Contact</a>
        </nav>
      </header>

      <main>
        <section id="home" ref={heroRef} className="min-h-screen flex flex-col items-center justify-center relative px-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/15 via-background to-background opacity-60 blur-3xl -z-10"></div>
          
          <div className="text-center space-y-6 mt-16 max-w-3xl relative z-10 flex flex-col items-center">
            {profile.profilePhotoUrl && (
              <div 
                className="mb-6 relative group"
                ref={el => { textRefs.current[0] = el; }}
              >
                <div className="absolute inset-0 bg-accent rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <img 
                  src={profile.profilePhotoUrl} 
                  alt="Renditya Dhika" 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-surface shadow-2xl relative z-10"
                />
              </div>
            )}
            
            <p ref={el => { textRefs.current[1] = el; }} className="text-accent tracking-widest text-sm uppercase font-medium">
              {profile.tagline || "Hi, I'm Renditya."}
            </p>
            
            <h1 ref={el => { textRefs.current[2] = el; }} className="text-5xl md:text-7xl font-bold tracking-tight text-primary leading-tight">
              Renditya Dhika <br /> Pramana Putra
            </h1>
            
            <p ref={el => { textRefs.current[3] = el; }} className="text-secondary text-lg md:text-xl max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
              {profile.title || "Informatics Student at Universitas Islam Indonesia.\nWeb & Mobile Developer · Social Media Specialist"}
            </p>
            
            <div ref={el => { textRefs.current[4] = el; }} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <a href="#projects" className="px-8 py-3 rounded-full bg-primary text-background font-medium hover:bg-white transition-colors w-full sm:w-auto">
                View My Work
              </a>
              <a href="#contact" className="px-8 py-3 rounded-full bg-surface border border-border text-primary hover:bg-surface-light transition-colors w-full sm:w-auto">
                Let's Connect
              </a>
            </div>

            {/* Social Media Links */}
            {(profile.instagramUrl || profile.tiktokUrl || profile.linkedinUrl || profile.githubUrl) && (
              <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    <span className="text-sm font-medium">LinkedIn</span>
                  </a>
                )}
                {profile.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.5 5.5 0 0 0-1.5-3.8 5.5 5.5 0 0 0 .2-3.8s-1.2-.4-3.9 1.7a13.4 13.4 0 0 0-7 0C6.2 1.2 5 1.6 5 1.6a5.5 5.5 0 0 0 .2 3.8A5.5 5.5 0 0 0 3 9.2c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"/><path d="M9 18c-4.5 1-5-2.5-5-2.5"/></svg>
                    <span className="text-sm font-medium">GitHub</span>
                  </a>
                )}
                {profile.instagramUrl && (
                  <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    <span className="text-sm font-medium">Instagram</span>
                  </a>
                )}
                {profile.tiktokUrl && (
                  <a href={profile.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-accent transition-colors flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                    <span className="text-sm font-medium">TikTok</span>
                  </a>
                )}
              </div>
            )}
          </div>
        </section>

        <About />
        <Skills />
        <Projects />
        <Experience />
        <Creative />
        <Education />
        <Contact />
      </main>
    </>
  );
};

export default Home;
