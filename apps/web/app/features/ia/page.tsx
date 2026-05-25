import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'IA Operacional para Agências de Turismo | Noro Guru',
  description: 'Economize 2h por dia com IA. Geração de roteiros, propostas automáticas, conteúdo para redes e follow-ups inteligentes.',
};

const FEATURES = [
  { icon: '✈️', title: 'Roteiros de viagem', desc: 'Descreva o destino e o perfil do cliente — a IA monta o itinerário completo em segundos.' },
  { icon: '📄', title: 'Propostas automáticas', desc: 'O rascunho já vem pronto com os dados do cliente. O consultor revisa e personaliza em minutos.' },
  { icon: '📱', title: 'Conteúdo para redes', desc: 'Posts para Instagram e WhatsApp sobre destinos, dicas e promoções gerados com um clique.' },
  { icon: '💬', title: 'Follow-up inteligente', desc: 'A IA detecta o melhor momento para contato e sugere a mensagem certa para reativar o lead.' },
  { icon: '📝', title: 'Resumo de conversas', desc: 'Cada atendimento resumido automaticamente. O consultor sabe o contexto sem ler 200 mensagens.' },
  { icon: '💡', title: 'Custo transparente', desc: 'Veja exatamente quanto de IA você consome por mês. Sem surpresas na fatura.' },
];

export default function IaFeaturePage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(180deg,#0D1526 0%,#0B1220 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '96px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 500, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(212,175,55,0.12) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <Link href="/features" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 24 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Funcionalidades
          </Link>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#D4AF37', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>IA Operacional</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 18px' }}>
            Economize 2 horas por dia.<br />Todo dia.
          </h1>
          <p style={{ fontSize: 17, color: '#B8C1E0', lineHeight: 1.65, margin: '0 0 32px', maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
            A IA da Noro Guru não substitui o consultor — ela elimina o trabalho repetitivo para ele focar no que realmente importa: o cliente.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#D4AF37', color: '#0B1220', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>✨ Ver IA em ação →</Link>
            <Link href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: '#E0E3FF', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '13px 20px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Ver planos</Link>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px 96px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', marginBottom: 80 }}>
          {[{ v: '2,3h', l: 'Economizadas por consultor/dia' }, { v: '-60%', l: 'Tempo para gerar proposta' }, { v: '+35%', l: 'Velocidade de resposta a leads' }, { v: '100%', l: 'Custo visível e controlável' }].map((m) => (
            <div key={m.l} style={{ background: '#12152C', padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: '#D4AF37', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>{m.v}</div>
              <div style={{ fontSize: 12, color: '#B8C1E0' }}>{m.l}</div>
            </div>
          ))}
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 32px', textAlign: 'center' }}>O que a IA faz por você</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20, marginBottom: 80 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#B8C1E0', margin: 0, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 14, padding: '32px 40px', textAlign: 'center', marginBottom: 80 }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontStyle: 'italic', color: '#E0E3FF', lineHeight: 1.6, margin: '0 0 12px' }}>&ldquo;Antes eu passava 3 horas por dia editando propostas. Hoje a IA faz o rascunho em 2 minutos e eu gasto 15 minutos personalizando.&rdquo;</p>
          <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0 }}>— Juliana Fonseca · Viagens Experienza, SP</p>
        </div>
        <div style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.15) 0%,rgba(52,44,164,0.1) 100%)', border: '1px solid rgba(212,175,55,0.25)', borderRadius: 16, padding: '48px 40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 12px' }}>Comece a usar IA hoje</h2>
          <p style={{ fontSize: 15, color: '#B8C1E0', margin: '0 0 28px', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>Disponível em todos os planos. Custo por uso, controlado e visível.</p>
          <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#D4AF37', color: '#0B1220', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>✨ Agendar demonstração</Link>
        </div>
      </div>
    </div>
  );
}
