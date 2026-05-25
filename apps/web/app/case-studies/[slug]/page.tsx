import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const CASES: Record<string, {
  agency: string;
  location: string;
  segment: string;
  size: string;
  color: string;
  photo: string;
  contact: string;
  contactRole: string;
  quote: string;
  metrics: Array<{ label: string; value: string; period: string }>;
  features: string[];
  challenge: string;
  solution: string;
  results: string;
  timeline: string;
}> = {
  'viagens-experienza': {
    agency: 'Viagens Experienza',
    location: 'São Paulo, SP',
    segment: 'Viagens corporativas',
    size: '8 consultores',
    color: '#342CA4',
    photo: 'VE',
    contact: 'Juliana Fonseca',
    contactRole: 'Diretora',
    quote: 'Em 6 meses, saímos de planilhas para um CRM completo. O faturamento cresceu 40% e hoje atendo o dobro de clientes com o mesmo time.',
    metrics: [
      { label: 'Crescimento de faturamento', value: '+40%', period: 'em 6 meses' },
      { label: 'Clientes atendidos/mês', value: '2×', period: 'mesmo time' },
      { label: 'Tempo por orçamento', value: '-60%', period: 'com IA' },
    ],
    features: ['CRM', 'IA Operacional', 'Financeiro'],
    challenge: 'A Viagens Experienza operava com 4 planilhas diferentes, WhatsApp pessoal dos consultores e nenhuma visibilidade financeira centralizada. Leads caíam com frequência e o time de 8 consultores passava horas por dia em tarefas repetitivas — principalmente geração de propostas.',
    solution: 'Implantamos o CRM Noro Guru em 2 semanas, com migração de toda a base de contatos. A IA Operacional foi configurada para gerar rascunhos de proposta a partir das informações do lead, e o módulo Financeiro passou a receber automaticamente cada venda fechada como conta a receber.',
    results: 'Em 6 meses, o faturamento cresceu 40% sem aumentar o time. A taxa de follow-up subiu de 45% para 98% — o CRM não deixa mais nada cair. O tempo médio para gerar uma proposta caiu de 45 minutos para menos de 10.',
    timeline: 'Implantação em 2 semanas · Primeiros resultados em 30 dias · ROI positivo em 45 dias',
  },
  'destinos-do-mundo': {
    agency: 'Destinos do Mundo',
    location: 'Rio de Janeiro, RJ',
    segment: 'Turismo de luxo',
    size: '3 consultores',
    color: '#1DD3C0',
    photo: 'DM',
    contact: 'Carlos Mendes',
    contactRole: 'Sócio-fundador',
    quote: 'O site gerado pela IA converteu 3× mais que nosso site antigo. E o inbox unificado resolveu o caos de WhatsApp com planilha que a gente tinha.',
    metrics: [
      { label: 'Taxa de conversão do site', value: '3×', period: 'vs site antigo' },
      { label: 'Tempo de resposta', value: '-70%', period: 'com inbox unificado' },
      { label: 'NPS dos clientes', value: '82', period: 'vs 54 antes' },
    ],
    features: ['Sites com IA', 'Atendimento', 'WhatsApp'],
    challenge: 'Com apenas 3 consultores atendendo um público de alto padrão, a Destinos do Mundo precisava de presença digital profissional e resposta rápida. O site antigo tinha 0,8% de conversão e as mensagens de WhatsApp se misturavam com o pessoal dos consultores.',
    solution: 'Geramos o site institucional via Wizard em menos de 20 minutos. O Inbox Unificado conectou 3 números de WhatsApp e o email corporativo em um painel só. O chatbot com IA passa a triagem 24/7 e só escala para consultores quando o lead está qualificado.',
    results: 'O novo site converteu 3× mais leads no primeiro mês. O NPS subiu de 54 para 82 — clientes relatam respostas mais rápidas e acompanhamento mais personalizado. O tempo de primeira resposta caiu de 4 horas para menos de 40 minutos.',
    timeline: 'Site no ar em 1 dia · Inbox configurado em 2 dias · Primeira proposta via IA em 1 semana',
  },
  'terra-mar-viagens': {
    agency: 'Terra & Mar Viagens',
    location: 'Curitiba, PR',
    segment: 'Ecoturismo e aventura',
    size: '5 consultores',
    color: '#D4AF37',
    photo: 'TM',
    contact: 'Ana Beatriz Rocha',
    contactRole: 'CEO',
    quote: 'Migrei de um sistema caro e complicado para a Noro Guru em 2 semanas. Os relatórios financeiros que antes tomavam horas agora ficam prontos em segundos.',
    metrics: [
      { label: 'Tempo de migração', value: '2 sem', period: 'setup completo' },
      { label: 'Redução de custo de software', value: '-45%', period: 'vs ferramenta anterior' },
      { label: 'Produtividade da equipe', value: '+35%', period: 'em 3 meses' },
    ],
    features: ['Financeiro', 'CRM', 'Relatórios'],
    challenge: 'A Terra & Mar pagava R$2.800/mês em três sistemas separados (ERP, CRM e site). Os dados não se comunicavam e o fechamento financeiro mensal exigia 2 dias de trabalho manual para conciliar tudo.',
    solution: 'Consolidamos tudo no Noro Guru: CRM substituiu o sistema legado, o Financeiro assumiu o controle de caixa e o site foi migrado para o gerador com IA. A migração de dados foi feita pela nossa equipe em uma única semana.',
    results: 'Custo de software caiu 45% — de R$2.800 para R$1.540/mês. O fechamento mensal agora demora 30 minutos. Em 3 meses, a produtividade subiu 35% com consultores gastando menos tempo em administração.',
    timeline: 'Proposta aprovada · Migração em 7 dias · Operação plena em 14 dias',
  },
  'sol-e-lua-turismo': {
    agency: 'Sol e Lua Turismo',
    location: 'Fortaleza, CE',
    segment: 'Turismo doméstico',
    size: '12 consultores',
    color: '#7C3AED',
    photo: 'SL',
    contact: 'Marcos Oliveira',
    contactRole: 'Diretor Comercial',
    quote: 'A Noro Guru permitiu que nossa equipe de 12 pessoas trabalhasse como uma equipe de 20. A IA sugere os próximos passos e os consultores focam no que importa: vender.',
    metrics: [
      { label: 'Leads qualificados/mês', value: '+80%', period: 'com IA de prospecção' },
      { label: 'Ticket médio', value: '+22%', period: 'com upsell assistido por IA' },
      { label: 'Churn de clientes', value: '-30%', period: 'com follow-up automático' },
    ],
    features: ['IA Operacional', 'CRM', 'Financeiro'],
    challenge: 'Com 12 consultores e crescimento acelerado, a Sol e Lua estava perdendo leads por falta de acompanhamento e deixando dinheiro na mesa por não identificar oportunidades de upsell. O gestor comercial passava 3h/dia em reuniões de alinhamento operacional.',
    solution: 'A IA Operacional foi configurada para sugerir o próximo passo de cada negócio: qual lead reativar, qual cliente está pronto para upgrade, qual destino sugerir baseado no histórico. O pipeline visual permite que o gestor veja tudo em 5 minutos.',
    results: 'Leads qualificados subiram 80% sem aumentar verba de marketing — a IA identificou oportunidades dormentes na base. Ticket médio cresceu 22% com sugestões de upsell contextualizadas. Churn caiu 30% com follow-up automatizado pós-viagem.',
    timeline: 'Onboarding em 3 semanas (12 consultores) · Primeiros resultados em 45 dias',
  },
};

