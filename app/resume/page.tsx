'use client';

import * as React from 'react';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { ResumePage } from '@/components/sections/resume-page';

export default function Resume() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <ResumePage />
      <Footer />
    </main>
  );
}

