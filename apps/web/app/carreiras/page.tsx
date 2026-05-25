import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Carreiras | Noro Guru',
  description: 'Junte-se à Noro Guru e ajude a construir o futuro das agências de turismo no Brasil.',
};

const OPENINGS = [
  {
    role: 'Senior Full-Stack Engineer',
    area: 'Engenharia',
    type: 'Remoto',
    level: 'Senior',
    desc: 'Construir e escalar as funcionalidades core da plataforma (Next.js, TypeScript, Supabase). Você vai definir arquitetura e mentorear devs juniores.',
    skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
    color: '#342CA4',
  },
  {
    role: 'Product Designer (UI/UX)',
    area: 'Design',
    type: 'Remoto',
    level: 'Pleno',
    desc: 'Projetar experiências para agentes de viagem — dashboards, fluxos de atendimento e sites gerados por IA. Parceria direta com o CEO e engineering.',
    skills: ['Figma', 'Design Systems', 'Prototipagem', 'Research'],
    color: '#1DD3C0',
  },
  {
    role: 'Head of Customer Success',
    area: 'Customer Success',
    type: 'Híbrido (SP)',
    level: 'Senior',
    desc: 'Liderar o time de CS, definir playbooks de onboarding e expansão de receita (NRR). Você vai ser a voz do cliente dentro da Noro Guru.',
    skills: ['SaaS', 'Onboarding', 'Churn reduction', 'Upsell'],
    color: '#D4AF37',
  },
  {
    role: 'Sales Development Representative',
    area: 'Comercial',
    type: 'Remoto',
    level: 'Júnior',
    desc: 'Prospecção outbound de agências de turismo no Brasil. Você vai qualificar leads e agendar demos para os AEs. Treinamento completo fornecido.',
    skills: ['Prospecção', 'CRM', 'Turismo', 'Comunicação'],
    color: '#7C3AED',
  },
];

const VALUES = [
  { icon: '🚀', title: 'Mova rápido', desc: 'Shipping > perfeito. Iteramos semanalmente com feedback real de agências.' },
  { icon: '🤝', title: 'Autonomia real', desc: 'Sem microgestão. Você define como e quando trabalha, desde que entregue.' },
  { icon: '📈', title: 'Aprenda sempre', desc: 'Budget anual de R$ 3.000 para cursos, livros e conferências.' },
  { icon: '🇧🇷', title: 'Impacto no Brasil', desc: 'Estamos modernizando um setor inteiro. Cada linha de código importa.' },
];

const BENEFITS = [
  'Salário competitivo em BRL + equity',
  'Plano de saúde Amil (você + dependentes)',
  'Trabalho 100% remoto',
  'Home office allowance: R$ 2.500 único',
  'Budget de aprendizado: R$ 3.000/ano',
  'Day off no aniversário',
  'Retiro anual do time (presencial)',
  'Equipamento MacBook fornecido',
];

export default function CarreirasPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>

      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0D1526 0%, #0B1220 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '96px 24px 80px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 700,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(52,44,164,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ maxWidth: 680, margin: '0 auto', position: 'relative' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 40 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Voltar
          </Link>

          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(29,211,192,0.1)',
              border: '1px solid rgba(29,211,192,0.3)',
              borderRadius: 999,
              padding: '6px 16px',
              fontSize: 12,
              fontWeight: 700,
              color: '#1DD3C0',
              marginBottom: 24,
            }}
          >
            🟢 {OPENINGS.length} vagas abertas
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 0 20px',
            }}
          >
            Construa o futuro<br />do turismo no Brasil
          </h1>
          <p style={{ fontSize: 17, color: '#B8C1E0', lineHeight: 1.65, margin: 0, maxWidth: 520, marginLeft: 'auto', marginRight: 'auto' }}>
            Somos um time pequeno e ambicioso. Cada pessoa aqui tem impacto real.
            Se você quer trabalhar em produto que agências de verdade usam todo dia, este é o lugar.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px 96px' }}>

        {/* Values */}
        <div style={{ marginBottom: 96 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
              margin: '0 0 32px',
              textAlign: 'center',
            }}
          >
            Como trabalhamos
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 20,
            }}
          >
            {VALUES.map((v) => (
              <div
                key={v.title}
                style={{
                  background: '#12152C',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12,
                  padding: 24,
                }}
              >
                <div style={{ fontSize: 28, marginBottom: 12 }}>{v.icon}</div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#fff',
                    margin: '0 0 8px',
                  }}
                >
                  {v.title}
                </h3>
                <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0, lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Job openings */}
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
            Vagas abertas
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {OPENINGS.map((job) => (
              <div
                key={job.role}
                style={{
                  background: '#12152C',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: '28px 32px',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 24,
                  alignItems: 'start',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: job.color,
                        background: `${job.color}22`,
                        border: `1px solid ${job.color}44`,
                        borderRadius: 6,
                        padding: '3px 10px',
                        fontFamily: 'var(--font-mono)',
                      }}
                    >
                      {job.area}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#B8C1E0',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 6,
                        padding: '3px 10px',
                      }}
                    >
                      {job.type}
                    </span>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: '#B8C1E0',
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 6,
                        padding: '3px 10px',
                      }}
                    >
                      {job.level}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 19,
                      fontWeight: 700,
                      color: '#fff',
                      margin: '0 0 10px',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {job.role}
                  </h3>
                  <p style={{ fontSize: 14, color: '#B8C1E0', margin: '0 0 16px', lineHeight: 1.65, maxWidth: 560 }}>
                    {job.desc}
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {job.skills.map((skill) => (
                      <span
                        key={skill}
                        style={{
                          fontSize: 12,
                          color: '#D1D5F0',
                          background: 'rgba(255,255,255,0.06)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: 6,
                          padding: '3px 10px',
                          fontFamily: 'var(--font-mono)',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href="mailto:carreiras@noro.guru"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    background: '#342CA4',
                    color: '#fff',
                    borderRadius: 10,
                    padding: '11px 22px',
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  Candidatar-se
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
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
            Benefícios
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 12,
            }}
          >
            {BENEFITS.map((benefit) => (
              <div
                key={benefit}
                style={{
                  background: '#12152C',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 10,
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  fontSize: 14,
                  color: '#D1D5F0',
                }}
              >
                <span style={{ color: '#1DD3C0', fontSize: 16 }}>✓</span>
                {benefit}
              </div>
            ))}
          </div>
        </div>

        {/* Open application */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(52,44,164,0.2) 0%, rgba(29,211,192,0.08) 100%)',
            border: '1px solid rgba(52,44,164,0.3)',
            borderRadius: 16,
            padding: '48px 40px',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 26,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
              margin: '0 0 12px',
            }}
          >
            Não achou sua vaga?
          </h2>
          <p style={{ fontSize: 15, color: '#B8C1E0', margin: '0 0 28px', maxWidth: 440, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Mandamos candidaturas espontâneas para o mesmo lugar. Nos conte o que você faz e como pode ajudar.
          </p>
          <a
            href="mailto:carreiras@noro.guru"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#342CA4',
              color: '#fff',
              borderRadius: 10,
              padding: '13px 28px',
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            carreiras@noro.guru
          </a>
        </div>
      </div>
    </div>
  );
}
