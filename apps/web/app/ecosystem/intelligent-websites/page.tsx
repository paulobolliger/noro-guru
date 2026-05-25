import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sites Inteligentes para Agências de Turismo | Noro Guru',
  description: 'Gere o site da sua agência em minutos com IA. Design profissional, integrado ao CRM, com captação de leads automática.',
};

const STEPS = [
  { num: '01', title: 'Você informa os dados', desc: 'Nome da agência, serviços, diferenciais, logo e cores. Leva menos de 5 minutos.' },
  { num: '02', title: 'A IA gera o site', desc: 'Estrutura, textos, seções e layout criados automaticamente com base no seu perfil.' },
  { num: '03', title: 'Você personaliza', desc: 'Edite textos, cores, imagens e seções diretamente no editor visual.' },
  { num: '04', title: 'Publique em um clique', desc: 'Domínio *.sites.noro.guru incluído. Conecte seu domínio próprio quando quiser.' },
];

const FEATURES = [
  { icon: '🔗', title: 'Integrado ao CRM', desc: 'Leads que chegam pelo site entram automaticamente no pipeline da agência.' },
  { icon: '📱', title: 'Responsivo', desc: 'Funciona perfeitamente em celular, tablet e desktop. Sem configuração extra.' },
  { icon: '⚡', title: 'Rápido', desc: 'Performance otimizada para Google. Core Web Vitals no verde.' },
  { icon: '🤖', title: 'Conteúdo com IA', desc: 'Textos de vendas, descrições de destinos e CTAs gerados por IA.' },
  { icon: '🌐', title: 'Domínio próprio', desc: 'Conecte seu domínio personalizado a partir do plano Profissional.' },
  { icon: '📊', title: 'Analytics integrado', desc: 'Veja quantas visitas, leads gerados e taxa de conversão direto no painel.' },
];

export default function IntelligentWebsitesPage() {
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
            top: '50%',
            right: '10%',
            transform: 'translateY(-50%)',
            width: 500,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(29,211,192,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <Link href="/ecosystem" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 32 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Ecossistema
          </Link>

          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(29,211,192,0.15)', border: '1px solid rgba(29,211,192,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>
            🌐
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#1DD3C0', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>
            Sites Inteligentes
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
            Seu site profissional<br />
            <span style={{ color: '#1DD3C0' }}>pronto em minutos</span>
          </h1>

          <p style={{ fontSize: 18, color: '#B8C1E0', lineHeight: 1.65, margin: '0 0 40px', maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
            A IA gera o site da sua agência do zero — com textos de vendas, design profissional e integração direta ao CRM para capturar leads automaticamente.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/wizard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#1DD3C0',
                color: '#0B1220',
                borderRadius: 10,
                padding: '13px 28px',
                fontSize: 15,
                fontWeight: 800,
                textDecoration: 'none',
              }}
            >
              ✨ Gerar meu site grátis
            </Link>
            <Link
              href="/demo"
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
              Ver demo
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px 96px' }}>

        {/* How it works */}
        <div style={{ marginBottom: 96 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 8px', textAlign: 'center' }}>
            Como funciona
          </h2>
          <p style={{ fontSize: 16, color: '#B8C1E0', textAlign: 'center', margin: '0 0 48px' }}>
            De zero a site publicado em menos de 30 minutos.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {STEPS.map((step) => (
              <div
                key={step.num}
                style={{
                  background: '#12152C',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: 28,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 28,
                    fontWeight: 800,
                    color: '#342CA4',
                    opacity: 0.5,
                    lineHeight: 1,
                    marginBottom: 16,
                  }}
                >
                  {step.num}
                </div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 14, color: '#B8C1E0', margin: 0, lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 96 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 32px', textAlign: 'center' }}>
            O que está incluído
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  background: '#12152C',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: '24px 28px',
                  display: 'flex',
                  gap: 16,
                  alignItems: 'flex-start',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: 'rgba(29,211,192,0.1)',
                    border: '1px solid rgba(29,211,192,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    flexShrink: 0,
                  }}
                >
                  {f.icon}
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#fff', margin: '0 0 6px' }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0, lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(29,211,192,0.12) 0%, rgba(52,44,164,0.12) 100%)',
            border: '1px solid rgba(29,211,192,0.25)',
            borderRadius: 16,
            padding: '56px 40px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            Seu melhor vendedor não tira férias
          </h2>
          <p style={{ fontSize: 16, color: '#B8C1E0', margin: '0 0 8px', lineHeight: 1.6 }}>
            Enquanto sua equipe atende, o site capta leads 24h por dia.
          </p>
          <p style={{ fontSize: 14, color: '#B8C1E0', margin: '0 0 32px' }}>
            Grátis no plano Starter · Domínio próprio a partir do Profissional
          </p>
          <Link
            href="/wizard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#1DD3C0',
              color: '#0B1220',
              borderRadius: 10,
              padding: '14px 32px',
              fontSize: 16,
              fontWeight: 800,
              textDecoration: 'none',
            }}
          >
            ✨ Criar meu site agora
          </Link>
        </div>
      </div>
    </div>
  );
}
