'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  {
    icon: '🚀',
    color: '#342CA4',
    title: 'Primeiros passos',
    desc: 'Configure sua conta e importe seus dados',
    articles: [
      'Como criar sua conta na Noro Guru',
      'Importar clientes de planilhas ou outro CRM',
      'Configurar seu pipeline de vendas',
      'Adicionar membros da equipe',
      'Configurar sua agência e logotipo',
    ],
  },
  {
    icon: '👥',
    color: '#1DD3C0',
    title: 'CRM & Clientes',
    desc: 'Gestão de leads, clientes e pipeline',
    articles: [
      'Criar e organizar leads no Kanban',
      'Histórico de atendimento por cliente',
      'Segmentar clientes por perfil e interesse',
      'Automatizar follow-ups com IA',
      'Relatórios de conversão e funil',
    ],
  },
  {
    icon: '💰',
    color: '#D4AF37',
    title: 'Financeiro',
    desc: 'Orçamentos, comissões e relatórios',
    articles: [
      'Criar e enviar orçamentos',
      'Calcular e controlar comissões',
      'Dashboard financeiro por período',
      'Conciliar pagamentos recebidos',
      'Exportar relatórios para contabilidade',
    ],
  },
  {
    icon: '💬',
    color: '#7C3AED',
    title: 'Atendimento',
    desc: 'WhatsApp, e-mail e inbox unificado',
    articles: [
      'Conectar seu WhatsApp Business',
      'Configurar respostas rápidas',
      'Usar o inbox unificado',
      'Transferir atendimentos entre agentes',
      'Métricas de tempo de resposta',
    ],
  },
  {
    icon: '🌐',
    color: '#059669',
    title: 'Site & Marketing',
    desc: 'Geração e personalização do seu site',
    articles: [
      'Gerar seu site em minutos com IA',
      'Personalizar cores e conteúdo',
      'Publicar pacotes e roteiros',
      'Configurar formulário de captação',
      'Conectar domínio próprio',
    ],
  },
  {
    icon: '🤖',
    color: '#DC2626',
    title: 'IA Operacional',
    desc: 'Assistente de IA e automações',
    articles: [
      'Como funciona o assistente de IA',
      'Gerar roteiros e propostas com IA',
      'Configurar automações de follow-up',
      'IA para análise de conversas',
      'Limites de uso por plano',
    ],
  },
];

