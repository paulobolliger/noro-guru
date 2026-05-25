import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Changelog | Noro Guru',
  description: 'O que há de novo no Noro Guru. Atualizações, melhorias e correções de todos os apps do ecossistema.',
};

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  'Nova funcionalidade': { bg: 'rgba(29,211,192,0.15)', color: '#1DD3C0' },
  'Melhoria': { bg: 'rgba(52,44,164,0.15)', color: '#9B8FF0' },
  'Correção': { bg: 'rgba(239,68,68,0.12)', color: '#FCA5A5' },
  'Breaking': { bg: 'rgba(212,175,55,0.12)', color: '#D4AF37' },
};

const APP_COLORS: Record<string, string> = {
  'Core': '#1DD3C0',
  'Control': '#D4AF37',
  'Sites': '#342CA4',
  'Visa': '#9B8FF0',
  'API': '#B8C1E0',
};

const ENTRIES = [
  {
    date: '2026-05-20',
    version: 'v2.5.0',
    type: 'Nova funcionalidade',
    title: 'IA Operacional v2 — geração de roteiros com contexto do cliente',
    desc: 'O módulo de IA agora usa o histórico de viagens do cliente para gerar roteiros personalizados. Suporte a prompts em português com templates por destino.',
    apps: ['Core'],
  },
  {
    date: '2026-05-14',
    version: 'v2.4.3',
    type: 'Melhoria',
    title: 'Inbox omnichannel — filtros avançados e busca por período',
    desc: 'Agora você pode filtrar mensagens por canal (WhatsApp, Instagram, email), status, consultor responsável e intervalo de datas. Exportação em CSV disponível.',
    apps: ['Core'],
  },
  {
    date: '2026-05-08',
    version: 'v2.4.2',
    type: 'Correção',
    title: 'Fix: cobranças PIX duplicadas em pedidos com split de pagamento',
    desc: 'Corrigido bug que gerava duas cobranças PIX quando um pedido tinha split entre múltiplos clientes. Todos os casos afetados foram revertidos automaticamente.',
    apps: ['Core'],
  },
  {
    date: '2026-04-30',
    version: 'v1.8.0',
    type: 'Nova funcionalidade',
    title: 'Builder Sites — suporte a páginas de destino personalizadas',
    desc: 'Agências agora podem criar landing pages por destino, com galeria de fotos, itinerário resumido e formulário de cotação integrado ao CRM.',
    apps: ['Sites'],
  },
  {
    date: '2026-04-22',
    version: 'v2.4.0',
    type: 'Nova funcionalidade',
    title: 'Dashboard financeiro — projeção de receita por mês',
    desc: 'Nova visualização de projeção de receita baseada em pedidos em andamento. Inclui gráfico de barras com comparativo mensal e alerta de sazonalidade.',
    apps: ['Core'],
  },
  {
    date: '2026-04-15',
    version: 'v1.2.0',
    type: 'Melhoria',
    title: 'Visa API — cobertura expandida para +40 novos países',
    desc: 'Adicionados requisitos de visto para Azerbaijão, Cazaquistão, Uzbequistão e mais 37 países. Base agora cobre 240+ combinações de nacionalidade × destino.',
    apps: ['Visa'],
  },
  {
    date: '2026-04-05',
    version: 'v1.5.0',
    type: 'Nova funcionalidade',
    title: 'Control — painel de feature flags por tenant',
    desc: 'Administradores Noro agora podem ativar e desativar funcionalidades por tenant sem deploy. Suporte a rollout gradual por percentual de usuários.',
    apps: ['Control'],
  },
];

export default function ChangelogPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 24px 56px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 48px)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: '0 0 16px',
          }}
        >
          O que há de novo no Noro Guru
        </h1>
        <p style={{ fontSize: 16, color: '#B8C1E0', margin: '0 0 24px' }}>
          Atualizações, melhorias e novidades de todos os apps do ecossistema.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            href="#"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#B8C1E0',
              textDecoration: 'none',
              padding: '8px 16px',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
            }}
          >
            📡 RSS Feed
          </Link>
          <button
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: '#B8C1E0',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              padding: '8px 16px',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            ✉️ Assinar por email
          </button>
        </div>
      </section>

      {/* Filters */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 40px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#B8C1E0', alignSelf: 'center', marginRight: 4 }}>Tipo:</span>
          {['Todos', 'Nova funcionalidade', 'Melhoria', 'Correção', 'Breaking'].map((t) => (
            <span
              key={t}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: t === 'Todos' ? '#fff' : (TYPE_COLORS[t]?.color || '#B8C1E0'),
                background: t === 'Todos' ? 'rgba(255,255,255,0.1)' : (TYPE_COLORS[t]?.bg || 'rgba(255,255,255,0.06)'),
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 999,
                padding: '4px 12px',
                cursor: 'pointer',
              }}
            >
              {t}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#B8C1E0', alignSelf: 'center', marginRight: 4 }}>App:</span>
          {['Todos', 'Core', 'Control', 'Sites', 'Visa', 'API'].map((app) => (
            <span
              key={app}
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: app === 'Todos' ? '#fff' : (APP_COLORS[app] || '#B8C1E0'),
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 999,
                padding: '4px 12px',
                cursor: 'pointer',
              }}
            >
              {app}
            </span>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 96px', position: 'relative' }}>
        {/* Vertical line */}
        <div
          style={{
            position: 'absolute',
            left: 48,
            top: 0,
            bottom: 0,
            width: 1,
            background: 'rgba(52,44,164,0.3)',
          }}
        />

        {ENTRIES.map((entry, i) => (
          <div
            key={i}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 1fr',
              gap: 24,
              marginBottom: 40,
              position: 'relative',
            }}
          >
            {/* Date column */}
            <div style={{ paddingTop: 4, textAlign: 'right' }}>
              <div style={{ fontSize: 11, color: '#B8C1E0', fontFamily: 'var(--font-mono)', lineHeight: 1.4 }}>
                {new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </div>
            </div>

            {/* Dot */}
            <div
              style={{
                position: 'absolute',
                left: 42,
                top: 8,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#342CA4',
                border: '2px solid #0B1220',
              }}
            />

            {/* Card */}
            <div
              style={{
                background: '#12152C',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12,
                padding: 24,
                marginLeft: 16,
              }}
            >
              {/* Header badges */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.5)',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 6,
                    padding: '2px 8px',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {entry.version}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: TYPE_COLORS[entry.type]?.color || '#B8C1E0',
                    background: TYPE_COLORS[entry.type]?.bg || 'rgba(255,255,255,0.06)',
                    borderRadius: 6,
                    padding: '2px 8px',
                  }}
                >
                  {entry.type}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 16,
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '-0.01em',
                  lineHeight: 1.3,
                  margin: '0 0 10px',
                }}
              >
                {entry.title}
              </h3>

              <p style={{ fontSize: 13.5, color: '#B8C1E0', lineHeight: 1.6, margin: '0 0 16px' }}>
                {entry.desc}
              </p>

              {/* App chips */}
              <div style={{ display: 'flex', gap: 6 }}>
                {entry.apps.map((app) => (
                  <span
                    key={app}
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: APP_COLORS[app] || '#B8C1E0',
                      background: `rgba(${APP_COLORS[app] ? '0,0,0' : '255,255,255'},0.0)`,
                      border: `1px solid ${APP_COLORS[app] || 'rgba(255,255,255,0.1)'}`,
                      borderRadius: 4,
                      padding: '2px 8px',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
