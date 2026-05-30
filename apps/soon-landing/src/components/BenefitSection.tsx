import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Percent,
  Cpu,
  Globe2,
  FileCheck,
  CreditCard,
  CheckCircle,
  TrendingUp,
  Coins,
  ArrowRight
} from 'lucide-react';

export default function BenefitSection() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null);

  const features = [
    {
      id: 0,
      icon: <Users className="w-5 h-5 text-noro-teal" />,
      title: 'CRM desenhado para Turismo',
      subtitle: 'Estruturado do lead até a entrega do voucher',
      badge: '100% Especializado',
      description: 'Esqueça CRMs genéricos de vendas. O funil da Noro acompanha o ciclo real do viajante: captação, cotação ativa, aprovação, emissão de reservas, faturamento e entrega de vouchers automatizada.',
      glowColor: 'from-noro-teal/10 to-transparent'
    },
    {
      id: 1,
      icon: <Coins className="w-5 h-5 text-noro-purple-light" />,
      title: 'Controle de Câmbio & Margem',
      subtitle: 'Composição de preços automática em moedas bivalentes',
      badge: 'Margem Blindada',
      description: 'Noro recalcula automaticamente as propostas com base na variação cambial em tempo real (USD, EUR, BRL). Garanta a margem de lucro exata da sua agência sem surpresas no encerramento do balanço.',
      glowColor: 'from-noro-purple-light/10 to-transparent'
    },
    {
      id: 2,
      icon: <Cpu className="w-5 h-5 text-noro-teal" />,
      title: 'Gerador de Roteiros com IA',
      subtitle: 'Propostas impecáveis geradas em minutos',
      badge: 'Produtividade Extrema',
      description: 'Ative a Inteligência Artificial diretamente na plataforma para criar roteiros personalizados de passeios, restaurantes e detalhes locais. Basta digitar o perfil básica do passageiro e deixar a IA escrever tudo.',
      glowColor: 'from-noro-teal/10 to-transparent'
    },
    {
      id: 3,
      icon: <Globe2 className="w-5 h-5 text-noro-purple-light" />,
      title: 'Site de Vendas Grátis',
      subtitle: 'Seu catálogo online de pacotes sem custo adicional',
      badge: 'Zero Custo de Setup',
      description: 'Toda agência cadastrada ganha um site institucional e de vendas integrado. Configure seus produtos, disponibilize orçamentos diretos para os clientes e receba leads vindos direto da sua vitrine virtual.',
      glowColor: 'from-noro-purple-light/10 to-transparent'
    },
    {
      id: 4,
      icon: <FileCheck className="w-5 h-5 text-noro-teal" />,
      title: 'Requisitos de Vistos Integrados',
      subtitle: 'Informações consulares ao alcance do passageiro',
      badge: 'Diferencial Exclusivo',
      description: 'Nossa plataforma cruza os destinos do roteiro do cliente com um banco de dados integrado de requisitos consulares, informando instantaneamente se o passageiro precisa de vistos ou vacinas específicas.',
      glowColor: 'from-noro-teal/10 to-transparent'
    },
    {
      id: 5,
      icon: <CreditCard className="w-5 h-5 text-noro-purple-light" />,
      title: 'Faturamento Integrado (Asaas)',
      subtitle: 'PIX, boletos e cartão parcelado em até 21x',
      badge: 'Cashflow Acelerado',
      description: 'Crie links de pagamento profissionais diretamente pela Noro Guru. Parcele pacotes internacionais no cartão de crédito em até 21x sem quebrar o limite do cliente ou envie cobranças instantâneas via Pix.',
      glowColor: 'from-noro-purple-light/10 to-transparent'
    }
  ];

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('waitlist-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="py-20 bg-noro-dark-elevated/10 relative" id="benefits-section">
      {/* Background decoration lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-noro-teal/20 to-transparent" />
      
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono font-bold tracking-widest text-noro-teal bg-noro-teal/10 border border-noro-teal/20 px-3.5 py-1.5 rounded-full uppercase mb-4 inline-block">
            Módulos & Benefícios
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tighter mb-4 leading-[1.15]">
            Uma única base operacional poderosa para sua agência.
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Deixe o improviso de lado. Descubra como a Noro Guru consolida cada etapa do seu ciclo de turismo em um ambiente premium e integrado.
          </p>
        </div>

        {/* Dynamic Interactive Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => (
            <div
              key={feature.id}
              onClick={() => setActiveFeature(activeFeature === feature.id ? null : feature.id)}
              className={`p-6 border rounded-xl bg-noro-dark-card/45 select-none relative overflow-hidden transition-all duration-300 cursor-pointer ${
                activeFeature === feature.id
                  ? 'border-noro-teal ring-1 ring-noro-teal glow-teal scale-[1.02]'
                  : 'border-noro-purple/10 hover:border-noro-teal/30 hover:bg-noro-dark-card/60'
              }`}
            >
              {/* Radial glow background on selection */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.glowColor} opacity-50 pointer-events-none`} />

              <div className="relative z-10 flex flex-col justify-between h-full">
                <div>
                  {/* Badge & Icon Row */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-10 h-10 rounded-lg bg-noro-dark flex items-center justify-center border border-noro-purple/25">
                      {feature.icon}
                    </div>
                    <span className={`text-[9px] font-mono font-bold uppercase py-0.5 px-2 rounded border ${
                      feature.id % 2 === 0 
                        ? 'text-noro-teal bg-noro-teal/5 border-noro-teal/20' 
                        : 'text-noro-purple-light bg-noro-purple-light/5 border-noro-purple-light/20'
                    }`}>
                      {feature.badge}
                    </span>
                  </div>

                  {/* Text Details */}
                  <h3 className="text-lg font-bold text-white mb-1 tracking-tight">
                    {feature.title}
                  </h3>
                  <h4 className="text-xs text-noro-teal font-medium mb-4">
                    {feature.subtitle}
                  </h4>
                  
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Micro-interaction hint */}
                <div className="mt-6 pt-3 border-t border-noro-purple/5 flex items-center justify-between text-[10px] font-mono tracking-wider uppercase text-gray-500">
                  <span>Clique para {activeFeature === feature.id ? 'recolher' : 'saber mais'}</span>
                  <CheckCircle className={`w-3.5 h-3.5 transition-all ${
                    activeFeature === feature.id ? 'text-noro-teal scale-110' : 'text-gray-700'
                  }`} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Visual Proof / Waitlist Prompt Section */}
        <div className="bg-noro-dark-card/30 border border-noro-purple/20 p-8 rounded-xl max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-8 shadow-xl">
          <div className="flex-1 text-center md:text-left">
            <span className="text-[10px] font-mono tracking-wider uppercase bg-noro-purple-light/10 text-noro-purple-light py-1 px-2.5 rounded border border-noro-purple-light/20 inline-block mb-3">
              PREPARAÇÃO DE MERCADO
            </span>
            <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight mb-2">
              Seja pioneiro no mercado brasileiro de turismo.
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
              O beta fechado dará acesso prioritário vitalício e condições de preços extremamente reduzidas para os primeiros parceiros homologados. Candidate-se agora.
            </p>
          </div>
          
          <button
            onClick={scrollToForm}
            className="group whitespace-nowrap bg-noro-purple-light hover:bg-noro-purple-hover text-white text-xs sm:text-sm font-bold py-4 px-6 rounded-lg flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(107,84,232,0.3)] hover:scale-[1.02]"
            id="benefits-cta"
          >
            Quero garantir meu desconto
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
