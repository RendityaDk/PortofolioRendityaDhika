import { pgTable, text, varchar, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  tech: text('tech').notNull(),
  colSpan: text('col_span').notNull(),
  imageUrl: text('image_url'),
  link: text('link'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const experiences = pgTable('experiences', {
  id: varchar('id', { length: 255 }).primaryKey(),
  role: text('role').notNull(),
  organization: text('organization').notNull(),
  period: text('period').notNull(),
  description: text('description').notNull(),
  achievements: jsonb('achievements').notNull(), // array of strings
  createdAt: timestamp('created_at').defaultNow(),
});

export const educations = pgTable('educations', {
  id: varchar('id', { length: 255 }).primaryKey(),
  institution: text('institution').notNull(),
  major: text('major').notNull(),
  period: text('period').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const profile = pgTable('profile', {
  id: varchar('id', { length: 255 }).primaryKey(), // We'll just use '1' for a single row
  profilePhotoUrl: text('profile_photo_url'),
  tagline: text('tagline'),
  title: text('title'),
  aboutText: text('about_text'),
  skills: jsonb('skills'), // array of strings
  contactEmail: text('contact_email'),
  instagramUrl: text('instagram_url'),
  tiktokUrl: text('tiktok_url'),
  linkedinUrl: text('linkedin_url'),
  githubUrl: text('github_url'),
  basedIn: text('based_in'),
  educationCard: text('education_card'),
  focusCard: text('focus_card'),
  interestsCard: text('interests_card'),
});

export const creativeWorks = pgTable('creative_works', {
  id: varchar('id', { length: 255 }).primaryKey(),
  title: text('title').notNull(),
  category: text('category').notNull(),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow(),
});
