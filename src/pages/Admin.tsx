import React, { useState, useRef, useEffect } from 'react';
import { useData, type Project, type Experience, type ProfileSettings, type CreativeWork } from '../context/DataContext';
import { Link } from 'react-router-dom';
import { upload } from '@vercel/blob/client';

const Admin = () => {
  const { projects, setProjects, experiences, setExperiences, profile, setProfile, educations, setEducations, creatives, setCreatives } = useData();
  const [activeTab, setActiveTab] = useState<'profile' | 'projects' | 'experiences' | 'educations' | 'creatives'>('profile');
  const [isUploading, setIsUploading] = useState(false);

  // Simple states for forms
  const [newProject, setNewProject] = useState<Partial<Project>>({ title: '', category: '', tech: '', colSpan: 'md:col-span-1 md:row-span-1', imageUrl: '', link: '' });
  const [newExperience, setNewExperience] = useState<Partial<Experience>>({ role: '', organization: '', period: '', description: '', achievements: [] });
  const [newEducation, setNewEducation] = useState<Partial<any>>({ institution: '', major: '', period: '' });
  const [newCreative, setNewCreative] = useState<Partial<CreativeWork>>({ title: '', category: '', imageUrl: '' });
  
  // Profile state
  const [profileForm, setProfileForm] = useState<ProfileSettings>({});

  // Sync profile form when profile loads
  useEffect(() => {
    if (profile) {
      setProfileForm({
        ...profile,
        skills: profile.skills || []
      });
    }
  }, [profile]);
  
  // Edit states
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [editingEducationId, setEditingEducationId] = useState<string | null>(null);
  const [editingCreativeId, setEditingCreativeId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const projectFileInputRef = useRef<HTMLInputElement>(null);
  const creativeFileInputRef = useRef<HTMLInputElement>(null);

  // Handler for uploading files directly to Vercel Blob
  const handleFileUpload = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });
      return newBlob.url;
    } catch (error) {
      alert("Gagal mengunggah gambar. Pastikan Anda sudah mengisi BLOB_READ_WRITE_TOKEN di file .env!");
      console.error(error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProfileSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      let finalPhotoUrl = profileForm.profilePhotoUrl;
      if (fileInputRef.current?.files?.[0]) {
        finalPhotoUrl = await handleFileUpload(fileInputRef.current.files[0]);
      }

      const skillsList = typeof profileForm.skills === 'string' 
        ? (profileForm.skills as string).split(',').map(s => s.trim()).filter(Boolean)
        : profileForm.skills;

      const dataToSave: ProfileSettings = {
        ...profileForm,
        profilePhotoUrl: finalPhotoUrl,
        skills: skillsList
      };
      
      // Save to database
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });
      
      setProfile(dataToSave);
      alert('Pengaturan profil berhasil disimpan!');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e) {
      // Error already handled
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalImageUrl = newProject.imageUrl;
    if (projectFileInputRef.current?.files?.[0]) {
      try {
        finalImageUrl = await handleFileUpload(projectFileInputRef.current.files[0]);
      } catch (e) {
        return; // Stop if upload failed
      }
    }

    const projectToSave = {
      ...newProject,
      id: editingProjectId || Date.now().toString(),
      imageUrl: finalImageUrl
    };

    try {
      await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectToSave)
      });

      if (editingProjectId) {
        setProjects(projects.map(p => p.id === editingProjectId ? projectToSave as Project : p));
        setEditingProjectId(null);
      } else {
        setProjects([...projects, projectToSave as Project]);
      }
      setNewProject({ title: '', category: '', tech: '', colSpan: 'md:col-span-1 md:row-span-1', imageUrl: '', link: '' });
      if (projectFileInputRef.current) projectFileInputRef.current.value = '';
    } catch (error) {
      alert("Gagal menyimpan proyek ke database.");
    }
  };

  const startEditProject = (project: Project) => {
    setEditingProjectId(project.id);
    setNewProject(project);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Hapus proyek ini?')) return;
    try {
      await fetch(`/api/projects?id=${id}`, { method: 'DELETE' });
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      alert("Gagal menghapus proyek.");
    }
  };

  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    const achievementsList = typeof newExperience.achievements === 'string' 
      ? (newExperience.achievements as string).split('\n').filter(item => item.trim() !== '')
      : newExperience.achievements;

    const expToSave = { 
      ...newExperience, 
      id: editingExperienceId || Date.now().toString(),
      achievements: achievementsList 
    } as Experience;

    try {
      await fetch('/api/experiences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expToSave)
      });

      if (editingExperienceId) {
        setExperiences(experiences.map(exp => exp.id === editingExperienceId ? expToSave : exp));
        setEditingExperienceId(null);
      } else {
        setExperiences([...experiences, expToSave]);
      }
      setNewExperience({ role: '', organization: '', period: '', description: '', achievements: [] });
    } catch (error) {
      alert("Gagal menyimpan pengalaman ke database.");
    }
  };

  const startEditExperience = (exp: Experience) => {
    setEditingExperienceId(exp.id);
    setNewExperience({ ...exp, achievements: exp.achievements.join('\n') as any });
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Hapus pengalaman ini?')) return;
    try {
      await fetch(`/api/experiences?id=${id}`, { method: 'DELETE' });
      setExperiences(experiences.filter(exp => exp.id !== id));
    } catch (error) {
      alert("Gagal menghapus pengalaman.");
    }
  };

  const handleSaveEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    const eduToSave = { 
      ...newEducation, 
      id: editingEducationId || Date.now().toString()
    };

    try {
      await fetch('/api/educations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eduToSave)
      });

      if (editingEducationId) {
        setEducations(educations.map(edu => edu.id === editingEducationId ? eduToSave as any : edu));
        setEditingEducationId(null);
      } else {
        setEducations([...educations, eduToSave as any]);
      }
      setNewEducation({ institution: '', major: '', period: '' });
    } catch (error) {
      alert("Gagal menyimpan pendidikan ke database.");
    }
  };

  const startEditEducation = (edu: any) => {
    setEditingEducationId(edu.id);
    setNewEducation(edu);
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Hapus pendidikan ini?')) return;
    try {
      await fetch(`/api/educations?id=${id}`, { method: 'DELETE' });
      setEducations(educations.filter(edu => edu.id !== id));
    } catch (error) {
      alert("Gagal menghapus pendidikan.");
    }
  };

  const handleSaveCreative = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalImageUrl = newCreative.imageUrl;
    if (creativeFileInputRef.current?.files?.[0]) {
      try {
        finalImageUrl = await handleFileUpload(creativeFileInputRef.current.files[0]);
      } catch (e) {
        return; // Stop if upload failed
      }
    }

    const creativeToSave = {
      ...newCreative,
      id: editingCreativeId || Date.now().toString(),
      imageUrl: finalImageUrl
    };

    try {
      await fetch('/api/creatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creativeToSave)
      });

      if (editingCreativeId) {
        setCreatives(creatives.map(c => c.id === editingCreativeId ? creativeToSave as CreativeWork : c));
        setEditingCreativeId(null);
      } else {
        setCreatives([...creatives, creativeToSave as CreativeWork]);
      }
      setNewCreative({ title: '', category: '', imageUrl: '' });
      if (creativeFileInputRef.current) creativeFileInputRef.current.value = '';
    } catch (error) {
      alert("Gagal menyimpan creative work ke database.");
    }
  };

  const startEditCreative = (creative: CreativeWork) => {
    setEditingCreativeId(creative.id);
    setNewCreative(creative);
  };

  const handleDeleteCreative = async (id: string) => {
    if (!confirm('Hapus creative work ini?')) return;
    try {
      await fetch(`/api/creatives?id=${id}`, { method: 'DELETE' });
      setCreatives(creatives.filter(c => c.id !== id));
    } catch (error) {
      alert("Gagal menghapus creative work.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-primary p-8 flex flex-col md:flex-row gap-8">
      {/* Sidebar */}
      <aside className="w-full md:w-64 space-y-6 shrink-0">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <nav className="flex flex-col gap-2">
          <button 
            className={`text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'profile' ? 'bg-surface border border-border text-accent' : 'text-secondary hover:text-primary'}`}
            onClick={() => setActiveTab('profile')}
          >
            Site Settings (Profile)
          </button>
          <button 
            className={`text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'projects' ? 'bg-surface border border-border text-accent' : 'text-secondary hover:text-primary'}`}
            onClick={() => setActiveTab('projects')}
          >
            Manage Projects
          </button>
          <button 
            className={`text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'experiences' ? 'bg-surface border border-border text-accent' : 'text-secondary hover:text-primary'}`}
            onClick={() => setActiveTab('experiences')}
          >
            Manage Experience
          </button>
          <button 
            className={`text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'educations' ? 'bg-surface border border-border text-accent' : 'text-secondary hover:text-primary'}`}
            onClick={() => setActiveTab('educations')}
          >
            Manage Education
          </button>
          <button 
            className={`text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'creatives' ? 'bg-surface border border-border text-accent' : 'text-secondary hover:text-primary'}`}
            onClick={() => setActiveTab('creatives')}
          >
            Manage Creative Work
          </button>
          <Link to="/" className="text-left px-4 py-2 mt-4 text-muted hover:text-primary transition-colors">
            ← Back to Portfolio
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 space-y-8 max-w-4xl pb-24">
        {activeTab === 'profile' && (
          <section className="space-y-6">
            <h2 className="text-3xl font-bold border-b border-border pb-4">General Settings</h2>
            
            <form onSubmit={handleSaveProfileSettings} className="bg-surface/50 p-6 rounded-2xl border border-border space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-4">Profile Photo</h3>
                <div className="flex items-center gap-6 mb-4">
                  {profileForm.profilePhotoUrl ? (
                    <img src={profileForm.profilePhotoUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-surface" />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-surface border-4 border-border flex items-center justify-center text-muted">No Photo</div>
                  )}
                </div>
                <label className="block text-sm text-secondary mb-2">Change Photo (Vercel Blob)</label>
                <input 
                  type="file" accept="image/*"
                  ref={fileInputRef}
                  className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                />
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-bold text-lg mb-4">Hero Section Text</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-secondary mb-1">Tagline (e.g. Hi, I'm Renditya.)</label>
                    <input 
                      type="text"
                      value={profileForm.tagline || ''} onChange={e => setProfileForm({...profileForm, tagline: e.target.value})}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-secondary mb-1">Title (e.g. Web Developer · Social Media)</label>
                    <textarea 
                      rows={2}
                      value={profileForm.title || ''} onChange={e => setProfileForm({...profileForm, title: e.target.value})}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent resize-y" 
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-bold text-lg mb-4">About Text & Info Cards</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-secondary mb-1">About Text</label>
                    <textarea 
                      rows={5}
                      value={profileForm.aboutText || ''} onChange={e => setProfileForm({...profileForm, aboutText: e.target.value})}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent resize-y" 
                    ></textarea>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-secondary mb-1">Based In</label>
                      <input 
                        type="text" placeholder="Yogyakarta, Indonesia"
                        value={profileForm.basedIn || ''} onChange={e => setProfileForm({...profileForm, basedIn: e.target.value})}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-secondary mb-1">Education</label>
                      <input 
                        type="text" placeholder="Universitas Islam Indonesia"
                        value={profileForm.educationCard || ''} onChange={e => setProfileForm({...profileForm, educationCard: e.target.value})}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-secondary mb-1">Focus</label>
                      <input 
                        type="text" placeholder="Web & Mobile Dev"
                        value={profileForm.focusCard || ''} onChange={e => setProfileForm({...profileForm, focusCard: e.target.value})}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-secondary mb-1">Interests</label>
                      <input 
                        type="text" placeholder="Digital Communication"
                        value={profileForm.interestsCard || ''} onChange={e => setProfileForm({...profileForm, interestsCard: e.target.value})}
                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-bold text-lg mb-4">Skills Categories</h3>
                <div className="space-y-4">
                  {(profileForm.skills || []).map((cat, idx) => (
                    <div key={idx} className="bg-surface p-4 rounded-xl border border-border">
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm text-secondary font-medium">Category {idx + 1}</label>
                        <button 
                          type="button" 
                          onClick={() => {
                            const newSkills = [...(profileForm.skills || [])];
                            newSkills.splice(idx, 1);
                            setProfileForm({...profileForm, skills: newSkills});
                          }}
                          className="text-red-400 text-sm hover:text-red-300"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <input 
                            type="text" placeholder="Title (e.g. Development)" 
                            value={cat.title} 
                            onChange={e => {
                              const newSkills = [...(profileForm.skills || [])];
                              newSkills[idx].title = e.target.value;
                              setProfileForm({...profileForm, skills: newSkills});
                            }}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent"
                          />
                        </div>
                        <div>
                          <input 
                            type="text" placeholder="Skills (comma separated)" 
                            value={cat.skills.join(', ')} 
                            onChange={e => {
                              const newSkills = [...(profileForm.skills || [])];
                              newSkills[idx].skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                              setProfileForm({...profileForm, skills: newSkills});
                            }}
                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => {
                      setProfileForm({...profileForm, skills: [...(profileForm.skills || []), {title: '', skills: []}]});
                    }}
                    className="text-accent text-sm font-medium hover:text-white"
                  >
                    + Add Category
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="font-bold text-lg mb-4">Contact & Socials</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm text-secondary mb-1">Email Address</label>
                    <input 
                      type="email"
                      value={profileForm.contactEmail || ''} onChange={e => setProfileForm({...profileForm, contactEmail: e.target.value})}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-secondary mb-1">LinkedIn URL</label>
                    <input 
                      type="url" placeholder="https://linkedin.com/in/..."
                      value={profileForm.linkedinUrl || ''} onChange={e => setProfileForm({...profileForm, linkedinUrl: e.target.value})}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-secondary mb-1">GitHub URL</label>
                    <input 
                      type="url" placeholder="https://github.com/..."
                      value={profileForm.githubUrl || ''} onChange={e => setProfileForm({...profileForm, githubUrl: e.target.value})}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-secondary mb-1">Instagram URL</label>
                    <input 
                      type="url" placeholder="https://instagram.com/..."
                      value={profileForm.instagramUrl || ''} onChange={e => setProfileForm({...profileForm, instagramUrl: e.target.value})}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-secondary mb-1">TikTok URL</label>
                    <input 
                      type="url" placeholder="https://tiktok.com/@..."
                      value={profileForm.tiktokUrl || ''} onChange={e => setProfileForm({...profileForm, tiktokUrl: e.target.value})}
                      className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                    />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={isUploading} className="px-6 py-2 bg-primary text-background rounded-lg font-medium hover:bg-white transition-colors disabled:opacity-50">
                {isUploading ? 'Saving...' : 'Save All Settings'}
              </button>
            </form>
          </section>
        )}

        {/* ... The rest of the tabs remain functionally identical ... */}
        {activeTab === 'projects' && (
          <section className="space-y-6">
            <h2 className="text-3xl font-bold border-b border-border pb-4">Projects</h2>
            
            <div className="space-y-4">
              {projects.map(project => (
                <div key={project.id} className="bg-surface p-4 rounded-xl border border-border flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {project.imageUrl ? (
                      <img src={project.imageUrl} alt={project.title} className="w-16 h-16 object-cover rounded-lg" />
                    ) : (
                      <div className="w-16 h-16 bg-surface-light rounded-lg"></div>
                    )}
                    <div>
                      <h3 className="font-bold">{project.title}</h3>
                      <p className="text-sm text-secondary">{project.category} · {project.tech}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEditProject(project)}
                      className="text-blue-400 hover:text-blue-300 px-3 py-1 bg-blue-400/10 rounded-lg text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-red-400 hover:text-red-300 px-3 py-1 bg-red-400/10 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSaveProject} className="bg-surface/50 p-6 rounded-2xl border border-border space-y-4">
              <h3 className="font-bold text-xl mb-4">{editingProjectId ? 'Edit Project' : 'Add New Project'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm text-secondary mb-1">Title</label>
                  <input 
                    type="text" required
                    value={newProject.title || ''} onChange={e => setNewProject({...newProject, title: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-1">Category</label>
                  <input 
                    type="text" required
                    value={newProject.category || ''} onChange={e => setNewProject({...newProject, category: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-1">Technologies</label>
                  <input 
                    type="text" required
                    value={newProject.tech || ''} onChange={e => setNewProject({...newProject, tech: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-1">Project Link (Optional)</label>
                  <input 
                    type="text"
                    value={newProject.link || ''} onChange={e => setNewProject({...newProject, link: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                    placeholder="https://..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-secondary mb-1">Upload Project Image (Optional)</label>
                  <input 
                    type="file" accept="image/*"
                    ref={projectFileInputRef}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                  />
                  {newProject.imageUrl && (
                    <p className="text-xs text-secondary mt-2">Current Image: {newProject.imageUrl}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" disabled={isUploading} className="px-6 py-2 bg-primary text-background rounded-lg font-medium hover:bg-white transition-colors mt-2 disabled:opacity-50">
                  {isUploading ? 'Uploading & Saving...' : (editingProjectId ? 'Save Changes' : 'Add Project')}
                </button>
                {editingProjectId && (
                  <button type="button" onClick={() => { setEditingProjectId(null); setNewProject({ title: '', category: '', tech: '', colSpan: 'md:col-span-1 md:row-span-1', imageUrl: '', link: '' }); }} className="px-6 py-2 bg-surface border border-border text-primary rounded-lg font-medium hover:bg-surface-light transition-colors mt-2">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        {activeTab === 'experiences' && (
          <section className="space-y-6">
            <h2 className="text-3xl font-bold border-b border-border pb-4">Experiences</h2>
            
            <div className="space-y-4">
              {experiences.map(exp => (
                <div key={exp.id} className="bg-surface p-4 rounded-xl border border-border flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg">{exp.role} <span className="text-secondary text-sm font-normal">at {exp.organization}</span></h3>
                    <p className="text-sm text-accent mb-2">{exp.period}</p>
                    <p className="text-sm text-secondary mb-2">{exp.description}</p>
                    <ul className="list-disc list-inside text-sm text-muted">
                      {exp.achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                    </ul>
                  </div>
                  <div className="flex gap-2 flex-col sm:flex-row shrink-0">
                    <button 
                      onClick={() => startEditExperience(exp)}
                      className="text-blue-400 hover:text-blue-300 px-3 py-1 bg-blue-400/10 rounded-lg text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteExperience(exp.id)}
                      className="text-red-400 hover:text-red-300 px-3 py-1 bg-red-400/10 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSaveExperience} className="bg-surface/50 p-6 rounded-2xl border border-border space-y-4">
              <h3 className="font-bold text-xl mb-4">{editingExperienceId ? 'Edit Experience' : 'Add New Experience'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-secondary mb-1">Role</label>
                  <input 
                    type="text" required
                    value={newExperience.role || ''} onChange={e => setNewExperience({...newExperience, role: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-1">Organization</label>
                  <input 
                    type="text" required
                    value={newExperience.organization || ''} onChange={e => setNewExperience({...newExperience, organization: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-secondary mb-1">Period (e.g. 2024 - 2025)</label>
                  <input 
                    type="text" required
                    value={newExperience.period || ''} onChange={e => setNewExperience({...newExperience, period: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-secondary mb-1">Description</label>
                  <textarea 
                    required rows={3}
                    value={newExperience.description || ''} onChange={e => setNewExperience({...newExperience, description: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent resize-none" 
                  ></textarea>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-secondary mb-1">Achievements (One per line)</label>
                  <textarea 
                    rows={4}
                    value={newExperience.achievements as any || ''} onChange={e => setNewExperience({...newExperience, achievements: e.target.value as any})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent resize-none" 
                  ></textarea>
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="px-6 py-2 bg-primary text-background rounded-lg font-medium hover:bg-white transition-colors mt-2">
                  {editingExperienceId ? 'Save Changes' : 'Add Experience'}
                </button>
                {editingExperienceId && (
                  <button type="button" onClick={() => { setEditingExperienceId(null); setNewExperience({ role: '', organization: '', period: '', description: '', achievements: [] }); }} className="px-6 py-2 bg-surface border border-border text-primary rounded-lg font-medium hover:bg-surface-light transition-colors mt-2">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        {activeTab === 'educations' && (
          <section className="space-y-6">
            <h2 className="text-3xl font-bold border-b border-border pb-4">Education</h2>
            <div className="space-y-4">
              {educations.map(edu => (
                <div key={edu.id} className="bg-surface p-4 rounded-xl border border-border flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{edu.institution}</h3>
                    <p className="text-sm text-secondary">{edu.major}</p>
                    <p className="text-sm text-accent mt-1">{edu.period}</p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEditEducation(edu)}
                      className="text-blue-400 hover:text-blue-300 px-3 py-1 bg-blue-400/10 rounded-lg text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteEducation(edu.id)}
                      className="text-red-400 hover:text-red-300 px-3 py-1 bg-red-400/10 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSaveEducation} className="bg-surface/50 p-6 rounded-2xl border border-border space-y-4 mt-8">
              <h3 className="font-bold text-xl mb-4">{editingEducationId ? 'Edit Education' : 'Add New Education'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-secondary mb-1">Institution</label>
                  <input 
                    type="text" required
                    value={newEducation.institution || ''} onChange={e => setNewEducation({...newEducation, institution: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-1">Major</label>
                  <input 
                    type="text" required
                    value={newEducation.major || ''} onChange={e => setNewEducation({...newEducation, major: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-secondary mb-1">Period (e.g. 2020 - 2023)</label>
                  <input 
                    type="text" required
                    value={newEducation.period || ''} onChange={e => setNewEducation({...newEducation, period: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" className="px-6 py-2 bg-primary text-background rounded-lg font-medium hover:bg-white transition-colors mt-2">
                  {editingEducationId ? 'Save Changes' : 'Add Education'}
                </button>
                {editingEducationId && (
                  <button type="button" onClick={() => { setEditingEducationId(null); setNewEducation({ institution: '', major: '', period: '' }); }} className="px-6 py-2 bg-surface border border-border text-primary rounded-lg font-medium hover:bg-surface-light transition-colors mt-2">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        )}

        {activeTab === 'creatives' && (
          <section className="space-y-6">
            <h2 className="text-3xl font-bold border-b border-border pb-4">Creative Work</h2>
            
            <div className="space-y-4">
              {creatives.map(creative => (
                <div key={creative.id} className="bg-surface p-4 rounded-xl border border-border flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    {creative.imageUrl ? (
                      <img src={creative.imageUrl} alt={creative.title} className="w-16 h-16 object-cover rounded-lg" />
                    ) : (
                      <div className="w-16 h-16 bg-surface-light rounded-lg"></div>
                    )}
                    <div>
                      <h3 className="font-bold">{creative.title}</h3>
                      <p className="text-sm text-secondary">{creative.category}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => startEditCreative(creative)}
                      className="text-blue-400 hover:text-blue-300 px-3 py-1 bg-blue-400/10 rounded-lg text-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteCreative(creative.id)}
                      className="text-red-400 hover:text-red-300 px-3 py-1 bg-red-400/10 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSaveCreative} className="bg-surface/50 p-6 rounded-2xl border border-border space-y-4">
              <h3 className="font-bold text-xl mb-4">{editingCreativeId ? 'Edit Creative Work' : 'Add New Creative Work'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-secondary mb-1">Title</label>
                  <input 
                    type="text" required
                    value={newCreative.title || ''} onChange={e => setNewCreative({...newCreative, title: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                  />
                </div>
                <div>
                  <label className="block text-sm text-secondary mb-1">Category (e.g. Social Media)</label>
                  <input 
                    type="text" required
                    value={newCreative.category || ''} onChange={e => setNewCreative({...newCreative, category: e.target.value})}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm text-secondary mb-1">Upload Background Image (Optional)</label>
                  <input 
                    type="file" accept="image/*"
                    ref={creativeFileInputRef}
                    className="w-full bg-background border border-border rounded-lg px-4 py-2 text-primary focus:outline-none focus:border-accent" 
                  />
                  {newCreative.imageUrl && (
                    <p className="text-xs text-secondary mt-2">Current Image: {newCreative.imageUrl}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-4">
                <button type="submit" disabled={isUploading} className="px-6 py-2 bg-primary text-background rounded-lg font-medium hover:bg-white transition-colors mt-2 disabled:opacity-50">
                  {isUploading ? 'Uploading & Saving...' : (editingCreativeId ? 'Save Changes' : 'Add Creative Work')}
                </button>
                {editingCreativeId && (
                  <button type="button" onClick={() => { setEditingCreativeId(null); setNewCreative({ title: '', category: '', imageUrl: '' }); }} className="px-6 py-2 bg-surface border border-border text-primary rounded-lg font-medium hover:bg-surface-light transition-colors mt-2">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>
        )}
      </main>
    </div>
  );
};

export default Admin;
