import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sites & Marketing para Agências de Turismo | Noro Guru',
  description: 'Gere o site profissional da sua agência em minutos com IA. Blog, SEO, domínio próprio e captação de leads integrada ao CRM.',
};

const FEATURES = [
  { icon: '🤖', title: 'Geração com IA', desc: 'Informe o nome, serviços e diferenciais da agência — a IA cria o site completo em minutos.' },
  { icon: '✏️', title: 'Editor visual', desc: 'Edite textos, cores e imagens sem código. O que você vê é o que o cliente vê.' },
  { icon: '📱', title: '100% responsivo', desc: 'Funciona perfeitamente em celular, tablet e desktop. Google premia velocidade.' },
  { icon: '🔗', title: 'CRM integrado', desc: 'Formulários do site enviam leads diretamente ao pipeline. Sem copiar e colar.' },
  { icon: '🌐', title: 'Domínio próprio', desc: 'Conecte minhaagencia.com.br. Inclui certificado SSL automático.' },
  { icon: '📊', title: 'Analytics incluso', desc: 'Visitas, conversões, origem de tráfego — tudo no painel Noro, sem Google Analytics separado.' },
];

export default function SitesFeaturePage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(180deg,#0D1526 0%,#0B1220 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '96px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', right: '15%', transform: 'translateY(-50%)', width: 500, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(5,150,105,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <Link href="/features" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 24 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Funcionalidades
          </Link>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#059669', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>Sites & Marketing</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 18px' }}>
            Seu melhor vendedor<br />não tira férias
          </h1>
          <p style={{ fontSize: 17, color: '#B8C1E0', lineHeight: 1.65, margin: '0 0 32px', maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
            Enquanto sua equipe atende clientes, o site capta leads 24h por dia — e envia tudo para o CRM automaticamente.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/wizard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#059669', color: '#fff', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>✨ Gerar meu site grátis</Link>
            <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: '#E0E3FF', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '13px 20px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Ver demo</Link>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px 96px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', marginBottom: 80 }}>
          {[{ v: '< 5min', l: 'Para gerar o primeiro site' }, { v: '3×', l: 'Mais conversão vs site antigo' }, { v: '0', l: 'Linhas de código necessárias' }].map((m) => (
            <div key={m.l} style={{ background: '#12152C', padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: '#059669', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>{m.v}</div>
              <div style={{ fontSize: 13, color: '#B8C1E0' }}>{m.l}</div>
            </div>
          ))}
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 32px', textAlign: 'center' }}>Tudo incluso, sem complicação</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20, marginBottom: 80 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#B8C1E0', margin: 0, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ background: 'linear-gradient(135deg,rgba(5,150,105,0.12) 0%,rgba(52,44,164,0.08) 100%)', border: '1px solid rgba(5,150,105,0.25)', borderRadius: 16, padding: '48px 40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 12px' }}>Crie seu site agora</h2>
          <p style={{ fontSize: 15, color: '#B8C1E0', margin: '0 0 8px', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>Grátis no plano Starter. Domínio próprio a partir do Profissional.</p>
          <p style={{ fontSize: 13, color: '#B8C1E0', margin: '0 0 28px' }}>Sem cartão de crédito para começar.</p>
          <Link href="/wizard" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#059669', color: '#fff', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>✨ Gerar meu site grátis</Link>
        </div>
      </div>
    </div>
  );
}
