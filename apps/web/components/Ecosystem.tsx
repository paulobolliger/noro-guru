'use client';

import React from 'react';
import Link from 'next/link';

const APPS = [
  {
    icon: '🌍',
    name: 'Web',
    url: 'noro.guru',
    desc: 'Site institucional e portal de marketing do ecossistema.',
    tags: ['Visitante'],
    href: '/',
    color: '#342CA4',
  },
  {
    icon: '⚙️',
    name: 'Core',
    url: 'app.noro.guru',
    desc: 'Plataforma principal: CRM, financeiro, IA e atendimento.',
    tags: ['Agência'],
    href: 'https://app.noro.guru',
    color: '#1DD3C0',
  },
  {
    icon: '🎛️',
    name: 'Control',
    url: 'control.noro.guru',
    desc: 'Painel administrativo interno da Noro Guru.',
    tags: ['Admin Noro'],
    href: 'https://control.noro.guru',
    color: '#D4AF37',
  },
  {
    icon: '🏗️',
    name: 'Sites',
    url: 'sites.noro.guru',
    desc: 'Builder de sites para agências de viagem.',
    tags: ['Agência'],
    href: 'https://sites.noro.guru',
    color: '#342CA4',
  },
  {
    icon: '🛂',
    name: 'Visa API',
    url: 'visa.noro.guru',
    desc: 'API de dados de vistos com +240 nacionalidades.',
    tags: ['Developer'],
    href: '/ecosystem/dados-de-vistos',
    color: '#1DD3C0',
  },
  {
    icon: '📡',
    name: 'API Docs',
    url: 'api.noro.guru',
    desc: 'Documentação completa para integrações e desenvolvedores.',
    tags: ['Developer'],
    href: 'https://api.noro.guru',
    color: '#D4AF37',
  },
];

export default function Ecosystem() {
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
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#D4AF37',
              marginBottom: 16,
            }}
          >
            Ecossistema
          </div>
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
            Seis apps. Um sistema operacional completo.
          </h2>
          <p style={{ fontSize: 16, color: '#B8C1E0', margin: 0, maxWidth: 560, marginInline: 'auto' }}>
            Cada app foi pensado para um momento da jornada — e todos compartilham dados, contas e cobrança.
          </p>
        </div>

        {/* Apps grid 2x3 */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 20,
            marginBottom: 56,
          }}
          className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
        >
          {APPS.map((app) => (
            <Link
              key={app.name}
              href={app.href}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 16,
                padding: 28,
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                transition: 'border-color .2s, background .2s, transform .2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = app.color;
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)';
                (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
              }}
            >
              {/* Icon */}
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

              {/* Name */}
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 20,
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '-0.02em',
                    marginBottom: 4,
                  }}
                >
                  {app.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: '#B8C1E0',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {app.url}
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: 13.5, color: '#B8C1E0', lineHeight: 1.55, margin: 0 }}>
                {app.desc}
              </p>

              {/* Tags */}
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
              </div>

              {/* CTA */}
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: app.color,
                  marginTop: 'auto',
                }}
              >
                Saiba mais →
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center' }}>
          <Link
            href="/ecosystem"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontSize: 14,
              fontWeight: 600,
              color: '#B8C1E0',
              textDecoration: 'none',
              padding: '10px 20px',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              transition: 'border-color .15s, color .15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.12)';
              (e.currentTarget as HTMLAnchorElement).style.color = '#B8C1E0';
            }}
          >
            Ver ecossistema completo →
          </Link>
        </div>
      </div>
    </section>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255,255,255';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}
