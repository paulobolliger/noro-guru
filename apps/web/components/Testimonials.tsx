'use client';

import React, { useState } from 'react';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Renata Aguiar',
    role: 'Sócia-fundadora',
    company: 'Wanderlust Turismo',
    city: 'São Paulo',
    avatar: 'RA',
    color: '#232452',
    quote:
      'Antes da NORO eu usava planilha, WhatsApp e um sistema de emissão separado. Hoje tudo fica em um lugar. Meu time de 4 pessoas opera como um time de 10.',
  },
  {
    id: 2,
    name: 'Carlos Mendes',
    role: 'Diretor Comercial',
    company: 'Horizonte Viagens',
    city: 'Belo Horizonte',
    avatar: 'CM',
    color: '#19b8a8',
    quote:
      'O CRM com funil de vendas mudou como a gente acompanha leads. Taxa de conversão subiu 38% em dois meses. Vale cada real do plano Pro.',
  },
  {
    id: 3,
    name: 'Juliana Fonseca',
    role: 'CEO',
    company: 'Trilha & Sonho',
    city: 'Curitiba',
    avatar: 'JF',
    color: '#7c3aed',
    quote:
      'O módulo de site é o que mais me surpreendeu. Lancei meu site em um fim de semana, com domínio próprio e tudo integrado ao CRM. Sem precisar contratar ninguém.',
  },
  {
    id: 4,
    name: 'Diego Rocha',
    role: 'Agente de Viagens',
    company: 'Mundo Afora',
    city: 'Porto Alegre',
    avatar: 'DR',
    color: '#0f766e',
    quote:
      'A geração de roteiros por IA economiza umas 3 horas por pedido. O cliente recebe um roteiro bonito e eu foco em fechar mais vendas.',
  },
  {
    id: 5,
    name: 'Priscila Lima',
    role: 'Proprietária',
    company: 'Sol & Mar Turismo',
    city: 'Fortaleza',
    avatar: 'PL',
    color: '#b45309',
    quote:
      'Cobrança via PIX integrada ao pedido foi um divisor de águas. Antes esquecia de marcar quem pagou. Hoje o sistema avisa automaticamente.',
  },
  {
    id: 6,
    name: 'André Bassetto',
    role: 'Co-founder',
    company: 'Atlas Experiências',
    city: 'Rio de Janeiro',
    avatar: 'AB',
    color: '#232452',
    quote:
      'Migrei de um sistema caro e travado. Em 2 dias já estava operando na NORO. Suporte respondeu em menos de 1h durante o onboarding.',
  },
];

const STATS = [
  { value: '+2.400', label: 'Agências ativas' },
  { value: 'R$ 18M', label: 'Em pedidos/mês' },
  { value: '4.9/5', label: 'Nota no G2' },
  { value: '98%', label: 'Uptime garantido' },
];

export default function Testimonials() {
  const [focused, setFocused] = useState<number | null>(null);

  return (
    <section style={{
      padding: '96px 24px',
      background: '#f6f7fb',
    }}>
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: '#fff',
            border: '1px solid #eceef3',
            borderRadius: 999,
            padding: '6px 14px',
            fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
            color: '#232452',
            marginBottom: 24,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#19b8a8', display: 'inline-block' }} />
            O que os clientes dizem
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 4.5vw, 54px)',
            fontWeight: 400,
            letterSpacing: '-0.025em',
            lineHeight: 1.06,
            color: '#1f2433',
            margin: '0 0 18px',
          }}>
            Agências que cresceram<br />
            <em style={{ fontStyle: 'italic', color: '#19b8a8' }}>com a NORO.</em>
          </h2>

          <p style={{
            fontSize: 17,
            color: 'rgba(31,36,51,0.6)',
            maxWidth: 520,
            margin: '0 auto',
            lineHeight: 1.55,
          }}>
            Mais de 2.400 agências de viagem brasileiras confiam na plataforma para vender, operar e crescer.
          </p>
        </div>

        {/* Stats bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 1,
          background: '#eceef3',
          borderRadius: 16,
          overflow: 'hidden',
          marginBottom: 64,
        }}>
          {STATS.map((s) => (
            <div key={s.label} style={{
              background: '#fff',
              padding: '28px 24px',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 28,
                fontWeight: 700,
                color: '#232452',
                letterSpacing: '-0.01em',
              }}>{s.value}</div>
              <div style={{
                fontSize: 12,
                color: 'rgba(31,36,51,0.55)',
                marginTop: 4,
                letterSpacing: '.04em',
                textTransform: 'uppercase',
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: 16,
        }}>
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              onMouseEnter={() => setFocused(t.id)}
              onMouseLeave={() => setFocused(null)}
              style={{
                background: '#fff',
                borderRadius: 16,
                border: `1px solid ${focused === t.id ? '#dfe2ea' : '#eceef3'}`,
                padding: '28px 28px 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                transition: 'box-shadow .15s, border-color .15s',
                boxShadow: focused === t.id ? '0 8px 32px -8px rgba(35,36,82,.12)' : 'none',
                cursor: 'default',
              }}
            >
              {/* Stars */}
              <div style={{ display: 'flex', gap: 3 }}>
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill="#f59e0b">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p style={{
                fontSize: 14.5,
                lineHeight: 1.6,
                color: '#1f2433',
                margin: 0,
                flex: 1,
              }}>
                &ldquo;{t.quote}&rdquo;
              </p>

              {/* Person */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                paddingTop: 16,
                borderTop: '1px solid #eceef3',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: t.color,
                  color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, letterSpacing: '.04em',
                  flexShrink: 0,
                }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: '#1f2433' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(31,36,51,0.55)', marginTop: 1 }}>
                    {t.role} · {t.company}
                  </div>
                </div>
                <div style={{
                  marginLeft: 'auto',
                  fontSize: 11,
                  fontFamily: 'var(--font-mono)',
                  color: 'rgba(31,36,51,0.4)',
                }}>
                  {t.city}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          textAlign: 'center',
          marginTop: 56,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{
            display: 'flex',
          }}>
            {['#f59e0b', '#ec4899', '#06b6d4', '#7c3aed', '#22c55e'].map((c, i) => (
              <div key={i} style={{
                width: 32, height: 32,
                borderRadius: '50%',
                background: c,
                border: '2px solid #f6f7fb',
                marginLeft: i ? -10 : 0,
              }} />
            ))}
          </div>
          <p style={{ fontSize: 14, color: 'rgba(31,36,51,0.6)', margin: 0 }}>
            <strong style={{ color: '#1f2433' }}>+2.400 agências</strong> já usam a NORO Guru.{' '}
            <a href="https://app.noro.guru" style={{ color: '#232452', fontWeight: 600, textDecoration: 'none' }}>
              Junte-se a elas →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
