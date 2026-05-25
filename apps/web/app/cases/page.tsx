import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cases de Sucesso | Noro Guru',
  description: 'Como agências de turismo cresceram com a Noro Guru. Histórias reais, resultados reais.',
};

const CASES = [
  {
    agency: 'Viagens Experienza',
    location: 'São Paulo, SP',
    segment: 'Viagens corporativas',
    size: '8 consultores',
    color: '#342CA4',
    photo: 'VE',
    contact: 'Juliana Fonseca · Diretora',
    quote: 'Em 6 meses, saímos de planilhas para um CRM completo. O faturamento cresceu 40% e hoje atendo o dobro de clientes com o mesmo time.',
    metrics: [
      { label: 'Crescimento de faturamento', value: '+40%', period: 'em 6 meses' },
      { label: 'Clientes atendidos/mês', value: '2×', period: 'mesmo time' },
      { label: 'Tempo por orçamento', value: '-60%', period: 'com IA' },
    ],
    features: ['CRM', 'IA Operacional', 'Financeiro'],
  },
  {
    agency: 'Destinos do Mundo',
    location: 'Rio de Janeiro, RJ',
    segment: 'Turismo de luxo',
    size: '3 consultores',
    color: '#1DD3C0',
    photo: 'DM',
    contact: 'Carlos Mendes · Sócio-fundador',
    quote: 'O site gerado pela IA converteu 3× mais que nosso site antigo. E o inbox unificado resolveu o caos de WhatsApp com planilha que a gente tinha.',
    metrics: [
      { label: 'Taxa de conversão do site', value: '3×', period: 'vs site antigo' },
      { label: 'Tempo de resposta', value: '-70%', period: 'com inbox unificado' },
      { label: 'NPS dos clientes', value: '82', period: 'vs 54 antes' },
    ],
    features: ['Sites com IA', 'Atendimento', 'WhatsApp'],
  },
  {
    agency: 'Terra & Mar Viagens',
    location: 'Curitiba, PR',
    segment: 'Ecoturismo e aventura',
    size: '5 consultores',
    color: '#D4AF37',
    photo: 'TM',
    contact: 'Ana Beatriz Rocha · CEO',
    quote: 'Migrei de um sistema caro e complicado para a Noro Guru em 2 semanas. Os relatórios financeiros que antes tomavam horas agora ficam prontos em segundos.',
    metrics: [
      { label: 'Tempo de migração', value: '2 sem', period: 'setup completo' },
      { label: 'Redução de custo de software', value: '-45%', period: 'vs ferramenta anterior' },
      { label: 'Produtividade da equipe', value: '+35%', period: 'em 3 meses' },
    ],
    features: ['Financeiro', 'CRM', 'Relatórios'],
  },
  {
    agency: 'Sol e Lua Turismo',
    location: 'Fortaleza, CE',
    segment: 'Turismo doméstico',
    size: '12 consultores',
    color: '#7C3AED',
    photo: 'SL',
    contact: 'Marcos Oliveira · Diretor Comercial',
    quote: 'A Noro Guru permitiu que nossa equipe de 12 pessoas trabalhasse como uma equipe de 20. A IA sugere os próximos passos e os consultores focam no que importa: vender.',
    metrics: [
      { label: 'Leads qualificados/mês', value: '+80%', period: 'com IA de prospecção' },
      { label: 'Ticket médio', value: '+22%', period: 'com upsell assistido por IA' },
      { label: 'Churn de clientes', value: '-30%', period: 'com follow-up automático' },
    ],
    features: ['IA Operacional', 'CRM', 'Financeiro'],
  },
];

const NUMBERS = [
  { value: '1.200+', label: 'Agências ativas' },
  { value: 'R$ 480M', label: 'Em vendas processadas' },
  { value: '4,8 ★', label: 'Avaliação média' },
  { value: '94%', label: 'Taxa de renovação anual' },
];

