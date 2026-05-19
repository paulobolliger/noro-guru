import React from 'react';

const WHY_ITEMS = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
    title: 'Tudo em um único sistema',
    description:
      'CRM, site, financeiro, roteiros e inbox no mesmo lugar. Sem tabs abertas, sem dados duplicados, sem integração que quebra toda semana.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
    ),
    title: 'Feito para o mercado brasileiro',
    description:
      'PIX integrado, pedidos em reais, termos em português e suporte humano no fuso de Brasília. Não é uma ferramenta americana adaptada — é construída daqui.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    title: 'IA que realmente trabalha',
    description:
      'Roteiros gerados em segundos, respostas de WhatsApp sugeridas pela IA, e insights de vendas automáticos. A IA não é feature extra — está em todo fluxo.',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: 'Setup em menos de 1 hora',
    description:
      'Onboarding guiado, dados do CNPJ pré-preenchidos e templates prontos. Em 60 minutos sua agência está operando — sem implantação, sem consultor.',
  },
];

export default function Values() {
  return (
    <section style={{
      padding: '96px 24px',
      background: '#fff',
    }}>
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>

        {/* Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 64,
          alignItems: 'end',
          marginBottom: 72,
        }}>
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              fontSize: 12, fontWeight: 700, letterSpacing: '.1em',
              textTransform: 'uppercase', color: '#19b8a8',
              marginBottom: 20,
            }}>
              <span style={{ width: 24, height: 1.5, background: '#19b8a8', display: 'inline-block' }} />
              Por que a NORO?
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
              Simples para operar,<br />
              <em style={{ fontStyle: 'italic', color: '#232452' }}>poderoso para crescer.</em>
            </h2>
          </div>

          <div>
            <p style={{
              fontSize: 17,
              lineHeight: 1.6,
              color: 'rgba(31,36,51,0.6)',
              margin: 0,
            }}>
              Enquanto outras ferramentas adicionam complexidade, a NORO foi desenhada para que qualquer agente de viagens — mesmo sem time de TI — opere com profissionalismo de empresa grande.
            </p>
            <div style={{ marginTop: 28 }}>
              <a
                href="https://app.noro.guru"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: '#232452',
                  color: '#fff',
                  borderRadius: 10,
                  padding: '12px 22px',
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: 'none',
                  letterSpacing: '-.01em',
                }}
              >
                Ver demonstração
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 2,
          background: '#eceef3',
          borderRadius: 20,
          overflow: 'hidden',
        }}>
          {WHY_ITEMS.map((item, i) => (
            <div
              key={i}
              style={{
                background: '#fff',
                padding: '36px 32px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              <div style={{
                width: 48, height: 48,
                borderRadius: 12,
                background: '#f6f7fb',
                border: '1px solid #eceef3',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#232452',
              }}>
                {item.icon}
              </div>
              <h3 style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: '-0.015em',
                color: '#1f2433',
                margin: 0,
              }}>
                {item.title}
              </h3>
              <p style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: 'rgba(31,36,51,0.6)',
                margin: 0,
              }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Quote strip */}
        <div style={{
          marginTop: 64,
          background: '#232452',
          borderRadius: 20,
          padding: '48px 56px',
          display: 'flex',
          alignItems: 'center',
          gap: 48,
        }}>
          <div style={{ flex: 1 }}>
            <p style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 'clamp(20px, 2.8vw, 30px)',
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1.3,
              letterSpacing: '-0.015em',
              margin: 0,
            }}>
              &ldquo;Não vendemos software. Entregamos <span style={{ color: '#19b8a8' }}>tempo, clareza e crescimento</span> para agências de viagem brasileiras.&rdquo;
            </p>
            <p style={{
              fontSize: 13,
              color: 'rgba(255,255,255,0.5)',
              marginTop: 16,
              fontFamily: 'var(--font-mono)',
              letterSpacing: '.04em',
            }}>
              — Equipe NORO Guru
            </p>
          </div>
          <div style={{
            flexShrink: 0,
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 16,
          }}>
            {[
              { v: '14 dias', l: 'trial grátis' },
              { v: 'Sem', l: 'contrato anual' },
              { v: '< 1h', l: 'para configurar' },
              { v: 'Suporte', l: 'humano PT-BR' },
            ].map((s) => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 20,
                  fontWeight: 700,
                  color: '#19b8a8',
                  letterSpacing: '-.01em',
                }}>{s.v}</div>
                <div style={{
                  fontSize: 11,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '.04em',
                  textTransform: 'uppercase',
                  marginTop: 3,
                }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
