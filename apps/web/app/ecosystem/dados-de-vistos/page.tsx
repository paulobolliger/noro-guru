import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Visa API — Dados de Vistos para Agências | Noro Guru',
  description: 'Acesse dados atualizados de requisitos de vistos para mais de 180 países. API para agências e desenvolvedores.',
};

const FEATURES = [
  { icon: '🗺️', title: '180+ países', desc: 'Base de dados cobrindo requisitos de vistos para passaportes brasileiros e internacionais.' },
  { icon: '🔄', title: 'Atualização contínua', desc: 'Dados atualizados por equipe especializada. Alertas automáticos quando requisitos mudam.' },
  { icon: '⚡', title: 'API REST', desc: 'Integre diretamente no seu sistema ou use a interface visual da plataforma Noro Core.' },
  { icon: '🛡️', title: 'Dados confiáveis', desc: 'Fontes oficiais de embaixadas e consulados, com validação cruzada periódica.' },
  { icon: '📋', title: 'Checklist por destino', desc: 'Lista completa de documentos necessários por perfil de viajante (turismo, negócios, estudo).' },
  { icon: '🤖', title: 'IA para análise', desc: 'Interprete cenários complexos e antecipe mudanças de requisitos com auxílio de IA.' },
];

const COUNTRIES = [
  { flag: '🇫🇷', name: 'França', type: 'Schengen', status: 'Visto obrigatório' },
  { flag: '🇺🇸', name: 'EUA', type: 'B1/B2', status: 'Visto obrigatório' },
  { flag: '🇦🇷', name: 'Argentina', type: 'Isento', status: 'Sem visto' },
  { flag: '🇵🇹', name: 'Portugal', type: 'Schengen', status: 'Visto obrigatório' },
  { flag: '🇨🇦', name: 'Canadá', type: 'eTA/Visto', status: 'eTA disponível' },
  { flag: '🇯🇵', name: 'Japão', type: 'Isento', status: 'Sem visto (90d)' },
];

export default function DadosDeVistosPage() {
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
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(212,175,55,0.12) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <Link href="/ecosystem" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 32 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Ecossistema
          </Link>

          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>
            🛂
          </div>

          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#D4AF37', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>
            Visa API
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
            Dados de vistos<br />
            <span style={{ color: '#D4AF37' }}>confiáveis e atualizados</span>
          </h1>

          <p style={{ fontSize: 18, color: '#B8C1E0', lineHeight: 1.65, margin: '0 0 40px', maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Acesse requisitos de vistos para mais de 180 países diretamente na plataforma Noro Core, ou integre via API no seu sistema. Dados verificados, alertas de mudança automáticos.
          </p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['180+ países', 'API REST', 'Atualização diária', 'Passaporte BR'].map((tag) => (
              <span
                key={tag}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#D4AF37',
                  background: 'rgba(212,175,55,0.1)',
                  border: '1px solid rgba(212,175,55,0.25)',
                  borderRadius: 999,
                  padding: '5px 14px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px 96px' }}>

        {/* Sample data */}
        <div style={{ marginBottom: 96 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 8px', textAlign: 'center' }}>
            Amostra da base de dados
          </h2>
          <p style={{ fontSize: 16, color: '#B8C1E0', textAlign: 'center', margin: '0 0 40px' }}>
            Dados para passaporte brasileiro — atualizado em maio de 2026.
          </p>
          <div
            style={{
              background: '#12152C',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 14,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.04)',
                borderBottom: '1px solid rgba(255,255,255,0.07)',
              }}
            >
              <span style={{ fontSize: 11, fontWeight: 700, color: '#B8C1E0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>País</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#B8C1E0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Tipo</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#B8C1E0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Status</span>
            </div>
            {COUNTRIES.map((c, i) => (
              <div
                key={c.name}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr',
                  padding: '16px 24px',
                  borderBottom: i < COUNTRIES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  alignItems: 'center',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 20 }}>{c.flag}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{c.name}</span>
                </div>
                <span
                  style={{
                    fontSize: 12,
                    color: '#B8C1E0',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {c.type}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: c.status === 'Sem visto' || c.status.startsWith('Sem visto') ? '#1DD3C0' : c.status.includes('eTA') ? '#D4AF37' : '#B8C1E0',
                  }}
                >
                  {c.status}
                </span>
              </div>
            ))}
            <div style={{ padding: '12px 24px', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ fontSize: 12, color: '#B8C1E0' }}>+ 174 países disponíveis na plataforma completa</span>
            </div>
          </div>
        </div>

        {/* Features */}
        <div style={{ marginBottom: 96 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 32px', textAlign: 'center' }}>
            Recursos da Visa API
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
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#B8C1E0', margin: 0, lineHeight: 1.65 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(52,44,164,0.1) 100%)',
            border: '1px solid rgba(212,175,55,0.25)',
            borderRadius: 16,
            padding: '48px 40px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 12px' }}>
            Acesse a Visa API
          </h2>
          <p style={{ fontSize: 15, color: '#B8C1E0', margin: '0 0 28px', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Disponível integrada ao Noro Core ou via API para desenvolvedores. Entre em contato para acesso e documentação.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#D4AF37', color: '#0B1220', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>
              Solicitar acesso →
            </Link>
            <Link href="/ecosystem" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: '#E0E3FF', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '13px 24px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>
              Ver ecossistema
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
