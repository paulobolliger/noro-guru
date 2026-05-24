'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ChevronDown, X, Menu } from 'lucide-react';

// ─── Dropdown data ───────────────────────────────────────────────────────────

const PRODUTO_ITEMS = [
  { icon: '📊', label: 'Visão Geral', desc: 'A plataforma completa', href: '/#features' },
  { icon: '🎯', label: 'CRM & Pipeline', desc: 'Gerencie leads e oportunidades', href: '/#crm' },
  { icon: '💰', label: 'Financeiro', desc: 'Faturamento e controle financeiro', href: '/#financeiro' },
  { icon: '🤖', label: 'IA Operacional', desc: 'Automação inteligente', href: '/#ia' },
  { icon: '🌐', label: 'Sites & Marketing', desc: 'Sites para sua agência', href: '/#sites' },
  { icon: '💬', label: 'Atendimento', desc: 'Omnichannel integrado', href: '/#atendimento' },
];

const ECOSSISTEMA_ITEMS = [
  { icon: '🌍', label: 'Web', desc: 'noro.guru — site institucional', href: '/' },
  { icon: '⚙️', label: 'Core', desc: 'app.noro.guru — plataforma principal', href: 'https://app.noro.guru' },
  { icon: '🎛️', label: 'Control', desc: 'control.noro.guru — admin Noro', href: 'https://control.noro.guru' },
  { icon: '🏗️', label: 'Sites', desc: 'sites.noro.guru — builder de sites', href: 'https://sites.noro.guru' },
  { icon: '🛂', label: 'Visa API', desc: 'Dados de vistos para agências', href: '/ecosystem/dados-de-vistos' },
  { icon: '📡', label: 'API Docs', desc: 'Documentação para devs', href: 'https://api.noro.guru' },
];

// ─── Dropdown component ───────────────────────────────────────────────────────

function NavDropdown({
  label,
  items,
}: {
  label: string;
  items: { icon: string; label: string; desc: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          fontSize: 15,
          fontWeight: 500,
          color: '#E0E3FF',
          background: 'transparent',
          border: 0,
          cursor: 'pointer',
          padding: '6px 12px',
          borderRadius: 8,
          fontFamily: 'var(--font-sans)',
          transition: 'color .15s, background .15s',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.05)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
        }}
      >
        {label}
        <ChevronDown
          size={14}
          style={{
            transition: 'transform .2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#12152C',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
            padding: '8px',
            minWidth: 280,
            zIndex: 100,
            animation: 'fade-in .15s ease-out forwards',
          }}
        >
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 12px',
                borderRadius: 8,
                textDecoration: 'none',
                transition: 'background .12s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              }}
            >
              <span style={{ fontSize: 20, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: '#E0E3FF', marginBottom: 2 }}>
                  {item.label}
                </div>
                <div style={{ fontSize: 12, color: '#B8C1E0' }}>{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: 64,
          background: scrolled
            ? '#0B1220'
            : 'rgba(11,18,32,0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled
            ? '1px solid rgba(255,255,255,0.08)'
            : '1px solid transparent',
          boxShadow: scrolled ? '0 1px 24px rgba(0,0,0,0.4)' : 'none',
          transition: 'background .25s, border-color .25s, box-shadow .25s',
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 80px',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 32,
          }}
          className="px-6 md:px-20"
        >
          {/* Logo */}
          <Link
            href="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              textDecoration: 'none',
              flexShrink: 0,
            }}
          >
            <img
              src="https://res.cloudinary.com/dhqvjxgue/image/upload/v1760969739/edited-photo_4_txwuti.png"
              alt="Noro Guru"
              style={{
                height: 28,
                width: 'auto',
                objectFit: 'contain',
                filter: 'brightness(0) invert(1)',
              }}
              onError={(e) => {
                // Fallback text logo
                (e.currentTarget as HTMLImageElement).style.display = 'none';
              }}
            />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 18,
                color: '#fff',
                letterSpacing: '-0.02em',
              }}
            >
              Noro Guru
            </span>
          </Link>

          {/* Desktop nav — hidden on mobile */}
          <nav
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              flex: 1,
              justifyContent: 'center',
            }}
            className="hidden md:flex"
          >
            <NavDropdown label="Produto" items={PRODUTO_ITEMS} />

            <Link
              href="/pricing"
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: '#E0E3FF',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: 8,
                transition: 'background .12s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              }}
            >
              Preços
            </Link>

            <NavDropdown label="Ecossistema" items={ECOSSISTEMA_ITEMS} />

            <Link
              href="/about"
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: '#E0E3FF',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: 8,
                transition: 'background .12s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              }}
            >
              Sobre
            </Link>

            <Link
              href="/blog"
              style={{
                fontSize: 15,
                fontWeight: 500,
                color: '#E0E3FF',
                textDecoration: 'none',
                padding: '6px 12px',
                borderRadius: 8,
                transition: 'background .12s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.05)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
              }}
            >
              Blog
            </Link>
          </nav>

          {/* Desktop CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              flexShrink: 0,
            }}
            className="hidden md:flex"
          >
            <Link
              href="https://app.noro.guru/login"
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: '#E0E3FF',
                textDecoration: 'none',
                padding: '8px 16px',
              }}
            >
              Entrar
            </Link>
            <Link
              href="https://app.noro.guru"
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                background: '#342CA4',
                textDecoration: 'none',
                padding: '10px 20px',
                borderRadius: 8,
                transition: 'background .15s',
                letterSpacing: '-0.01em',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = '#3B2CA4';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = '#342CA4';
              }}
            >
              Começar grátis
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              background: 'transparent',
              border: 0,
              cursor: 'pointer',
              padding: 8,
              color: '#E0E3FF',
              marginLeft: 'auto',
            }}
            className="flex md:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 49,
            background: '#0B1220',
            paddingTop: 64,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'auto',
          }}
          className="md:hidden"
        >
          <div style={{ padding: '24px 24px 32px', flex: 1 }}>
            {/* Mobile nav links */}
            {[
              { label: 'Produto', href: '/#features' },
              { label: 'Preços', href: '/pricing' },
              { label: 'Ecossistema', href: '/ecosystem' },
              { label: 'Sobre', href: '/about' },
              { label: 'Blog', href: '/blog' },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block',
                  padding: '16px 0',
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#E0E3FF',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {link.label}
              </Link>
            ))}

            <div style={{ marginTop: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Link
                href="https://app.noro.guru/login"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '14px',
                  fontSize: 15,
                  fontWeight: 600,
                  color: '#E0E3FF',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 10,
                  textDecoration: 'none',
                }}
              >
                Entrar
              </Link>
              <Link
                href="https://app.noro.guru"
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block',
                  textAlign: 'center',
                  padding: '14px',
                  fontSize: 15,
                  fontWeight: 700,
                  color: '#fff',
                  background: '#342CA4',
                  borderRadius: 10,
                  textDecoration: 'none',
                }}
              >
                Começar grátis
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed header */}
      <div style={{ height: 64 }} />
    </>
  );
}
