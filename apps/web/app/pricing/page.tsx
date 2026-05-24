'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// ─── Plans data ───────────────────────────────────────────────────────────────

const PLANS = [
  {
    name: 'Starter',
    desc: 'Para agências que estão começando a se organizar.',
    priceMonthly: 197,
    priceAnnual: 157,
    popular: false,
    enterprise: false,
    features: [
      'Até 500 leads ativos',
      'CRM e pipeline kanban',
      'Pedidos e propostas',
      'Cobrança PIX e cartão',
      'Inbox WhatsApp + email',
      '2 usuários',
      'Suporte por chat',
    ],
    cta: 'Começar grátis',
    ctaHref: 'https://app.noro.guru',
  },
  {
    name: 'Profissional',
    desc: 'Para agências em crescimento que precisam de mais poder.',
    priceMonthly: 397,
    priceAnnual: 317,
    popular: true,
    enterprise: false,
    features: [
      'Leads ilimitados',
      'Tudo do Starter',
      'Automações de funil',
      'Conteúdo IA (200/mês)',
      'Site próprio com domínio',
      'Inbox + Instagram',
      'Conciliação automática',
      'Até 8 usuários',
      'Suporte prioritário',
    ],
    cta: 'Começar grátis',
    ctaHref: 'https://app.noro.guru',
  },
  {
    name: 'Agência',
    desc: 'Para operações maduras com múltiplas marcas.',
    priceMonthly: 697,
    priceAnnual: 557,
    popular: false,
    enterprise: false,
    features: [
      'Tudo do Profissional',
      'Multi-empresa',
      'Sites ilimitados',
      'Conteúdo IA ilimitado',
      'API pública',
      'Inbox + FB + Instagram',
      'Usuários ilimitados',
      'Gerente de conta dedicado',
    ],
    cta: 'Começar grátis',
    ctaHref: 'https://app.noro.guru',
  },
  {
    name: 'Enterprise',
    desc: 'Para grandes redes e franquias com necessidades específicas.',
    priceMonthly: null,
    priceAnnual: null,
    popular: false,
    enterprise: true,
    features: [
      'Tudo do Agência',
      'SLA personalizado',
      'Onboarding dedicado',
      'Integrações customizadas',
      'Treinamento da equipe',
      'Contrato personalizado',
    ],
    cta: 'Falar com especialista',
    ctaHref: '/demo',
  },
];

