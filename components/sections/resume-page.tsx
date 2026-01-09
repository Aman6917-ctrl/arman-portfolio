'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Upload,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCheck,
  TrendingUp,
  Target,
  Eye,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { aiApi } from '@/services/api';
import { toast } from 'sonner';

const roles = [
  { value: 'sde', label: 'Software Development Engineer (SDE)' },
  { value: 'ds', label: 'Data Scientist' },
  { value: 'ai-engineer', label: 'AI Engineer' },
  { value: 'backend', label: 'Backend Developer' },
  { value: 'fullstack', label: 'Full-Stack Developer' },
];

export function ResumePage() {
  const [file, setFile] = React.useState<File | null>(null);
  const [resumeText, setResumeText] = React.useState('');
  const [selectedRole, setSelectedRole] = React.useState('sde');
  const [isDragging, setIsDragging] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [score, setScore] = React.useState<number | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

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
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.name.endsWith('.docx'))) {
      setFile(droppedFile);
    } else {
      toast.error('Please upload a PDF or DOCX file');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleReview = async () => {
    if (!file && !resumeText.trim()) {
      toast.error('Please upload a resume file or paste resume text');
      return;
    }

    setIsProcessing(true);
    setFeedback(null);
    setScore(null);

    try {
      const result = await aiApi.resumeReview({
        file: file || undefined,
        text: resumeText || undefined,
        role: selectedRole,
        userName: 'Candidate',
      });

      // Extract score if present in feedback (look for patterns like "Score: 85/100")
      const scoreMatch = result.feedback.match(/(\d+)\s*\/\s*100/i) || result.feedback.match(/score[:\s]+(\d+)/i);
      if (scoreMatch) {
        setScore(parseInt(scoreMatch[1], 10));
      }

      setFeedback(result.feedback);
      toast.success('Resume review completed');
    } catch (error) {
      console.error('Resume review error:', error);
      toast.error('Failed to review resume. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <section className="min-h-screen pt-16 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">Resume</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional background, education, and experience. Use the AI Resume Reviewer below for
            ATS-optimized feedback.
          </p>
        </motion.div>

        {/* Resume PDF Viewer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-5xl mx-auto mb-12"
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <CardTitle>Arman Tiwari - Resume</CardTitle>
                  <CardDescription>B.Tech CSE (Data Science) | RCOEM | CGPA: 8.79</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button asChild variant="outline">
                    <a href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                      <Eye className="mr-2 h-4 w-4" />
                      View PDF
                    </a>
                  </Button>
                  <Button asChild variant="default">
                    <a href="/resume.pdf" download="Arman_Tiwari_Resume.pdf">
                      <Download className="mr-2 h-4 w-4" />
                      Download PDF
                    </a>
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[800px] border rounded-lg overflow-hidden bg-muted/20">
                <iframe
                  src="/resume.pdf"
                  className="w-full h-full"
                  title="Resume PDF Viewer"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Resume Reviewer Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <FileCheck className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>AI Resume Reviewer (Optional Tool)</CardTitle>
                  <CardDescription>
                    Get ATS-style feedback, skill gap detection, and role-based scoring
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="text-sm font-medium mb-2 block">Target Role</label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.value} value={role.value}>
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* File Upload Area */}
              <div>
                <label className="text-sm font-medium mb-2 block">Upload Resume (PDF/DOCX)</label>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragging
                      ? 'border-primary bg-primary/5'
                      : 'border-muted-foreground/25 hover:border-primary/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  {file ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="font-medium">{file.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <>
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
                      <p className="text-xs text-muted-foreground">PDF or DOCX format</p>
                    </>
                  )}
                </div>
              </div>

              {/* Text Input Alternative */}
              <div>
                <label className="text-sm font-medium mb-2 block">Or Paste Resume Text</label>
                <Textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here..."
                  className="min-h-[150px]"
                  disabled={!!file}
                />
                {file && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Remove the uploaded file to use text input
                  </p>
                )}
              </div>

              {/* Review Button */}
              <Button
                onClick={handleReview}
                disabled={isProcessing || (!file && !resumeText.trim())}
                className="w-full"
                size="lg"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <FileCheck className="mr-2 h-4 w-4" />
                    Review Resume
                  </>
                )}
              </Button>

              {/* Score Display */}
              {score !== null && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" />
                          <span className="font-semibold">ATS Score</span>
                        </div>
                        <Badge variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}>
                          {score}/100
                        </Badge>
                      </div>
                      <Progress value={score} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-2">
                        {score >= 80
                          ? 'Excellent! Your resume is well-optimized for ATS systems.'
                          : score >= 60
                          ? 'Good, but there are areas for improvement.'
                          : 'Needs significant improvements for better ATS compatibility.'}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Feedback Display */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Review Feedback</h3>
                  </div>
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="whitespace-pre-wrap text-sm">{feedback}</div>
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

