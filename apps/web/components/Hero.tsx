import React from 'react';
import NoroLogo from './icons/NoroLogo';

const Hero: React.FC = () => {
  return (
    <section className="relative container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute -top-1/4 -left-1/4 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-noro-purple/10 to-transparent rounded-full blur-3xl z-0"></div>
      <div className="relative z-10 flex flex-col items-center">
        <NoroLogo className="w-48 h-48 md:w-64 md:h-64 mb-8 animate-float" />

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-noro-accent/70">
          O cérebro por trás do seu negócio.
        </h1>
        <p className="mt-6 max-w-2xl text-lg md:text-xl text-noro-accent/80">
          A NORO é o núcleo inteligente que conecta, processa e automatiza tudo. Um hub de inteligência, automação e dados para negócios modernos.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <button className="bg-gradient-to-r from-noro-turquoise to-noro-purple text-white font-bold py-3 px-8 rounded-lg text-lg hover:scale-105 transition-transform">
            Descubra o Poder
          </button>
           <span className="text-sm text-noro-accent/60">Intelligent Core by .guru</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