export async function generateStaticParams() {
  return Object.keys(CASES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const c = CASES[params.slug];
  if (!c) return { title: 'Case não encontrado | Noro Guru' };
  return {
    title: `${c.agency} — Case de Sucesso | Noro Guru`,
    description: c.quote,
  };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const c = CASES[params.slug];
  if (!c) notFound();

  const otherCases = Object.entries(CASES).filter(([slug]) => slug !== params.slug);

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg,#0D1526 0%,#0B1220 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '80px 24px 60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(ellipse at 30% 50%, ${c.color}18 0%, transparent 60%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative' }}>
          <Link href="/cases" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 32 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Cases de sucesso
          </Link>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
            {/* Avatar */}
            <div style={{ width: 72, height: 72, borderRadius: 20, background: `${c.color}33`, border: `2px solid ${c.color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: c.color, flexShrink: 0 }}>{c.photo}</div>
            <div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {c.features.map((f) => (
                  <span key={f} style={{ fontSize: 11, fontWeight: 700, color: c.color, background: `${c.color}18`, border: `1px solid ${c.color}33`, borderRadius: 6, padding: '3px 10px', letterSpacing: '0.04em' }}>{f}</span>
                ))}
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3.5vw,40px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 8px', lineHeight: 1.1 }}>{c.agency}</h1>
              <div style={{ fontSize: 14, color: '#B8C1E0' }}>📍 {c.location} · {c.segment} · {c.size}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px 96px', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 48, alignItems: 'start' }}>
        {/* Main content */}
        <div>
          {/* Quote */}
          <blockquote style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontStyle: 'italic', color: '#E0E3FF', lineHeight: 1.65, margin: '0 0 8px', borderLeft: `4px solid ${c.color}`, paddingLeft: 20 }}>
            &ldquo;{c.quote}&rdquo;
          </blockquote>
          <p style={{ fontSize: 13, color: '#B8C1E0', fontWeight: 600, margin: '0 0 48px', paddingLeft: 24 }}>— {c.contact} · {c.contactRole}, {c.agency}</p>

          {/* Desafio */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>⚡</span> O desafio
            </h2>
            <p style={{ fontSize: 15, color: '#B8C1E0', lineHeight: 1.75, margin: 0 }}>{c.challenge}</p>
          </div>

          {/* Solução */}
          <div style={{ marginBottom: 40 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>🔧</span> A solução
            </h2>
            <p style={{ fontSize: 15, color: '#B8C1E0', lineHeight: 1.75, margin: 0 }}>{c.solution}</p>
          </div>

          {/* Resultados */}
          <div style={{ marginBottom: 48 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 18 }}>📈</span> Os resultados
            </h2>
            <p style={{ fontSize: 15, color: '#B8C1E0', lineHeight: 1.75, margin: '0 0 20px' }}>{c.results}</p>
            <div style={{ fontSize: 12, color: '#B8C1E0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '10px 16px', fontFamily: 'var(--font-mono)' }}>{c.timeline}</div>
          </div>

          {/* Other cases */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 40 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 20px' }}>Outros cases</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {otherCases.slice(0, 3).map(([slug, other]) => (
                <Link key={slug} href={`/case-studies/${slug}`} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '12px 16px', textDecoration: 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${other.color}25`, border: `1px solid ${other.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: other.color, flexShrink: 0 }}>{other.photo}</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>{other.agency}</div>
                    <div style={{ fontSize: 11, color: '#B8C1E0' }}>{other.segment} · {other.location}</div>
                  </div>
                  <svg style={{ marginLeft: 'auto', color: '#B8C1E0' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ position: 'sticky', top: 24 }}>
          {/* Metrics */}
          <div style={{ background: '#12152C', border: `1px solid ${c.color}30`, borderRadius: 14, padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: c.color, fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', marginBottom: 20 }}>RESULTADOS</div>
            {c.metrics.map((m) => (
              <div key={m.label} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: c.color, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 4 }}>{m.value}</div>
                <div style={{ fontSize: 12, color: '#B8C1E0', lineHeight: 1.4 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: '#B8C1E0', opacity: 0.6 }}>{m.period}</div>
              </div>
            ))}
          </div>

          {/* Features used */}
          <div style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 24, marginBottom: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#B8C1E0', fontFamily: 'var(--font-mono)', letterSpacing: '0.1em', marginBottom: 16 }}>FUNCIONALIDADES USADAS</div>
            {c.features.map((f) => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: 13, color: '#D1D5F0' }}>
                <span style={{ color: c.color }}>✓</span> {f}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ background: `linear-gradient(135deg, ${c.color}20 0%, transparent 100%)`, border: `1px solid ${c.color}30`, borderRadius: 14, padding: 24, textAlign: 'center' }}>
            <p style={{ fontSize: 14, color: '#E0E3FF', lineHeight: 1.6, margin: '0 0 16px' }}>Quer resultados como esses na sua agência?</p>
            <Link href="/demo" style={{ display: 'block', background: c.color, color: c.color === '#D4AF37' ? '#0B1220' : '#fff', borderRadius: 8, padding: '12px 0', fontSize: 14, fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>Agendar demo gratuita →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
