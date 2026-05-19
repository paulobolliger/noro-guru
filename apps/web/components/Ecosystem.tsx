import React from 'react';
import Link from 'next/link';

const PRODUCTS = [
  {
    id: 'portal',
    name: 'NORO Portal',
    tag: 'App principal',
    status: 'DISPONÍVEL',
    statusColor: '#0a5a3b',
    statusBg: '#cce8d8',
    tagline: 'O sistema operacional da agência.',
    description:
      'CRM, financeiro, marketing, conteúdo e o site da agência em um único portal feito para o mercado brasileiro.',
    bullets: [
      'CRM completo + funil de vendas',
      'Financeiro com PIX integrado',
      'Módulo Meu Site (domínio próprio)',
      'Conteúdo IA + inbox unificada',
    ],
    cta: 'Conheça o Portal',
    href: 'https://app.noro.guru',
    bg: '#232452',
    iconColor: '#19b8a8',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
    ),
  },
  {
    id: 'vistos',
    name: 'Dados de Vistos',
    tag: 'API & dados',
    status: 'DISPONÍVEL',
    statusColor: '#0a5a3b',
    statusBg: '#cce8d8',
    tagline: 'A maior base de vistos da América Latina.',
    description:
      'Consulte requisitos de visto, prazos e custos por nacionalidade × destino em tempo real. API REST pronta para integrar com qualquer sistema.',
    bullets: [
      '+240 nacionalidades cobertas',
      'Dados validados por especialistas',
      'Atualização diária + changelog',
      'SDKs em JS, Python e PHP',
    ],
    cta: 'Ver documentação',
    href: '/ecosystem/dados-de-vistos',
    bg: '#19b8a8',
    iconColor: '#232452',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 9V5a2 2 0 0 1 2-2h4"/><path d="M20 9V5a2 2 0 0 0-2-2h-4"/><path d="M2 15v4a2 2 0 0 0 2 2h4"/><path d="M20 15v4a2 2 0 0 1-2 2h-4"/>
        <rect x="7" y="7" width="10" height="10" rx="1"/>
      </svg>
    ),
  },
  {
    id: 'ittd',
    name: 'NORO ITTD',
    tag: 'In-trip companion',
    status: 'EM BREVE',
    statusColor: '#7d4a14',
    statusBg: '#f4d4a8',
    tagline: 'O companheiro do viajante na jornada.',
    description:
      'App white-label que a agência entrega ao cliente: roteiro, documentos, suporte 24h e SOS local. Em desenvolvimento — lista de espera aberta.',
    bullets: [
      'App iOS + Android white-label',
      'Roteiro offline + check-ins',
      'Suporte 24h via WhatsApp',
      'Pesquisa pós-viagem automática',
    ],
    cta: 'Entrar na lista de espera',
    href: '/ecosystem/ittd',
    bg: '#f6f7fb',
    iconColor: '#232452',
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/>
      </svg>
    ),
  },
];

const ROADMAP = [
  { q: 'Q2 · 2026', title: 'Multi-empresa para Agency+', desc: 'Operar várias marcas em uma só conta NORO.', status: 'AGORA', statusColor: '#0a5a3b', statusBg: '#cce8d8' },
  { q: 'Q3 · 2026', title: 'App móvel do NORO Portal', desc: 'iOS + Android para responder leads em movimento.', status: 'EM DEV', statusColor: '#1f3da8', statusBg: '#dce5fc' },
  { q: 'Q4 · 2026', title: 'ITTD beta — 30 agências piloto', desc: 'App in-trip white-label para o viajante.', status: 'PROGRAMADO', statusColor: '#7d4a14', statusBg: '#f4d4a8' },
  { q: 'Q1 · 2027', title: 'Marketplace de fornecedores', desc: 'Operadoras, hotéis e seguradoras numa única vitrine.', status: 'EXPLORANDO', statusColor: '#4c2d99', statusBg: '#e1d8f7' },
];

