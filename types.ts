// The SkillCategory enum is removed and replaced with a more flexible interface
// to allow adding/editing categories in the admin panel.

export interface Skill {
  name: string;
  icon: string; // Path to the icon image file
}

export interface SkillCategory {
  name: string;
  skills: Skill[];
}

export interface Certification {
  title: string;
  issuer: string;
  imageUrl: string;
  link: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  fullDescription: string;
  icon: 'work' | 'education' | 'milestone';
}

export interface LearningItem {
  title: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  imageUrl?: string;
  githubUrl?: string;
  interactiveComponent?: 'Game2048';
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  imgSrc: string;
}