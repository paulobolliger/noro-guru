import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Noro Control — Gestão Multi-Agência | Noro Guru',
  description: 'Painel de controle para franquias e redes de agências. Consolide operações, monitore performance e gerencie múltiplas unidades em um lugar.',
};

const FEATURES = [
  { icon: '🏢', title: 'Visão consolidada', desc: 'Dashboard com performance de todas as unidades da rede em tempo real. Um login, tudo visível.' },
  { icon: '👥', title: 'Gestão de usuários', desc: 'Controle de permissões granular por unidade. Defina quem vê o quê em cada filial.' },
  { icon: '📊', title: 'Relatórios comparativos', desc: 'Ranking de consultores, comparação entre unidades, metas e desvios — tudo automatizado.' },
  { icon: '🔧', title: 'Configurações centralizadas', desc: 'Atualize templates de proposta, regras de SLA e comissões para toda a rede de uma vez.' },
  { icon: '🔗', title: 'APIs de integração', desc: 'Conecte sistemas legados, ERPs externos e ferramentas de BI via API documentada.' },
  { icon: '🛡️', title: 'Auditoria e compliance', desc: 'Log completo de ações por usuário. Rastreabilidade total para auditorias internas.' },
];

const METRICS = [
  { v: '50+', l: 'Unidades por rede' },
  { v: '1 login', l: 'Para gerenciar tudo' },
  { v: '< 5s', l: 'Consolidação de dados' },
  { v: '100%', l: 'Rastreabilidade de ações' },
];

export default function ControlPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg,#0D1526 0%,#0B1220 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '96px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', right: '10%', transform: 'translateY(-50%)', width: 600, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(212,175,55,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1060, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', position: 'relative' }}>
          <div>
            <Link href="/ecosystem" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 24 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
              Ecossistema
            </Link>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, color: '#D4AF37', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Noro Control</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#D4AF37', background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)', padding: '2px 8px', borderRadius: 999, letterSpacing: '0.05em' }}>Enterprise</span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 18px' }}>
              Uma rede inteira.<br />Um painel só.
            </h1>
            <p style={{ fontSize: 17, color: '#B8C1E0', lineHeight: 1.65, margin: '0 0 32px' }}>
              O Noro Control foi criado para franquias e redes de agências que precisam de visibilidade consolidada, controle de permissões e relatórios comparativos sem abrir 10 abas.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#D4AF37', color: '#0B1220', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>Agendar demo Enterprise →</Link>
              <Link href="/partners" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: '#E0E3FF', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '13px 20px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Programa de parceiros</Link>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div style={{ background: '#12152C', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 16, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#D4AF37', fontFamily: 'var(--font-mono)' }}>NORO CONTROL · MAIO 2026</span>
              <span style={{ fontSize: 11, color: '#1DD3C0', background: 'rgba(29,211,192,0.1)', padding: '3px 10px', borderRadius: 999 }}>● ao vivo</span>
            </div>
            {[
              { unit: 'Filial SP Centro', revenue: 'R$84.200', growth: '+18%', color: '#1DD3C0' },
              { unit: 'Filial SP Sul', revenue: 'R$62.100', growth: '+12%', color: '#1DD3C0' },
              { unit: 'Filial RJ Copacabana', revenue: 'R$51.800', growth: '+7%', color: '#D4AF37' },
              { unit: 'Filial BH Centro', revenue: 'R$38.400', growth: '-3%', color: '#ef4444' },
            ].map((unit) => (
              <div key={unit.unit} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: '#D1D5F0' }}>{unit.unit}</span>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 700, color: '#fff' }}>{unit.revenue}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: unit.color, background: `${unit.color}15`, padding: '2px 8px', borderRadius: 999 }}>{unit.growth}</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: '#B8C1E0' }}>Total da rede (mês)</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 800, color: '#D4AF37' }}>R$236.500</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px 96px' }}>
        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', marginBottom: 80 }}>
          {METRICS.map((m) => (
            <div key={m.l} style={{ background: '#12152C', padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: '#D4AF37', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>{m.v}</div>
              <div style={{ fontSize: 12, color: '#B8C1E0' }}>{m.l}</div>
            </div>
          ))}
        </div>

        {/* Features */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 32px', textAlign: 'center' }}>Tudo que a gestão de redes precisa</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20, marginBottom: 80 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#B8C1E0', margin: 0, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Ecosystem nav */}
        <div style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 24, marginBottom: 48 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#B8C1E0', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>Outros produtos do ecossistema</div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Noro Core (CRM+ERP)', href: '/ecosystem/intelligent-crm-erp' },
              { label: 'Sites IA', href: '/ecosystem/intelligent-websites' },
              { label: 'Dados de Vistos', href: '/ecosystem/dados-de-vistos' },
              { label: 'ITTD', href: '/ecosystem/ittd' },
              { label: 'Parceiros', href: '/ecosystem/parceiros' },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ fontSize: 13, color: '#D4AF37', background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: 8, padding: '6px 14px', textDecoration: 'none' }}>{item.label}</Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.15) 0%,rgba(52,44,164,0.1) 100%)', border: '1px solid rgba(212,175,55,0.3)', borderRadius: 16, padding: '48px 40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 12px' }}>Gerencie sua rede de um lugar só</h2>
          <p style={{ fontSize: 15, color: '#B8C1E0', margin: '0 0 28px', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>Noro Control é exclusivo para redes com 3+ unidades. Fale com nossa equipe Enterprise.</p>
          <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#D4AF37', color: '#0B1220', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>Falar com Enterprise →</Link>
        </div>
      </div>
    </div>
  );
}
