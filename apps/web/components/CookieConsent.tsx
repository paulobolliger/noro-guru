'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        padding: '0',
        background: 'rgba(13,21,38,0.97)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {/* Content */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1, minWidth: 280 }}>
          <span style={{ fontSize: 22, flexShrink: 0, marginTop: 2 }}>🍪</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Usamos cookies</div>
            <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0, lineHeight: 1.55 }}>
              Cookies essenciais e opcionais para melhorar sua experiência.{' '}
              <Link href="/cookies" style={{ color: '#1DD3C0', textDecoration: 'none' }}>
                Saiba mais
              </Link>{' '}
              ou ajuste suas preferências.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
          <button
            onClick={declineCookies}
            style={{
              padding: '9px 20px',
              fontSize: 13,
              fontWeight: 600,
              color: '#B8C1E0',
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.12)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; }}
          >
            Apenas essenciais
          </button>
          <button
            onClick={acceptCookies}
            style={{
              padding: '9px 20px',
              fontSize: 13,
              fontWeight: 700,
              color: '#fff',
              background: '#342CA4',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1'; }}
          >
            Aceitar todos
          </button>
        </div>
      </div>
    </div>
  );
}
