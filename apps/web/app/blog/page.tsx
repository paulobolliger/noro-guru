'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const dynamic = 'force-static';

const CATEGORIES = ['Todos', 'CRM & Vendas', 'Financeiro', 'IA', 'Atendimento', 'Sites', 'Turismo'];

const POSTS = [
  {
    id: 1,
    title: '5 erros que agências de viagem cometem no CRM (e como evitar)',
    excerpt: 'Leads esquecidos, follow-up tardio, pipeline desorganizado. Veja os erros mais comuns e como o Noro resolve cada um.',
    category: 'CRM & Vendas',
    author: 'Paulo Bolliger',
    date: '2026-05-20',
    readTime: '8 min',
    featured: true,
  },
  {
    id: 2,
    title: 'Como automatizar cobranças e nunca mais esquecer um recebível',
    excerpt: 'PIX, boleto e cartão integrados ao pedido. Veja como a conciliação automática economiza horas por semana.',
    category: 'Financeiro',
    author: 'Equipe Noro',
    date: '2026-05-17',
    readTime: '6 min',
    featured: false,
  },
  {
    id: 3,
    title: 'IA Operacional v2: o que mudou e por que isso importa para sua agência',
    excerpt: 'Roteiros mais precisos, sugestões de preço e análise de conversão em tempo real. Confira as novidades.',
    category: 'IA',
    author: 'Tech Team',
    date: '2026-05-14',
    readTime: '10 min',
    featured: false,
  },
  {
    id: 4,
    title: 'WhatsApp + Instagram + Email: como unificar o atendimento e responder 3x mais rápido',
    excerpt: 'A caixa omnichannel do Noro une todos os canais em um lugar. Chega de perder mensagem no celular pessoal.',
    category: 'Atendimento',
    author: 'Marina Costa',
    date: '2026-05-10',
    readTime: '7 min',
    featured: false,
  },
  {
    id: 5,
    title: 'Site da agência em 1 fim de semana: guia completo do builder Noro',
    excerpt: 'Sem precisar de programador. Template, domínio, SEO e integração com CRM — tudo em um só lugar.',
    category: 'Sites',
    author: 'Equipe Noro',
    date: '2026-05-07',
    readTime: '9 min',
    featured: false,
  },
  {
    id: 6,
    title: 'O que os dados de visto dizem sobre as viagens mais procuradas em 2026',
    excerpt: 'Análise da base Visa API do Noro com as tendências de destino e requisitos de visto mais consultados.',
    category: 'Turismo',
    author: 'Rafael Souza',
    date: '2026-05-03',
    readTime: '12 min',
    featured: false,
  },
];

