'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, Github, Linkedin, MessageSquare } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function Contact() {
  return (
    <section id="contact" className="py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Feel free to reach out via email, phone, or connect with me online.
          </p>
        </motion.div>

        {/* Contact Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-xl mx-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Contact Details
              </CardTitle>
              <CardDescription>
                You can contact me directly using the details below.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 text-center">
              {/* Email */}
              <a
                href="mailto:armantiwari01@gmail.com"
                className="flex items-center justify-center gap-3 text-primary hover:underline"
              >
                <Mail className="h-5 w-5" />
                armantiwari01@gmail.com
              </a>

              {/* Phone */}
              <a
                href="tel:+919373610991"
                className="flex items-center justify-center gap-3 text-primary hover:underline"
              >
                <Phone className="h-5 w-5" />
                +91 93736 10991
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/tiwariar7/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 text-primary hover:underline"
              >
                <Linkedin className="h-5 w-5" />
                linkedin.com/in/tiwariar7
              </a>

              {/* GitHub */}
              <a
                href="https://github.com/tiwariar7"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 text-primary hover:underline"
              >
                <Github className="h-5 w-5" />
                github.com/tiwariar7
              </a>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
