'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { AIAssistantHub } from '@/components/ai/ai-assistant-hub';

function AIAssistantContent() {
  return <AIAssistantHub />;
}

export default function AIAssistantPage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Suspense fallback={<div className="min-h-screen pt-16 flex items-center justify-center">Loading...</div>}>
        <AIAssistantContent />
      </Suspense>
      <Footer />
    </main>
  );
}

