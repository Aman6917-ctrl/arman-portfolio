'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github, Sparkles, Users, Brain, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { projectsApi } from '@/services/api';
import type { Project } from '@/types';

// Fallback projects data (in case API is not available)
const fallbackProjects: Project[] = [
  {
    id: '1',
    title: 'PlacementPrep – AI-Driven Placement Tool',
    description: 'AI-powered platform for mock interviews and company analysis',
    longDescription: 'A comprehensive placement preparation tool featuring AI mock interviews, company analysis, and personalized feedback to help students prepare for campus placements.',
    tags: ['React', 'TypeScript', 'AI', 'Interviews'],
    githubUrl: 'https://github.com/tiwariar7/PlacementPrep',
    liveUrl: 'https://placementpreprcoem.netlify.app/',
    featured: true,
    highlights: [
      'AI mock interviews with real-time feedback',
      'Company-specific analysis and insights',
      'Student-focused design with empathy',
    ],
    category: 'ai',
  },
  {
    id: '2',
    title: 'ScholarMatch – Scholarship Finder',
    description: 'Full-stack scholarship discovery platform with NGO collaboration',
    longDescription: 'Led a team of 5 members to build an MVP scholarship finder platform in collaboration with NGOs, focusing on accessibility and social impact.',
    tags: ['Leadership', 'Full-Stack', 'Social Impact'],
    githubUrl: 'https://github.com/tiwariar7/ScholarMatch',
    featured: true,
    highlights: [
      'Team lead for 5-member development team',
      'NGO collaboration and partnership',
      'MVP delivery with focus on impact',
    ],
    category: 'leadership',
  },
  {
    id: '3',
    title: 'NewsLens – AI News Aggregator',
    description: 'NLP-powered news aggregator with bias detection',
    longDescription: 'An intelligent news aggregator using HuggingFace models for sentiment analysis and bias detection, demonstrating system design thinking and AI integration.',
    tags: ['NLP', 'Bias Detection', 'AI'],
    githubUrl: 'https://github.com/tiwariar7/NewsLens',
    liveUrl: 'https://news-lens-frontend.vercel.app/',
    featured: true,
    highlights: [
      'HuggingFace model integration',
      'Sentiment analysis with VADER and TextBlob',
      'Team collaboration and system design',
    ],
    category: 'nlp',
  },
];

const categoryIcons = {
  ai: Sparkles,
  fullstack: ExternalLink,
  leadership: Users,
  nlp: Brain,
};

export function Projects() {
  const [projects, setProjects] = React.useState<Project[]>(fallbackProjects);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await projectsApi.getAll();
        setProjects(data);
      } catch (error) {
        console.error('Failed to fetch projects, using fallback data:', error);
        // Keep fallback data
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-muted-foreground">Loading projects...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real projects from my portfolio showcasing AI integration, leadership, and full-stack development.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const CategoryIcon = categoryIcons[project.category] || ExternalLink;
            const isAI = project.category === 'ai';

            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="h-5 w-5 text-primary" />
                        {isAI && (
                          <Badge variant="default" className="bg-accent text-accent-foreground">
                            AI
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl">{project.title}</CardTitle>
                    <CardDescription>{project.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    {project.highlights && (
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        {project.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                  <CardFooter className="flex flex-col gap-2">
                    <div className="flex gap-2 w-full">
                      {project.liveUrl && (
                        <Button asChild className="flex-1">
                          <a 
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="flex items-center justify-center"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Live
                          </a>
                        </Button>
                      )}
                      {project.githubUrl && (
                        <Button asChild variant="outline" className="flex-1">
                          <a 
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="flex items-center justify-center"
                          >
                            <Github className="mr-2 h-4 w-4" />
                            GitHub
                          </a>
                        </Button>
                      )}
                    </div>
                    <Button asChild variant="secondary" size="sm" className="w-full">
                      <Link href={`/ai-assistant?project=${project.id}`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Ask AI about this project
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}