import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'SLA — Acordo de Nível de Serviço | Noro Guru',
  description: 'Compromissos de disponibilidade, tempo de resposta e suporte para cada plano Noro Guru.',
};

const PLANS = ['Starter', 'Profissional', 'Agência'];

const SLA_TABLE = [
  {
    category: 'Disponibilidade',
    rows: [
      { metric: 'Uptime mensal garantido', values: ['99,5%', '99,7%', '99,9%'] },
      { metric: 'Janela de manutenção programada', values: ['Domingos 2h–4h', 'Domingos 2h–4h', 'Aviso 72h antes'] },
      { metric: 'Compensação por violação de SLA', values: ['—', 'Crédito proporcional', 'Crédito + extensão'] },
    ],
  },
  {
    category: 'Suporte',
    rows: [
      { metric: 'Canal de suporte', values: ['Email + Chat', 'Email + Chat + WhatsApp', 'Gerente dedicado'] },
      { metric: 'Tempo de primeira resposta', values: ['< 24h', '< 8h', '< 2h'] },
      { metric: 'Tempo de resolução (crítico)', values: ['< 72h', '< 24h', '< 4h'] },
      { metric: 'Horário de atendimento', values: ['8h–18h seg–sex', '8h–20h seg–sáb', '24/7'] },
    ],
  },
  {
    category: 'Dados',
    rows: [
      { metric: 'Backup automático', values: ['Diário', 'Diário', 'A cada 6 horas'] },
      { metric: 'Retenção de backup', values: ['7 dias', '30 dias', '90 dias'] },
      { metric: 'RTO (Recovery Time Objective)', values: ['< 12h', '< 4h', '< 1h'] },
      { metric: 'RPO (Recovery Point Objective)', values: ['< 24h', '< 6h', '< 6h'] },
    ],
  },
  {
    category: 'Incidentes',
    rows: [
      { metric: 'Notificação de incidente P0', values: ['Página de status', 'Email + WhatsApp', 'Ligação + Email'] },
      { metric: 'Post-mortem compartilhado', values: ['—', 'Sob solicitação', 'Automático em 48h'] },
      { metric: 'Acesso à página de status', values: ['✓', '✓', '✓'] },
    ],
  },
];

const PRIORITY_LEVELS = [
  { p: 'P0', label: 'Crítico', color: '#ef4444', desc: 'Plataforma fora do ar ou perda de dados em produção', response: '30min', resolution: '4h' },
  { p: 'P1', label: 'Alto', color: '#f59e0b', desc: 'Funcionalidade principal indisponível, sem workaround', response: '2h', resolution: '24h' },
  { p: 'P2', label: 'Médio', color: '#342CA4', desc: 'Funcionalidade degradada, workaround disponível', response: '8h', resolution: '72h' },
  { p: 'P3', label: 'Baixo', color: '#1DD3C0', desc: 'Dúvidas, melhorias e solicitações não urgentes', response: '24h', resolution: 'Próximo sprint' },
];

