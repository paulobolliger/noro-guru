import Link from 'next/link';
import React from 'react';

export default function NotFoundPage() {
  return (
    <div
      style={{
        background: '#0B1220',
        minHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '80px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background 404 number */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(160px, 25vw, 280px)',
          fontWeight: 800,
          color: '#342CA4',
          opacity: 0.08,
          letterSpacing: '-0.05em',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1,
        }}
      >
        404
      </div>

      {/* Icon */}
      <div style={{ fontSize: 64, marginBottom: 24 }}>✈️</div>

      {/* Content */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '-0.03em',
          margin: '0 0 16px',
        }}
      >
        Esta página voou para longe!
      </h1>
      <p style={{ fontSize: 16, color: '#B8C1E0', margin: '0 0 48px', maxWidth: 440 }}>
        A página que você procura não existe ou foi movida. Mas ainda podemos te ajudar a encontrar o que precisa.
      </p>

      {/* Quick links */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          maxWidth: 560,
          width: '100%',
          marginBottom: 40,
        }}
      >
        {[
          { icon: '🏠', label: 'Página inicial', href: '/' },
          { icon: '💰', label: 'Ver planos', href: '/pricing' },
          { icon: '💬', label: 'Fale conosco', href: '/demo' },
        ].map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              background: '#12152C',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12,
              padding: '20px 16px',
              textDecoration: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              transition: 'border-color .2s',
            }}
          >
            <span style={{ fontSize: 28 }}>{link.icon}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#E0E3FF' }}>{link.label}</span>
          </Link>
        ))}
      </div>

      {/* Primary CTA */}
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          background: '#342CA4',
          color: '#fff',
          borderRadius: 10,
          padding: '12px 28px',
          fontSize: 15,
          fontWeight: 700,
          textDecoration: 'none',
        }}
      >
        Ir para o início
      </Link>
    </div>
  );
}
