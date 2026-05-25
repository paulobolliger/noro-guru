import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Imprensa | Noro Guru',
  description: 'Recursos de imprensa, mídia kit e cobertura jornalística da Noro Guru.',
};

const MENTIONS = [
  {
    outlet: 'Panrotas',
    logo: 'P',
    color: '#342CA4',
    headline: '"Startup brasileira usa IA para modernizar agências de turismo"',
    date: 'Mar 2026',
    href: '#',
  },
  {
    outlet: 'Startup Base',
    logo: 'SB',
    color: '#1DD3C0',
    headline: '"Noro Guru levanta rodada seed de R$ 3M para expansão"',
    date: 'Jan 2026',
    href: '#',
  },
  {
    outlet: 'Mundo do Turismo',
    logo: 'MT',
    color: '#D4AF37',
    headline: '"As ferramentas que estão transformando a agência de viagens"',
    date: 'Dez 2025',
    href: '#',
  },
  {
    outlet: 'Abav Informa',
    logo: 'AI',
    color: '#7C3AED',
    headline: '"Tecnologia como aliada: como a IA chega às agências de turismo"',
    date: 'Nov 2025',
    href: '#',
  },
];

const MILESTONES = [
  { date: 'Mai 2026', event: '1.200+ agências ativas na plataforma' },
  { date: 'Jan 2026', event: 'Captação seed de R$ 3M com Nomade Group' },
  { date: 'Set 2025', event: 'Lançamento da IA Operacional v1' },
  { date: 'Jun 2025', event: 'Abertura do beta para 50 agências parceiras' },
  { date: 'Mar 2025', event: 'Fundação da Noro Guru em São Paulo' },
];

