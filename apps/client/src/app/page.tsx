import { Hero } from '@/features/(landing)/components/Hero';
import { Features } from '@/features/(landing)/components/Features';
import { CTASection } from '@/features/(landing)/components/CTASection';
import { LandingNavBar } from '@/widgets/navigation/LandingNavBar';

export default function LandingPage() {
  return (
    <>
      <LandingNavBar />
      <main className="min-h-screen">
        <Hero />
        <Features />
        <CTASection />
      </main>
    </>
  );
}