const INITIALS_COLOR: Record<string, string> = {
  'Paulo Bolliger': '#342CA4',
  'Equipe Noro': '#1DD3C0',
  'Tech Team': '#D4AF37',
  'Marina Costa': '#342CA4',
  'Rafael Souza': '#1DD3C0',
};

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');

  const filtered = activeCategory === 'Todos'
    ? POSTS
    : POSTS.filter((p) => p.category === activeCategory);

  const featured = filtered.find((p) => p.featured) ?? filtered[0];
  const rest = filtered.filter((p) => p.id !== featured?.id);

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 24px 48px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            margin: '0 0 16px',
          }}
        >
          Blog Noro Guru
        </h1>
        <p style={{ fontSize: 18, color: '#B8C1E0', margin: '0 0 32px' }}>
          Conteúdo para agências modernas
        </p>

        {/* Search */}
        <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative' }}>
          <input
            type="search"
            placeholder="Buscar artigos..."
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 999,
              padding: '12px 48px 12px 20px',
              fontSize: 14,
              color: '#fff',
              outline: 'none',
              boxSizing: 'border-box',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <svg
            style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', color: '#B8C1E0' }}
            width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
      </section>

      {/* Category chips */}
      <section style={{ padding: '0 80px 40px', display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }} className="px-6 md:px-20">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              border: '1px solid',
              borderColor: activeCategory === cat ? '#342CA4' : 'rgba(255,255,255,0.1)',
              background: activeCategory === cat ? 'rgba(52,44,164,0.2)' : 'transparent',
              color: activeCategory === cat ? '#fff' : '#B8C1E0',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all .15s',
              fontFamily: 'var(--font-sans)',
            }}
          >
            {cat}
          </button>
        ))}
      </section>

      {/* Content */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 80px 96px' }} className="px-6 md:px-20">

        {/* Featured post */}
        {featured && (
          <Link
            href={`/blog/${featured.id}`}
            style={{
              display: 'grid',
              gridTemplateColumns: '60% 40%',
              background: '#12152C',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 16,
              overflow: 'hidden',
              textDecoration: 'none',
              marginBottom: 40,
              transition: 'border-color .2s',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.2)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)'; }}
            className="grid-cols-1 md:grid-cols-5"
          >
            {/* Image placeholder */}
            <div
              style={{
                background: 'linear-gradient(135deg, rgba(52,44,164,0.4), rgba(29,211,192,0.15))',
                minHeight: 280,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ fontSize: 64, opacity: 0.3 }}>📝</span>
            </div>

            {/* Content */}
            <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <span
                style={{
                  display: 'inline-block',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#342CA4',
                  background: 'rgba(52,44,164,0.15)',
                  border: '1px solid rgba(52,44,164,0.3)',
                  borderRadius: 999,
                  padding: '3px 12px',
                  letterSpacing: '0.06em',
                  width: 'fit-content',
                }}
              >
                {featured.category}
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#fff',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.25,
                  margin: 0,
                }}
              >
                {featured.title}
              </h2>
              <p style={{ fontSize: 14, color: '#B8C1E0', lineHeight: 1.6, margin: 0 }}>
                {featured.excerpt}
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: INITIALS_COLOR[featured.author] || '#342CA4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff' }}>
                  {featured.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                </div>
                <span style={{ fontSize: 12, color: '#B8C1E0' }}>{featured.author}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>·</span>
                <span style={{ fontSize: 12, color: '#B8C1E0' }}>{featured.readTime} de leitura</span>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#1DD3C0',
                }}
              >
                Ler artigo →
              </div>
            </div>
          </Link>
        )}

        {/* Posts grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              style={{
                background: '#12152C',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                overflow: 'hidden',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                transition: 'border-color .2s, box-shadow .2s',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.14)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.3)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.06)';
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none';
              }}
            >
              {/* Thumbnail */}
              <div
                style={{
                  height: 160,
                  background: 'linear-gradient(135deg, rgba(52,44,164,0.3), rgba(29,211,192,0.1))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ fontSize: 36, opacity: 0.4 }}>📄</span>
              </div>

              {/* Content */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: '#1DD3C0',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                  }}
                >
                  {post.category}
                </span>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#fff',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.3,
                    margin: 0,
                  }}
                >
                  {post.title}
                </h3>
                <p style={{ fontSize: 13, color: '#B8C1E0', lineHeight: 1.55, margin: 0 }}>
                  {post.excerpt.slice(0, 100)}…
                </p>
                <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: INITIALS_COLOR[post.author] || '#342CA4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#fff' }}>
                    {post.author.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                  </div>
                  <span style={{ fontSize: 11, color: '#B8C1E0' }}>{post.author}</span>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginLeft: 'auto' }}>{post.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section style={{ background: '#12152C', borderTop: '1px solid rgba(255,255,255,0.08)', padding: '64px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 12px' }}>
          Receba novidades por email
        </h2>
        <p style={{ fontSize: 15, color: '#B8C1E0', margin: '0 0 28px' }}>
          Conteúdo sobre gestão de agências, turismo e tecnologia.
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', maxWidth: 420, margin: '0 auto' }}>
          <input
            type="email"
            placeholder="seu@email.com.br"
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 8,
              padding: '12px 16px',
              fontSize: 14,
              color: '#fff',
              outline: 'none',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <button
            style={{
              background: '#342CA4',
              color: '#fff',
              border: 0,
              borderRadius: 8,
              padding: '12px 24px',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
          >
            Assinar
          </button>
        </div>
      </section>
    </div>
  );
}
