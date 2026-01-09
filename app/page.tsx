import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { Hero } from '@/components/sections/hero';
import { About } from '@/components/sections/about';
import { WhyHireMe } from '@/components/sections/why-hire-me';
import { Projects } from '@/components/sections/projects';
import { Skills } from '@/components/sections/skills';
import { Contact } from '@/components/sections/contact';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <WhyHireMe />
      <Projects />
      <Skills />
      <Contact />
      <Footer />
    </main>
  );
}