export default function SlaPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg,#0D1526 0%,#0B1220 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '80px 24px 60px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link href="/seguranca" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 24 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Confiabilidade
          </Link>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#1DD3C0', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>SLA · Service Level Agreement</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 16px' }}>
            Nossos compromissos com você
          </h1>
          <p style={{ fontSize: 16, color: '#B8C1E0', lineHeight: 1.65, margin: '0 0 8px', maxWidth: 640 }}>
            Acordos de disponibilidade, suporte e recuperação de dados para cada plano. Transparência total sobre o que você pode esperar.
          </p>
          <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0 }}>Última revisão: maio de 2026 · Vigência: 30 dias após publicação</p>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px 96px' }}>
        {/* Uptime banner */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', marginBottom: 64 }}>
          {[
            { v: '99,9%', l: 'Uptime · Agência', sub: 'meta mensal' },
            { v: '99,97%', l: 'Uptime atual (30 dias)', sub: 'verificado em noro.guru/status' },
            { v: '< 2h', l: 'Resposta P0 · Agência', sub: 'qualquer hora do dia' },
          ].map((m) => (
            <div key={m.l} style={{ background: '#12152C', padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: '#1DD3C0', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 6 }}>{m.v}</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#D1D5F0', marginBottom: 4 }}>{m.l}</div>
              <div style={{ fontSize: 11, color: '#B8C1E0' }}>{m.sub}</div>
            </div>
          ))}
        </div>

        {/* SLA Table by plan */}
        {SLA_TABLE.map((section) => (
          <div key={section.category} style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>{section.category}</h2>
            <div style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
              {/* Header */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 0, padding: '12px 20px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#B8C1E0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Métrica</span>
                {PLANS.map((p) => (
                  <span key={p} style={{ fontSize: 11, fontWeight: 700, color: '#B8C1E0', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'center' }}>{p}</span>
                ))}
              </div>
              {section.rows.map((row, i) => (
                <div key={row.metric} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 0, padding: '14px 20px', borderBottom: i < section.rows.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: '#D1D5F0' }}>{row.metric}</span>
                  {row.values.map((v, vi) => (
                    <span key={vi} style={{ fontSize: 13, color: v === '—' ? '#4B5578' : v === '✓' ? '#1DD3C0' : '#fff', textAlign: 'center', fontWeight: v !== '—' && v !== '✓' ? 600 : 400 }}>{v}</span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Priority levels */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>Níveis de prioridade de incidentes</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16, marginBottom: 64 }}>
          {PRIORITY_LEVELS.map((pl) => (
            <div key={pl.p} style={{ background: '#12152C', border: `1px solid ${pl.color}30`, borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: pl.color, background: `${pl.color}15`, padding: '2px 8px', borderRadius: 6 }}>{pl.p}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{pl.label}</span>
              </div>
              <p style={{ fontSize: 12, color: '#B8C1E0', lineHeight: 1.5, margin: '0 0 12px' }}>{pl.desc}</p>
              <div style={{ fontSize: 11, color: '#B8C1E0' }}>
                <div>Resp. inicial: <strong style={{ color: pl.color }}>{pl.response}</strong></div>
                <div>Resolução: <strong style={{ color: '#D1D5F0' }}>{pl.resolution}</strong></div>
              </div>
            </div>
          ))}
        </div>

        {/* Compensation */}
        <div style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 32, marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>Compensação por violação de SLA</h2>
          <p style={{ fontSize: 14, color: '#B8C1E0', lineHeight: 1.7, margin: '0 0 16px' }}>
            Se o uptime mensal ficar abaixo da meta contratada (planos Profissional e Agência), você recebe crédito automático proporcional ao tempo de indisponibilidade, calculado sobre o valor da mensalidade vigente.
          </p>
          <p style={{ fontSize: 14, color: '#B8C1E0', lineHeight: 1.7, margin: 0 }}>
            Créditos são aplicados na próxima fatura. Não se acumulam e não são convertidos em dinheiro. Não se aplicam a manutenções programadas comunicadas com antecedência mínima de 48 horas.
          </p>
        </div>

        {/* Footer links */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32, display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <Link href="/seguranca" style={{ color: '#1DD3C0', fontSize: 13, textDecoration: 'none' }}>Política de Segurança →</Link>
          <Link href="/privacidade" style={{ color: '#B8C1E0', fontSize: 13, textDecoration: 'none' }}>Política de Privacidade →</Link>
          <Link href="/termos" style={{ color: '#B8C1E0', fontSize: 13, textDecoration: 'none' }}>Termos de Uso →</Link>
          <a href="https://status.noro.guru" target="_blank" rel="noopener noreferrer" style={{ color: '#B8C1E0', fontSize: 13, textDecoration: 'none' }}>Status da plataforma ↗</a>
        </div>
      </div>
    </div>
  );
}
