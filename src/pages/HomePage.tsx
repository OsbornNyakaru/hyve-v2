import { Hero } from '../components/sections/hero';
import { Features } from '../components/sections/features';
import { HowItWorks } from '../components/sections/how-it-works';
import { Impact } from '../components/sections/impact';
import { CTA } from '../components/sections/cta';
import { Navbar } from '../components/layout/navbar';
import { Footer } from '../components/layout/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Impact />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}