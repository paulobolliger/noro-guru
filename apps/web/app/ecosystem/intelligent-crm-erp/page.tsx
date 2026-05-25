import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Noro Core — CRM & ERP para Agências | Noro Guru',
  description: 'O CRM e ERP inteligente criado especificamente para agências de turismo. Gestão de leads, financeiro, IA e muito mais em um só lugar.',
};

const FEATURES = [
  { icon: '🎯', title: 'Pipeline de Vendas', desc: 'Kanban visual com etapas personalizadas para o ciclo real de venda de viagens. Nunca perca um lead.' },
  { icon: '💰', title: 'Financeiro Integrado', desc: 'Orçamentos, contas a pagar/receber e comissões conectados ao CRM. Sem planilhas paralelas.' },
  { icon: '💬', title: 'Atendimento Omnichannel', desc: 'Inbox unificado com WhatsApp, e-mail e outros canais. Tudo em um só lugar, por cliente.' },
  { icon: '🤖', title: 'IA Operacional', desc: 'Geração de propostas, roteiros e follow-ups automatizados. A IA trabalha nos bastidores.' },
  { icon: '📊', title: 'Relatórios & Analytics', desc: 'Dashboard financeiro, funil de conversão e indicadores de desempenho em tempo real.' },
  { icon: '👥', title: 'Multiusuário', desc: 'Controle de acesso por papel (admin, consultor, financeiro). Cada um vê o que precisa.' },
];

const PROBLEMS = [
  { before: 'Leads espalhados no WhatsApp pessoal', after: 'Inbox unificado com histórico completo' },
  { before: 'Orçamentos perdidos em e-mails e planilhas', after: 'Propostas geradas e rastreadas no CRM' },
  { before: 'Comissões calculadas na mão, mês a mês', after: 'Cálculo automático integrado ao financeiro' },
  { before: 'Decisões baseadas em achismo', after: 'Dashboard com dados reais em tempo real' },
];

export default function NoroCoreEcosystemPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>

      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0D1526 0%, #0B1220 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '96px 24px 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 700,
            height: 500,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(52,44,164,0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <Link href="/ecosystem" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 32 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Ecossistema
          </Link>

          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: 'rgba(52,44,164,0.2)',
              border: '1px solid rgba(52,44,164,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              margin: '0 auto 24px',
            }}
          >
            🏗️
          </div>

          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#342CA4',
              fontFamily: 'var(--font-mono)',
              marginBottom: 16,
            }}
          >
            Noro Core
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 5vw, 52px)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 0 20px',
            }}
          >
            O CRM/ERP feito para a<br />
            <span style={{ color: '#342CA4' }}>realidade das agências</span>
          </h1>

          <p style={{ fontSize: 18, color: '#B8C1E0', lineHeight: 1.65, margin: '0 0 40px', maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
            Não é um software genérico adaptado ao turismo. Foi pensado desde o início para esse setor — com o ciclo real de vendas, o vocabulário e os problemas específicos das agências.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/demo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#342CA4',
                color: '#fff',
                borderRadius: 10,
                padding: '13px 28px',
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              Agendar demo gratuita →
            </Link>
            <Link
              href="/pricing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.07)',
                color: '#E0E3FF',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10,
                padding: '13px 24px',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Ver planos
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px 96px' }}>

        {/* Problem vs Solution */}
        <div style={{ marginBottom: 96 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
              margin: '0 0 8px',
              textAlign: 'center',
            }}
          >
            Chega de gambiarras
          </h2>
          <p style={{ fontSize: 16, color: '#B8C1E0', textAlign: 'center', margin: '0 0 40px' }}>
            O Noro Core resolve os problemas reais do dia a dia da agência.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {PROBLEMS.map((p, i) => (
              <div
                key={i}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto 1fr',
                  gap: 16,
                  alignItems: 'center',
                  background: '#12152C',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 10,
                  padding: '18px 24px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#ef4444', fontSize: 16, flexShrink: 0 }}>✗</span>
                  <span style={{ fontSize: 14, color: '#B8C1E0', textDecoration: 'line-through' }}>{p.before}</span>
                </div>
                <span style={{ fontSize: 18, color: '#342CA4', flexShrink: 0 }}>→</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#1DD3C0', fontSize: 16, flexShrink: 0 }}>✓</span>
                  <span style={{ fontSize: 14, color: '#E0E3FF', fontWeight: 600 }}>{p.after}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 96 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
              margin: '0 0 32px',
              textAlign: 'center',
            }}
          >
            Tudo que a agência precisa, integrado
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  background: '#12152C',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: 28,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 17,
                    fontWeight: 700,
                    color: '#fff',
                    margin: '0 0 8px',
                  }}
                >
                  {f.title}
                </h3>
                <p style={{ fontSize: 14, color: '#B8C1E0', margin: 0, lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div
          style={{
            background: 'rgba(52,44,164,0.1)',
            border: '1px solid rgba(52,44,164,0.3)',
            borderRadius: 16,
            padding: '40px 48px',
            textAlign: 'center',
            marginBottom: 96,
          }}
        >
          <blockquote
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontStyle: 'italic',
              color: '#E0E3FF',
              lineHeight: 1.6,
              margin: '0 0 16px',
            }}
          >
            &ldquo;O Noro Core não substitui o agente. Ele organiza o negócio para que o agente possa vender melhor.&rdquo;
          </blockquote>
          <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0 }}>— Paulo Bolliger, CEO Noro Guru</p>
        </div>

        {/* CTA final */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(52,44,164,0.2) 0%, rgba(29,211,192,0.08) 100%)',
            border: '1px solid rgba(52,44,164,0.3)',
            borderRadius: 16,
            padding: '56px 40px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 32,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
              margin: '0 0 12px',
            }}
          >
            Comece a usar o Noro Core
          </h2>
          <p style={{ fontSize: 16, color: '#B8C1E0', margin: '0 0 32px', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Setup em menos de 2 semanas. Migração de dados incluída. Suporte dedicado para os primeiros 30 dias.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#342CA4', color: '#fff', borderRadius: 10, padding: '14px 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
              Quero uma demo →
            </Link>
            <Link href="/ecosystem" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: '#E0E3FF', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '14px 24px', fontSize: 16, fontWeight: 600, textDecoration: 'none' }}>
              Ver ecossistema completo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
