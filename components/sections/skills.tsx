'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Code, Globe, Server, Brain, Database, Wrench } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Skill } from '@/types';

const skills: Skill[] = [
  // Programming
  { name: 'Java', level: 90, category: 'programming' },
  { name: 'Python', level: 85, category: 'programming' },
  
  // Frontend
  { name: 'React', level: 85, category: 'frontend' },
  { name: 'Next.js', level: 80, category: 'frontend' },
  { name: 'TypeScript', level: 80, category: 'frontend' },
  { name: 'HTML/CSS', level: 85, category: 'frontend' },
  
  // Backend
  { name: 'Java Spring Boot', level: 55, category: 'backend' },
  { name: 'Flask', level: 75, category: 'backend' },
  
  // AI/NLP
  { name: 'HuggingFace', level: 80, category: 'ai' },
  { name: 'VADER', level: 75, category: 'ai' },
  { name: 'TextBlob', level: 75, category: 'ai' },
  { name: 'Gemini', level: 70, category: 'ai' },
  
  // Database
  { name: 'SQL', level: 80, category: 'database' },
  { name: 'PostgreSQL', level: 75, category: 'database' },
  { name: 'Supabase', level: 70, category: 'database' },
  
  // Tools
  { name: 'Git', level: 85, category: 'tools' },
  { name: 'Power BI', level: 75, category: 'tools' },
];

const categoryConfig = {
  programming: { icon: Code, label: 'Programming', color: 'text-blue-500' },
  frontend: { icon: Globe, label: 'Frontend', color: 'text-purple-500' },
  backend: { icon: Server, label: 'Backend', color: 'text-green-500' },
  ai: { icon: Brain, label: 'AI/NLP', color: 'text-pink-500' },
  database: { icon: Database, label: 'Database', color: 'text-orange-500' },
  tools: { icon: Wrench, label: 'Tools', color: 'text-cyan-500' },
} as const;

export function Skills() {
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="skills" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Skills & Technologies
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I work with, organized by category.
          </p>
        </motion.div>

        <Tabs defaultValue={categories[0]} className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-8">
            {categories.map((category) => {
              const config = categoryConfig[category];
              const Icon = config.icon;
              return (
                <TabsTrigger key={category} value={category} className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{config.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category);
            const config = categoryConfig[category];

            return (
              <TabsContent key={category} value={category}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <config.icon className={`h-5 w-5 ${config.color}`} />
                      {config.label}
                    </CardTitle>
                    <CardDescription>
                      {categorySkills.length} skills in this category
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categorySkills.map((skill, index) => (
                      <motion.div
                        key={skill.name}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-sm text-muted-foreground">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: index * 0.1 }}
                            className="h-full bg-primary rounded-full"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
}

