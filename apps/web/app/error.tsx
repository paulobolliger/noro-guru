'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      style={{
        background: '#0B1220',
        minHeight: '100vh',
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
      {/* Ghost 500 background text */}
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
          opacity: 0.07,
          letterSpacing: '-0.05em',
          userSelect: 'none',
          pointerEvents: 'none',
          lineHeight: 1,
        }}
      >
        500
      </div>

      {/* Subtle glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(220,38,38,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Icon */}
      <div style={{ fontSize: 64, marginBottom: 24, position: 'relative' }}>⚠️</div>

      {/* Content */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(24px, 4vw, 36px)',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '-0.03em',
          margin: '0 0 16px',
          position: 'relative',
        }}
      >
        Algo deu errado
      </h1>

      <p
        style={{
          fontSize: 16,
          color: '#B8C1E0',
          lineHeight: 1.65,
          margin: '0 0 12px',
          maxWidth: 440,
          position: 'relative',
        }}
      >
        Ocorreu um erro inesperado. Nossa equipe já foi notificada e estamos trabalhando para resolver isso o quanto antes.
      </p>

      {error.digest && (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: '#4B5578',
            margin: '0 0 40px',
            position: 'relative',
          }}
        >
          Código: {error.digest}
        </p>
      )}

      {!error.digest && <div style={{ marginBottom: 40 }} />}

      {/* Buttons */}
      <div
        style={{
          display: 'flex',
          gap: 12,
          justifyContent: 'center',
          flexWrap: 'wrap',
          position: 'relative',
        }}
      >
        <button
          onClick={() => reset()}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#342CA4',
            color: '#fff',
            border: 'none',
            borderRadius: 10,
            padding: '13px 28px',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Tentar novamente
        </button>
        <Link
          href="/"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.07)',
            color: '#E0E3FF',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10,
            padding: '13px 20px',
            fontSize: 15,
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Ir para o início
        </Link>
      </div>

      {/* Status link */}
      <div style={{ marginTop: 32, position: 'relative' }}>
        <a
          href="https://status.noro.guru"
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: 13, color: '#1DD3C0', textDecoration: 'none' }}
        >
          Ver status da plataforma →
        </a>
      </div>
    </div>
  );
}
