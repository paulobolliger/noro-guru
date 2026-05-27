'use client';

import React from 'react';
import Link from 'next/link';

const FOOTER_LINKS = {
  Produto: [
    { label: 'CRM & Pipeline', href: '/#crm' },
    { label: 'Financeiro & Billing', href: '/#financeiro' },
    { label: 'IA Operacional', href: '/#ia' },
    { label: 'Sites & Marketing', href: '/#sites' },
    { label: 'Atendimento Omnichannel', href: '/#atendimento' },
  ],
  Empresa: [
    { label: 'Sobre Nós', href: '/about' },
    { label: 'Manifesto', href: '/manifesto' },
    { label: 'Blog', href: '/blog' },
    { label: 'Cases de Sucesso', href: '/cases' },
    { label: 'Carreiras', href: '/careers' },
    { label: 'Imprensa', href: '/press' },
  ],
  'Suporte & Legal': [
    { label: 'Central de Ajuda', href: '/help' },
    { label: 'Status da Plataforma', href: '/status' },
    { label: 'Política de Privacidade', href: '/privacy-policy' },
    { label: 'Termos de Serviço', href: '/terms-of-service' },
    { label: 'LGPD', href: '/lgpd' },
    { label: 'Segurança', href: '/security' },
  ],
};

const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/company/noroguru',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
        <rect x="2" y="9" width="4" height="12"/>
        <circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/noroguru',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
      </svg>
    ),
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@noroguru',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
        <polygon points="9.75,15.02 15.5,12 9.75,8.98 9.75,15.02"/>
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer
      style={{
        background: '#12152C',
        color: '#fff',
        paddingTop: 64,
        paddingBottom: 32,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 80px',
        }}
        className="px-6 md:px-20"
      >
        {/* Top grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr repeat(3, 1fr)',
            gap: 48,
            marginBottom: 56,
          }}
          className="grid-cols-1 md:grid-cols-4"
        >
          {/* Brand column */}
          <div>
            <Link
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                textDecoration: 'none',
                marginBottom: 16,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: '#342CA4',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: 16,
                  color: '#fff',
                }}
              >
                N
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 16,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                }}
              >
                Noro Guru
              </span>
            </Link>

            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: '#B8C1E0',
                margin: '0 0 24px',
                maxWidth: 240,
              }}
            >
              O sistema operacional da agência moderna.
            </p>

            {/* Social icons */}
            <div style={{ display: 'flex', gap: 10 }}>
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  aria-label={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#B8C1E0',
                    transition: 'background .15s, color .15s',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = '#342CA4';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)';
                    (e.currentTarget as HTMLAnchorElement).style.color = '#B8C1E0';
                  }}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#E0E3FF',
                  marginBottom: 16,
                }}
              >
                {section}
              </div>
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10,
                }}
              >
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      style={{
                        fontSize: 14,
                        color: '#B8C1E0',
                        textDecoration: 'none',
                        transition: 'color .12s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = '#B8C1E0';
                      }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 28 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <p
              style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.35)',
                margin: 0,
              }}
            >
              © 2026 Noro Guru · Nomade Group. Todos os direitos reservados.
            </p>

            {/* Trust badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {['LGPD Compliant', 'Dados no Brasil 🇧🇷'].map((badge) => (
                <span
                  key={badge}
                  style={{
                    fontSize: 11.5,
                    fontWeight: 600,
                    color: 'rgba(255,255,255,0.4)',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
