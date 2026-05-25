import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ecossistema de Parceiros | Noro Guru',
  description: 'Fornecedores, operadoras e integrações do ecossistema Noro Guru para agências de turismo.',
};

const PARTNER_CATEGORIES = [
  {
    category: 'Operadoras de Turismo',
    color: '#342CA4',
    partners: [
      { name: 'Flytour Viagens', desc: 'Pacotes nacionais e internacionais com cotação integrada' },
      { name: 'CVC Corp', desc: 'Maior rede de turismo do Brasil com API de disponibilidade' },
      { name: 'RexturAdvance', desc: 'Tecnologia para agências com tarifas negociadas' },
      { name: 'Trend Operadora', desc: 'Especialista em viagens de luxo e corporativas' },
    ],
  },
  {
    category: 'Companhias Aéreas',
    color: '#1DD3C0',
    partners: [
      { name: 'LATAM Airlines', desc: 'API de GDS com disponibilidade de assentos em tempo real' },
      { name: 'Gol Linhas Aéreas', desc: 'Tarifas exclusivas para agências credenciadas' },
      { name: 'Azul Viagens', desc: 'Pacotes e tarifas consolidadas para operadores' },
    ],
  },
  {
    category: 'Pagamentos & Financeiro',
    color: '#D4AF37',
    partners: [
      { name: 'Adyen', desc: 'Gateway internacional multi-moeda para cobranças em viagens' },
      { name: 'Pagar.me', desc: 'Processamento de pagamentos PIX, cartão e boleto' },
      { name: 'Omie ERP', desc: 'Integração contábil e fiscal para agências' },
    ],
  },
  {
    category: 'Comunicação & Marketing',
    color: '#7C3AED',
    partners: [
      { name: 'Twilio', desc: 'Infraestrutura de WhatsApp Business API e SMS' },
      { name: 'RD Station', desc: 'Automação de marketing e nutrição de leads' },
      { name: 'Mailchimp', desc: 'Email marketing para newsletters e promoções' },
    ],
  },
];

const INTEGRATION_TYPES = [
  { icon: '🔗', title: 'API REST', desc: 'Integre qualquer sistema via nossa API documentada. SDKs em JavaScript e Python.' },
  { icon: '🔄', title: 'Webhooks', desc: 'Receba eventos em tempo real: nova reserva, pagamento confirmado, lead recebido.' },
  { icon: '📦', title: 'Integrações nativas', desc: '30+ integrações pré-construídas. Ative em segundos, sem código.' },
  { icon: '🧩', title: 'Zapier / Make', desc: 'Conecte 3.000+ apps via automação no-code com nossos triggers nativos.' },
];

export default function ParceirosEcossistemaPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg,#0D1526 0%,#0B1220 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '96px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(52,44,164,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <Link href="/ecosystem" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 24 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Ecossistema
          </Link>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#342CA4', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>Parceiros do Ecossistema</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 18px' }}>
            Conectado com o melhor<br />do turismo brasileiro
          </h1>
          <p style={{ fontSize: 17, color: '#B8C1E0', lineHeight: 1.65, margin: '0 0 36px', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Operadoras, aéreas, sistemas de pagamento e ferramentas de marketing — o Noro Guru se conecta ao ecossistema que você já usa.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/partners" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#342CA4', color: '#fff', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>Ser parceiro →</Link>
            <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: '#E0E3FF', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '13px 20px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Ver demo</Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px 96px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', marginBottom: 80 }}>
          {[
            { v: '30+', l: 'Integrações nativas' },
            { v: '4', l: 'Categorias de parceiros' },
            { v: '< 5min', l: 'Para ativar uma integração' },
            { v: '24/7', l: 'Sincronização automática' },
          ].map((m) => (
            <div key={m.l} style={{ background: '#12152C', padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: '#342CA4', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>{m.v}</div>
              <div style={{ fontSize: 12, color: '#B8C1E0' }}>{m.l}</div>
            </div>
          ))}
        </div>

        {/* Partner categories */}
        {PARTNER_CATEGORIES.map((cat) => (
          <div key={cat.category} style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: cat.color, margin: '0 0 20px' }}>{cat.category}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 16 }}>
              {cat.partners.map((p) => (
                <div key={p.name} style={{ background: '#12152C', border: `1px solid ${cat.color}20`, borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{p.name}</div>
                  <div style={{ fontSize: 12, color: '#B8C1E0', lineHeight: 1.5 }}>{p.desc}</div>
                  <div style={{ marginTop: 12, fontSize: 11, color: cat.color, fontWeight: 700 }}>Integrado ✓</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Integration types */}
        <div style={{ marginTop: 32, marginBottom: 80 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 32px', textAlign: 'center' }}>Tipos de integração disponíveis</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))', gap: 20 }}>
            {INTEGRATION_TYPES.map((it) => (
              <div key={it.title} style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24 }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{it.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{it.title}</h3>
                <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0, lineHeight: 1.6 }}>{it.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Become a partner CTA */}
        <div style={{ background: 'linear-gradient(135deg,rgba(52,44,164,0.2) 0%,rgba(29,211,192,0.08) 100%)', border: '1px solid rgba(52,44,164,0.3)', borderRadius: 16, padding: '48px 40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 12px' }}>Quer integrar seu produto ao Noro?</h2>
          <p style={{ fontSize: 15, color: '#B8C1E0', margin: '0 0 28px', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Operadoras, aéreas, fintechs e SaaS de turismo — venha fazer parte do ecossistema.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/partners" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#342CA4', color: '#fff', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>Programa de parceiros →</Link>
            <a href="mailto:parceiros@noro.guru" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: '#E0E3FF', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '13px 20px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>parceiros@noro.guru</a>
          </div>
        </div>
      </div>
    </div>
  );
}
