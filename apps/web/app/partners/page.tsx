import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Programa de Parceiros | Noro Guru',
  description: 'Seja um parceiro Noro Guru. Indicadores, integradores e consultores de turismo — comissões recorrentes e suporte dedicado.',
};

const TIERS = [
  {
    name: 'Indicador',
    color: '#B8C1E0',
    commission: '15%',
    period: '12 meses',
    features: ['Link de indicação personalizado', 'Dashboard de acompanhamento', 'Pagamento mensal automático', 'Suporte por email'],
    ideal: 'Consultores e influenciadores do setor de turismo',
  },
  {
    name: 'Integrador',
    color: '#342CA4',
    commission: '25%',
    period: 'Vitalício',
    features: ['Tudo do Indicador', 'Treinamento técnico certificado', 'Acesso à API de parceiros', 'Canal Slack dedicado', 'Co-marketing disponível'],
    ideal: 'Empresas de tecnologia e consultoras de gestão',
    highlight: true,
  },
  {
    name: 'Agência Master',
    color: '#D4AF37',
    commission: '30%',
    period: 'Vitalício',
    features: ['Tudo do Integrador', 'White-label disponível', 'SLA prioritário para clientes', 'Gerente de conta dedicado', 'Revenue share em expansão'],
    ideal: 'Agências de turismo com rede de subagências',
  },
];

const BENEFITS = [
  { icon: '💰', title: 'Comissões recorrentes', desc: 'Ganhe enquanto seu cliente usar a Noro. Sem teto, sem prazo de expiração no plano Integrador.' },
  { icon: '🎓', title: 'Certificação gratuita', desc: 'Treinamento completo e certificado Noro Partner para destacar sua expertise no mercado.' },
  { icon: '📊', title: 'Dashboard em tempo real', desc: 'Acompanhe suas indicações, receitas e comissões pendentes em um painel dedicado.' },
  { icon: '🤝', title: 'Co-marketing', desc: 'Cases conjuntos, webinars e materiais de divulgação para alavancar suas vendas.' },
  { icon: '⚡', title: 'Suporte prioritário', desc: 'Seus clientes têm SLA diferenciado. Você tem canal direto com nossa equipe.' },
  { icon: '🔗', title: 'API de parceiros', desc: 'Integre o Noro Guru ao seu próprio produto ou workflow com nossa API dedicada a parceiros.' },
];

export default function PartnersPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg,#0D1526 0%,#0B1220 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '96px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(52,44,164,0.18) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#342CA4', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>Programa de Parceiros</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 20px' }}>
            Cresça com a Noro.<br />Ganhe junto com a gente.
          </h1>
          <p style={{ fontSize: 17, color: '#B8C1E0', lineHeight: 1.65, margin: '0 0 36px', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Indique, integre ou revenda a plataforma líder para agências de turismo no Brasil. Comissões recorrentes, suporte dedicado e materiais prontos.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#aplicar" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#342CA4', color: '#fff', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>Quero ser parceiro →</a>
            <a href="#tiers" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: '#E0E3FF', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '13px 20px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Ver níveis</a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px 96px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', marginBottom: 80 }}>
          {[
            { v: '+200', l: 'Parceiros ativos' },
            { v: 'R$18k', l: 'Média mensal top parceiro' },
            { v: '25%', l: 'Comissão recorrente' },
            { v: '48h', l: 'Tempo até primeiro pagamento' },
          ].map((m) => (
            <div key={m.l} style={{ background: '#12152C', padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: '#342CA4', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>{m.v}</div>
              <div style={{ fontSize: 12, color: '#B8C1E0' }}>{m.l}</div>
            </div>
          ))}
        </div>

        {/* Tiers */}
        <h2 id="tiers" style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 40px', textAlign: 'center' }}>Escolha seu nível</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20, marginBottom: 80 }}>
          {TIERS.map((t) => (
            <div key={t.name} style={{ background: t.highlight ? 'linear-gradient(135deg,rgba(52,44,164,0.25) 0%,rgba(52,44,164,0.08) 100%)' : '#12152C', border: `1px solid ${t.highlight ? 'rgba(52,44,164,0.4)' : 'rgba(255,255,255,0.07)'}`, borderRadius: 16, padding: 28, position: 'relative' }}>
              {t.highlight && <div style={{ position: 'absolute', top: -1, left: '50%', transform: 'translateX(-50%)', background: '#342CA4', color: '#fff', fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '4px 14px', borderRadius: '0 0 8px 8px' }}>Mais popular</div>}
              <div style={{ fontSize: 11, fontWeight: 700, color: t.color, letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>{t.name}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 4 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 44, fontWeight: 800, color: t.color }}>{t.commission}</span>
                <span style={{ fontSize: 14, color: '#B8C1E0' }}>de comissão</span>
              </div>
              <div style={{ fontSize: 12, color: '#B8C1E0', marginBottom: 20 }}>por {t.period}</div>
              <div style={{ fontSize: 12, color: '#D1D5F0', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 12px', marginBottom: 20 }}>{t.ideal}</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px' }}>
                {t.features.map((f) => (
                  <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#D1D5F0', marginBottom: 8 }}>
                    <span style={{ color: t.color }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a href="#aplicar" style={{ display: 'block', textAlign: 'center', background: t.highlight ? '#342CA4' : 'rgba(255,255,255,0.07)', color: t.highlight ? '#fff' : '#E0E3FF', border: t.highlight ? 'none' : '1px solid rgba(255,255,255,0.12)', borderRadius: 8, padding: '10px 0', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Aplicar</a>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 32px', textAlign: 'center' }}>Por que ser parceiro Noro?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20, marginBottom: 80 }}>
          {BENEFITS.map((b) => (
            <div key={b.title} style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{b.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{b.title}</h3>
              <p style={{ fontSize: 14, color: '#B8C1E0', margin: 0, lineHeight: 1.65 }}>{b.desc}</p>
            </div>
          ))}
        </div>

        {/* Apply CTA */}
        <div id="aplicar" style={{ background: 'linear-gradient(135deg,rgba(52,44,164,0.2) 0%,rgba(29,211,192,0.08) 100%)', border: '1px solid rgba(52,44,164,0.3)', borderRadius: 16, padding: '56px 40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 12px' }}>Pronto para começar?</h2>
          <p style={{ fontSize: 16, color: '#B8C1E0', margin: '0 0 32px', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>Preencha o formulário e nossa equipe entra em contato em até 1 dia útil.</p>
          <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#342CA4', color: '#fff', borderRadius: 10, padding: '14px 32px', fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>Falar com parceria →</Link>
        </div>
      </div>
    </div>
  );
}
