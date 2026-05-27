'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const METRICS = [
  { value: '150+', label: 'Países cobertos', sub: 'Cobertura Global' },
  { value: '99.9%', label: 'uptime', sub: 'Disponibilidade Garantida' },
  { value: '< 200ms', label: 'latência', sub: 'Resposta Instantânea' },
];

const FEATURES = [
  {
    icon: '✅',
    title: 'Checklist de Requisitos',
    desc: 'Dados granulares sobre formulários necessários, taxas e prazos de processamento por jurisdição.',
  },
  {
    icon: '⚡',
    title: 'Dados em Tempo Real',
    desc: 'Atualizações diárias baseadas em canais governamentais oficiais e acordos bilaterais.',
  },
  {
    icon: '🔗',
    title: 'Webhooks',
    desc: 'Notificações automáticas quando as regras de entrada de um país mudam drasticamente.',
  },
  {
    icon: '🌐',
    title: 'Multi-idioma',
    desc: 'Respostas formatadas em PT-BR, EN e ES para facilitar a exibição direta ao seu usuário final.',
  },
  {
    icon: '💻',
    title: 'Sandbox Gratuito',
    desc: 'Ambiente de teste completo com chaves de API imediatas para começar a buildar agora mesmo.',
  },
  {
    icon: '🛡️',
    title: 'SLA Garantido',
    desc: 'Contratos de nível de serviço de nível empresarial para aplicações críticas de missão.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Obtenha sua Chave',
    desc: 'Crie sua conta e gere uma API_KEY instantânea para começar a fazer requisições.',
  },
  {
    num: '02',
    title: 'Configure os Parâmetros',
    desc: 'Envie a origem e o destino para obter os requisitos detalhados de entrada.',
  },
  {
    num: '03',
    title: 'Exiba para o Usuário',
    desc: 'Utilize nossos payloads estruturados para montar sua interface de check-in ou vendas.',
  },
];

const CODE_CURL = `# Fazer uma consulta simples
curl -X GET "https://api.noro.guru/v1/visa/requirements" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -G \\
  -d "origin=BR" \\
  -d "destination=PT"`;

const CODE_JS = `const response = await fetch("https://api.noro.guru/v1/...", {
  method: "GET",
  headers: {
    "Authorization": \`Bearer \${API_KEY}\`
  }
});
const data = await response.json();`;

