'use client';

import { useState } from 'react';
import { CheckIcon } from './icons/CheckIcon';

type BillingPeriod = 'monthly' | 'annual';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number;
  stripeMonthlyPriceId?: string;
  stripeAnnualPriceId?: string;
  features: string[];
  highlighted?: boolean;
  cta: string;
}

const plans: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Ideal para pequenos projetos e startups',
    monthlyPrice: 99,
    annualPrice: 950,
    features: [
      'Até 1.000 requisições/mês',
      '3 integrações ativas',
      'Suporte por email',
      'Dashboard básico',
      '1 usuário',
      'Armazenamento 5GB',
    ],
    cta: 'Começar Teste Grátis',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Para empresas em crescimento',
    monthlyPrice: 299,
    annualPrice: 2870,
    features: [
      'Até 10.000 requisições/mês',
      'Integrações ilimitadas',
      'Suporte prioritário 24/7',
      'Dashboard avançado + Analytics',
      'Até 10 usuários',
      'Armazenamento 50GB',
      'API avançada',
      'Webhooks customizados',
      'Relatórios exportáveis',
    ],
    highlighted: true,
    cta: 'Começar Agora',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'Solução completa para grandes empresas',
    monthlyPrice: 0, // Customizado
    annualPrice: 0,
    features: [
      'Requisições ilimitadas',
      'Integrações ilimitadas',
      'Gerente de conta dedicado',
      'SLA garantido 99.9%',
      'Usuários ilimitados',
      'Armazenamento personalizado',
      'API completa + SDK',
      'White-label disponível',
      'Treinamento personalizado',
      'Consultoria estratégica',
      'Deploy on-premise',
    ],
    cta: 'Falar com Vendas',
  },
];

export default function PricingCards() {
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly');
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (planId: string) => {
    setLoading(planId);
    
    try {
      if (planId === 'enterprise') {
        window.location.href = '/contact';
        return;
      }

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, billingPeriod }),
      });

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else if (data.message) {
        alert(data.message);
      }
    } catch (error) {
      console.error('Erro no checkout:', error);
      alert('Erro ao processar checkout. Tente novamente.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div>
      {/* Toggle de período de cobrança */}
      <div className="flex justify-center mb-12">
        <div className="bg-[#2E2E3A] p-1 rounded-2xl inline-flex">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
              billingPeriod === 'monthly'
                ? 'bg-[#1DD3C0] text-[#0B1220] scale-105'
                : 'text-[#B8C1E0] hover:text-white hover:scale-105'
            }`}
            aria-pressed={billingPeriod === 'monthly'}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
              billingPeriod === 'annual'
                ? 'bg-[#1DD3C0] text-[#0B1220] scale-105'
                : 'text-[#B8C1E0] hover:text-white hover:scale-105'
            }`}
            aria-pressed={billingPeriod === 'annual'}
          >
            Anual
            <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#0B1220] text-xs px-2 py-1 rounded-full font-bold animate-pulse">
              -20%
            </span>
          </button>
        </div>
      </div>

      {/* Grid de planos */}
      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl p-8 transition-all duration-300 ${
              plan.highlighted
                ? 'card-noro bg-[#0B1220] border-2 border-[#1DD3C0] relative scale-105 shadow-[0_0_30px_rgba(29,211,192,0.3)]'
                : 'bg-[#2E2E3A]/50 border border-[#2E2E3A] hover:border-[#1DD3C0]/50 hover:scale-102'
            }`}
            role="article"
            aria-label={`Plano ${plan.name}`}
          >
            {plan.highlighted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#1DD3C0] to-[#D4AF37] text-[#0B1220] px-4 py-1 rounded-full text-sm font-bold shadow-lg animate-bounce-subtle">
                🏆 Mais Popular
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-[#A9ADC4]">{plan.description}</p>
            </div>

            <div className="mb-6">
              {plan.monthlyPrice > 0 ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-bold text-white">
                      R$ {billingPeriod === 'monthly' ? plan.monthlyPrice : Math.round(plan.annualPrice / 12)}
                    </span>
                    <span className="text-[#A9ADC4]">/mês</span>
                  </div>
                  {billingPeriod === 'annual' && (
                    <p className="text-sm text-[#1DD3C0] mt-2">
                      R$ {plan.annualPrice} cobrado anualmente
                    </p>
                  )}
                </>
              ) : (
                <div className="text-3xl font-bold text-white">Sob consulta</div>
              )}
            </div>

            <button
              onClick={() => handleCheckout(plan.id)}
              disabled={loading === plan.id}
              className={`w-full py-4 rounded-2xl font-bold text-lg mb-6 transition-all duration-300 ${
                plan.highlighted
                  ? 'btn-noro-primary hover:scale-105'
                  : 'btn-noro-secondary hover:scale-105'
              } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 relative group`}
              aria-label={`${plan.cta} - ${plan.name}`}
            >
              {loading === plan.id ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Processando...
                </span>
              ) : (
                <>
                  {plan.cta}
                  {plan.id === 'professional' && (
                    <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#0B1220] text-xs px-2 py-1 rounded-full font-bold animate-bounce-subtle">
                      Popular
                    </span>
                  )}
                </>
              )}
            </button>

            <div className="space-y-4">
              <p className="text-sm font-semibold text-white uppercase tracking-wide">
                Recursos inclusos:
              </p>
              {plan.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckIcon className="w-5 h-5 text-[#1DD3C0] flex-shrink-0 mt-0.5" />
                  <span className="text-[#A9ADC4]">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}