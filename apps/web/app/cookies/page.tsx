import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Cookies | Noro Guru',
  description: 'Entenda quais cookies a Noro Guru utiliza, para que servem e como você pode controlar suas preferências.',
};

const COOKIE_TYPES = [
  {
    category: 'Essenciais',
    color: '#1DD3C0',
    required: true,
    desc: 'Necessários para o funcionamento básico do site. Sem estes cookies, a plataforma não funciona.',
    cookies: [
      { name: 'session_id', purpose: 'Mantém a sessão do usuário autenticado', duration: 'Sessão' },
      { name: 'csrf_token', purpose: 'Proteção contra ataques Cross-Site Request Forgery', duration: 'Sessão' },
      { name: 'cookie_consent', purpose: 'Armazena suas preferências de cookies', duration: '12 meses' },
    ],
  },
  {
    category: 'Funcionais',
    color: '#342CA4',
    required: false,
    desc: 'Melhoram a experiência recordando suas preferências e configurações.',
    cookies: [
      { name: 'lang_pref', purpose: 'Preferência de idioma', duration: '12 meses' },
      { name: 'theme_pref', purpose: 'Preferência de tema (claro/escuro)', duration: '12 meses' },
      { name: 'sidebar_state', purpose: 'Estado do menu lateral no painel', duration: '30 dias' },
    ],
  },
  {
    category: 'Analíticos',
    color: '#D4AF37',
    required: false,
    desc: 'Nos ajudam a entender como você usa o site para melhorarmos a experiência.',
    cookies: [
      { name: '_noro_analytics', purpose: 'Contagem de visitas e páginas mais acessadas', duration: '13 meses' },
      { name: '_noro_session', purpose: 'Duração e fluxo de navegação por sessão', duration: 'Sessão' },
    ],
  },
  {
    category: 'Marketing',
    color: '#7C3AED',
    required: false,
    desc: 'Usados para personalizar anúncios e medir a eficácia de campanhas.',
    cookies: [
      { name: '_fbp', purpose: 'Rastreamento de conversões Facebook Ads', duration: '3 meses' },
      { name: '_gcl_au', purpose: 'Medição de conversões Google Ads', duration: '3 meses' },
      { name: 'utm_source', purpose: 'Origem da visita para atribuição de campanhas', duration: '30 dias' },
    ],
  },
];

export default function CookiesPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg,#0D1526 0%,#0B1220 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '80px 24px 60px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <Link href="/privacidade" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 24 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Políticas
          </Link>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#1DD3C0', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 12 }}>Política de Cookies</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 16px' }}>
            Cookies: o que usamos e por quê
          </h1>
          <p style={{ fontSize: 16, color: '#B8C1E0', lineHeight: 1.65, margin: '0 0 8px', maxWidth: 640 }}>
            Cookies são pequenos arquivos salvos no seu navegador. Esta página explica quais usamos, para que servem e como você controla cada categoria.
          </p>
          <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0 }}>Última atualização: maio de 2026 · Vigência: LGPD / Lei 13.709/2018</p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px 96px' }}>
        {/* Intro */}
        <div style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 28, marginBottom: 48 }}>
          <p style={{ fontSize: 15, color: '#D1D5F0', lineHeight: 1.7, margin: 0 }}>
            A Noro Guru utiliza cookies e tecnologias similares para garantir o funcionamento da plataforma, melhorar sua experiência e — com seu consentimento — analisar o uso do site e personalizar comunicações. Você pode aceitar ou recusar cada categoria de cookie (exceto os essenciais, sem os quais o site não funciona).
          </p>
        </div>

        {/* Cookie types */}
        {COOKIE_TYPES.map((type) => (
          <div key={type.category} style={{ marginBottom: 48 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: type.color, margin: 0 }}>{type.category}</h2>
              <span style={{ fontSize: 11, fontWeight: 700, color: type.required ? '#1DD3C0' : '#B8C1E0', background: type.required ? 'rgba(29,211,192,0.12)' : 'rgba(255,255,255,0.06)', border: `1px solid ${type.required ? 'rgba(29,211,192,0.3)' : 'rgba(255,255,255,0.1)'}`, padding: '2px 10px', borderRadius: 999, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{type.required ? 'Obrigatório' : 'Opcional'}</span>
            </div>
            <p style={{ fontSize: 14, color: '#B8C1E0', lineHeight: 1.65, margin: '0 0 16px' }}>{type.desc}</p>
            <div style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 1fr', gap: 0, padding: '10px 20px', background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#B8C1E0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cookie</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#B8C1E0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Finalidade</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#B8C1E0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Duração</span>
              </div>
              {type.cookies.map((c, i) => (
                <div key={c.name} style={{ display: 'grid', gridTemplateColumns: '2fr 3fr 1fr', gap: 0, padding: '12px 20px', borderBottom: i < type.cookies.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: type.color }}>{c.name}</span>
                  <span style={{ fontSize: 13, color: '#D1D5F0' }}>{c.purpose}</span>
                  <span style={{ fontSize: 12, color: '#B8C1E0' }}>{c.duration}</span>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Managing cookies */}
        <div style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: 32, marginBottom: 48 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 16px' }}>Como gerenciar seus cookies</h2>
          <p style={{ fontSize: 14, color: '#B8C1E0', lineHeight: 1.7, margin: '0 0 16px' }}>
            Você pode alterar suas preferências a qualquer momento clicando em &ldquo;Configurações de cookies&rdquo; no rodapé do site. Também é possível bloquear ou excluir cookies diretamente no seu navegador:
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {[
              { browser: 'Chrome', url: 'chrome://settings/cookies' },
              { browser: 'Firefox', url: 'about:preferences#privacy' },
              { browser: 'Safari', url: 'Preferências → Privacidade' },
              { browser: 'Edge', url: 'Configurações → Cookies e permissões do site' },
            ].map((b) => (
              <li key={b.browser} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#D1D5F0', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: '#1DD3C0' }}>→</span>
                <strong>{b.browser}:</strong> <span style={{ color: '#B8C1E0', fontFamily: 'var(--font-mono)', fontSize: 12 }}>{b.url}</span>
              </li>
            ))}
          </ul>
          <p style={{ fontSize: 13, color: '#B8C1E0', lineHeight: 1.6, margin: '16px 0 0' }}>
            Atenção: bloquear cookies essenciais pode prejudicar o funcionamento da plataforma.
          </p>
        </div>

        {/* Contact */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 32 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>Dúvidas sobre cookies?</h3>
          <p style={{ fontSize: 14, color: '#B8C1E0', lineHeight: 1.65, margin: '0 0 16px' }}>
            Entre em contato com nosso DPO (Encarregado de Dados) pelo email{' '}
            <a href="mailto:privacidade@noro.guru" style={{ color: '#1DD3C0', textDecoration: 'none' }}>privacidade@noro.guru</a>.
            Respondemos em até 72 horas úteis.
          </p>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link href="/privacidade" style={{ color: '#1DD3C0', fontSize: 13, textDecoration: 'none' }}>Política de Privacidade →</Link>
            <Link href="/termos" style={{ color: '#B8C1E0', fontSize: 13, textDecoration: 'none' }}>Termos de Uso →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