export default function VisaApiPage() {
  const [activeTab, setActiveTab] = useState<'curl' | 'js'>('curl');

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#D1D5F0' }}>

      {/* Hero */}
      <section
        style={{
          position: 'relative',
          paddingTop: 140,
          paddingBottom: 96,
          paddingLeft: 24,
          paddingRight: 24,
          minHeight: '100vh',
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          overflow: 'hidden',
        }}
      >
        {/* Decorative glows */}
        <div style={{
          position: 'absolute', top: 0, left: 0,
          width: 400, height: 400,
          background: '#342CA4',
          opacity: 0.15,
          borderRadius: '50%',
          filter: 'blur(120px)',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, right: 0,
          width: 500, height: 500,
          background: '#1DD3C0',
          opacity: 0.15,
          borderRadius: '50%',
          filter: 'blur(120px)',
          transform: 'translate(33%, 33%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          {/* Badge */}
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '6px 16px',
            borderRadius: 999,
            background: 'rgba(29,211,192,0.1)',
            border: '1px solid rgba(29,211,192,0.2)',
            color: '#1DD3C0',
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 32,
          }}>
            API de Vistos · 150+ países cobertos
          </span>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(40px, 6vw, 60px)',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 24,
              background: 'linear-gradient(135deg, #1DD3C0, #342CA4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Consulte requisitos de visto em segundos.
          </h1>

          <p style={{ fontSize: 18, color: '#B8C1E0', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.6 }}>
            API REST para agências, plataformas de turismo e integradores. Dados em tempo real para automação de conformidade internacional.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 64 }}>
            <Link
              href="/cadastro"
              style={{
                padding: '16px 32px',
                background: '#342CA4',
                color: '#fff',
                borderRadius: 8,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 15,
                textDecoration: 'none',
                transition: 'opacity .15s',
              }}
            >
              Começar grátis
            </Link>
            <Link
              href="https://api.noro.guru"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '16px 32px',
                background: 'transparent',
                color: '#1DD3C0',
                border: '1px solid #1DD3C0',
                borderRadius: 8,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 15,
                textDecoration: 'none',
                transition: 'background .15s',
              }}
            >
              Ver documentação
            </Link>
          </div>

          {/* Code card */}
          <div style={{
            maxWidth: 640,
            margin: '0 auto',
            background: '#12152C',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 12,
            overflow: 'hidden',
            textAlign: 'left',
          }}>
            {/* Window chrome */}
            <div style={{
              background: 'rgba(18,21,44,0.5)',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
              padding: '8px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(239,68,68,0.5)' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(234,179,8,0.5)' }} />
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'rgba(34,197,94,0.5)' }} />
              </div>
              <span style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Endpoint Explorer
              </span>
            </div>
            <div style={{ padding: 24, fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7, overflowX: 'auto' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <span style={{ padding: '2px 8px', background: 'rgba(34,197,94,0.15)', color: '#4ade80', borderRadius: 4, fontSize: 11, fontWeight: 700 }}>GET</span>
                <span style={{ color: '#D1D5F0' }}>/v1/visa/requirements?origin=BR&destination=PT</span>
              </div>
              <div style={{ color: '#D1D5F0' }}>
                <span style={{ color: '#1DD3C0' }}>{'{'}</span><br/>
                <span style={{ paddingLeft: 16, color: '#1DD3C0' }}>&quot;visa_required&quot;</span>
                <span style={{ color: '#D1D5F0' }}>: </span>
                <span style={{ color: '#A78BFA' }}>false</span>
                <span style={{ color: '#D1D5F0' }}>,</span><br/>
                <span style={{ paddingLeft: 16, color: '#1DD3C0' }}>&quot;stay_limit_days&quot;</span>
                <span style={{ color: '#D1D5F0' }}>: </span>
                <span style={{ color: '#A78BFA' }}>90</span>
                <span style={{ color: '#D1D5F0' }}>,</span><br/>
                <span style={{ paddingLeft: 16, color: '#1DD3C0' }}>&quot;documents_required&quot;</span>
                <span style={{ color: '#D1D5F0' }}>: </span>
                <span style={{ color: '#1DD3C0' }}>[</span>
                <span style={{ color: '#F59E0B' }}>&quot;Passaporte válido&quot;</span>
                <span style={{ color: '#1DD3C0' }}>]</span><br/>
                <span style={{ color: '#1DD3C0' }}>{'}'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics */}
      <section style={{
        background: '#12152C',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '80px 24px',
        position: 'relative',
        zIndex: 10,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, textAlign: 'center' }} className="grid-cols-1 md:grid-cols-3">
          {METRICS.map((m) => (
            <div key={m.sub}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>{m.value} <span style={{ fontSize: 28 }}>{m.label}</span></div>
              <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1DD3C0', marginTop: 8 }}>{m.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '128px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>
              Arquitetura focada no desenvolvedor
            </h2>
            <p style={{ fontSize: 16, color: '#B8C1E0', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
              Tudo o que você precisa para integrar verificações de viagem complexas em sua plataforma em questão de horas, não semanas.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                style={{
                  padding: 32,
                  background: 'rgba(18,21,44,0.4)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 16,
                  transition: 'border-color .2s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'rgba(29,211,192,0.4)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
              >
                <div style={{ fontSize: 28, marginBottom: 24 }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#B8C1E0', lineHeight: 1.6, margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '128px 24px', background: 'rgba(18,21,44,0.2)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }} className="grid-cols-1 lg:grid-cols-2">
          {/* Steps */}
          <div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, color: '#fff', margin: '0 0 48px' }}>
              Como funciona a integração
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
              {STEPS.map((step) => (
                <div key={step.num} style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: 48, fontWeight: 700, color: 'rgba(255,255,255,0.08)', flexShrink: 0 }}>{step.num}</span>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', margin: '8px 0 8px' }}>{step.title}</h4>
                    <p style={{ fontSize: 15, color: '#B8C1E0', margin: 0, lineHeight: 1.6 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Code tabs */}
          <div style={{ background: '#1a1d35', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            {/* Tab bar */}
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              {(['curl', 'js'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '12px 24px',
                    fontSize: 11,
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    textTransform: 'uppercase' as const,
                    letterSpacing: '0.05em',
                    color: activeTab === tab ? '#1DD3C0' : '#B8C1E0',
                    background: activeTab === tab ? 'rgba(255,255,255,0.05)' : 'transparent',
                    cursor: 'pointer',
                    border: 'none',
                    borderBottom: activeTab === tab ? '2px solid #1DD3C0' : '2px solid transparent',
                    transition: 'color .15s',
                  }}
                >
                  {tab === 'curl' ? 'cURL' : 'Node.js'}
                </button>
              ))}
            </div>
            <div style={{ padding: 24 }}>
              <pre style={{ fontFamily: 'var(--font-mono)', fontSize: 13, lineHeight: 1.7, overflowX: 'auto', margin: 0, whiteSpace: 'pre-wrap', color: '#D1D5F0' }}>
                {activeTab === 'curl' ? CODE_CURL : CODE_JS}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '128px 24px' }}>
        <div style={{
          maxWidth: 800,
          margin: '0 auto',
          padding: '48px',
          borderRadius: 32,
          background: 'linear-gradient(135deg, rgba(52,44,164,0.2), rgba(29,211,192,0.1))',
          border: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: 0, right: 0,
            width: 256, height: 256,
            background: '#1DD3C0',
            opacity: 0.15,
            borderRadius: '50%',
            filter: 'blur(100px)',
            transform: 'translate(50%, -50%)',
            pointerEvents: 'none',
          }} />
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 700, color: '#fff', margin: '0 0 24px', position: 'relative', zIndex: 1 }}>
            Pronto para automatizar seus vistos?
          </h2>
          <p style={{ fontSize: 17, color: '#B8C1E0', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
            Comece a integrar hoje com 1.000 requisições gratuitas por mês. Sem cartão de crédito.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link
              href="/cadastro"
              style={{
                padding: '16px 40px',
                background: '#1DD3C0',
                color: '#0B1220',
                borderRadius: 8,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 15,
                textDecoration: 'none',
              }}
            >
              Criar conta gratuita
            </Link>
            <Link
              href="/demo"
              style={{
                padding: '16px 40px',
                background: 'rgba(255,255,255,0.05)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 8,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 15,
                textDecoration: 'none',
              }}
            >
              Falar com vendas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
