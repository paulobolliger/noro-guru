import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Ecossistema | Noro Guru',
  description: 'Seis apps integrados. Um sistema operacional completo para agências de viagem modernas.',
};

const APPS = [
  {
    num: '01',
    icon: '🌍',
    domain: 'noro.guru',
    name: 'Noro Web',
    desc: 'Site de marketing e conversão projetado para máxima performance e autoridade de marca.',
    tag: 'Visitantes',
    tagColor: '#342CA4',
    href: '/',
  },
  {
    num: '02',
    icon: '⚙️',
    domain: 'app.noro.guru',
    name: 'Noro Core',
    desc: 'Painel operacional completo para gestão de agências, centralizando dados e processos.',
    tag: 'Agências (Tenants)',
    tagColor: '#3B82F6',
    href: '/ecosystem/intelligent-crm-erp',
  },
  {
    num: '03',
    icon: '🛡️',
    domain: 'control.noro.guru',
    name: 'Noro Control',
    desc: 'Administração de alto nível da plataforma, controle de segurança e logs de auditoria.',
    tag: 'Admins Noro',
    tagColor: '#D4AF37',
    href: '/ecosystem/control',
  },
  {
    num: '04',
    icon: '🏗️',
    domain: 'sites.noro.guru',
    name: 'Noro Sites',
    desc: 'Sites ultrarrápidos para clientes das agências utilizando tecnologia ISR de última geração.',
    tag: 'Clientes das Agências',
    tagColor: '#1DD3C0',
    href: '/ecosystem/intelligent-websites',
  },
  {
    num: '05',
    icon: '🛂',
    domain: 'visa.noro.guru',
    name: 'Noro Visa',
    desc: 'Gestão automatizada de vistos e documentação complexa com workflows inteligentes.',
    tag: 'Agências',
    tagColor: '#22C55E',
    href: '/ecosystem/dados-de-vistos',
  },
  {
    num: '06',
    icon: '📡',
    domain: 'api.noro.guru',
    name: 'Noro API',
    desc: 'Portal de desenvolvedor com documentação e endpoints para integrações personalizadas.',
    tag: 'Developers',
    tagColor: '#94A3B8',
    href: '/ecosystem/visa-api',
  },
];

export default function EcosystemPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#D1D5F0' }}>

      {/* Hero */}
      <section
        style={{
          position: 'relative',
          paddingTop: 160,
          paddingBottom: 80,
          overflow: 'hidden',
          backgroundSize: '40px 40px',
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
        }}
      >
        {/* Decorative orbs */}
        <div style={{
          position: 'absolute', top: '-10%', left: '-5%',
          width: 400, height: 400,
          background: 'rgba(52,44,164,0.2)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '-5%',
          width: 400, height: 400,
          background: 'rgba(29,211,192,0.1)',
          borderRadius: '50%',
          filter: 'blur(120px)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 40px', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(40px, 6vw, 56px)',
              color: '#fff',
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              margin: '0 0 24px',
            }}
          >
            O ecossistema Noro Guru
          </h1>
          <p style={{ fontSize: 20, color: '#B8C1E0', maxWidth: 760, margin: '0 auto', fontWeight: 500 }}>
            Seis apps. Um sistema operacional completo.
          </p>
        </div>
      </section>

      {/* Apps grid */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 40px' }} className="px-6 md:px-10">
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}
          className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          {APPS.map((app) => (
            <Link
              key={app.name}
              href={app.href}
              style={{
                background: '#12152C',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: 28,
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color .3s, transform .3s, box-shadow .3s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = '#342CA4';
                el.style.transform = 'translateY(-4px)';
                el.style.boxShadow = '0 0 30px rgba(52,44,164,0.15)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = 'rgba(255,255,255,0.1)';
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              {/* Header row */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
                <span style={{ fontSize: 48 }}>{app.icon}</span>
                <span style={{ fontSize: 10, fontFamily: 'var(--font-mono)', color: 'rgba(184,193,224,0.5)', letterSpacing: '0.1em' }}>{app.num}</span>
              </div>

              {/* Domain */}
              <div style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'rgba(184,193,224,0.6)', marginBottom: 8 }}>
                {app.domain}
              </div>

              {/* Name */}
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>
                {app.name}
              </h3>

              {/* Description */}
              <p style={{ fontSize: 14, color: '#B8C1E0', lineHeight: 1.6, margin: '0 0 32px', flex: 1 }}>
                {app.desc}
              </p>

              {/* Tag */}
              <div style={{ marginBottom: 20 }}>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  background: 'rgba(255,255,255,0.05)',
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>
                  {app.tag}
                </span>
              </div>

              {/* Link */}
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1DD3C0', display: 'flex', alignItems: 'center', gap: 8 }}>
                Saiba mais <span style={{ transition: 'transform .15s' }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 24px', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(52,44,164,0.1), rgba(29,211,192,0.05))',
          borderRadius: 24,
          padding: '48px',
          border: '1px solid rgba(255,255,255,0.05)',
        }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: '#fff', margin: '0 0 24px' }}>
            Pronto para unificar sua operação?
          </h2>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/demo"
              style={{
                padding: '16px 40px',
                background: '#342CA4',
                color: '#fff',
                borderRadius: 8,
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 17,
                textDecoration: 'none',
                boxShadow: '0 8px 24px rgba(52,44,164,0.3)',
              }}
            >
              Começar agora
            </Link>
            <Link
              href="/pricing"
              style={{
                padding: '16px 40px',
                background: 'transparent',
                color: '#D1D5F0',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 8,
                fontFamily: 'var(--font-display)',
                fontWeight: 600,
                fontSize: 17,
                textDecoration: 'none',
              }}
            >
              Ver planos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
