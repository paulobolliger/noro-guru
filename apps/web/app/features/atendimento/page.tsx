import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Atendimento Omnichannel para Agências | Noro Guru',
  description: 'Inbox unificado com WhatsApp, email e chat. Chatbot com IA, SLA configurável e histórico completo por cliente.',
};

const FEATURES = [
  { icon: '📥', title: 'Inbox unificado', desc: 'WhatsApp, e-mail e chat em um painel só. Sem alternar entre abas, sem mensagens perdidas.' },
  { icon: '🤖', title: 'Chatbot com IA', desc: 'Triagem automática 24/7. A IA responde dúvidas frequentes e escalona para o consultor quando necessário.' },
  { icon: '⏱️', title: 'SLA configurável', desc: 'Defina tempos máximos de resposta por canal. Alertas automáticos quando SLA está em risco.' },
  { icon: '🔀', title: 'Transferência entre agentes', desc: 'Passe atendimentos com histórico completo. O cliente não precisa se repetir.' },
  { icon: '⚡', title: 'Respostas rápidas', desc: 'Biblioteca de templates por situação. O consultor escolhe, personaliza e envia em segundos.' },
  { icon: '📋', title: 'Histórico completo', desc: 'Todo contato do cliente, independente do canal, no mesmo histórico cronológico.' },
];

export default function AtendimentoFeaturePage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(180deg,#0D1526 0%,#0B1220 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '96px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 400, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(124,58,237,0.15) 0%,transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <Link href="/features" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 24 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Funcionalidades
          </Link>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>Atendimento Omnichannel</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 18px' }}>
            Nunca perca uma<br />mensagem de cliente
          </h1>
          <p style={{ fontSize: 17, color: '#B8C1E0', lineHeight: 1.65, margin: '0 0 32px', maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
            WhatsApp, email e chat em um inbox só. A IA faz a triagem, o consultor fecha a venda.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#7C3AED', color: '#fff', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>Agendar demo →</Link>
            <Link href="/pricing" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: '#E0E3FF', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '13px 20px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Ver planos</Link>
          </div>
        </div>
      </div>
      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px 96px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 12, overflow: 'hidden', marginBottom: 80 }}>
          {[{ v: '-70%', l: 'Tempo de resposta médio' }, { v: '0', l: 'Mensagens perdidas' }, { v: '24/7', l: 'Atendimento com IA' }].map((m) => (
            <div key={m.l} style={{ background: '#12152C', padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 36, fontWeight: 800, color: '#7C3AED', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>{m.v}</div>
              <div style={{ fontSize: 13, color: '#B8C1E0' }}>{m.l}</div>
            </div>
          ))}
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 32px', textAlign: 'center' }}>Um inbox para todos os canais</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20, marginBottom: 80 }}>
          {FEATURES.map((f) => (
            <div key={f.title} style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 28 }}>
              <div style={{ fontSize: 32, marginBottom: 14 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#B8C1E0', margin: 0, lineHeight: 1.65 }}>{f.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ background: 'linear-gradient(135deg,rgba(124,58,237,0.15) 0%,rgba(52,44,164,0.08) 100%)', border: '1px solid rgba(124,58,237,0.25)', borderRadius: 16, padding: '48px 40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 12px' }}>Organize o atendimento da sua agência</h2>
          <p style={{ fontSize: 15, color: '#B8C1E0', margin: '0 0 28px', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>Conecte WhatsApp em menos de 2 minutos. Setup guiado.</p>
          <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#7C3AED', color: '#fff', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>Ver demonstração →</Link>
        </div>
      </div>
    </div>
  );
}
