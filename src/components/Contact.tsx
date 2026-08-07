import React from 'react';
import { useData } from '../context/DataContext';

const Contact = () => {
  const { profile } = useData();
  const contactEmail = profile.contactEmail || "hello@example.com";
  
  return (
    <section id="contact" className="min-h-screen py-24 px-6 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto w-full text-center space-y-12">
        <div className="space-y-6">
          <h2 className="text-5xl md:text-7xl font-bold text-primary tracking-tight">
            Let's build something <br className="hidden md:block" />
            <span className="text-muted">meaningful.</span>
          </h2>
          <p className="text-secondary text-xl md:text-2xl max-w-2xl mx-auto">
            Have a project, collaboration, or idea? Let's talk.
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <a 
            href={`mailto:${contactEmail}`}
            className="inline-flex items-center justify-center px-10 py-5 rounded-full bg-primary text-background font-bold text-lg hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
          >
            Get In Touch
          </a>
          <p className="text-secondary font-mono bg-surface/50 px-6 py-2 rounded-full border border-border">
            {contactEmail}
          </p>
        </div>

        <div className="pt-24 border-t border-border w-full flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted text-sm">
            © {new Date().getFullYear()} Renditya Dhika Pramana Putra. All rights reserved.
          </p>
          <div className="flex gap-6">
            {profile.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors text-sm font-medium">LinkedIn</a>
            )}
            {profile.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors text-sm font-medium">GitHub</a>
            )}
            {profile.instagramUrl && (
              <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors text-sm font-medium">Instagram</a>
            )}
            {profile.tiktokUrl && (
              <a href={profile.tiktokUrl} target="_blank" rel="noopener noreferrer" className="text-secondary hover:text-primary transition-colors text-sm font-medium">TikTok</a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
