import React from 'react';
import NoroLogo from './icons/NoroLogo';
import Link from 'next/link';

const brands = [
  { 
    name: 'Nomade Guru', 
    description: 'Seguros de viagem com cobertura global inteligente',
    href: 'https://nomade.guru',
    color: 'from-blue-500 to-purple-500' 
  },
  { 
    name: 'SafeTrip Guru', 
    description: 'Proteção completa para você viajar tranquilo',
    href: 'https://safetrip.guru',
    color: 'from-green-500 to-emerald-500' 
  },
  { 
    name: 'Vistos Guru', 
    description: 'Processos de visto simplificados com tecnologia',
    href: 'https://vistos.guru',
    color: 'from-orange-500 to-red-500' 
  },
  { 
    name: 'NORO', 
    description: 'Gestão empresarial completa em uma plataforma',
    href: 'https://noro.guru',
    color: 'from-[#342CA4] to-[#1DD3C0]' 
  },
];

const EcosystemCard: React.FC<{ name: string; description: string; href: string; color: string; }> = ({ name, description, href, color }) => (
    <Link href={href} className="card-noro bg-[#0B1220]/80 backdrop-blur-sm p-6 group block">
        <div className={`w-full h-2 mb-4 rounded-full bg-gradient-to-r ${color}`}></div>
        <h3 className="font-bold text-xl text-white mb-2 group-hover:text-[#1DD3C0] transition-colors">{name}</h3>
        <p className="text-[#D1D5F0] text-sm font-medium">{description}</p>
    </Link>
);

const Ecosystem: React.FC = () => {
  return (
    <section id="ecosystem" className="container mx-auto px-6 py-20 md:py-32">
      <div className="text-center mb-16">
        <h2 className="font-extrabold text-4xl md:text-5xl text-white tracking-wide mb-6">
          Faça parte do ecossistema <span className="text-gradient-noro">.guru</span>
        </h2>
        <p className="mt-6 max-w-3xl mx-auto text-lg text-[#E0E3FF] font-medium">
          Mais que produtos individuais, somos um ecossistema integrado de soluções 
          que trabalham juntas para simplificar viagens, gestão e processos globais.
        </p>
      </div>
      
      {/* Logo central com animação */}
      <div className="flex justify-center mb-16">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1DD3C0]/20 to-[#D4AF37]/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <NoroLogo className="relative w-32 h-32 md:w-48 md:h-48 animate-float" />
        </div>
      </div>

      {/* Grid de produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {brands.map(brand => (
           <EcosystemCard key={brand.name} {...brand} />
        ))}
      </div>

      {/* Call to action */}
      <div className="text-center mt-16">
        <Link 
          href="/ecosystem" 
          className="inline-block btn-noro-secondary font-semibold py-4 px-10 rounded-2xl text-lg hover:scale-105 transition-transform"
        >
          Conheça todas as soluções →
        </Link>
      </div>
    </section>
  );
};

export default Ecosystem;