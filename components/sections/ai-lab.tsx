'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Upload, Sparkles, Brain, Headphones, Timer, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { aiApi } from '@/services/api';

const featureList = [
  { title: 'AI Career Assistant', desc: 'Ask for resume advice, career tips, or project explanations.', icon: Sparkles },
  { title: 'Context Memory', desc: 'Remembers your name and conversation flow.', icon: Brain },
  { title: 'Voice Ready', desc: 'Use mic input and hear AI responses with TTS.', icon: Headphones },
  { title: 'Fast Feedback', desc: 'Resume reviewer gives concise, actionable insights.', icon: Timer },
];

export function AiLab() {
  const [file, setFile] = React.useState<File | null>(null);
  const [resumeText, setResumeText] = React.useState('');
  const [desiredRole, setDesiredRole] = React.useState('AI Engineer');
  const [userName, setUserName] = React.useState('Visitor');
  const [feedback, setFeedback] = React.useState('');
  const [isReviewing, setIsReviewing] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsReviewing(true);
    setFeedback('');
    try {
      const result = await aiApi.resumeReview({
        file: file || undefined,
        text: resumeText || undefined,
        role: desiredRole,
        userName,
      });
      setFeedback(result.feedback);
    } catch (err) {
      console.error(err);
      setFeedback('Failed to review resume. Please try again.');
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <section id="ai-assistant" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">AI Career Studio</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Switch personas, get resume feedback, and chat with a career-focused assistant powered by real project data.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            {featureList.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Card key={item.title} className="h-full">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                    <CardDescription>{item.desc}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
            <Card className="border-primary/40 bg-primary/5">
              <CardHeader>
                <CardTitle>Try the Assistant</CardTitle>
                <CardDescription>Open the chat and start with suggested prompts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('openChat'));
                    setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 200);
                  }}
                >
                  Chat Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <p className="text-xs text-muted-foreground">
                  Modes: Career Coach, Developer You, Designer You, Mentor You. Agent mode adds next steps.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="lg:col-span-2">
            <CardHeader className="space-y-2">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                <CardTitle>AI Resume Reviewer</CardTitle>
              </div>
              <CardDescription>
                Upload a PDF or paste text. Get concise, ATS-friendly feedback with clear action items.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Your name</label>
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Target role</label>
                    <Input
                      value={desiredRole}
                      onChange={(e) => setDesiredRole(e.target.value)}
                      placeholder="e.g., AI Engineer, Backend Developer"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Upload PDF (optional)</label>
                  <Input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                  <p className="text-xs text-muted-foreground">You can also paste text below.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Paste resume text (optional)</label>
                  <Textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    placeholder="Paste your resume content if not uploading a PDF."
                    rows={6}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Button type="submit" disabled={isReviewing}>
                    {isReviewing ? 'Reviewing...' : 'Get Feedback'}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    The assistant uses ATS-friendly criteria and returns action items.
                  </p>
                </div>
              </form>

              {feedback && (
                <div className="mt-4 p-4 rounded-lg border bg-muted/50 text-sm whitespace-pre-wrap">
                  {feedback}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

