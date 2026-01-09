export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  highlights?: string[];
  category: 'ai' | 'fullstack' | 'leadership' | 'nlp';
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'programming' | 'frontend' | 'backend' | 'ai' | 'database' | 'tools';
  icon?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  cgpa?: string;
  highlights?: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  period: string;
  credentialId?: string;
}

