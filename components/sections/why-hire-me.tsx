'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Play, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function WhyHireMe() {
  const [isPlaying, setIsPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const strengths = [
    'Strong technical foundation in AI, Data Science, and Full-Stack Development',
    'Proven leadership experience in team-based projects',
    'Placement-ready with system design and scalable application expertise',
    'Passionate about solving real-world problems with technology',
    'Continuous learner with certifications from IBM, IIM Ahmedabad, and Vanderbilt',
    'Collaborative mindset with focus on delivering value',
  ];

  return (
    <section id="why-hire-me" className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Why Should You Hire Me?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A 1-2 minute introduction showcasing my strengths, mindset, and what makes me a great hire.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto items-center">
          {/* Video Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <Card className="overflow-hidden">
              <CardContent className="p-0 relative">
                <div className="aspect-video bg-muted relative">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    controls
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                  >
                    <source src="/video/WhatsApp Video 2026-01-09 at 11.06.33.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                      <Button
                        size="lg"
                        className="rounded-full h-20 w-20"
                        onClick={handlePlay}
                        aria-label="Play video"
                      >
                        <Play className="h-10 w-10 ml-1" fill="currentColor" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Click to play the introduction video
            </p>
          </motion.div>

          {/* Key Strengths */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">What Makes Me a Great Hire</h3>
              <div className="space-y-4">
                {strengths.map((strength, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">{strength}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  I'm not just looking for a job—I'm looking for an opportunity to contribute,
                  learn, and grow while delivering real value to your team and customers.
                  My combination of technical skills, leadership experience, and placement readiness
                  makes me ready to hit the ground running.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

