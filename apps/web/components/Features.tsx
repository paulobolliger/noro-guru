'use client';

import React, { useState } from 'react';
import Link from 'next/link';

// ─── Pilares data ─────────────────────────────────────────────────────────────

const PILARES = [
  {
    id: 'crm',
    icon: '🎯',
    label: 'CRM & Pipeline',
    title: 'Gerencie leads do primeiro contato ao fechamento',
    desc: 'Funil visual, automações de follow-up, histórico completo do cliente e propostas personalizadas — tudo integrado.',
    bullets: [
      'Kanban de leads com drag & drop',
      'Automações de WhatsApp e email',
      'Histórico e timeline do cliente',
    ],
    color: '#342CA4',
  },
  {
    id: 'financeiro',
    icon: '💰',
    label: 'Financeiro',
    title: 'Controle financeiro sem planilhas',
    desc: 'Cobranças, recebíveis, comissões e fluxo de caixa em tempo real. Conciliação automática com PIX e cartão.',
    bullets: [
      'Cobrança por PIX, boleto e cartão',
      'Comissões automáticas por consultor',
      'Relatórios e DRE em um clique',
    ],
    color: '#D4AF37',
  },
  {
    id: 'atendimento',
    icon: '💬',
    label: 'Atendimento',
    title: 'Omnichannel integrado na plataforma',
    desc: 'WhatsApp, Instagram, email e chat em uma única caixa de entrada. Com histórico do cliente em cada conversa.',
    bullets: [
      'Caixa unificada (WhatsApp + IG + email)',
      'Chatbot com IA para triagem',
      'SLA e filas por departamento',
    ],
    color: '#1DD3C0',
  },
  {
    id: 'sites',
    icon: '🌐',
    label: 'Sites & Marketing',
    title: 'Site da sua agência sem programação',
    desc: 'Crie, publique e gerencie o site da sua agência em minutos. Domínio próprio, SEO e blog inclusos.',
    bullets: [
      'Builder visual sem código',
      'Blog, landing pages e formulários',
      'SEO automático e domínio próprio',
    ],
    color: '#342CA4',
  },
  {
    id: 'ia',
    icon: '🤖',
    label: 'IA Operacional',
    title: 'IA que trabalha para sua agência',
    desc: 'Gere roteiros, propostas e conteúdo em segundos. Automatize tarefas repetitivas e foque no que importa.',
    bullets: [
      'Roteiros e propostas em segundos',
      'Conteúdo para redes sociais com IA',
      'Automações inteligentes de processo',
    ],
    color: '#1DD3C0',
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Features: React.FC = () => {
  const [active, setActive] = useState(0);
  const pilar = PILARES[active];

  return (
    <section
      style={{
        background: '#0B1220',
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
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#1DD3C0',
              marginBottom: 16,
            }}
          >
            A plataforma completa
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4vw, 48px)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 auto',
              maxWidth: 640,
            }}
          >
            Tudo que sua agência precisa.
          </h2>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            gap: 4,
            justifyContent: 'center',
            marginBottom: 48,
            flexWrap: 'wrap',
          }}
        >
          {PILARES.map((p, i) => (
            <button
              key={p.id}
              onClick={() => setActive(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                borderRadius: 10,
                border: '1px solid',
                borderColor: active === i ? p.color : 'rgba(255,255,255,0.08)',
                background: active === i ? `rgba(${hexToRgb(p.color)},0.12)` : 'transparent',
                color: active === i ? '#fff' : '#B8C1E0',
                fontSize: 14,
                fontWeight: active === i ? 700 : 500,
                cursor: 'pointer',
                transition: 'all .2s',
                fontFamily: 'var(--font-sans)',
              }}
            >
              <span>{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 64,
            alignItems: 'center',
          }}
          key={active}
        >
          {/* Left — text */}
          <div style={{ animation: 'fade-in .3s ease-out forwards' }}>
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: `rgba(${hexToRgb(pilar.color)},0.15)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                marginBottom: 24,
              }}
            >
              {pilar.icon}
            </div>
            <h3
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                margin: '0 0 16px',
              }}
            >
              {pilar.title}
            </h3>
            <p
              style={{
                fontSize: 16,
                color: '#B8C1E0',
                lineHeight: 1.6,
                margin: '0 0 28px',
              }}
            >
              {pilar.desc}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pilar.bullets.map((b) => (
                <li key={b} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: '#D1D5F0' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={pilar.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {b}
                </li>
              ))}
            </ul>
            <Link
              href={`/#${pilar.id}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 14,
                fontWeight: 600,
                color: pilar.color,
                textDecoration: 'none',
              }}
            >
              Ver mais →
            </Link>
          </div>

          {/* Right — screenshot mock */}
          <div style={{ animation: 'fade-in .3s ease-out forwards' }}>
            <div
              style={{
                background: '#12152C',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: `0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)`,
                minHeight: 320,
                position: 'relative',
              }}
            >
              {/* Colored accent bar */}
              <div
                style={{
                  height: 3,
                  background: `linear-gradient(90deg, ${pilar.color}, transparent)`,
                }}
              />

              {/* Mock UI content */}
              <div style={{ padding: 24 }}>
                {/* Top row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 20,
                  }}
                >
                  <div
                    style={{
                      fontSize: 16,
                      width: 36,
                      height: 36,
                      borderRadius: 9,
                      background: `rgba(${hexToRgb(pilar.color)},0.15)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {pilar.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{pilar.label}</div>
                    <div style={{ fontSize: 11, color: '#B8C1E0' }}>app.noro.guru</div>
                  </div>
                </div>

                {/* Skeleton rows */}
                {[100, 80, 65, 90, 55].map((w, i) => (
                  <div
                    key={i}
                    style={{
                      height: i === 0 ? 40 : 28,
                      background: i === 0
                        ? `rgba(${hexToRgb(pilar.color)},0.12)`
                        : 'rgba(255,255,255,0.04)',
                      borderRadius: 8,
                      marginBottom: 10,
                      width: `${w}%`,
                      border: i === 0
                        ? `1px solid rgba(${hexToRgb(pilar.color)},0.2)`
                        : '1px solid rgba(255,255,255,0.04)',
                    }}
                  />
                ))}

                {/* Colored badge */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: `rgba(${hexToRgb(pilar.color)},0.1)`,
                    border: `1px solid rgba(${hexToRgb(pilar.color)},0.25)`,
                    borderRadius: 999,
                    padding: '4px 12px',
                    fontSize: 11,
                    fontWeight: 600,
                    color: pilar.color,
                    marginTop: 8,
                  }}
                >
                  ✦ IA ativa
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255,255,255';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

export default Features;
