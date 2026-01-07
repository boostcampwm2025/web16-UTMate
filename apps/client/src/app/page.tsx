import { Hero } from '@/features/(landing)/components/Hero';
import { Features } from '@/features/(landing)/components/Features';
import { CTASection } from '@/features/(landing)/components/CTASection';

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <CTASection />
    </main>
  );
}