export default function Ecosystem() {
  return (
    <section style={{
      padding: '96px 24px',
      background: '#fff',
    }}>
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr',
          gap: 64,
          alignItems: 'end',
          marginBottom: 64,
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 12, fontWeight: 700, letterSpacing: '.1em',
              textTransform: 'uppercase', color: '#19b8a8',
              marginBottom: 20,
            }}>
              <span style={{ width: 24, height: 1.5, background: '#19b8a8', display: 'inline-block' }} />
              Ecossistema NORO
            </div>
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(36px, 4.2vw, 52px)',
              fontWeight: 400,
              letterSpacing: '-0.025em',
              lineHeight: 1.06,
              color: '#1f2433',
              margin: 0,
            }}>
              Três produtos.{' '}
              <em style={{ fontStyle: 'italic', color: '#19b8a8' }}>Um ecossistema.</em>
            </h2>
          </div>
          <p style={{
            fontSize: 16,
            lineHeight: 1.6,
            color: 'rgba(31,36,51,0.6)',
            margin: 0,
          }}>
            Cada produto NORO foi pensado para um momento da jornada da agência — e todos compartilham os mesmos dados, contas e cobrança.
          </p>
        </div>

        {/* Product cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 64,
        }}>
          {PRODUCTS.map((p) => (
            <div
              key={p.id}
              style={{
                background: p.bg === '#f6f7fb' ? '#f6f7fb' : p.bg === '#19b8a8' ? '#f0fdfb' : '#fff',
                border: `1px solid ${p.bg === '#232452' ? '#232452' : '#eceef3'}`,
                borderRadius: 18,
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                gap: 20,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: p.bg === '#232452' ? '#19b8a8' : p.bg === '#19b8a8' ? '#232452' : '#232452',
                  color: p.bg === '#232452' ? '#232452' : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  {p.icon}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9.5, fontWeight: 700, letterSpacing: '.08em',
                  padding: '4px 9px', borderRadius: 999,
                  background: p.statusBg,
                  color: p.statusColor,
                  whiteSpace: 'nowrap',
                }}>
                  ● {p.status}
                </div>
              </div>

              {/* Title */}
              <div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10.5, fontWeight: 700, letterSpacing: '.08em',
                  textTransform: 'uppercase',
                  color: p.bg === '#232452' ? 'rgba(255,255,255,0.5)' : 'rgba(31,36,51,0.5)',
                  marginBottom: 6,
                }}>{p.tag}</div>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 26,
                  fontWeight: 500,
                  letterSpacing: '-0.02em',
                  margin: 0,
                  color: p.bg === '#232452' ? '#fff' : '#1f2433',
                }}>{p.name}</h3>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 15,
                  color: p.bg === '#232452' ? '#19b8a8' : '#19b8a8',
                  marginTop: 4,
                }}>{p.tagline}</div>
              </div>

              <p style={{
                fontSize: 13.5,
                lineHeight: 1.55,
                color: p.bg === '#232452' ? 'rgba(255,255,255,0.65)' : 'rgba(31,36,51,0.6)',
                margin: 0,
              }}>{p.description}</p>

              {/* Bullets */}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.bullets.map((b) => (
                  <li key={b} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 8,
                    fontSize: 13, color: p.bg === '#232452' ? 'rgba(255,255,255,0.8)' : '#1f2433',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#19b8a8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginTop: 2, flexShrink: 0 }}>
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {b}
                  </li>
                ))}
              </ul>

              <Link
                href={p.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13.5,
                  fontWeight: 700,
                  color: p.bg === '#232452' ? '#19b8a8' : '#232452',
                  textDecoration: 'none',
                  marginTop: 'auto',
                }}
              >
                {p.cta}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          ))}
        </div>

        {/* Connection diagram */}
        <div style={{
          background: '#f6f7fb',
          border: '1px solid #eceef3',
          borderRadius: 18,
          padding: '44px 48px',
          display: 'grid',
          gridTemplateColumns: '1fr 1.3fr',
          gap: 64,
          alignItems: 'center',
          marginBottom: 64,
        }}>
          <div>
            <div style={{
              fontSize: 12, fontWeight: 700, letterSpacing: '.1em',
              textTransform: 'uppercase', color: '#19b8a8',
              marginBottom: 16,
            }}>Como conversam</div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 36,
              fontWeight: 400,
              letterSpacing: '-0.022em',
              lineHeight: 1.08,
              margin: '0 0 16px',
              color: '#1f2433',
            }}>
              Pensados juntos<br />desde o primeiro dia.
            </h3>
            <p style={{
              fontSize: 15,
              color: 'rgba(31,36,51,0.6)',
              lineHeight: 1.55,
              margin: 0,
            }}>
              O CRM do Portal usa Dados de Vistos para validar viagens. O ITTD lê o pedido do CRM e gera o roteiro do viajante. Tudo numa única conta, com cobrança unificada.
            </p>
          </div>

          {/* SVG diagram */}
          <div style={{ position: 'relative' }}>
            <svg viewBox="0 0 400 240" style={{ width: '100%' }}>
              <defs>
                <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L10,5 L0,10 z" fill="#19b8a8"/>
                </marker>
              </defs>
              <path d="M120,60 Q200,30 280,60" fill="none" stroke="#19b8a8" strokeWidth="1.5" strokeDasharray="3 4" markerEnd="url(#ar)"/>
              <path d="M280,60 Q330,140 200,200" fill="none" stroke="#19b8a8" strokeWidth="1.5" strokeDasharray="3 4" markerEnd="url(#ar)"/>
              <path d="M200,200 Q60,140 120,60" fill="none" stroke="#19b8a8" strokeWidth="1.5" strokeDasharray="3 4" markerEnd="url(#ar)"/>
              <g>
                <rect x="60" y="32" width="120" height="56" rx="12" fill="#232452"/>
                <text x="120" y="58" fill="#fff" fontFamily="var(--font-display)" fontWeight="500" fontSize="13" textAnchor="middle">NORO Portal</text>
                <text x="120" y="76" fill="#19b8a8" fontFamily="monospace" fontSize="9" letterSpacing="0.08em" textAnchor="middle">APP PRINCIPAL</text>
              </g>
              <g>
                <rect x="220" y="32" width="120" height="56" rx="12" fill="#19b8a8"/>
                <text x="280" y="56" fill="#232452" fontFamily="var(--font-display)" fontWeight="500" fontSize="12" textAnchor="middle">Dados de</text>
                <text x="280" y="70" fill="#232452" fontFamily="var(--font-display)" fontWeight="500" fontSize="12" textAnchor="middle">Vistos</text>
                <text x="280" y="83" fill="#232452" fontFamily="monospace" fontSize="9" letterSpacing="0.08em" textAnchor="middle" opacity="0.7">API</text>
              </g>
              <g>
                <rect x="140" y="174" width="120" height="56" rx="12" fill="#fff" stroke="#dfe2ea" strokeWidth="1.2"/>
                <text x="200" y="200" fill="#232452" fontFamily="var(--font-display)" fontWeight="500" fontSize="13" textAnchor="middle">NORO ITTD</text>
                <text x="200" y="218" fill="#c97a14" fontFamily="monospace" fontSize="9" letterSpacing="0.08em" textAnchor="middle">EM BREVE</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Roadmap */}
        <div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: 30,
            letterSpacing: '-0.022em',
            margin: '0 0 24px',
            color: '#1f2433',
          }}>
            Roadmap público
          </h3>
          <div style={{
            background: '#fff',
            border: '1px solid #eceef3',
            borderRadius: 14,
            overflow: 'hidden',
          }}>
            {ROADMAP.map((r, i) => (
              <div
                key={r.q}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '140px 1.2fr 1fr 110px',
                  padding: '20px 28px',
                  borderTop: i ? '1px solid #eceef3' : 'none',
                  alignItems: 'center',
                  gap: 24,
                }}
              >
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12, fontWeight: 700, letterSpacing: '.08em',
                  color: '#232452',
                }}>{r.q}</div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  fontSize: 17,
                  letterSpacing: '-0.015em',
                  color: '#1f2433',
                }}>{r.title}</div>
                <div style={{
                  fontSize: 13,
                  color: 'rgba(31,36,51,0.55)',
                  lineHeight: 1.45,
                }}>{r.desc}</div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10, fontWeight: 700, letterSpacing: '.08em',
                  padding: '4px 9px', borderRadius: 999,
                  background: r.statusBg, color: r.statusColor,
                  textAlign: 'center',
                  justifySelf: 'end',
                  whiteSpace: 'nowrap',
                }}>● {r.status}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
