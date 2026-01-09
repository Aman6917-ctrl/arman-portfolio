'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Bot,
  User,
  Send,
  GraduationCap,
  Loader2,
  Lightbulb,
  Target,
  TrendingUp,
  Briefcase,
  Award,
  Upload,
  FileText,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { aiApi } from '@/services/api';
import type { ChatMessage } from '@/types';
import { toast } from 'sonner';

const predefinedPrompts = [
  {
    category: 'Placement Preparation',
    prompts: [
      'How should I prepare for technical interviews?',
      'What system design topics should I focus on?',
      'How do I approach behavioral interviews?',
      'What makes a strong placement candidate?',
    ],
  },
  {
    category: 'Career Growth',
    prompts: [
      'How do I transition from student to professional?',
      'What skills should I prioritize for AI engineering roles?',
      'How do I build a strong professional network?',
      'What are the key differences between SDE and AI Engineer roles?',
    ],
  },
  {
    category: 'Resume & Portfolio',
    prompts: [
      'How do I highlight AI projects on my resume?',
      'What should I include in my portfolio?',
      'How do I demonstrate leadership experience?',
      'What metrics should I use to showcase impact?',
    ],
  },
];

export function CareerPage() {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [userName, setUserName] = React.useState<string>(() => {
    if (typeof window === 'undefined') return 'Visitor';
    return localStorage.getItem('ai-user-name') || 'Visitor';
  });
  const [sessionId, setSessionId] = React.useState<string | undefined>(() => {
    if (typeof window === 'undefined') return undefined;
    return localStorage.getItem('ai-career-session-id') || undefined;
  });
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [resumeText, setResumeText] = React.useState('');
  const [isReviewingResume, setIsReviewingResume] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        role: 'assistant',
        content:
          "Hi! I'm your Career Mentor. I'm here to provide guidance on placement preparation, career growth, and professional development. Feel free to ask about interview preparation, skill building, or career strategy.",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('ai-career-messages', JSON.stringify(messages));
    if (sessionId) localStorage.setItem('ai-career-session-id', sessionId);
    if (userName) localStorage.setItem('ai-user-name', userName);
  }, [messages, sessionId, userName]);

  const sendMessage = async (messageText?: string) => {
    const message = messageText || input.trim();
    if (!message || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: message,
      timestamp: new Date().toISOString(),
    };

    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await aiApi.chat({
        message,
        history: nextHistory,
        mode: 'mentor', // Locked to mentor persona
        sessionId,
        userName,
        agentMode: false,
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      if (response.sessionId) setSessionId(response.sessionId);
    } catch (error: any) {
      console.error('Failed to get AI response:', error);
      const errorMessage = error?.response?.data?.error || error?.message || 'Unknown error';
      toast.error(`AI Service Error: ${errorMessage}`);
      const errorChatMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I'm sorry, I'm having trouble connecting to the AI service. Please check if the backend server is running and try again later.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorChatMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setResumeFile(droppedFile);
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setResumeFile(selectedFile);
    }
  };

  const handleResumeReview = async () => {
    if (!resumeFile && !resumeText.trim()) {
      toast.error('Please upload a resume file or paste resume text');
      return;
    }

    setIsReviewingResume(true);

    try {
      const result = await aiApi.resumeReview({
        file: resumeFile || undefined,
        text: resumeText || undefined,
        role: 'General Career Guidance',
        userName: userName || 'Candidate',
      });

      // Send the feedback as a message to the chat
      const reviewMessage = `I've reviewed your resume. Here's my feedback:\n\n${result.feedback}`;
      sendMessage(reviewMessage);
      
      // Clear resume inputs
      setResumeFile(null);
      setResumeText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      toast.success('Resume reviewed successfully');
    } catch (error) {
      console.error('Resume review error:', error);
      toast.error('Failed to review resume. Please try again.');
    } finally {
      setIsReviewingResume(false);
    }
  };

  return (
    <section className="min-h-screen pt-16 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 flex items-center justify-center gap-3">
            <GraduationCap className="h-8 w-8 text-primary" />
            Career Guidance
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Placement-focused guidance and career mentorship. Get personalized advice on interviews,
            skill development, and professional growth.
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Predefined Prompts Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Quick Prompts</CardTitle>
                  </div>
                  <CardDescription>Click any prompt to start a conversation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {predefinedPrompts.map((category, idx) => (
                    <div key={idx} className="space-y-2">
                      <h3 className="text-sm font-semibold flex items-center gap-2">
                        {category.category === 'Placement Preparation' && <Target className="h-4 w-4" />}
                        {category.category === 'Career Growth' && <TrendingUp className="h-4 w-4" />}
                        {category.category === 'Resume & Portfolio' && <Briefcase className="h-4 w-4" />}
                        {category.category}
                      </h3>
                      <div className="space-y-1.5">
                        {category.prompts.map((prompt, pIdx) => (
                          <Button
                            key={pIdx}
                            variant="outline"
                            size="sm"
                            className="w-full text-left justify-start h-auto py-2 px-3 text-xs"
                            onClick={() => sendMessage(prompt)}
                            disabled={isLoading}
                          >
                            {prompt}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Chat Interface */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Resume Upload Section */}
              <Card className="border-2">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Upload Resume for Review</CardTitle>
                  </div>
                  <CardDescription>
                    Get personalized career guidance based on your resume
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Upload Resume (PDF)</label>
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                        isDragging
                          ? 'border-primary bg-primary/5'
                          : 'border-muted-foreground/25 hover:border-primary/50'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      {resumeFile ? (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center gap-2">
                            <FileText className="h-5 w-5 text-primary" />
                            <span className="font-medium">{resumeFile.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setResumeFile(null);
                              if (fileInputRef.current) fileInputRef.current.value = '';
                            }}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop your resume here, or{' '}
                            <button
                              type="button"
                              onClick={() => fileInputRef.current?.click()}
                              className="text-primary hover:underline"
                            >
                              browse
                            </button>
                          </p>
                          <p className="text-xs text-muted-foreground">PDF format only</p>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Or Paste Resume Text</label>
                    <Textarea
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your resume content here..."
                      className="min-h-[100px]"
                      disabled={!!resumeFile}
                    />
                    {resumeFile && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Remove the uploaded file to use text input
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={handleResumeReview}
                    disabled={isReviewingResume || (!resumeFile && !resumeText.trim())}
                    className="w-full"
                  >
                    {isReviewingResume ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Reviewing Resume...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Review Resume & Get Career Advice
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-green-500" />
                      <CardTitle>Mentor You</CardTitle>
                      <Badge variant="secondary" className="ml-2">Locked</Badge>
                    </div>
                    <Input
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      placeholder="Your name"
                      className="h-9 w-32 text-sm"
                    />
                  </div>
                  <CardDescription>
                    Guidance, feedback, and growth-oriented suggestions for your career journey
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-0">
                  {/* Chat Messages */}
                  <ScrollArea className="h-[500px] p-4">
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex gap-3 ${
                            message.role === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {message.role === 'assistant' && (
                            <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                              <GraduationCap className="h-4 w-4 text-green-500" />
                            </div>
                          )}
                          <div
                            className={`max-w-[80%] rounded-lg p-3 text-sm leading-relaxed ${
                              message.role === 'user'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted'
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                          {message.role === 'user' && (
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <User className="h-4 w-4 text-primary" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                      {isLoading && (
                        <div className="flex gap-3 justify-start">
                          <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center">
                            <GraduationCap className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="bg-muted rounded-lg p-3">
                            <Loader2 className="h-4 w-4 animate-spin" />
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>

                  {/* Input Form */}
                  <form onSubmit={handleSubmit} className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about placement preparation, career growth, or professional development..."
                        disabled={isLoading}
                        className="flex-1"
                      />
                      <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-2">
                      Mentor persona active • Session memory enabled
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