const FAQS = [
  {
    q: 'Posso importar meus clientes de uma planilha Excel?',
    a: 'Sim! A Noro Guru aceita importação via CSV/Excel com mapeamento automático de colunas. Acesse Clientes → Importar e siga o assistente.',
  },
  {
    q: 'Como conectar meu WhatsApp Business?',
    a: 'Vá em Configurações → Integrações → WhatsApp. Escaneie o QR code com seu WhatsApp Business. O processo leva menos de 2 minutos.',
  },
  {
    q: 'O site gerado é hospedado onde?',
    a: 'Os sites são hospedados na infraestrutura da Noro Guru (no Brasil) com CDN global. Você pode apontar seu domínio próprio gratuitamente a partir do plano Profissional.',
  },
  {
    q: 'Posso usar em múltiplos dispositivos?',
    a: 'Sim, a plataforma funciona em qualquer navegador — desktop, tablet ou celular. Aplicativos nativos estão no roadmap para 2026.',
  },
  {
    q: 'Como cancelar minha assinatura?',
    a: 'Acesse Configurações → Assinatura → Cancelar. Seus dados ficam disponíveis por 90 dias após o cancelamento para exportação.',
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredCategories = CATEGORIES.filter(
    (cat) =>
      !search ||
      cat.title.toLowerCase().includes(search.toLowerCase()) ||
      cat.articles.some((a) => a.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>

      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0D1526 0%, #0B1220 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '96px 24px 80px',
          textAlign: 'center',
        }}
      >
        <div style={{ maxWidth: 680, margin: '0 auto' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 40 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Voltar
          </Link>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(28px, 5vw, 48px)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.03em',
              margin: '0 0 16px',
            }}
          >
            Como podemos ajudar?
          </h1>
          <p style={{ fontSize: 16, color: '#B8C1E0', margin: '0 0 36px', lineHeight: 1.6 }}>
            Encontre respostas, tutoriais e guias para tirar o máximo da Noro Guru.
          </p>

          {/* Search */}
          <div style={{ position: 'relative', maxWidth: 520, margin: '0 auto' }}>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#B8C1E0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
            >
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar artigos, tutoriais..."
              style={{
                width: '100%',
                padding: '14px 16px 14px 48px',
                background: '#12152C',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12,
                fontSize: 15,
                color: '#fff',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Quick links */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 8, marginTop: 20 }}>
            {['Importar clientes', 'Conectar WhatsApp', 'Criar orçamento', 'Gerar site'].map((q) => (
              <button
                key={q}
                onClick={() => setSearch(q)}
                style={{
                  fontSize: 13,
                  color: '#B8C1E0',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 999,
                  padding: '5px 14px',
                  cursor: 'pointer',
                }}
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 24px 96px' }}>

        {/* Categories */}
        <div style={{ marginBottom: 96 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
              margin: '0 0 32px',
            }}
          >
            Categorias {search && `· "${search}"`}
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 20,
            }}
          >
            {(filteredCategories.length > 0 ? filteredCategories : CATEGORIES).map((cat) => (
              <div
                key={cat.title}
                style={{
                  background: '#12152C',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: 28,
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: `${cat.color}22`,
                    border: `1px solid ${cat.color}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    marginBottom: 14,
                  }}
                >
                  {cat.icon}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 16,
                    fontWeight: 700,
                    color: '#fff',
                    margin: '0 0 4px',
                  }}
                >
                  {cat.title}
                </h3>
                <p style={{ fontSize: 13, color: '#B8C1E0', margin: '0 0 16px' }}>{cat.desc}</p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {cat.articles.map((article) => (
                    <li key={article}>
                      <a
                        href="#"
                        style={{
                          fontSize: 13,
                          color: '#B8C1E0',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <span style={{ color: cat.color, fontSize: 10 }}>▶</span>
                        {article}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginBottom: 96 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
              margin: '0 0 28px',
            }}
          >
            Perguntas frequentes
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {FAQS.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: '#12152C',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 10,
                  overflow: 'hidden',
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '18px 24px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    gap: 16,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 15,
                      fontWeight: 600,
                      color: '#fff',
                    }}
                  >
                    {faq.q}
                  </span>
                  <span
                    style={{
                      fontSize: 20,
                      color: '#342CA4',
                      transform: openFaq === i ? 'rotate(45deg)' : 'none',
                      transition: 'transform .2s',
                      flexShrink: 0,
                    }}
                  >
                    +
                  </span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 20px' }}>
                    <p style={{ fontSize: 14, color: '#B8C1E0', margin: 0, lineHeight: 1.7 }}>
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contact support */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          {[
            {
              icon: '💬',
              color: '#1DD3C0',
              title: 'Chat ao vivo',
              desc: 'Fale com nossa equipe agora. Disponível de segunda a sexta, das 9h às 18h.',
              action: 'Iniciar chat',
              href: '/demo',
            },
            {
              icon: '📧',
              color: '#342CA4',
              title: 'E-mail',
              desc: 'Envie sua dúvida e respondemos em até 4 horas em dias úteis.',
              action: 'suporte@noro.guru',
              href: 'mailto:suporte@noro.guru',
            },
            {
              icon: '📚',
              color: '#D4AF37',
              title: 'Base de conhecimento',
              desc: 'Mais de 200 artigos e tutoriais em vídeo no nosso centro de ajuda.',
              action: 'Ver tutoriais',
              href: '#',
            },
          ].map((channel) => (
            <div
              key={channel.title}
              style={{
                background: '#12152C',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 14,
                padding: 28,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 14 }}>{channel.icon}</div>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 17,
                  fontWeight: 700,
                  color: '#fff',
                  margin: '0 0 8px',
                }}
              >
                {channel.title}
              </h3>
              <p style={{ fontSize: 14, color: '#B8C1E0', margin: '0 0 20px', lineHeight: 1.6 }}>
                {channel.desc}
              </p>
              <a
                href={channel.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 13,
                  fontWeight: 700,
                  color: channel.color,
                  textDecoration: 'none',
                }}
              >
                {channel.action} →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
