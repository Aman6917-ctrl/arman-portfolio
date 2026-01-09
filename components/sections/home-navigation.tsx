'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { User, Briefcase, Code, Target, Mail, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const navigationItems = [
  {
    href: '#why-hire-me',
    label: 'Why Should You Hire Me?',
    icon: Target,
    description: 'Discover my strengths and value proposition',
    color: 'from-orange-500/20 to-red-500/20',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    href: '#about',
    label: 'About',
    icon: User,
    description: 'Learn about my background and education',
    color: 'from-blue-500/20 to-cyan-500/20',
    iconColor: 'text-blue-600 dark:text-blue-400',
  },
  {
    href: '#projects',
    label: 'Featured Projects',
    icon: Briefcase,
    description: 'Explore my portfolio projects',
    color: 'from-purple-500/20 to-pink-500/20',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
  {
    href: '#skills',
    label: 'Skills',
    icon: Code,
    description: 'View my technical expertise',
    color: 'from-green-500/20 to-emerald-500/20',
    iconColor: 'text-green-600 dark:text-green-400',
  },
  {
    href: '#contact',
    label: 'Get In Contact',
    icon: Mail,
    description: 'Reach out and connect with me',
    color: 'from-indigo-500/20 to-violet-500/20',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
  },
];

export function HomeNavigation() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      const offset = 80; // Account for fixed navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Quick Navigation
          </h2>
          <p className="text-muted-foreground text-lg">Explore different sections of my portfolio</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <Card className="h-full border-2 hover:border-primary/30 transition-all duration-300 group cursor-pointer overflow-hidden bg-card/50 backdrop-blur-sm hover:shadow-xl hover:shadow-primary/5">
                  <Link
                    href={item.href}
                    onClick={(e) => handleScroll(e, item.href)}
                    className="block h-full"
                  >
                    <CardContent className="p-6 sm:p-7 flex flex-col h-full">
                      {/* Icon Container */}
                      <div className={`relative mb-5 flex items-center justify-center`}>
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                        />
                        <div className="relative h-14 w-14 rounded-xl bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-border/50 group-hover:border-primary/30">
                          <Icon className={`h-7 w-7 ${item.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-lg mb-2.5 group-hover:text-primary transition-colors duration-300 leading-tight">
                        {item.label}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground mb-5 flex-grow leading-relaxed">
                        {item.description}
                      </p>

                      {/* CTA */}
                      <div className="flex items-center text-primary text-sm font-semibold mt-auto pt-2 border-t border-border/50 group-hover:border-primary/30 transition-colors">
                        <span className="group-hover:translate-x-1 transition-transform duration-300 inline-block">
                          Explore
                        </span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

