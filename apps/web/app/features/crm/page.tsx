import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'CRM & Pipeline para Agências de Turismo | Noro Guru',
  description: 'Do lead ao cliente fidelizado. Pipeline visual, follow-ups automáticos e histórico 360° do cliente integrado ao WhatsApp.',
};

const FEATURES = [
  { icon: '📥', title: 'Captação de leads', desc: 'Leads do site, WhatsApp, Instagram e outras fontes entram direto no CRM — sem copiar e colar.' },
  { icon: '🎯', title: 'Pipeline Kanban', desc: 'Funil visual com etapas personalizadas para o ciclo real da venda de viagens. Drag & drop intuitivo.' },
  { icon: '👤', title: 'Hub 360° do cliente', desc: 'Histórico completo: destinos visitados, preferências, viagens passadas, valor de vida e interações.' },
  { icon: '📄', title: 'Orçamentos com IA', desc: 'Gere propostas profissionais em minutos. A IA preenche baseada no perfil e destino do cliente.' },
  { icon: '🔁', title: 'Follow-up automático', desc: 'Sequências de mensagens configuradas por você. O sistema envia no momento certo, pelo canal certo.' },
  { icon: '📊', title: 'Relatórios de conversão', desc: 'Taxa de conversão por consultor, canal e destino. Saiba onde estão as oportunidades de melhoria.' },
];

const METRICS = [
  { value: '+35%', label: 'Velocidade de resposta a leads' },
  { value: '+28%', label: 'Taxa de conversão média' },
  { value: '-60%', label: 'Tempo para gerar uma proposta' },
  { value: '0', label: 'Leads perdidos por esquecimento' },
];

export default function CrmFeaturePage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg,#0D1526 0%,#0B1220 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '96px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '30%', transform: 'translate(-50%,-50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(52,44,164,0.2) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', position: 'relative' }}>
          <div>
            <Link href="/features" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 24 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Funcionalidades
            </Link>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#342CA4', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>CRM & Pipeline</div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 18px' }}>
              Do lead ao cliente fidelizado, sem deixar nada cair
            </h1>
            <p style={{ fontSize: 17, color: '#B8C1E0', lineHeight: 1.65, margin: '0 0 32px' }}>
              O pipeline visual da Noro Guru foi criado para o ciclo real de vendas de viagens — não para software genérico. Cada etapa, cada cliente, cada follow-up, em um lugar só.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#342CA4', color: '#fff', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>Agendar demo →</Link>
              <Link href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: '#E0E3FF', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '13px 20px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Ver planos</Link>
            </div>
          </div>
          {/* Kanban mockup */}
          <div style={{ background: '#12152C', border: '1px solid rgba(52,44,164,0.3)', borderRadius: 16, padding: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#342CA4', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>PIPELINE · MAIO 2026</div>
            {[
              { stage: 'Novos leads', count: 8, color: '#B8C1E0' },
              { stage: 'Qualificados', count: 5, color: '#342CA4' },
              { stage: 'Proposta enviada', count: 3, color: '#D4AF37' },
              { stage: 'Fechamento', count: 2, color: '#1DD3C0' },
            ].map((col) => (
              <div key={col.stage} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#D1D5F0' }}>{col.stage}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: col.color, background: `${col.color}20`, padding: '2px 10px', borderRadius: 999 }}>{col.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px 96px' }}>
        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', marginBottom: 80 }}>
          {METRICS.map((m) => (
            <div key={m.label} style={{ background: '#12152C', padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: '#342CA4', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>{m.value}</div>
              <div style={{ fontSize: 13, color: '#B8C1E0', lineHeight: 1.4 }}>{m.label}</div>
            </div>
          ))}
        </div>
        {/* Features */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 32px', textAlign: 'center' }}>Tudo que o CRM precisa ter</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20, marginBottom: 80 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#B8C1E0', margin: 0, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
        {/* Quote */}
        <div style={{ background: 'rgba(52,44,164,0.1)', border: '1px solid rgba(52,44,164,0.25)', borderRadius: 14, padding: '32px 40px', textAlign: 'center', marginBottom: 80 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontStyle: 'italic', color: '#E0E3FF', lineHeight: 1.6, margin: '0 0 12px' }}>&ldquo;Em 3 semanas, nossa taxa de follow-up subiu de 40% para 95%. O CRM simplesmente não deixa nada cair.&rdquo;</p>
          <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0 }}>— Carlos Mendes · Destinos do Mundo, RJ</p>
        </div>
        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg,rgba(52,44,164,0.2) 0%,rgba(29,211,192,0.08) 100%)', border: '1px solid rgba(52,44,164,0.3)', borderRadius: 16, padding: '48px 40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 12px' }}>Comece a organizar sua operação</h2>
          <p style={{ fontSize: 15, color: '#B8C1E0', margin: '0 0 28px', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>Setup em 2 semanas. Migração de dados incluída.</p>
          <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#342CA4', color: '#fff', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>Agendar demonstração →</Link>
        </div>
      </div>
    </div>
  );
}
