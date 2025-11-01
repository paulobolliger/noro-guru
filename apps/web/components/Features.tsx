import React from 'react';
import { BrainIcon } from './icons/BrainIcon';
import { CircuitIcon } from './icons/CircuitIcon';
import { ConnectIcon } from './icons/ConnectIcon';
import { SparklesIcon } from './icons/SparklesIcon';

const features = [
  {
    icon: <ConnectIcon className="w-12 h-12" />,
    title: 'Tudo integrado em um só lugar',
    description: 'Centralize CRM, vendas, financeiro e operações em uma plataforma única. Elimine planilhas e sistemas dispersos.',
  },
  {
    icon: <CircuitIcon className="w-12 h-12" />,
    title: 'Automação que economiza tempo',
    description: 'Reduza em 80% as tarefas repetitivas. Workflows inteligentes que se adaptam ao seu processo de trabalho.',
  },
  {
    icon: <BrainIcon className="w-12 h-12" />,
    title: 'Decisões baseadas em dados reais',
    description: 'Dashboards com métricas em tempo real, previsões de vendas e alertas automáticos para oportunidades.',
  },
  {
    icon: <SparklesIcon className="w-12 h-12" />,
    title: 'IA que realmente ajuda seu negócio',
    description: 'Sugestões inteligentes, análise preditiva e assistente virtual que entende suas necessidades.',
  },
];

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
  <div className="card-noro bg-[#0B1220]/80 backdrop-blur-sm p-8 group">
    <div className="mb-6 text-[#1DD3C0] group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-[#D1D5F0] leading-relaxed font-medium">{description}</p>
  </div>
);

const Features: React.FC = () => {
  return (
    <section id="features" className="container mx-auto px-6 py-20 md:py-28">
      <div className="text-center mb-16">
        <h2 className="font-extrabold text-4xl md:text-5xl text-white tracking-wide">
          Gestão empresarial simplificada com tecnologia de ponta
        </h2>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-[#E0E3FF] font-medium">
          Pare de perder tempo com sistemas complicados. NORO é a solução completa que 
          cresce junto com seu negócio — simples de usar, poderosa nos resultados.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default Features;
