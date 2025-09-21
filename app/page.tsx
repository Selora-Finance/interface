import FAQ from '@/ui/homepage/FAQ';
import Hero from '@/ui/homepage/Hero';
import HowItWorks from '@/ui/homepage/HowItWorks';
import Stats from '@/ui/homepage/Stats';

export default function Home() {
  return (
    <div className="flex flex-col justify-start items-center px-4 gap-10 py-16">
      
      <Hero />
      <Stats />
      <HowItWorks />
      <FAQ />
    </div>
  );
}
