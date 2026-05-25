import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'ITTD — Internet Travel & Tourism Database | Noro Guru',
  description: 'O banco de dados global do turismo. Em desenvolvimento — o projeto mais ambicioso do ecossistema Noro.',
};

export default function IttdPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Hero full-screen */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '96px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            height: 600,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 65%)',
            pointerEvents: 'none',
          }}
        />

        {/* Grid pattern */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', maxWidth: 640 }}>
          <Link href="/ecosystem" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 48 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Ecossistema
          </Link>

          {/* Icon */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 24,
              background: 'rgba(124,58,237,0.15)',
              border: '1px solid rgba(124,58,237,0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              margin: '0 auto 32px',
            }}
          >
            🗄️
          </div>

          {/* Label */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.3)',
              borderRadius: 999,
              padding: '6px 16px',
              fontSize: 11,
              fontWeight: 700,
              color: '#7C3AED',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontFamily: 'var(--font-mono)',
              marginBottom: 24,
            }}
          >
            🔭 Em desenvolvimento
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 56px)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 0 20px',
            }}
          >
            ITTD
          </h1>

          <p
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 20,
              color: '#7C3AED',
              fontWeight: 600,
              letterSpacing: '0.02em',
              margin: '0 0 24px',
            }}
          >
            Internet Travel &amp; Tourism Database
          </p>

          <p style={{ fontSize: 17, color: '#B8C1E0', lineHeight: 1.7, margin: '0 0 48px' }}>
            O projeto mais ambicioso do ecossistema Noro. Uma base de dados global do turismo — destinos, hotéis, atrações, operadoras e muito mais — estruturada para ser consultada por humanos e máquinas.
          </p>

          {/* Teaser cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: 12,
              marginBottom: 48,
            }}
          >
            {[
              { icon: '🌍', label: 'Destinos', value: '10.000+' },
              { icon: '🏨', label: 'Propriedades', value: '500K+' },
              { icon: '🎯', label: 'Atrações', value: '50.000+' },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12,
                  padding: '16px 12px',
                  textAlign: 'center',
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 4 }}>{item.icon}</div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 18,
                    fontWeight: 800,
                    color: '#7C3AED',
                    letterSpacing: '-0.02em',
                    marginBottom: 2,
                  }}
                >
                  {item.value}
                </div>
                <div style={{ fontSize: 12, color: '#B8C1E0' }}>{item.label}</div>
              </div>
            ))}
          </div>

          {/* Email signup */}
          <p style={{ fontSize: 14, color: '#B8C1E0', margin: '0 0 20px' }}>
            Quer ser avisado quando o ITTD abrir para acesso antecipado?
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <input
              type="email"
              placeholder="seu@email.com.br"
              style={{
                flex: 1,
                minWidth: 220,
                maxWidth: 300,
                padding: '12px 16px',
                background: '#12152C',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10,
                fontSize: 14,
                color: '#fff',
                outline: 'none',
              }}
            />
            <button
              style={{
                padding: '12px 24px',
                background: '#7C3AED',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Quero acesso antecipado
            </button>
          </div>

          <div style={{ marginTop: 48 }}>
            <Link href="/ecosystem" style={{ fontSize: 14, color: '#B8C1E0', textDecoration: 'none' }}>
              ← Ver outros produtos do ecossistema
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
