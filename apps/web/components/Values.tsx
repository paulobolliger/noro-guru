'use client';

import React from 'react';

// "Problema/Solução" section — 3 cards Before/After
const BEFORE_AFTER = [
  {
    before: { icon: '❌', text: 'Planilhas espalhadas, dados duplicados, impossível saber o status de cada cliente.' },
    after: { icon: '✅', text: 'CRM centralizado com funil visual e histórico completo de cada lead.' },
    title: 'Organização',
  },
  {
    before: { icon: '❌', text: 'WhatsApp no celular pessoal, sem histórico, sem controle, sem equipe.' },
    after: { icon: '✅', text: 'Inbox omnichannel com WhatsApp, email e Instagram em uma única tela.' },
    title: 'Comunicação',
  },
  {
    before: { icon: '❌', text: 'Cobrança manual, PIX sem conciliação, comissões calculadas no papel.' },
    after: { icon: '✅', text: 'Financeiro automatizado com PIX integrado e relatórios em tempo real.' },
    title: 'Financeiro',
  },
];

export default function Values() {
  return (
    <>
      {/* ── Problema/Solução ──────────────────────────────────────────── */}
      <section
        style={{
          background: '#12152C',
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
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(28px, 4vw, 40px)',
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                margin: '0 auto',
              }}
            >
              Chega de ferramentas separadas.
            </h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 24,
            }}
            className="grid-cols-1 md:grid-cols-3"
          >
            {BEFORE_AFTER.map((item) => (
              <div
                key={item.title}
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 16,
                  overflow: 'hidden',
                }}
              >
                {/* Before */}
                <div
                  style={{
                    padding: '20px 24px',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    background: 'rgba(239,68,68,0.05)',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(239,68,68,0.7)', marginBottom: 10 }}>
                    Antes
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>{item.before.icon}</span>
                    <p style={{ fontSize: 13.5, color: '#B8C1E0', lineHeight: 1.5, margin: 0 }}>
                      {item.before.text}
                    </p>
                  </div>
                </div>

                {/* After */}
                <div
                  style={{
                    padding: '20px 24px',
                    background: 'rgba(29,211,192,0.04)',
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(29,211,192,0.7)', marginBottom: 10 }}>
                    Com Noro Guru
                  </div>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 16, flexShrink: 0, marginTop: 2 }}>{item.after.icon}</span>
                    <p style={{ fontSize: 13.5, color: '#D1D5F0', lineHeight: 1.5, margin: 0 }}>
                      {item.after.text}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Noro strip ────────────────────────────────────────────── */}
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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 64,
              alignItems: 'center',
            }}
            className="grid-cols-1 md:grid-cols-2"
          >
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1DD3C0', marginBottom: 20 }}>
                Por que a Noro?
              </div>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(28px, 3.5vw, 44px)',
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '-0.03em',
                  lineHeight: 1.15,
                  margin: '0 0 24px',
                }}
              >
                Simples para operar,{' '}
                <span
                  style={{
                    background: 'linear-gradient(90deg, #342CA4, #1DD3C0)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  poderoso para crescer.
                </span>
              </h2>
              <p style={{ fontSize: 16, color: '#B8C1E0', lineHeight: 1.65, margin: 0 }}>
                Enquanto outras ferramentas adicionam complexidade, a Noro foi desenhada para que qualquer agente de viagens — mesmo sem time de TI — opere com profissionalismo de empresa grande.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
              }}
            >
              {[
                { icon: '🚀', title: 'Setup em < 1 hora', desc: 'Onboarding guiado, CNPJ pré-preenchido, templates prontos.' },
                { icon: '🇧🇷', title: 'Feito para o Brasil', desc: 'PIX integrado, suporte em PT-BR, dados no Brasil.' },
                { icon: '🤖', title: 'IA em todo fluxo', desc: 'Roteiros, propostas e automações em segundos.' },
                { icon: '🔗', title: 'Tudo integrado', desc: 'Sem integrações quebradas. Um ecossistema coeso.' },
              ].map((card) => (
                <div
                  key={card.title}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: 12,
                    padding: '20px',
                  }}
                >
                  <div style={{ fontSize: 24, marginBottom: 12 }}>{card.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#E0E3FF', marginBottom: 6 }}>{card.title}</div>
                  <div style={{ fontSize: 13, color: '#B8C1E0', lineHeight: 1.5 }}>{card.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
