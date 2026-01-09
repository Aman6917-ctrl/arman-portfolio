'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Wand2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { aiApi } from '@/services/api';
import type { ChatMessage } from '@/types';

const suggestedQuestions = [
  'Give me resume advice for AI roles',
  'Explain your placement projects',
  'What AI experience do you have?',
  'Review my resume for backend roles',
  'Why Java Spring Boot?',
  'Tell me about your leadership experience',
];

const modes = [
  { id: 'career', label: 'Career Coach' },
  { id: 'developer', label: 'Developer You' },
  { id: 'designer', label: 'Designer You' },
  { id: 'mentor', label: 'Mentor You' },
];

type SpeechRecognitionType = any;

export function ChatAssistant() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>(() => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('ai-chat-messages');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [input, setInput] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [mode, setMode] = React.useState<'career' | 'developer' | 'designer' | 'mentor'>('career');
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
  const recognitionRef = React.useRef<SpeechRecognitionType | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content:
            "Hi! I'm Arman Tiwari's AI Assistant. Ask for career advice, resume feedback, project explanations, or switch personas (Developer, Designer, Mentor).",
          timestamp: new Date().toISOString(),
        },
      ]);
    }
  }, [messages.length]);

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
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition as any;
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const sendMessage = async (message: string) => {
    if (!message.trim() || isLoading) return;

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
        mode,
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
    } catch (error) {
      console.error('Failed to get AI response:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content:
          "I'm sorry, I'm having trouble connecting to the AI service. Please try again later.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  React.useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };
    window.addEventListener('openChat', handleOpenChat);
    return () => window.removeEventListener('openChat', handleOpenChat);
  }, []);

  return (
    <>
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={() => setIsOpen(true)}
            size="lg"
            className="rounded-full h-14 w-14 shadow-lg"
            aria-label="Open chat"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
        </motion.div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[420px] h-[640px]"
          >
            <Card className="h-full flex flex-col shadow-2xl">
              <CardHeader className="flex flex-col space-y-3 border-b pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">AI Career Assistant</CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Your name"
                    className="h-9 text-sm"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant={speakEnabled ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSpeakEnabled((prev) => !prev)}
                      className="h-9"
                    >
                      {speakEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant={agentMode ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setAgentMode((prev) => !prev)}
                      className="h-9"
                    >
                      <Wand2 className="h-4 w-4 mr-1" />
                      Agent
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {modes.map((m) => (
                    <Button
                      key={m.id}
                      size="sm"
                      variant={mode === m.id ? 'default' : 'outline'}
                      className="h-8 text-xs"
                      onClick={() => setMode(m.id as any)}
                    >
                      {m.label}
                    </Button>
                  ))}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-4">
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
                            <Bot className="h-4 w-4 text-primary" />
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
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-lg p-3">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {messages.length === 1 && (
                  <div className="p-4 border-t space-y-2">
                    <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedQuestions.map((question) => (
                        <Button
                          key={question}
                          variant="outline"
                          size="sm"
                          className="text-xs"
                          onClick={() => sendMessage(question)}
                        >
                          {question}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="p-4 border-t space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask for career tips, resume review, or project explanations..."
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant={isListening ? 'default' : 'outline'}
                      onClick={() => (isListening ? stopListening() : startListening())}
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    Modes: Career (default), Developer, Designer, Mentor. Agent mode adds next-step
                    plans. Voice input/output available.
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

