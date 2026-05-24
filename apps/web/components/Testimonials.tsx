'use client';

import React from 'react';

const STATS = [
  { value: '1.200+', label: 'agências' },
  { value: 'R$ 480M', label: 'gerenciados' },
  { value: '4.8★', label: 'satisfação' },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Renata Aguiar',
    role: 'Sócia-fundadora',
    company: 'Wanderlust Turismo',
    initials: 'RA',
    color: '#342CA4',
    quote: 'Antes da Noro eu usava planilha, WhatsApp e um sistema de emissão separado. Hoje tudo fica em um lugar. Meu time de 4 pessoas opera como um time de 10.',
  },
  {
    id: 2,
    name: 'Carlos Mendes',
    role: 'Diretor Comercial',
    company: 'Horizonte Viagens',
    initials: 'CM',
    color: '#1DD3C0',
    quote: 'O CRM com funil de vendas mudou como a gente acompanha leads. Taxa de conversão subiu 38% em dois meses. Vale cada real do plano Pro.',
  },
  {
    id: 3,
    name: 'Juliana Fonseca',
    role: 'CEO',
    company: 'Trilha & Sonho',
    initials: 'JF',
    color: '#D4AF37',
    quote: 'O módulo de site é o que mais me surpreendeu. Lancei meu site em um fim de semana, com domínio próprio e tudo integrado ao CRM. Sem precisar contratar ninguém.',
  },
  {
    id: 4,
    name: 'Diego Rocha',
    role: 'Agente de Viagens',
    company: 'Mundo Afora',
    initials: 'DR',
    color: '#342CA4',
    quote: 'A geração de roteiros por IA economiza umas 3 horas por pedido. O cliente recebe um roteiro bonito e eu foco em fechar mais vendas.',
  },
  {
    id: 5,
    name: 'Priscila Lima',
    role: 'Proprietária',
    company: 'Sol & Mar Turismo',
    initials: 'PL',
    color: '#1DD3C0',
    quote: 'Cobrança via PIX integrada ao pedido foi um divisor de águas. Antes esquecia de marcar quem pagou. Hoje o sistema avisa automaticamente.',
  },
  {
    id: 6,
    name: 'André Bassetto',
    role: 'Co-founder',
    company: 'Atlas Experiências',
    initials: 'AB',
    color: '#D4AF37',
    quote: 'Migrei de um sistema caro e travado. Em 2 dias já estava operando na Noro. Suporte respondeu em menos de 1h durante o onboarding.',
  },
];

export default function Testimonials() {
  return (
    <section
      style={{
        background: '#12152C',
        padding: '96px 0',
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 80px',
        }}
        className="px-6 md:px-20"
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 auto 16px',
            }}
          >
            Agências que cresceram com o Noro.
          </h2>
          <p style={{ fontSize: 16, color: '#B8C1E0', margin: 0 }}>
            Mais de 1.200 agências brasileiras confiam na plataforma.
          </p>
        </div>

        {/* Big numbers */}
        <div
          style={{
            display: 'flex',
            gap: 0,
            justifyContent: 'center',
            marginBottom: 64,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 16,
            overflow: 'hidden',
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                flex: 1,
                padding: '32px 24px',
                textAlign: 'center',
                borderRight: i < STATS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(32px, 4vw, 48px)',
                  fontWeight: 800,
                  color: '#fff',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: 8,
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: 14, color: '#B8C1E0', fontWeight: 500 }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials grid 3x2 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: '24px 24px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                transition: 'border-color .2s, background .2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.14)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.03)';
              }}
            >
              {/* Stars */}
              <div style={{ display: 'flex', gap: 3 }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="#D4AF37">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.65,
                  color: '#D1D5F0',
                  fontStyle: 'italic',
                  margin: 0,
                  flex: 1,
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Person */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  paddingTop: 16,
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: t.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '0.05em',
                    flexShrink: 0,
                  }}
                >
                  {t.initials}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#E0E3FF' }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: '#B8C1E0', marginTop: 2 }}>
                    {t.role} · {t.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
