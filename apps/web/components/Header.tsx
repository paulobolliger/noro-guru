'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Produto', href: '/#features' },
  { label: 'Preços', href: '/pricing' },
  { label: 'Ecossistema', href: '/ecosystem' },
  { label: 'Suporte', href: '/suporte' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: scrolled ? 'rgba(255,255,255,0.96)' : '#fff',
      borderBottom: '1px solid #eceef3',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
      transition: 'background .2s, box-shadow .2s',
      boxShadow: scrolled ? '0 1px 12px rgba(35,36,82,.06)' : 'none',
    }}>
      <div style={{
        maxWidth: 1152,
        margin: '0 auto',
        padding: '0 24px',
        height: 60,
        display: 'flex',
        alignItems: 'center',
        gap: 32,
      }}>

        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            textDecoration: 'none', flexShrink: 0,
          }}
        >
          <div style={{
            width: 34, height: 34, borderRadius: 9,
            background: '#232452',
            color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 15, letterSpacing: '.02em',
            fontFamily: 'var(--font-sans)',
          }}>
            N
          </div>
          <div>
            <div style={{
              fontWeight: 700,
              fontSize: 14.5,
              letterSpacing: '-.012em',
              color: '#1f2433',
              lineHeight: 1.1,
            }}>NORO Guru</div>
            <div style={{
              fontSize: 9.5,
              color: 'rgba(31,36,51,0.45)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '.04em',
            }}>para agências de viagem</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          marginLeft: 8,
          flex: 1,
        }}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              style={{
                fontSize: 13.5,
                fontWeight: 600,
                color: 'rgba(31,36,51,0.65)',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: 8,
                transition: 'color .12s, background .12s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = '#232452';
                (e.currentTarget as HTMLAnchorElement).style.background = '#f6f7fb';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = 'rgba(31,36,51,0.65)';
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* CTAs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <Link
            href="https://app.noro.guru/login"
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              color: 'rgba(31,36,51,0.7)',
              textDecoration: 'none',
              padding: '7px 14px',
              borderRadius: 8,
            }}
          >
            Entrar
          </Link>
          <Link
            href="https://app.noro.guru"
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: '#fff',
              background: '#232452',
              textDecoration: 'none',
              padding: '8px 18px',
              borderRadius: 9,
              letterSpacing: '-.01em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Começar grátis
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            style={{
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              padding: 8,
              display: 'none', // hidden on desktop via CSS below
            }}
            aria-label="Menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1f2433" strokeWidth="2" strokeLinecap="round">
              {mobileOpen ? (
                <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              ) : (
                <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{
          background: '#fff',
          borderTop: '1px solid #eceef3',
          padding: '16px 24px 24px',
        }}>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'block',
                padding: '12px 0',
                fontSize: 15,
                fontWeight: 600,
                color: '#1f2433',
                textDecoration: 'none',
                borderBottom: '1px solid #f6f7fb',
              }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link
              href="https://app.noro.guru/login"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '11px',
                fontSize: 14, fontWeight: 600,
                color: '#232452',
                border: '1px solid #dfe2ea',
                borderRadius: 9,
                textDecoration: 'none',
              }}
            >
              Entrar
            </Link>
            <Link
              href="https://app.noro.guru"
              style={{
                display: 'block',
                textAlign: 'center',
                padding: '11px',
                fontSize: 14, fontWeight: 700,
                color: '#fff',
                background: '#232452',
                borderRadius: 9,
                textDecoration: 'none',
              }}
            >
              Começar grátis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
