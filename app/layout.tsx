import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Arman Tiwari | AI & Full-Stack Developer',
  description: 'B.Tech CSE (Data Science) student specializing in AI-driven applications, Java Spring Boot, and full-stack development. Placement-ready portfolio showcasing real projects.',
  keywords: [
    'Arman Tiwari',
    'AI Engineer',
    'Full-Stack Developer',
    'Flask, Java Spring Boot',
    'Data Science',
    'Portfolio',
    'Placement Ready',
  ],
  authors: [{ name: 'Arman Tiwari' }],
  openGraph: {
    title: 'Arman Tiwari | AI & Full-Stack Developer',
    description: 'B.Tech CSE (Data Science) student specializing in AI-driven applications and full-stack development.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arman Tiwari | AI & Full-Stack Developer',
    description: 'B.Tech CSE (Data Science) student specializing in AI-driven applications and full-stack development.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
