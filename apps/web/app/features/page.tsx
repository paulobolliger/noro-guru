import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Funcionalidades | Noro Guru',
  description: 'Tudo que sua agência de turismo precisa em um só lugar: CRM, financeiro, atendimento omnichannel, sites com IA e IA operacional.',
};

const PILLARS = [
  {
    id: 'crm',
    icon: '🎯',
    color: '#342CA4',
    name: 'CRM & Pipeline',
    title: 'Do lead ao cliente fidelizado',
    desc: 'Gerencie todo o ciclo de vendas em um funil visual. Nunca perca um lead, automatize follow-ups e acompanhe cada oportunidade em tempo real.',
    features: [
      'Pipeline Kanban personalizável por etapas',
      'Hub 360° do cliente com histórico completo',
      'Orçamentos e propostas gerados com IA',
      'Follow-up automático por WhatsApp e email',
      'Captação de leads pelo site integrada',
      'Relatórios de conversão e funil',
    ],
    href: '/features/crm',
  },
  {
    id: 'financeiro',
    icon: '💰',
    color: '#1DD3C0',
    name: 'Financeiro & Billing',
    title: 'Controle total sem planilhas',
    desc: 'Fluxo de caixa, comissões e faturamento integrados ao CRM. Saiba exatamente quanto sua agência vai receber — sem surpresas no fim do mês.',
    features: [
      'Contas a pagar e a receber integradas',
      'Cálculo automático de comissões',
      'Fluxo de caixa em tempo real',
      'Conciliação de pagamentos',
      'Relatórios financeiros exportáveis',
      'Integração com Stripe e Asaas',
    ],
    href: '/features/financeiro',
  },
  {
    id: 'atendimento',
    icon: '💬',
    color: '#7C3AED',
    name: 'Atendimento Omnichannel',
    title: 'Todas as mensagens, um lugar só',
    desc: 'Inbox unificado com WhatsApp, email e outros canais. Chatbot com IA, SLA configurável e histórico completo por cliente.',
    features: [
      'Inbox unificado WhatsApp + email + chat',
      'Chatbot de IA para triagem automática',
      'SLA e tempo de resposta monitorados',
      'Transferência entre agentes',
      'Templates de resposta rápida',
      'Histórico completo por cliente',
    ],
    href: '/features/atendimento',
  },
  {
    id: 'sites',
    icon: '🌐',
    color: '#059669',
    name: 'Sites & Marketing',
    title: 'Seu site pronto em minutos',
    desc: 'A IA gera o site profissional da sua agência do zero — com textos de vendas, design responsivo e captação de leads integrada ao CRM.',
    features: [
      'Site gerado por IA em menos de 5 minutos',
      'Domínio personalizado incluído',
      'Blog integrado com SEO automático',
      'Galeria de destinos e pacotes',
      'Formulários conectados ao CRM',
      'Analytics de visitantes e conversão',
    ],
    href: '/features/sites',
  },
  {
    id: 'ia',
    icon: '🤖',
    color: '#D4AF37',
    name: 'IA Operacional',
    title: 'Economize horas. Todo dia.',
    desc: 'Geração de roteiros, propostas e conteúdo para redes sociais com IA. A automação cuida do repetitivo para o consultor focar no que importa.',
    features: [
      'Geração de roteiros de viagem com IA',
      'Propostas e orçamentos automatizados',
      'Conteúdo para Instagram e WhatsApp',
      'Sugestões de follow-up inteligentes',
      'Resumo automático de conversas',
      'Custo de IA transparente por uso',
    ],
    href: '/features/ia',
  },
];

