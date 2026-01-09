'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Download, MessageCircle, ArrowRight, Sparkles, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const roles = [
  'AI Engineer',
  'Backend Developer (Flask,Java Spring Boot)',
  'Full-Stack Developer',
];

export function Hero() {
  const [currentRoleIndex, setCurrentRoleIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-8">
          {/* Name and Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold">
              Arman Tiwari
            </h1>
            <div className="flex items-center justify-center gap-2 text-lg sm:text-xl md:text-2xl text-muted-foreground">
              <span>B.Tech CSE (Data Science) |</span>
              <motion.span
                key={currentRoleIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5 }}
                className="text-primary font-semibold inline-flex items-center gap-2"
              >
                <Sparkles className="h-5 w-5 text-accent" />
                {roles[currentRoleIndex]}
              </motion.span>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Building AI-driven products with Java Spring Boot & Python.
          </motion.p>

          {/* Subtle AI Assistant CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col items-center gap-2 pt-2"
          >
            <Button asChild variant="ghost" size="lg" className="group text-muted-foreground hover:text-foreground">
              <Link href="/ai-assistant">
                <Sparkles className="mr-2 h-4 w-4" />
                Talk to my AI Assistant
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground">
              Ask about my projects, resume, or career journey.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Button asChild size="lg" className="group">
              <Link href="#projects">
                View Projects
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="group">
              <Link href="/resume">
                View Resume
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="group"
            >
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                <Eye className="mr-2 h-4 w-4" />
                Open Resume PDF
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
            >
              <a href="/resume.pdf" download="Arman_Tiwari_Resume.pdf">
                <Download className="mr-2 h-4 w-4" />
                Download Resume
              </a>
            </Button>
          </motion.div>

          {/* Navigation Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="pt-8 space-y-4"
          >
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
              <Button
                asChild
                variant="outline"
                size="default"
                className="group"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector('#why-hire-me');
                  if (element) {
                    const offset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }}
              >
                <Link href="#why-hire-me">
                  Why Should You Hire Me?
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="default"
                className="group"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector('#about');
                  if (element) {
                    const offset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }}
              >
                <Link href="#about">
                  About
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="default"
                className="group"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector('#projects');
                  if (element) {
                    const offset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }}
              >
                <Link href="#projects">
                  Featured Projects
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="default"
                className="group"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector('#skills');
                  if (element) {
                    const offset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }}
              >
                <Link href="#skills">
                  Skills
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="default"
                className="group"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector('#contact');
                  if (element) {
                    const offset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                  }
                }}
              >
                <Link href="#contact">
                  Get In Contact
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex items-start justify-center p-2"
            >
              <motion.div
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-1 h-3 bg-muted-foreground/50 rounded-full"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

