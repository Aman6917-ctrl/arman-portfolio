'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Award, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const education = {
  degree: 'B.Tech CSE (Data Science)',
  institution: 'RCOEM',
  period: '2021 - 2025',
  cgpa: '8.79',
  highlights: [
    'Strong foundation in Data Science and AI',
    'Active in placement preparation and system design',
  ],
};

const certifications = [
  {
    name: 'IBM Data Science Professional Certificate',
    issuer: 'IBM',
    period: '2023',
  },
  {
    name: 'Business Analytics Certificate',
    issuer: 'IIM Ahmedabad',
    period: '2023',
  },
  {
    name: 'Data Science Certificate',
    issuer: 'Vanderbilt University',
    period: '2022',
  },
];

export function About() {
  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            About Me
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A Data Science student passionate about AI-driven applications, full-stack development,
            and building placement-ready solutions. Experienced in leading teams and delivering impactful projects.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Education */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <GraduationCap className="h-6 w-6 text-primary" />
                  <CardTitle>Education</CardTitle>
                </div>
                <CardDescription>{education.institution}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{education.degree}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="h-4 w-4" />
                    <span>{education.period}</span>
                  </div>
                  <p className="text-sm font-medium text-primary mt-2">
                    CGPA: {education.cgpa}
                  </p>
                </div>
                <ul className="space-y-2 text-sm">
                  {education.highlights.map((highlight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Certifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <Award className="h-6 w-6 text-primary" />
                  <CardTitle>Certifications</CardTitle>
                </div>
                <CardDescription>Professional Development</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {certifications.map((cert, index) => (
                  <div key={index} className="border-l-2 border-primary/30 pl-4">
                    <h3 className="font-semibold">{cert.name}</h3>
                    <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                    <p className="text-xs text-muted-foreground mt-1">{cert.period}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Narrative */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground leading-relaxed">
                With a strong foundation in Data Science and a passion for AI, I've focused on building
                real-world applications that solve practical problems. My experience leading teams in projects
                like ScholarMatch has taught me the importance of collaboration, empathy, and delivering value.
                I'm particularly interested in the intersection of AI and system design, and I'm always eager
                to work on projects that challenge me to think at scale.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