export default function CasesPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>

      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0D1526 0%, #0B1220 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '96px 24px 80px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(52,44,164,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 40 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Voltar
          </Link>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(52,44,164,0.15)',
              border: '1px solid rgba(52,44,164,0.3)',
              borderRadius: 999,
              padding: '6px 16px',
              fontSize: 12,
              fontWeight: 700,
              color: '#342CA4',
              marginBottom: 24,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Resultados reais
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 0 20px',
            }}
          >
            Agências que cresceram<br />com a Noro Guru
          </h1>
          <p style={{ fontSize: 17, color: '#B8C1E0', lineHeight: 1.65, margin: 0, maxWidth: 500, marginLeft: 'auto', marginRight: 'auto' }}>
            Histórias reais de agências que trocaram planilhas e sistemas legados pela Noro Guru — e nunca mais olharam para trás.
          </p>
        </div>
      </div>

      {/* Numbers strip */}
      <div
        style={{
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '32px 24px',
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 0,
          }}
        >
          {NUMBERS.map((n, i) => (
            <div
              key={n.label}
              style={{
                textAlign: 'center',
                padding: '16px 24px',
                borderRight: i < NUMBERS.length - 1 ? '1px solid rgba(255,255,255,0.07)' : 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(24px, 3vw, 36px)',
                  fontWeight: 800,
                  color: '#fff',
                  letterSpacing: '-0.03em',
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                {n.value}
              </div>
              <div style={{ fontSize: 13, color: '#B8C1E0' }}>{n.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Cases */}
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px 96px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {CASES.map((c, idx) => (
            <div
              key={c.agency}
              style={{
                background: '#12152C',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 16,
                overflow: 'hidden',
              }}
            >
              {/* Case header */}
              <div
                style={{
                  background: `linear-gradient(135deg, ${c.color}22 0%, transparent 60%)`,
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  padding: '32px 36px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 24,
                  flexWrap: 'wrap',
                }}
              >
                {/* Avatar */}
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: `${c.color}33`,
                    border: `1px solid ${c.color}66`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 800,
                    fontSize: 16,
                    color: c.color,
                    flexShrink: 0,
                  }}
                >
                  {c.photo}
                </div>
                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 22,
                      fontWeight: 700,
                      color: '#fff',
                      letterSpacing: '-0.02em',
                      margin: '0 0 6px',
                    }}
                  >
                    {c.agency}
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                    <span style={{ fontSize: 13, color: '#B8C1E0' }}>📍 {c.location}</span>
                    <span style={{ fontSize: 13, color: '#B8C1E0' }}>· {c.segment}</span>
                    <span style={{ fontSize: 13, color: '#B8C1E0' }}>· {c.size}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {c.features.map((f) => (
                    <span
                      key={f}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: c.color,
                        background: `${c.color}18`,
                        border: `1px solid ${c.color}33`,
                        borderRadius: 6,
                        padding: '3px 10px',
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* Quote + Metrics */}
              <div style={{ padding: '32px 36px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 40, alignItems: 'start' }}>
                <div>
                  <blockquote
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 17,
                      fontStyle: 'italic',
                      color: '#E0E3FF',
                      lineHeight: 1.65,
                      margin: '0 0 16px',
                      borderLeft: `3px solid ${c.color}`,
                      paddingLeft: 16,
                    }}
                  >
                    &ldquo;{c.quote}&rdquo;
                  </blockquote>
                  <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0, fontWeight: 600 }}>
                    — {c.contact}
                  </p>
                </div>

                {/* Metrics */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    minWidth: 200,
                  }}
                >
                  {c.metrics.map((m) => (
                    <div
                      key={m.label}
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.07)',
                        borderRadius: 10,
                        padding: '12px 16px',
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 22,
                          fontWeight: 800,
                          color: c.color,
                          letterSpacing: '-0.02em',
                          lineHeight: 1,
                          marginBottom: 3,
                        }}
                      >
                        {m.value}
                      </div>
                      <div style={{ fontSize: 11, color: '#B8C1E0', lineHeight: 1.3 }}>
                        {m.label}
                        <span style={{ opacity: 0.6 }}> · {m.period}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: 80,
            background: 'linear-gradient(135deg, rgba(52,44,164,0.2) 0%, rgba(29,211,192,0.08) 100%)',
            border: '1px solid rgba(52,44,164,0.3)',
            borderRadius: 16,
            padding: '56px 40px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
              margin: '0 0 12px',
            }}
          >
            Sua agência pode ser o próximo case
          </h2>
          <p style={{ fontSize: 16, color: '#B8C1E0', margin: '0 0 32px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Agende uma demo gratuita e veja como a Noro Guru pode transformar a sua operação em menos de 30 minutos.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/demo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#342CA4',
                color: '#fff',
                borderRadius: 10,
                padding: '14px 32px',
                fontSize: 16,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Quero uma demo gratuita →
            </Link>
            <Link
              href="/pricing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.07)',
                color: '#E0E3FF',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10,
                padding: '14px 28px',
                fontSize: 16,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Ver planos e preços
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
