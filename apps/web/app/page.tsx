import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Values from '@/components/Values';
import Ecosystem from '@/components/Ecosystem';
import Testimonials from '@/components/Testimonials';
import Newsletter from '@/components/Newsletter';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Values />
      <Testimonials />
      <Ecosystem />
      <section className="py-16 px-6 md:px-12">
        <div className="container mx-auto max-w-6xl">
          <Newsletter variant="dark" />
        </div>
      </section>
    </>
  );
}
