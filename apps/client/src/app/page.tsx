import { Hero } from '@/features/(landing)/components/Hero';
import { Features } from '@/features/(landing)/components/Features';
import { CTASection } from '@/features/(landing)/components/CTASection';
import { GlobalNavigationBar } from '@/widgets/navigation/GlobalNavigationBar';
import { Footer } from '@/shared/components/Footer';

export default function LandingPage() {
  return (
    <>
      <GlobalNavigationBar />
      <main className="min-h-screen">
        <Hero />
        <Features />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