export default function ImprensaPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>

      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0D1526 0%, #0B1220 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '96px 24px 80px',
        }}
      >
        <div style={{ maxWidth: 840, margin: '0 auto' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 40 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Voltar
          </Link>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 32 }}>
            <div>
              <h1
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(32px, 5vw, 52px)',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.1,
                  margin: '0 0 16px',
                }}
              >
                Sala de Imprensa
              </h1>
              <p style={{ fontSize: 17, color: '#B8C1E0', lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
                Recursos para jornalistas, bloggers e criadores de conteúdo sobre a Noro Guru.
              </p>
            </div>
            <a
              href="mailto:imprensa@noro.guru"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#342CA4',
                color: '#fff',
                borderRadius: 10,
                padding: '12px 24px',
                fontSize: 14,
                fontWeight: 700,
                textDecoration: 'none',
                flexShrink: 0,
              }}
            >
              Falar com assessoria →
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px 96px' }}>

        {/* Media Kit */}
        <div
          style={{
            background: '#12152C',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            padding: '40px',
            marginBottom: 80,
            display: 'grid',
            gridTemplateColumns: '1fr auto',
            gap: 32,
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#342CA4',
                marginBottom: 10,
                fontFamily: 'var(--font-mono)',
              }}
            >
              Kit de Mídia
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 24,
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.02em',
                margin: '0 0 10px',
              }}
            >
              Logos, cores e screenshots
            </h2>
            <p style={{ fontSize: 14, color: '#B8C1E0', margin: '0 0 20px', lineHeight: 1.65 }}>
              Tudo que você precisa para publicar sobre a Noro Guru: marca em PNG/SVG, paleta oficial, capturas de tela da plataforma e bio da empresa.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <a
                href="#"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#342CA4',
                  color: '#fff',
                  borderRadius: 8,
                  padding: '10px 20px',
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                📦 Baixar kit completo
              </a>
              <a
                href="#"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(255,255,255,0.07)',
                  color: '#E0E3FF',
                  borderRadius: 8,
                  padding: '10px 20px',
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                🎨 Ver guidelines
              </a>
            </div>
          </div>
          <div
            style={{
              width: 120,
              height: 120,
              background: 'rgba(52,44,164,0.15)',
              border: '1px solid rgba(52,44,164,0.3)',
              borderRadius: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 52,
              flexShrink: 0,
            }}
          >
            📐
          </div>
        </div>

        {/* Press Coverage */}
        <div style={{ marginBottom: 80 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
              margin: '0 0 28px',
            }}
          >
            Cobertura recente
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 16 }}>
            {MENTIONS.map((mention) => (
              <a
                key={mention.headline}
                href={mention.href}
                style={{
                  background: '#12152C',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12,
                  padding: '20px 24px',
                  textDecoration: 'none',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: `${mention.color}22`,
                    border: `1px solid ${mention.color}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 800,
                    color: mention.color,
                    fontFamily: 'var(--font-mono)',
                    flexShrink: 0,
                  }}
                >
                  {mention.logo}
                </div>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: '#B8C1E0', marginBottom: 6 }}>
                    {mention.outlet} · {mention.date}
                  </div>
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#E0E3FF',
                      margin: 0,
                      lineHeight: 1.5,
                      fontStyle: 'italic',
                    }}
                  >
                    {mention.headline}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Company Timeline */}
        <div style={{ marginBottom: 80 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
              margin: '0 0 28px',
            }}
          >
            Nossa história
          </h2>
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            <div
              style={{
                position: 'absolute',
                left: 7,
                top: 8,
                bottom: 8,
                width: 1,
                background: 'rgba(255,255,255,0.08)',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {MILESTONES.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: 24, paddingBottom: 28 }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 2,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: '#342CA4',
                      marginTop: 4,
                      flexShrink: 0,
                    }}
                  />
                  <div style={{ paddingLeft: 8 }}>
                    <div
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: '#342CA4',
                        fontFamily: 'var(--font-mono)',
                        marginBottom: 4,
                      }}
                    >
                      {m.date}
                    </div>
                    <p style={{ fontSize: 15, color: '#D1D5F0', margin: 0 }}>{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Boilerplate */}
        <div
          style={{
            background: '#12152C',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14,
            padding: '32px 36px',
            marginBottom: 80,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.01em',
              margin: '0 0 16px',
            }}
          >
            Sobre a Noro Guru (boilerplate)
          </h2>
          <p style={{ fontSize: 14, color: '#D1D5F0', margin: '0 0 16px', lineHeight: 1.75, fontStyle: 'italic' }}>
            &quot;A Noro Guru é o sistema operacional da agência de turismo moderna. Fundada em 2025 em São Paulo, a plataforma reúne CRM, gestão financeira, atendimento omnichannel, geração de sites e IA operacional em uma solução integrada. Hoje, mais de 1.200 agências no Brasil usam a Noro Guru para atender clientes com mais eficiência e crescer sua receita. A empresa faz parte do Nomade Group.&quot;
          </p>
          <button
            style={{
              fontSize: 13,
              color: '#1DD3C0',
              background: 'transparent',
              border: '1px solid rgba(29,211,192,0.3)',
              borderRadius: 8,
              padding: '7px 14px',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            📋 Copiar texto
          </button>
        </div>

        {/* Contact */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: 16,
          }}
        >
          {[
            {
              icon: '📧',
              title: 'Assessoria de imprensa',
              info: 'imprensa@noro.guru',
              href: 'mailto:imprensa@noro.guru',
              note: 'Resposta em até 4 horas',
            },
            {
              icon: '📱',
              title: 'WhatsApp de mídia',
              info: '+55 11 9xxxx-xxxx',
              href: '#',
              note: 'Segunda a sexta, 9h–18h',
            },
          ].map((c) => (
            <div
              key={c.title}
              style={{
                background: '#12152C',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12,
                padding: '24px 28px',
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>{c.icon}</div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#fff',
                  margin: '0 0 6px',
                }}
              >
                {c.title}
              </h3>
              <a
                href={c.href}
                style={{
                  fontSize: 14,
                  color: '#1DD3C0',
                  textDecoration: 'none',
                  fontWeight: 600,
                  display: 'block',
                  marginBottom: 4,
                }}
              >
                {c.info}
              </a>
              <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0 }}>{c.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
