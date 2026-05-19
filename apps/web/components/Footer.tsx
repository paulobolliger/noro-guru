import React from 'react';
import Link from 'next/link';

const FOOTER_LINKS = {
  Produto: [
    { label: 'CRM & Vendas', href: '/#features' },
    { label: 'Meu Site', href: '/#features' },
    { label: 'Financeiro & PIX', href: '/#features' },
    { label: 'Conteúdo IA', href: '/#features' },
    { label: 'Preços', href: '/pricing' },
  ],
  Ecossistema: [
    { label: 'NORO Portal', href: 'https://app.noro.guru' },
    { label: 'Dados de Vistos', href: '/ecosystem/dados-de-vistos' },
    { label: 'NORO ITTD', href: '/ecosystem/ittd' },
    { label: 'Roadmap público', href: '/ecosystem' },
  ],
  Empresa: [
    { label: 'Sobre', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Suporte', href: '/suporte' },
    { label: 'Status', href: 'https://status.noro.guru' },
  ],
  Legal: [
    { label: 'Privacidade', href: '/privacy-policy' },
    { label: 'Termos de Uso', href: '/terms-of-service' },
  ],
};

export default function Footer() {
  return (
    <footer style={{
      background: '#1a1d2e',
      color: '#fff',
      padding: '64px 24px 40px',
    }}>
      <div style={{ maxWidth: 1152, margin: '0 auto' }}>

        {/* Top grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.4fr repeat(4, 1fr)',
          gap: 48,
          marginBottom: 56,
        }}>

          {/* Brand column */}
          <div>
            <Link href="/" style={{
              display: 'flex', alignItems: 'center', gap: 10,
              textDecoration: 'none', marginBottom: 16,
            }}>
              <div style={{
                width: 34, height: 34, borderRadius: 9,
                background: '#19b8a8',
                color: '#1a1d2e',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 15,
              }}>
                N
              </div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: '-.012em' }}>
                NORO Guru
              </div>
            </Link>
            <p style={{
              fontSize: 13.5,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.5)',
              margin: '0 0 20px',
              maxWidth: 240,
            }}>
              O sistema operacional para agências de viagem brasileiras. CRM, site, financeiro e IA em uma plataforma.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {/* Instagram */}
              <a href="https://instagram.com/noroguru" aria-label="Instagram" style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.6)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://linkedin.com/company/noroguru" aria-label="LinkedIn" style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.6)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              {/* WhatsApp */}
              <a href="https://wa.me/5511999999999" aria-label="WhatsApp" style={{
                width: 34, height: 34, borderRadius: 8,
                background: 'rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'rgba(255,255,255,0.6)',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <div style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.35)',
                marginBottom: 16,
                fontFamily: 'var(--font-mono)',
              }}>
                {section}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} style={{
                      fontSize: 13.5,
                      color: 'rgba(255,255,255,0.6)',
                      textDecoration: 'none',
                    }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 28 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}>
            <p style={{
              fontSize: 12,
              color: 'rgba(255,255,255,0.3)',
              margin: 0,
            }}>
              © 2026 NORO Guru · Nomade Group. Todos os direitos reservados.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11.5,
                color: 'rgba(255,255,255,0.3)',
                fontFamily: 'var(--font-mono)',
              }}>
                <span style={{
                  width: 7, height: 7, borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 0 3px rgba(34,197,94,.2)',
                  display: 'inline-block',
                }} />
                Todos sistemas operacionais
              </div>
              <span style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-mono)' }}>
                app.noro.guru
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
