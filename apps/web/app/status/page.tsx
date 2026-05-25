import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Status | Noro Guru',
  description: 'Status em tempo real dos serviços do ecossistema Noro Guru.',
};

const SERVICES = [
  { name: 'Core App', icon: '⚙️', status: 'Operacional', uptime: '99.98%', statusColor: '#22c55e' },
  { name: 'API', icon: '📡', status: 'Operacional', uptime: '99.99%', statusColor: '#22c55e' },
  { name: 'Autenticação', icon: '🔐', status: 'Operacional', uptime: '100%', statusColor: '#22c55e' },
  { name: 'Sites CDN', icon: '🌐', status: 'Operacional', uptime: '99.97%', statusColor: '#22c55e' },
  { name: 'Email', icon: '✉️', status: 'Operacional', uptime: '99.95%', statusColor: '#22c55e' },
  { name: 'Pagamentos', icon: '💳', status: 'Operacional', uptime: '99.99%', statusColor: '#22c55e' },
];

const INCIDENTS = [
  {
    date: '2026-05-03',
    title: 'Lentidão na geração de roteiros por IA',
    impact: 'Parcial',
    status: 'Resolvido',
    statusColor: '#22c55e',
    detail: 'Entre 14h e 15h30 (BRT), o módulo de IA Operacional apresentou tempos de resposta elevados (>10s). Causa: pico de uso acima da capacidade. Escalamos automaticamente a infraestrutura.',
  },
  {
    date: '2026-04-18',
    title: 'Falha em webhooks de cobrança PIX',
    impact: 'Crítico',
    status: 'Resolvido',
    statusColor: '#22c55e',
    detail: 'Durante 23 minutos, webhooks de confirmação PIX não foram entregues. Pagamentos não foram perdidos — apenas a notificação automática foi atrasada. Cobranças conciliadas manualmente.',
  },
];

// Generate 90 days of uptime bars (mock)
function generateBars(uptime: string): ('ok' | 'degraded' | 'outage')[] {
  const pct = parseFloat(uptime) / 100;
  return Array.from({ length: 90 }, (_, i) => {
    const r = Math.random();
    if (r > pct) return i % 40 === 0 ? 'outage' : 'degraded';
    return 'ok';
  });
}

const BAR_COLORS = {
  ok: '#22c55e',
  degraded: '#D4AF37',
  outage: '#ef4444',
};

export default function StatusPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>

      {/* Global status banner */}
      <div
        style={{
          background: 'rgba(34,197,94,0.12)',
          borderBottom: '1px solid rgba(34,197,94,0.2)',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>
          ● Todos os sistemas operacionais
        </span>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-mono)', marginLeft: 8 }}>
          Atualizado em {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} BRT
        </span>
      </div>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '60px 24px 48px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 40px)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.03em',
            margin: '0 0 12px',
          }}
        >
          Status dos Serviços
        </h1>
        <p style={{ fontSize: 15, color: '#B8C1E0', margin: 0 }}>
          Monitoramento em tempo real do ecossistema Noro Guru.
        </p>
      </section>

      {/* Services grid */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }} className="grid-cols-1 md:grid-cols-2">
          {SERVICES.map((service) => (
            <div
              key={service.name}
              style={{
                background: '#12152C',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '20px 24px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
              }}
            >
              <span style={{ fontSize: 24, flexShrink: 0 }}>{service.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#E0E3FF', marginBottom: 4 }}>{service.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: service.statusColor,
                      display: 'inline-block',
                      boxShadow: `0 0 0 3px rgba(34,197,94,0.2)`,
                    }}
                  />
                  <span style={{ fontSize: 12, color: service.statusColor, fontWeight: 600 }}>{service.status}</span>
                </div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'var(--font-mono)' }}>{service.uptime}</div>
                <div style={{ fontSize: 10, color: '#B8C1E0', marginTop: 2 }}>uptime 30d</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Uptime histórico */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 64px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 700,
            color: '#fff',
            margin: '0 0 28px',
          }}
        >
          Uptime histórico — 90 dias
        </h2>

        {SERVICES.map((service) => {
          const bars = generateBars(service.uptime);
          return (
            <div
              key={service.name}
              style={{
                marginBottom: 20,
                background: '#12152C',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10,
                padding: '16px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#E0E3FF' }}>{service.name}</span>
                <span style={{ fontSize: 12, color: '#22c55e', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{service.uptime}</span>
              </div>
              <div style={{ display: 'flex', gap: 2, alignItems: 'stretch', height: 24 }}>
                {bars.map((status, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      borderRadius: 2,
                      background: BAR_COLORS[status],
                      opacity: status === 'ok' ? 0.8 : 1,
                      cursor: 'default',
                    }}
                    title={`Dia ${90 - i}: ${status === 'ok' ? 'Operacional' : status === 'degraded' ? 'Degradado' : 'Fora do ar'}`}
                  />
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>90 dias atrás</span>
                <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: 'var(--font-mono)' }}>Hoje</span>
              </div>
            </div>
          );
        })}
      </section>

      {/* Incidentes recentes */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 64px' }}>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 700,
            color: '#fff',
            margin: '0 0 24px',
          }}
        >
          Incidentes recentes
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {INCIDENTS.map((incident, i) => (
            <div
              key={i}
              style={{
                background: '#12152C',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: '20px 24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 10, color: '#B8C1E0', fontFamily: 'var(--font-mono)', marginBottom: 6 }}>
                    {new Date(incident.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#E0E3FF', margin: 0 }}>{incident.title}</h3>
                </div>
                <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: incident.impact === 'Crítico' ? '#ef4444' : '#D4AF37',
                    background: incident.impact === 'Crítico' ? 'rgba(239,68,68,0.1)' : 'rgba(212,175,55,0.1)',
                    borderRadius: 6, padding: '3px 8px',
                  }}>
                    {incident.impact}
                  </span>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: '#22c55e',
                    background: 'rgba(34,197,94,0.1)',
                    borderRadius: 6, padding: '3px 8px',
                  }}>
                    ● {incident.status}
                  </span>
                </div>
              </div>
              <p style={{ fontSize: 13, color: '#B8C1E0', lineHeight: 1.6, margin: 0 }}>
                {incident.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Subscribe */}
      <section
        style={{
          background: '#12152C',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '48px 24px',
          textAlign: 'center',
        }}
      >
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>
          Assinar atualizações de status
        </h3>
        <p style={{ fontSize: 14, color: '#B8C1E0', margin: '0 0 24px' }}>
          Receba alertas por email quando houver incidentes ou manutenções.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', maxWidth: 380, margin: '0 auto' }}>
          <input
            type="email"
            placeholder="seu@email.com.br"
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              padding: '11px 14px',
              fontSize: 14,
              color: '#fff',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <button
            style={{
              background: '#342CA4',
              color: '#fff',
              border: 0,
              borderRadius: 8,
              padding: '11px 20px',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              whiteSpace: 'nowrap',
            }}
          >
            Assinar
          </button>
        </div>
        <Link href="#" style={{ display: 'block', marginTop: 12, fontSize: 13, color: '#B8C1E0', textDecoration: 'none' }}>
          ou via RSS →
        </Link>
      </section>
    </div>
  );
}