export default function FeaturesPage() {
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
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(52,44,164,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 720, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(52,44,164,0.15)', border: '1px solid rgba(52,44,164,0.3)', borderRadius: 999, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: '#342CA4', marginBottom: 24, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            5 pilares · 1 plataforma
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 20px' }}>
            Tudo que sua agência precisa.<br />Em um só lugar.
          </h1>
          <p style={{ fontSize: 18, color: '#B8C1E0', lineHeight: 1.65, margin: '0 0 40px', maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
            Cinco módulos integrados que cobrem toda a operação — do primeiro contato com o lead até a fidelização do cliente.
          </p>
          {/* Anchor nav */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8 }}>
            {PILLARS.map((p) => (
              <a
                key={p.id}
                href={`#${p.id}`}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: p.color,
                  background: `${p.color}15`,
                  border: `1px solid ${p.color}30`,
                  borderRadius: 999,
                  padding: '6px 16px',
                  textDecoration: 'none',
                }}
              >
                {p.icon} {p.name}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Pillars */}
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px 40px' }}>
        {PILLARS.map((pillar, idx) => (
          <div
            key={pillar.id}
            id={pillar.id}
            style={{
              display: 'grid',
              gridTemplateColumns: idx % 2 === 0 ? '1fr 1fr' : '1fr 1fr',
              gap: 64,
              alignItems: 'center',
              marginBottom: 96,
              direction: idx % 2 === 1 ? 'rtl' : 'ltr',
            }}
          >
            {/* Text */}
            <div style={{ direction: 'ltr' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  marginBottom: 20,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${pillar.color}22`,
                    border: `1px solid ${pillar.color}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}
                >
                  {pillar.icon}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: pillar.color,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {pillar.name}
                </span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(24px, 3vw, 36px)',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  margin: '0 0 14px',
                }}
              >
                {pillar.title}
              </h2>
              <p style={{ fontSize: 16, color: '#B8C1E0', lineHeight: 1.7, margin: '0 0 28px' }}>
                {pillar.desc}
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {pillar.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#D1D5F0' }}>
                    <span style={{ color: pillar.color, marginTop: 2, flexShrink: 0 }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={pillar.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 14,
                  fontWeight: 700,
                  color: pillar.color,
                  textDecoration: 'none',
                }}
              >
                Ver {pillar.name} em detalhe →
              </Link>
            </div>

            {/* Mock card */}
            <div style={{ direction: 'ltr' }}>
              <div
                style={{
                  background: '#12152C',
                  border: `1px solid ${pillar.color}30`,
                  borderRadius: 16,
                  overflow: 'hidden',
                }}
              >
                {/* Card header */}
                <div
                  style={{
                    background: `${pillar.color}18`,
                    borderBottom: `1px solid ${pillar.color}25`,
                    padding: '16px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <div style={{ display: 'flex', gap: 6 }}>
                    {['#ef4444', '#f59e0b', '#22c55e'].map((c) => (
                      <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                    ))}
                  </div>
                  <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 4 }} />
                </div>
                {/* Card body */}
                <div style={{ padding: 24 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: pillar.color,
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      fontFamily: 'var(--font-mono)',
                      marginBottom: 12,
                    }}
                  >
                    {pillar.name}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[0.9, 0.7, 0.8, 0.6, 0.75].map((w, i) => (
                      <div
                        key={i}
                        style={{
                          height: i === 0 ? 14 : 10,
                          width: `${w * 100}%`,
                          background: i === 0 ? `${pillar.color}60` : 'rgba(255,255,255,0.08)',
                          borderRadius: 4,
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      marginTop: 20,
                      padding: '10px 14px',
                      background: `${pillar.color}18`,
                      border: `1px solid ${pillar.color}30`,
                      borderRadius: 8,
                      fontSize: 12,
                      fontWeight: 600,
                      color: pillar.color,
                    }}
                  >
                    ✦ IA ativa · Noro Guru
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA final */}
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '0 24px 96px' }}>
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(52,44,164,0.2) 0%, rgba(29,211,192,0.08) 100%)',
            border: '1px solid rgba(52,44,164,0.3)',
            borderRadius: 16,
            padding: '56px 40px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            Pronto para modernizar sua agência?
          </h2>
          <p style={{ fontSize: 16, color: '#B8C1E0', margin: '0 0 32px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Mais de 1.200 agências já operam com o Noro Guru. Comece gratuitamente.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#342CA4', color: '#fff', borderRadius: 10, padding: '14px 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
              Começar gratuitamente →
            </Link>
            <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: '#E0E3FF', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '14px 24px', fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
              Falar com especialista
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
