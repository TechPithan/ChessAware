import Hero from '../components/Hero';
import FetchGamesSection from '../components/FetchGamesSection';
import HowItWorksSection from '../components/HowItWorksSection';
import PricingSection from '../components/PricingSection';
import WhyChessAwareSection from '@/components/WhyChessAwareSection';
import Footer from '@/components/Footer';

export default function Page() {
  return (
    <>
      <Hero />
      <FetchGamesSection />
      <HowItWorksSection />
      <WhyChessAwareSection />
      <PricingSection />
      <Footer />

    </>
  );
}
