'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bot,
  User,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Wand2,
  Loader2,
  Code,
  Palette,
  GraduationCap,
  Sparkles,
  X,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { aiApi, projectsApi } from '@/services/api';
import type { ChatMessage, Project } from '@/types';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { toast } from 'sonner';

const personas = [
  {
    id: 'developer',
    label: 'Developer You',
    icon: Code,
    description: 'Technical deep-dives, code references, implementation details',
    color: 'text-blue-500',
  },
  {
    id: 'designer',
    label: 'Designer You',
    icon: Palette,
    description: 'UX/UI focus, accessibility, visual hierarchy',
    color: 'text-purple-500',
  },
  {
    id: 'mentor',
    label: 'Mentor You',
    icon: GraduationCap,
    description: 'Guidance, feedback, growth-oriented suggestions',
    color: 'text-green-500',
  },
];

const smartPrompts = [
  'Explain your PlacementPrep project in detail',
  'What AI frameworks have you worked with?',
  'Tell me about your leadership experience',
  'How do you approach system design?',
  'What makes you placement-ready?',
  'Walk me through your tech stack',
];

function AIAssistantHubContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams?.get('project');
  
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [persona, setPersona] = React.useState<'developer' | 'designer' | 'mentor'>('developer');
  const [agentMode, setAgentMode] = React.useState(false);
  const [userName, setUserName] = React.useState<string>(() => {
    if (typeof window === 'undefined') return 'Visitor';
    return localStorage.getItem('ai-user-name') || 'Visitor';
  });
  const [sessionId, setSessionId] = React.useState<string | undefined>(() => {
    if (typeof window === 'undefined') return undefined;
    return localStorage.getItem('ai-session-id') || undefined;
  });
  const [speakEnabled, setSpeakEnabled] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const [projectContext, setProjectContext] = React.useState<Project | null>(null);
  const recognitionRef = React.useRef<any>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Load project context if projectId is provided
  React.useEffect(() => {
    if (projectId) {
      projectsApi
        .getById(projectId)
        .then((project) => {
          setProjectContext(project);
          setPersona('developer'); // Auto-switch to Developer persona
          // Auto-send initial message about the project
          const initialMessage = `Tell me about the ${project.title} project.`;
          setTimeout(() => {
            sendMessage(initialMessage, project);
          }, 500);
        })
        .catch((error) => {
          console.error('Failed to load project:', error);
        });
    }
  }, [projectId]);

  React.useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        role: 'assistant',
        content: projectContext
          ? `Hi! I'm here to help you learn about ${projectContext.title}. Ask me anything about this project, its implementation, or related technologies.`
          : "Hi! I'm Arman Tiwari's AI Assistant. Choose a persona or ask me about projects, resume, or career journey.",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  }, [projectContext]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('ai-chat-messages', JSON.stringify(messages));
    if (sessionId) localStorage.setItem('ai-session-id', sessionId);
    if (userName) localStorage.setItem('ai-user-name', userName);
  }, [messages, sessionId, userName]);

  const speak = (text: string) => {
    if (!speakEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in your browser.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.continuous = false;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      inputRef.current?.focus();
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const sendMessage = async (messageText?: string, project?: Project | null) => {
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
      // Enhance API call with project context if available
      const contextProject = project || projectContext;
      const enhancedMessage = contextProject
        ? `[Project Context: ${contextProject.title} - ${contextProject.description}. ${contextProject.longDescription || ''} Technologies: ${contextProject.tags.join(', ')}. Highlights: ${contextProject.highlights?.join(', ') || 'N/A'}]\n\nUser question: ${message}`
        : message;

      const response = await aiApi.chat({
        message: enhancedMessage,
        history: nextHistory,
        mode: persona,
        sessionId,
        userName,
        agentMode,
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      if (response.sessionId) setSessionId(response.sessionId);
      speak(response.response);
    } catch (error: any) {
      console.error('Failed to get AI response:', error);
      let errorMessage = 'Unknown error';
      
      if (error?.response) {
        // Server responded with error status
        const errorData = error.response.data;
        const status = error.response.status;
        
        if (status === 429) {
          errorMessage = 'Rate limit exceeded. Please wait a moment and try again.';
        } else if (status === 401) {
          errorMessage = 'API authentication failed. Please check backend configuration.';
        } else {
          errorMessage = errorData?.error || errorData?.message || `Server error: ${status}`;
        }
        console.error('Server error response:', errorData);
      } else if (error?.request) {
        // Request was made but no response received
        errorMessage = 'No response from server. Is the backend running on http://localhost:5000?';
        console.error('No response from server:', error.request);
      } else {
        // Error setting up the request
        errorMessage = error?.message || 'Failed to send request';
        console.error('Request setup error:', error.message);
      }
      
      toast.error(`AI Service Error: ${errorMessage}`);
      const errorChatMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm sorry, I encountered an error: ${errorMessage}. Please check if the backend server is running on http://localhost:5000 and try again.`,
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

  const selectedPersona = personas.find((p) => p.id === persona) || personas[0];
  const PersonaIcon = selectedPersona.icon;

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
            <Bot className="h-8 w-8 text-primary" />
            AI Career Assistant
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Context-aware conversations with persona-based guidance. Ask about projects, resume, or career journey.
          </p>
        </motion.div>

        {/* Project Context Banner */}
        {projectContext && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="default">Project Context Active</Badge>
                      <span className="text-sm font-semibold">{projectContext.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{projectContext.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setProjectContext(null);
                      window.history.replaceState({}, '', '/ai-assistant');
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="max-w-5xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="border-b">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2 mb-2">
                    <PersonaIcon className={`h-5 w-5 ${selectedPersona.color}`} />
                    {selectedPersona.label}
                  </CardTitle>
                  <CardDescription>{selectedPersona.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your name"
                    className="h-9 w-32 text-sm"
                  />
                  <Button
                    variant={speakEnabled ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSpeakEnabled((prev) => !prev)}
                    className="h-9"
                    title="Toggle text-to-speech"
                  >
                    {speakEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={agentMode ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setAgentMode((prev) => !prev)}
                    className="h-9"
                    title="Enable autonomous reasoning"
                  >
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Persona Selector */}
              <div className="mt-4 flex flex-wrap gap-2">
                {personas.map((p) => {
                  const Icon = p.icon;
                  return (
                    <Button
                      key={p.id}
                      size="sm"
                      variant={persona === p.id ? 'default' : 'outline'}
                      className="h-9 text-xs"
                      onClick={() => setPersona(p.id as any)}
                    >
                      <Icon className={`h-3 w-3 mr-1.5 ${p.color}`} />
                      {p.label}
                    </Button>
                  );
                })}
              </div>
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
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <PersonaIcon className={`h-4 w-4 ${selectedPersona.color}`} />
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
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <PersonaIcon className={`h-4 w-4 ${selectedPersona.color}`} />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <Loader2 className="h-4 w-4 animate-spin" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Smart Prompt Suggestions */}
              {messages.length <= 1 && (
                <div className="p-4 border-t space-y-2">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-muted-foreground" />
                    <p className="text-xs font-medium text-muted-foreground">Suggested questions:</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {smartPrompts.map((prompt) => (
                      <Button
                        key={prompt}
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => sendMessage(prompt)}
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleSubmit} className="p-4 border-t space-y-2">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={
                      projectContext
                        ? `Ask about ${projectContext.title}...`
                        : 'Ask about projects, resume, or career journey...'
                    }
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant={isListening ? 'default' : 'outline'}
                    onClick={() => (isListening ? stopListening() : startListening())}
                    title="Voice input"
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center justify-between">
                  <span>
                    {agentMode && <Badge variant="secondary" className="mr-2">Agent Mode</Badge>}
                    Voice input/output available • Session memory active
                  </span>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export function AIAssistantHub() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-16 flex items-center justify-center">Loading...</div>}>
      <AIAssistantHubContent />
    </Suspense>
  );
}

