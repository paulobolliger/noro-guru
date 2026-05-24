'use client';

import React from 'react';
import Link from 'next/link';

// Social-proof logos (agency names)
const LOGOS = ['Wanderlust', 'Voa Brasil', 'Honda Viagens', 'Topázio Tours', 'Atlas & Co.', 'Mirante'];

const Hero: React.FC = () => {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '92vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#0B1220',
        paddingTop: 80,
        paddingBottom: 80,
      }}
    >
      {/* Background: radial gradient + grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 50% 0%, rgba(18,21,44,0.95) 0%, #0B1220 100%)
          `,
        }}
      />

      {/* Grid overlay */}
      <div
        className="bg-grid-noro"
        style={{ position: 'absolute', inset: 0, opacity: 1 }}
      />

      {/* Orb — primary (purple, top-left) */}
      <div
        style={{
          position: 'absolute',
          top: -120,
          left: -120,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52,44,164,0.35) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />
      {/* Orb — accent (teal, bottom-right) */}
      <div
        style={{
          position: 'absolute',
          bottom: -80,
          right: -80,
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(29,211,192,0.18) 0%, transparent 65%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          maxWidth: 800,
          margin: '0 auto',
          textAlign: 'center',
          padding: '0 24px',
        }}
      >
        {/* Badge pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(29,211,192,0.1)',
            border: '1px solid rgba(29,211,192,0.3)',
            borderRadius: 999,
            padding: '6px 16px',
            fontSize: 13,
            fontWeight: 600,
            color: '#1DD3C0',
            marginBottom: 32,
          }}
        >
          <span>✦ Novo: IA Operacional v2 —</span>
          <Link
            href="/changelog"
            style={{
              color: '#1DD3C0',
              textDecoration: 'underline',
              textDecorationColor: 'rgba(29,211,192,0.5)',
              textUnderlineOffset: 3,
            }}
          >
            Ver novidades →
          </Link>
        </div>

        {/* H1 */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(44px, 7vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            color: '#fff',
            margin: '0 0 24px',
          }}
        >
          O sistema operacional{' '}
          <span
            style={{
              background: 'linear-gradient(90deg, #342CA4 0%, #1DD3C0 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            da agência moderna.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 18,
            color: '#B8C1E0',
            lineHeight: 1.6,
            maxWidth: 600,
            margin: '0 auto 40px',
            fontFamily: 'var(--font-sans)',
          }}
        >
          CRM, financeiro, atendimento, sites e IA em uma plataforma.
          Do lead ao cliente fidelizado.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            flexWrap: 'wrap',
            marginBottom: 56,
          }}
        >
          <Link
            href="https://app.noro.guru"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#342CA4',
              color: '#fff',
              borderRadius: 10,
              padding: '14px 28px',
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
              boxShadow: '0 4px 24px rgba(52,44,164,0.5)',
              transition: 'background .15s, box-shadow .15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#3B2CA4';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = '#342CA4';
            }}
          >
            Começar gratuitamente
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
          <Link
            href="/demo"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'transparent',
              color: '#fff',
              borderRadius: 10,
              padding: '14px 28px',
              fontSize: 15,
              fontWeight: 600,
              textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.3)',
              transition: 'border-color .15s, background .15s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.5)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.3)';
            }}
          >
            Ver demonstração
          </Link>
        </div>

        {/* Social proof */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0 }}>
            Mais de <strong style={{ color: '#fff' }}>800 agências</strong> já operam com o Noro
          </p>

          {/* Agency logo row */}
          <div
            style={{
              display: 'flex',
              gap: 28,
              alignItems: 'center',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {LOGOS.map((name) => (
              <span
                key={name}
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 15,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.25)',
                  letterSpacing: '-0.01em',
                  fontStyle: 'italic',
                }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero dashboard visual */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          marginTop: 64,
          maxWidth: 960,
          width: '100%',
          padding: '0 24px',
        }}
      >
        {/* Glow under card */}
        <div
          style={{
            position: 'absolute',
            bottom: -40,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '70%',
            height: 80,
            background: 'rgba(52,44,164,0.5)',
            filter: 'blur(40px)',
            borderRadius: '50%',
          }}
        />

        {/* Browser frame card */}
        <div
          style={{
            background: '#12152C',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
            transform: 'perspective(1200px) rotateX(4deg)',
          }}
        >
          {/* Browser top bar */}
          <div
            style={{
              background: '#1a1d35',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderBottom: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <div style={{ display: 'flex', gap: 6 }}>
              {['#ff5f57', '#febc2e', '#28c840'].map((c, i) => (
                <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <div
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 6,
                padding: '4px 12px',
                fontSize: 11,
                color: 'rgba(255,255,255,0.35)',
                fontFamily: 'var(--font-mono)',
                textAlign: 'center',
              }}
            >
              app.noro.guru
            </div>
          </div>

          {/* Dashboard mock content */}
          <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: 20, minHeight: 340 }}>
            {/* Stats row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
              {[
                { label: 'Receita do mês', value: 'R$ 142k', delta: '+18%', color: '#1DD3C0' },
                { label: 'Leads ativos', value: '38', delta: '+12 hoje', color: '#342CA4' },
                { label: 'A receber', value: 'R$ 38k', delta: '3 cobr.', color: '#D4AF37' },
                { label: 'NPS da semana', value: '4.8★', delta: '↑ 0.2', color: '#1DD3C0' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 10,
                    padding: '14px 16px',
                  }}
                >
                  <div style={{ fontSize: 10, color: '#B8C1E0', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>{stat.label}</div>
                  <div style={{ fontSize: 20, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{stat.value}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: stat.color, marginTop: 4 }}>{stat.delta}</div>
                </div>
              ))}
            </div>

            {/* Chart + list row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {/* Bar chart */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 10, color: '#B8C1E0', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 16 }}>Receita por mês</div>
                <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end', height: 80 }}>
                  {[30, 45, 28, 60, 50, 75, 65, 90, 78, 102, 88, 120].map((h, i) => (
                    <div
                      key={i}
                      style={{
                        flex: 1,
                        height: `${(h / 120) * 100}%`,
                        borderRadius: '3px 3px 2px 2px',
                        background: i === 11 ? '#342CA4' : i === 10 ? 'rgba(52,44,164,0.5)' : 'rgba(255,255,255,0.1)',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Pipeline */}
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 10, color: '#B8C1E0', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Pipeline — leads</div>
                {[
                  { stage: 'Novo contato', count: 12, w: 85, c: '#342CA4' },
                  { stage: 'Proposta enviada', count: 8, w: 60, c: '#1DD3C0' },
                  { stage: 'Negociando', count: 5, w: 40, c: '#D4AF37' },
                  { stage: 'Fechado ✓', count: 3, w: 25, c: '#22c55e' },
                ].map((row) => (
                  <div key={row.stage} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <div style={{ fontSize: 10, color: '#B8C1E0', width: 100, flexShrink: 0 }}>{row.stage}</div>
                    <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                      <div style={{ width: `${row.w}%`, height: '100%', background: row.c, borderRadius: 3 }} />
                    </div>
                    <div style={{ fontSize: 10, color: '#fff', fontWeight: 700, width: 18, textAlign: 'right' }}>{row.count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