const FAQS = [
  { q: 'Posso trocar de plano a qualquer momento?', a: 'Sim! Upgrade ou downgrade a qualquer momento. O valor é ajustado proporcionalmente no próximo ciclo.' },
  { q: 'O que acontece após os 14 dias de teste?', a: 'Você escolhe o plano ou volta ao gratuito. Sem cobrança automática sem aviso prévio.' },
  { q: 'Quais formas de pagamento são aceitas?', a: 'PIX, cartão de crédito (Visa, Master, Amex). Pagamento anual com 20% de desconto.' },
  { q: 'Como funciona a migração de dados?', a: 'Nossa equipe migra em até 48h a partir de planilhas ou outros CRMs. Incluído em todos os planos pagos.' },
  { q: 'Preciso de conhecimento técnico para usar o módulo de Site?', a: 'Não. É um editor visual sem código. Você escolhe o template, personaliza e publica em minutos.' },
  { q: 'Como funciona o suporte?', a: 'Todos os planos têm suporte em português. Pro tem resposta prioritária. Agência+ tem gerente de conta dedicado.' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>
      {/* Hero */}
      <section
        style={{
          textAlign: 'center',
          padding: '80px 24px 56px',
          maxWidth: 800,
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: '0 0 20px',
          }}
        >
          Planos Noro Guru
        </h1>
        <p style={{ fontSize: 18, color: '#B8C1E0', margin: '0 0 36px' }}>
          Preços simples, sem pegadinhas. Trial de 14 dias sem cartão de crédito.
        </p>

        {/* Billing toggle */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 999,
            padding: '6px 8px',
          }}
        >
          <button
            onClick={() => setAnnual(false)}
            style={{
              padding: '8px 20px',
              borderRadius: 999,
              border: 0,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              background: !annual ? '#fff' : 'transparent',
              color: !annual ? '#0B1220' : '#B8C1E0',
              transition: 'all .2s',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Mensal
          </button>
          <button
            onClick={() => setAnnual(true)}
            style={{
              padding: '8px 20px',
              borderRadius: 999,
              border: 0,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              background: annual ? '#fff' : 'transparent',
              color: annual ? '#0B1220' : '#B8C1E0',
              transition: 'all .2s',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: 'var(--font-sans)',
            }}
          >
            Anual
            <span
              style={{
                background: annual ? '#342CA4' : 'rgba(52,44,164,0.6)',
                color: '#fff',
                fontSize: 10,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 999,
              }}
            >
              -20%
            </span>
          </button>
        </div>
      </section>

      {/* Plan cards */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 80px 80px',
        }}
        className="px-6 md:px-20"
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 16,
          }}
          className="grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
        >
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              style={{
                background: plan.popular ? 'rgba(52,44,164,0.12)' : '#12152C',
                border: plan.popular ? '2px solid #342CA4' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                position: 'relative',
              }}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div
                  style={{
                    position: 'absolute',
                    top: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#342CA4',
                    color: '#fff',
                    fontSize: 11,
                    fontWeight: 700,
                    padding: '4px 14px',
                    borderRadius: 999,
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  ✦ Mais popular
                </div>
              )}

              {/* Plan name */}
              <div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: '#fff',
                    fontFamily: 'var(--font-display)',
                    marginBottom: 6,
                  }}
                >
                  {plan.name}
                </div>
                <p style={{ fontSize: 13, color: '#B8C1E0', lineHeight: 1.5, margin: 0 }}>
                  {plan.desc}
                </p>
              </div>

              {/* Price */}
              <div>
                {plan.enterprise ? (
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 28,
                      fontWeight: 700,
                      color: '#fff',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    Sob consulta
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 36,
                        fontWeight: 700,
                        color: '#fff',
                        letterSpacing: '-0.03em',
                      }}
                    >
                      R$ {annual ? plan.priceAnnual : plan.priceMonthly}
                    </div>
                    <div style={{ fontSize: 13, color: '#B8C1E0' }}>/mês</div>
                  </div>
                )}
                {annual && !plan.enterprise && (
                  <div style={{ fontSize: 11, color: '#1DD3C0', marginTop: 4, fontWeight: 600 }}>
                    Cobrado anualmente
                  </div>
                )}
              </div>

              {/* CTA */}
              <Link
                href={plan.ctaHref}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '12px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: 'none',
                  background: plan.popular ? '#342CA4' : 'transparent',
                  color: plan.popular ? '#fff' : '#E0E3FF',
                  border: plan.popular ? 'none' : '1px solid rgba(255,255,255,0.2)',
                  transition: 'background .15s',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = plan.popular
                    ? '#3B2CA4'
                    : 'rgba(255,255,255,0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = plan.popular
                    ? '#342CA4'
                    : 'transparent';
                }}
              >
                {plan.cta}
              </Link>

              {/* Features */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 13, color: '#D1D5F0' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#1DD3C0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: 2 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section
        style={{
          maxWidth: 760,
          margin: '0 auto',
          padding: '0 24px 80px',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.02em',
            textAlign: 'center',
            margin: '0 0 40px',
          }}
        >
          Perguntas frequentes
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                borderTop: '1px solid rgba(255,255,255,0.08)',
                padding: '0',
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 16,
                  padding: '20px 0',
                  background: 'transparent',
                  border: 0,
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'var(--font-sans)',
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: '#E0E3FF' }}>{faq.q}</span>
                <span style={{ fontSize: 20, color: '#B8C1E0', flexShrink: 0, transition: 'transform .2s', transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ paddingBottom: 20 }}>
                  <p style={{ fontSize: 14, lineHeight: 1.65, color: '#B8C1E0', margin: 0 }}>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
      </section>

      {/* CTA final */}
      <section
        style={{
          background: '#12152C',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '64px 24px',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            fontWeight: 700,
            color: '#fff',
            margin: '0 0 12px',
          }}
        >
          Ainda em dúvida? Fale com um especialista.
        </h2>
        <p style={{ fontSize: 15, color: '#B8C1E0', margin: '0 0 28px' }}>
          Nossa equipe fala português e está pronta para ajudar.
        </p>
        <Link
          href="/demo"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#342CA4',
            color: '#fff',
            borderRadius: 10,
            padding: '12px 28px',
            fontSize: 15,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Agendar demonstração →
        </Link>
      </section>
    </div>
  );
}
