import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sobre Nós | Noro Guru',
  description: 'Conheça a missão, visão e o time por trás do Noro Guru — o sistema operacional da agência moderna.',
};

const TEAM = [
  { name: 'Paulo Bolliger', role: 'Co-founder & CEO', initials: 'PB', color: '#342CA4' },
  { name: 'Marina Costa', role: 'Co-founder & CPO', initials: 'MC', color: '#1DD3C0' },
  { name: 'Rafael Souza', role: 'CTO', initials: 'RS', color: '#D4AF37' },
  { name: 'Juliana Alves', role: 'Head de Customer Success', initials: 'JA', color: '#342CA4' },
];

const MVV = [
  {
    icon: '🎯',
    color: '#342CA4',
    label: 'Missão',
    text: 'Colocar ordem inteligente na operação de agências de viagem brasileiras, sem engessar o negócio.',
  },
  {
    icon: '👁️',
    color: '#1DD3C0',
    label: 'Visão',
    text: 'Ser o sistema operacional de toda agência de turismo moderna da América Latina.',
  },
  {
    icon: '❤️',
    color: '#D4AF37',
    label: 'Valores',
    text: 'Simplicidade que respeita a complexidade real. Tecnologia a serviço de pessoas. Feito no Brasil, para o Brasil.',
  },
];

export default function AboutPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>

      {/* Hero */}
      <section
        style={{
          background: '#12152C',
          padding: '80px 80px 96px',
          position: 'relative',
          overflow: 'hidden',
          textAlign: 'center',
        }}
        className="px-6 md:px-20"
      >
        {/* Orbs */}
        <div style={{ position: 'absolute', top: -80, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(52,44,164,0.3) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, right: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(29,211,192,0.15) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 760, margin: '0 auto' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1DD3C0', marginBottom: 20 }}>
            Nossa missão
          </div>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 6vw, 56px)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 0 24px',
            }}
          >
            Construímos o sistema operacional das agências de turismo modernas.
          </h1>
          <p style={{ fontSize: 18, color: '#B8C1E0', lineHeight: 1.65, margin: 0 }}>
            A Noro Guru nasceu dentro do turismo — e por isso entende o que softwares genéricos nunca entenderam.
          </p>
        </div>

        {/* Photo placeholder */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            maxWidth: 900,
            margin: '56px auto 0',
            height: 320,
            borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(52,44,164,0.4), rgba(29,211,192,0.2))',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, transparent 60%, #12152C 100%)',
            }}
          />
          <span style={{ fontSize: 64, opacity: 0.4 }}>📸</span>
          <p style={{ position: 'absolute', bottom: 24, left: 0, right: 0, textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
            Equipe Noro Guru · São Paulo, 2026
          </p>
        </div>
      </section>

      {/* Por que criamos */}
      <section style={{ padding: '96px 0' }}>
        <div
          style={{ maxWidth: 1200, margin: '0 auto', padding: '0 80px', display: 'grid', gridTemplateColumns: '55% 45%', gap: 80, alignItems: 'center' }}
          className="px-6 md:px-20 grid-cols-1 md:grid-cols-2"
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#342CA4', marginBottom: 20 }}>
              Nossa história
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.02em',
                lineHeight: 1.2,
                margin: '0 0 24px',
              }}
            >
              Por que criamos o Noro Guru
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                'Vimos de perto como agências de viagem perdiam tempo e margem usando planilhas, WhatsApp e sistemas genéricos que nunca foram feitos para o turismo.',
                'Cotações esquecidas. Comissões calculadas manualmente. Clientes sem follow-up. Sites desatualizados. O problema não era falta de esforço — era falta de ferramenta certa.',
                'Por isso construímos a Noro Guru: uma plataforma que entende a complexidade real do dia a dia de uma agência e organiza tudo em um único lugar, com inteligência e simplicidade.',
              ].map((p, i) => (
                <p key={i} style={{ fontSize: 17, color: '#D1D5F0', lineHeight: 1.7, margin: 0 }}>
                  {p}
                </p>
              ))}
            </div>
          </div>

          {/* Right image placeholder */}
          <div
            style={{
              height: 380,
              borderRadius: 16,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: 48, opacity: 0.3 }}>🏢</span>
          </div>
        </div>
      </section>

      {/* MVV */}
      <section style={{ background: '#12152C', padding: '96px 0' }}>
        <div
          style={{ maxWidth: 1200, margin: '0 auto', padding: '0 80px' }}
          className="px-6 md:px-20"
        >
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              Missão, Visão e Valores
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="grid-cols-1 md:grid-cols-3">
            {MVV.map((item) => (
              <div
                key={item.label}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 16,
                  padding: 32,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `rgba(${hexToRgb(item.color)},0.15)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: item.color }}>
                  {item.label}
                </div>
                <p style={{ fontSize: 15, color: '#D1D5F0', lineHeight: 1.65, margin: 0 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '96px 0' }}>
        <div
          style={{ maxWidth: 1200, margin: '0 auto', padding: '0 80px' }}
          className="px-6 md:px-20"
        >
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 3.5vw, 40px)',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.02em',
                margin: 0,
              }}
            >
              O time
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }} className="grid-cols-2 md:grid-cols-4">
            {TEAM.map((member) => (
              <div
                key={member.name}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  textAlign: 'center',
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    background: member.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '0.04em',
                  }}
                >
                  {member.initials}
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#E0E3FF' }}>{member.name}</div>
                  <div style={{ fontSize: 13, color: '#B8C1E0', marginTop: 4 }}>{member.role}</div>
                </div>
                <a
                  href="#"
                  style={{ fontSize: 12, color: '#B8C1E0', textDecoration: 'none' }}
                  aria-label={`LinkedIn de ${member.name}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Números */}
      <section style={{ background: '#12152C', padding: '80px 0' }}>
        <div
          style={{ maxWidth: 1200, margin: '0 auto', padding: '0 80px', textAlign: 'center' }}
          className="px-6 md:px-20"
        >
          <div style={{ display: 'flex', gap: 0, justifyContent: 'center' }}>
            {[
              { v: '1.200+', l: 'agências' },
              { v: '5 apps', l: 'no ecossistema' },
              { v: 'Desde 2023', l: 'no mercado' },
            ].map((stat, i) => (
              <div
                key={stat.l}
                style={{
                  flex: 1,
                  padding: '40px 24px',
                  borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(36px, 5vw, 56px)',
                    fontWeight: 800,
                    color: '#fff',
                    letterSpacing: '-0.03em',
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {stat.v}
                </div>
                <div style={{ fontSize: 14, color: '#B8C1E0', fontWeight: 500 }}>{stat.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center' }}>
        <Link
          href="/pricing"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 15,
            fontWeight: 600,
            color: '#E0E3FF',
            textDecoration: 'none',
            padding: '12px 28px',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 10,
          }}
        >
          Conheça nossa plataforma →
        </Link>
      </section>
    </div>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255,255,255';
  return `${parseInt(result[1], 16)},${parseInt(result[2], 16)},${parseInt(result[3], 16)}`;
}
