import React from 'react';
import NoroLogo from './icons/NoroLogo';
import Link from 'next/link';

const brands = [
  { name: 'Inteligência de Dados para Vistos', href: '/ecosystem/vistos-guru', position: 'top-0 left-1/2 -translate-x-1/2 -translate-y-[120%]' },
  { name: 'Sites Inteligentes', href: '/ecosystem/intelligent-websites', position: 'top-1/2 right-0 translate-x-[75%] -translate-y-1/2' },
  { name: 'CRM/ERP Inteligente', href: '/ecosystem/intelligent-crm-erp', position: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-[120%]' },
  { name: 'ITTD', href: '/ecosystem/ittd', position: 'top-1/2 left-0 -translate-x-[75%] -translate-y-1/2' },
];

const EcosystemBrand: React.FC<{ name: string; href: string; position: string; }> = ({ name, href, position }) => (
    <div className={`absolute w-40 text-center transition-transform hover:scale-105 ${position} hidden md:block`}>
        <Link href={href} className="block p-4 bg-noro-dark-2/80 backdrop-blur-md rounded-lg border border-noro-dark-2 hover:border-noro-turquoise/50">
            <h3 className="font-bold text-noro-accent text-sm">{name}</h3>
        </Link>
    </div>
);

const Ecosystem: React.FC = () => {
  return (
    <section id="ecosystem" className="container mx-auto px-6 py-20 md:py-32 overflow-hidden">
      <div className="text-center mb-16 md:mb-24">
        <h2 className="font-display text-4xl md:text-5xl font-bold">O Núcleo Inteligente do Ecossistema</h2>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-noro-accent/80">
          NORO é o coração digital que conecta e potencializa todas as marcas do universo .guru, garantindo coesão, inteligência e crescimento escalável.
        </p>
      </div>
      
      <div className="relative flex justify-center items-center h-96">
        {/* Connection Lines */}
        <div className="absolute w-full h-full flex justify-center items-center">
            <div className="w-[400px] h-[400px] border-2 border-dashed border-noro-blue/20 rounded-full animate-spin-slow"></div>
            <div className="absolute w-[600px] h-[600px] border border-dashed border-noro-purple/20 rounded-full animate-spin-slow [animation-direction:reverse]"></div>
        </div>

        {/* Central Core */}
        <div className="relative z-10">
          <NoroLogo className="w-40 h-40 animate-pulse-slow" />
        </div>

        {/* Satellite Brands */}
        {brands.map(brand => (
           <EcosystemBrand key={brand.name} {...brand} />
        ))}

        {/* Mobile View for Brands */}
        <div className="md:hidden flex flex-col gap-4 mt-16 w-full max-w-sm mx-auto">
            {brands.map(brand => (
                <Link href={brand.href} key={brand.name} className="w-full text-center block">
                    <div className="p-4 bg-noro-dark-2/80 backdrop-blur-md rounded-lg border border-noro-dark-2 active:border-noro-turquoise/50">
                        <h3 className="font-bold text-noro-accent">{brand.name}</h3>
                    </div>
                </Link>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Ecosystem;