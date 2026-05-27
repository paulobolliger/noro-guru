'use client';

import { useState } from 'react';
import Link from 'next/link';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    tagline: 'Para a agência que está começando a se organizar.',
    priceMonthly: 197,
    priceAnnual: 167,
    cta: 'Começar grátis',
    ctaHref: '/register?plan=starter',
    features: [
      'Até 2 usuários',
      'CRM com até 500 leads ativos',
      'Pedidos & cobrança Pix/cartão',
      'Inbox WhatsApp + email',
      'Suporte por chat',
    ],
    notFeatures: ['Módulo Meu Site', 'Conteúdo IA', 'API pública'],
    recommended: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    tagline: 'O queridinho. 80% das agências começam por aqui.',
    priceMonthly: 497,
    priceAnnual: 397,
    cta: 'Testar Pro grátis',
    ctaHref: '/register?plan=pro',
    features: [
      'Até 8 usuários',
      'CRM ilimitado + automações',
      'Módulo Meu Site (domínio próprio)',
      'Conteúdo IA — 200 gerações/mês',
      'Inbox WhatsApp · email · Instagram',
      'Financeiro com conciliação automática',
      'Relatórios avançados',
      'Suporte prioritário em PT-BR',
    ],
    notFeatures: ['API pública', 'Multi-empresa'],
    recommended: true,
  },
  {
    id: 'agency',
    name: 'Agency+',
    tagline: 'Operação com múltiplas marcas, equipe e volume.',
    priceMonthly: 1297,
    priceAnnual: 1097,
    cta: 'Falar com vendas',
    ctaHref: '/demo',
    features: [
      'Usuários ilimitados',
      'Tudo do Pro, sem limites',
      'Multi-empresa / multi-marca',
      'Conteúdo IA ilimitado',
      'API pública + webhooks',
      'Dados de Vistos (5.000 consultas/mês)',
      'Gerente de conta dedicado',
      'SLA 99,9% & onboarding white-glove',
    ],
    notFeatures: [],
    recommended: false,
  },
];

export default function NoroPricingCards() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('annual');

  return (
    <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 56px 64px' }}>
      {/* Billing toggle */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 40 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            display: 'inline-flex', padding: 4,
            background: '#fff', border: '1px solid #eceef3',
            borderRadius: 999,
          }}>
            {[
              { v: 'monthly' as const, l: 'Mensal' },
              { v: 'annual' as const, l: 'Anual' },
            ].map((opt) => {
              const on = billing === opt.v;
              return (
                <button
                  key={opt.v}
                  onClick={() => setBilling(opt.v)}
                  style={{
                    appearance: 'none', border: 0,
                    padding: '8px 20px',
                    background: on ? '#232452' : 'transparent',
                    color: on ? '#fff' : 'rgba(31,36,51,0.6)',
                    fontSize: 13.5, fontWeight: 600,
                    borderRadius: 999, cursor: 'pointer',
                    letterSpacing: '-0.005em',
                    transition: 'all .15s',
                  }}
                >
                  {opt.l}
                </button>
              );
            })}
          </div>
          <span style={{
            fontFamily: 'monospace', fontSize: 11.5,
            background: 'rgba(25,184,168,0.12)', color: '#0e6963',
            padding: '5px 10px', borderRadius: 999, fontWeight: 700,
            letterSpacing: '.05em',
          }}>
            Economize 20% no anual
          </span>
        </div>
      </div>

      {/* Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 22, alignItems: 'stretch',
      }}>
        {PLANS.map((plan) => {
          const price = billing === 'annual' ? plan.priceAnnual : plan.priceMonthly;
          const featured = plan.recommended;
          return (
            <div
              key={plan.id}
              style={{
                background: featured ? '#232452' : '#fff',
                color: featured ? '#fff' : '#1f2433',
                borderRadius: 22,
                border: featured ? 'none' : '1px solid #eceef3',
                padding: '40px 36px',
                display: 'flex', flexDirection: 'column', gap: 24,
                position: 'relative',
                transform: featured ? 'translateY(-12px)' : 'none',
                boxShadow: featured ? '0 40px 80px -30px rgba(15,16,32,0.45)' : '0 2px 8px rgba(15,20,40,.04)',
              }}
            >
              {featured && (
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  background: '#19b8a8', color: '#232452',
                  fontFamily: 'monospace', fontSize: 10.5, fontWeight: 700,
                  padding: '5px 12px', borderRadius: 999, letterSpacing: '.08em',
                  whiteSpace: 'nowrap',
                }}>
                  ★ MAIS ESCOLHIDO
                </div>
              )}

              {/* Name + tagline */}
              <div>
                <div style={{
                  fontFamily: 'var(--font-display, Georgia)', fontWeight: 500,
                  fontSize: 28, letterSpacing: '-0.02em',
                }}>
                  {plan.name}
                </div>
                <p style={{
                  fontSize: 13.5,
                  color: featured ? 'rgba(255,255,255,0.7)' : 'rgba(31,36,51,0.55)',
                  margin: '8px 0 0', lineHeight: 1.45, minHeight: 38,
                }}>
                  {plan.tagline}
                </p>
              </div>

              {/* Price */}
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{
                    fontFamily: 'var(--font-display, Georgia)', fontWeight: 500,
                    fontSize: 50, letterSpacing: '-0.025em', lineHeight: 1,
                    color: featured ? '#fff' : '#232452',
                  }}>
                    R$ {price}
                  </span>
                  <span style={{ fontSize: 14, color: featured ? 'rgba(255,255,255,0.6)' : 'rgba(31,36,51,0.45)', fontWeight: 500 }}>
                    / mês
                  </span>
                </div>
                <div style={{
                  fontSize: 11, color: featured ? 'rgba(255,255,255,0.5)' : 'rgba(31,36,51,0.4)',
                  marginTop: 6, fontFamily: 'monospace', letterSpacing: '.04em',
                }}>
                  {billing === 'annual' ? 'FATURADO ANUALMENTE' : 'FATURADO MENSALMENTE'}
                </div>
              </div>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                style={{
                  display: 'block', textAlign: 'center',
                  padding: '13px 24px', borderRadius: 10,
                  background: featured ? '#19b8a8' : '#232452',
                  color: featured ? '#232452' : '#fff',
                  fontSize: 14, fontWeight: 700, textDecoration: 'none',
                }}
              >
                {plan.cta}
              </Link>

              {/* Features list */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13 }}>
                    <span style={{ color: featured ? '#19b8a8' : '#19b8a8', fontSize: 14, flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ color: featured ? 'rgba(255,255,255,0.85)' : '#1f2433' }}>{f}</span>
                  </li>
                ))}
                {plan.notFeatures.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13 }}>
                    <span style={{ color: featured ? 'rgba(255,255,255,0.25)' : 'rgba(31,36,51,0.25)', fontSize: 14, flexShrink: 0, marginTop: 1 }}>—</span>
                    <span style={{ color: featured ? 'rgba(255,255,255,0.35)' : 'rgba(31,36,51,0.35)', textDecoration: 'line-through' }}>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      {/* Trial note */}
      <p style={{ textAlign: 'center', fontSize: 12.5, color: 'rgba(31,36,51,0.45)', marginTop: 28 }}>
        14 dias grátis em qualquer plano · sem cartão de crédito · cancele quando quiser
      </p>
    </section>
  );
}
