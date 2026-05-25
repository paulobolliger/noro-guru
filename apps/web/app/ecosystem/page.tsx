'use client';

import React from 'react';
import Link from 'next/link';

// Metadata handled in layout — 'use client' pages cannot export metadata directly

const APPS = [
  {
    icon: '🌍',
    name: 'Web',
    url: 'noro.guru',
    desc: 'Site institucional, marketing e portal público do ecossistema Noro Guru.',
    tags: ['Visitante'],
    href: '/',
    color: '#342CA4',
    audience: 'Público geral',
  },
  {
    icon: '⚙️',
    name: 'Core',
    url: 'app.noro.guru',
    desc: 'Plataforma principal das agências: CRM, financeiro, IA operacional e atendimento omnichannel.',
    tags: ['Agência'],
    href: 'https://app.noro.guru',
    color: '#1DD3C0',
    audience: 'Agências de viagem',
  },
  {
    icon: '🎛️',
    name: 'Control',
    url: 'control.noro.guru',
    desc: 'Painel de controle interno da Noro Guru: tenants, planos, faturamento e feature flags.',
    tags: ['Admin Noro'],
    href: 'https://control.noro.guru',
    color: '#D4AF37',
    audience: 'Equipe interna',
  },
  {
    icon: '🏗️',
    name: 'Sites',
    url: 'sites.noro.guru',
    desc: 'Builder de sites para agências de turismo. Publica em minutos, com domínio próprio e SEO.',
    tags: ['Agência'],
    href: 'https://sites.noro.guru',
    color: '#342CA4',
    audience: 'Agências de viagem',
  },
  {
    icon: '🛂',
    name: 'Visa API',
    url: 'visa.noro.guru',
    desc: 'API com dados de vistos para +240 nacionalidades. Base atualizada diariamente com validação de especialistas.',
    tags: ['Developer'],
    href: '/ecosystem/dados-de-vistos',
    color: '#1DD3C0',
    audience: 'Desenvolvedores',
  },
  {
    icon: '📡',
    name: 'API',
    url: 'api.noro.guru',
    desc: 'Documentação completa e playground para integrações com a plataforma Noro Guru.',
    tags: ['Developer'],
    href: 'https://api.noro.guru',
    color: '#D4AF37',
    audience: 'Desenvolvedores',
  },
];

const CONNECTIONS = [
  { from: 'Core', to: 'Visa API', label: 'Consulta dados de visto em tempo real' },
  { from: 'Core', to: 'Sites', label: 'Publica site e sincroniza leads' },
  { from: 'Control', to: 'Core', label: 'Gerencia planos e tenants' },
  { from: 'API', to: 'Core', label: 'Webhooks e integrações externas' },
];

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255,255,255';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}

