import React from 'react';
import { BrainIcon } from './icons/BrainIcon';
import { CircuitIcon } from './icons/CircuitIcon';
import { ConnectIcon } from './icons/ConnectIcon';

const features = [
  {
    icon: <BrainIcon className="w-10 h-10" />,
    title: 'Inteligência Aplicada',
    description: 'Transformamos dados em clareza e complexidade em fluidez. Tecnologia com propósito para decisões mais inteligentes.',
  },
  {
    icon: <CircuitIcon className="w-10 h-10" />,
    title: 'Automação Intuitiva',
    description: 'Automatize sistemas, pessoas e dados de forma inteligente e acessível, permitindo foco total na criação de valor.',
  },
  {
    icon: <ConnectIcon className="w-10 h-10" />,
    title: 'Conexão Total',
    description: 'Tudo se integra — sistemas, pessoas, ideias. NORO é o hub que unifica o ecossistema e impulsiona a colaboração.',
  },
];

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; }> = ({ icon, title, description }) => (
  <div className="bg-noro-dark-2/50 border border-noro-dark-2 rounded-xl p-8 backdrop-blur-sm transition-all duration-300 hover:border-noro-turquoise/50 hover:-translate-y-2">
    <div className="mb-4 text-noro-turquoise">
      {icon}
    </div>
    <h3 className="font-display text-2xl font-bold text-noro-accent mb-3">{title}</h3>
    <p className="text-noro-accent/70">{description}</p>
  </div>
);


const Features: React.FC = () => {
  return (
    <section id="features" className="container mx-auto px-6 py-20 md:py-28">
      <div className="text-center mb-12">
        <h2 className="font-display text-4xl md:text-5xl font-bold">Automatize. Analise. Cresça.</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-noro-accent/80">
          NORO não é mais uma ferramenta. É o cérebro que aprende com você e simplifica a complexidade.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default Features;
