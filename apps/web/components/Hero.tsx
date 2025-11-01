import React from 'react';
import NoroLogo from './icons/NoroLogo';

const Hero: React.FC = () => {
  return (
    <section className="relative gradient-noro-hero overflow-hidden">
      <div className="container mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center">
        {/* Animated background particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#1DD3C0]/5 rounded-full filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full filter blur-3xl animate-pulse-slow animation-delay-2000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <NoroLogo className="w-48 h-48 md:w-64 md:h-64 mb-8 animate-float" />

          <h1 className="font-extrabold text-4xl md:text-6xl lg:text-7xl tracking-wide text-white leading-tight">
            Transforme dados em <span className="text-gradient-noro">decisões inteligentes</span>
          </h1>
          
          <p className="mt-6 max-w-2xl text-lg md:text-xl text-[#E0E3FF] font-medium">
            A plataforma completa de gestão que une CRM, ERP, Automação e IA em um só lugar. 
            Simplifique processos, aumente produtividade e escale seu negócio.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
            <button className="btn-noro-primary font-bold py-4 px-10 rounded-2xl text-lg shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform">
              Começar agora grátis
            </button>
            <button className="btn-noro-secondary font-semibold py-4 px-10 rounded-2xl text-lg hover:scale-105 transition-transform">
              Ver demonstração
            </button>
          </div>

          <p className="mt-8 text-sm text-[#B8C1E0] font-medium">
            ✨ Teste grátis por 14 dias · Sem cartão de crédito · Cancele quando quiser
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