export default function EcosystemPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 24px 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(52,44,164,0.3) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#D4AF37', marginBottom: 20 }}>
            O ecossistema Noro Guru
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 6vw, 56px)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 0 20px',
            }}
          >
            Seis apps. Um sistema operacional completo.
          </h1>
          <p style={{ fontSize: 18, color: '#B8C1E0', maxWidth: 600, margin: '0 auto 40px' }}>
            Cada app pensado para um momento da jornada — e todos compartilham dados, contas e cobrança.
          </p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['100% integrado', 'IA em todo fluxo', 'Dados no Brasil 🇧🇷', 'Multi-tenant'].map((badge) => (
              <span
                key={badge}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#B8C1E0',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 999,
                  padding: '6px 14px',
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Diagrama visual */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 80px 80px' }} className="px-6 md:px-20">
        <div
          style={{
            background: '#12152C',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: '48px',
            marginBottom: 48,
            textAlign: 'center',
          }}
        >
          {/* SVG Ecosystem diagram */}
          <div style={{ maxWidth: 640, margin: '0 auto' }}>
            <svg viewBox="0 0 640 360" style={{ width: '100%' }}>
              {/* Lines */}
              <line x1="320" y1="180" x2="120" y2="80" stroke="rgba(52,44,164,0.4)" strokeWidth="1.5" strokeDasharray="4 4"/>
              <line x1="320" y1="180" x2="520" y2="80" stroke="rgba(29,211,192,0.4)" strokeWidth="1.5" strokeDasharray="4 4"/>
              <line x1="320" y1="180" x2="120" y2="280" stroke="rgba(212,175,55,0.4)" strokeWidth="1.5" strokeDasharray="4 4"/>
              <line x1="320" y1="180" x2="520" y2="280" stroke="rgba(52,44,164,0.4)" strokeWidth="1.5" strokeDasharray="4 4"/>
              <line x1="320" y1="180" x2="160" y2="180" stroke="rgba(29,211,192,0.4)" strokeWidth="1.5" strokeDasharray="4 4"/>
              <line x1="320" y1="180" x2="480" y2="180" stroke="rgba(212,175,55,0.4)" strokeWidth="1.5" strokeDasharray="4 4"/>

              {/* Center — Core */}
              <circle cx="320" cy="180" r="48" fill="rgba(52,44,164,0.2)" stroke="#342CA4" strokeWidth="1.5"/>
              <text x="320" y="174" textAnchor="middle" fill="#fff" fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="14">⚙️ Core</text>
              <text x="320" y="192" textAnchor="middle" fill="#B8C1E0" fontFamily="sans-serif" fontSize="9">app.noro.guru</text>

              {/* Web */}
              <circle cx="120" cy="80" r="36" fill="rgba(52,44,164,0.1)" stroke="rgba(52,44,164,0.4)" strokeWidth="1"/>
              <text x="120" y="76" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="13">🌍</text>
              <text x="120" y="92" textAnchor="middle" fill="#B8C1E0" fontFamily="sans-serif" fontSize="9">Web</text>

              {/* Sites */}
              <circle cx="520" cy="80" r="36" fill="rgba(52,44,164,0.1)" stroke="rgba(52,44,164,0.4)" strokeWidth="1"/>
              <text x="520" y="76" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="13">🏗️</text>
              <text x="520" y="92" textAnchor="middle" fill="#B8C1E0" fontFamily="sans-serif" fontSize="9">Sites</text>

              {/* Control */}
              <circle cx="120" cy="280" r="36" fill="rgba(212,175,55,0.1)" stroke="rgba(212,175,55,0.4)" strokeWidth="1"/>
              <text x="120" y="276" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="13">🎛️</text>
              <text x="120" y="292" textAnchor="middle" fill="#B8C1E0" fontFamily="sans-serif" fontSize="9">Control</text>

              {/* API */}
              <circle cx="520" cy="280" r="36" fill="rgba(212,175,55,0.1)" stroke="rgba(212,175,55,0.4)" strokeWidth="1"/>
              <text x="520" y="276" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="13">📡</text>
              <text x="520" y="292" textAnchor="middle" fill="#B8C1E0" fontFamily="sans-serif" fontSize="9">API</text>

              {/* Visa */}
              <circle cx="160" cy="180" r="36" fill="rgba(29,211,192,0.1)" stroke="rgba(29,211,192,0.4)" strokeWidth="1"/>
              <text x="160" y="176" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="13">🛂</text>
              <text x="160" y="192" textAnchor="middle" fill="#B8C1E0" fontFamily="sans-serif" fontSize="9">Visa</text>

              {/* Placeholder right */}
              <circle cx="480" cy="180" r="36" fill="rgba(29,211,192,0.1)" stroke="rgba(29,211,192,0.4)" strokeWidth="1"/>
              <text x="480" y="176" textAnchor="middle" fill="#fff" fontFamily="sans-serif" fontSize="13">🌐</text>
              <text x="480" y="192" textAnchor="middle" fill="#B8C1E0" fontFamily="sans-serif" fontSize="9">Noro</text>
            </svg>
          </div>
          <p style={{ fontSize: 13, color: '#B8C1E0', margin: '16px 0 0' }}>
            Core é o hub central — todos os apps compartilham dados em tempo real.
          </p>
        </div>

        {/* Apps grid */}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.02em',
            margin: '0 0 32px',
          }}
        >
          Os 6 apps do ecossistema
        </h2>

        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {APPS.map((app) => (
            <Link
              key={app.name}
              href={app.href}
              style={{
                background: '#12152C',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: 28,
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                transition: 'border-color .2s, transform .2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = app.color;
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 14,
                  background: `rgba(${hexToRgb(app.color)},0.12)`,
                  border: `1px solid rgba(${hexToRgb(app.color)},0.2)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 26,
                }}
              >
                {app.icon}
              </div>

              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', marginBottom: 4 }}>
                  {app.name}
                </div>
                <div style={{ fontSize: 12, color: '#B8C1E0', fontFamily: 'var(--font-mono)' }}>
                  {app.url}
                </div>
              </div>

              <p style={{ fontSize: 13.5, color: '#B8C1E0', lineHeight: 1.55, margin: 0, flex: 1 }}>
                {app.desc}
              </p>

              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {app.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: app.color,
                      background: `rgba(${hexToRgb(app.color)},0.1)`,
                      border: `1px solid rgba(${hexToRgb(app.color)},0.2)`,
                      borderRadius: 999,
                      padding: '3px 10px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
                <span style={{ fontSize: 11, color: '#B8C1E0', marginLeft: 'auto', alignSelf: 'center' }}>
                  {app.audience}
                </span>
              </div>

              <div style={{ fontSize: 13, fontWeight: 600, color: app.color }}>
                Saiba mais →
              </div>
            </Link>
          ))}
        </div>

        {/* Connections section */}
        <div style={{ marginTop: 64 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 32px' }}>
            Como os apps se conectam
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="grid-cols-1 md:grid-cols-2">
            {CONNECTIONS.map((conn) => (
              <div
                key={conn.label}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#E0E3FF', background: 'rgba(255,255,255,0.08)', borderRadius: 6, padding: '3px 8px' }}>{conn.from}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1DD3C0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#E0E3FF', background: 'rgba(255,255,255,0.08)', borderRadius: 6, padding: '3px 8px' }}>{conn.to}</span>
                </div>
                <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0, lineHeight: 1.5 }}>{conn.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: 'linear-gradient(135deg, #342CA4, #232452)', padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>
          Pronto para o ecossistema completo?
        </h2>
        <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', margin: '0 0 32px' }}>
          Escolha o plano certo para sua agência.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="/pricing"
            style={{ background: '#fff', color: '#342CA4', borderRadius: 10, padding: '12px 28px', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}
          >
            Ver planos →
          </Link>
          <Link
            href="/demo"
            style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 10, padding: '12px 28px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}
          >
            Agendar demo
          </Link>
        </div>
      </section>
    </div>
  );
}
