import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Programa de Afiliados | Noro Guru',
  description: 'Indique agências de turismo e ganhe comissão recorrente. Simples, transparente e automático.',
};

const STEPS = [
  { n: '01', title: 'Cadastre-se grátis', desc: 'Crie sua conta de afiliado em menos de 2 minutos. Sem burocracia, sem taxas.' },
  { n: '02', title: 'Compartilhe seu link', desc: 'Receba um link rastreado único. Use em redes sociais, grupos, email ou onde quiser.' },
  { n: '03', title: 'A agência assina', desc: 'Quando uma agência ativa uma conta paga pelo seu link, você começa a ganhar.' },
  { n: '04', title: 'Receba todo mês', desc: 'Comissões calculadas automaticamente e pagas via PIX no dia 15 de cada mês.' },
];

const FAQ = [
  { q: 'Quanto vou ganhar?', a: '15% da mensalidade de cada agência indicada, pelos primeiros 12 meses ativos. Sem teto.' },
  { q: 'Quando recebo?', a: 'Pagamentos no dia 15 de cada mês, via PIX, para todas as comissões consolidadas do mês anterior.' },
  { q: 'Tem algum custo para participar?', a: 'Nenhum. O programa é gratuito e não há mínimo de indicações.' },
  { q: 'Posso ser afiliado sem ser do setor de turismo?', a: 'Sim! Qualquer pessoa pode ser afiliado — influenciadores digitais, podcasters, blogueiros ou simplesmente quem conhece agências.' },
  { q: 'Como funciona o rastreamento?', a: 'Cada link tem um código único com cookie de 60 dias. Se a agência assinar dentro desse prazo, a comissão é sua.' },
  { q: 'Existe limite de indicações?', a: 'Não. Quanto mais agências você indicar, mais você ganha. Simples assim.' },
];

export default function AffiliatePage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(180deg,#0D1526 0%,#0B1220 100%)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '96px 24px 80px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(ellipse,rgba(29,211,192,0.1) 0%,transparent 70%)', pointerEvents: 'none', transform: 'translate(30%,-30%)' }} />
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#1DD3C0', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>Programa de Afiliados</div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 20px' }}>
            Indique. Ganhe.<br />Todo mês.
          </h1>
          <p style={{ fontSize: 17, color: '#B8C1E0', lineHeight: 1.65, margin: '0 0 12px', maxWidth: 540, marginLeft: 'auto', marginRight: 'auto' }}>
            Ganhe 15% de comissão recorrente por cada agência de turismo que você indicar para a Noro Guru.
          </p>
          <p style={{ fontSize: 14, color: '#B8C1E0', margin: '0 0 36px' }}>Sem burocracia. Sem mínimo. Pago via PIX todo mês.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#cadastro" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1DD3C0', color: '#0B1220', borderRadius: 10, padding: '13px 28px', fontSize: 15, fontWeight: 800, textDecoration: 'none' }}>Quero ser afiliado →</a>
            <a href="#como-funciona" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.07)', color: '#E0E3FF', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '13px 20px', fontSize: 15, fontWeight: 600, textDecoration: 'none' }}>Como funciona</a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px 96px' }}>
        {/* Calculator preview */}
        <div style={{ background: '#12152C', border: '1px solid rgba(29,211,192,0.2)', borderRadius: 16, padding: '40px', marginBottom: 80, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1DD3C0', fontFamily: 'var(--font-mono)', marginBottom: 16 }}>CALCULADORA DE GANHOS</div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: '#B8C1E0', marginBottom: 8 }}>Agências indicadas por mês</div>
              <div style={{ display: 'flex', gap: 8 }}>
                {[1, 3, 5, 10].map((n) => (
                  <div key={n} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '8px 16px', fontSize: 14, color: '#D1D5F0', cursor: 'default' }}>{n}</div>
                ))}
              </div>
            </div>
            <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0, lineHeight: 1.6 }}>Com 5 agências no plano Profissional (R$397/mês), você ganha <strong style={{ color: '#1DD3C0' }}>R$297/mês</strong> — recorrente por 12 meses.</p>
          </div>
          <div>
            {[
              { agencias: 1, plano: 'Starter', valor: 'R$43/mês' },
              { agencias: 5, plano: 'Profissional', valor: 'R$297/mês' },
              { agencias: 10, plano: 'Profissional', valor: 'R$595/mês' },
            ].map((row) => (
              <div key={row.agencias} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <span style={{ fontSize: 13, color: '#B8C1E0' }}>{row.agencias} agência{row.agencias > 1 ? 's' : ''} · {row.plano}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#1DD3C0' }}>{row.valor}</span>
              </div>
            ))}
          </div>
        </div>

        {/* How it works */}
        <h2 id="como-funciona" style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 40px', textAlign: 'center' }}>Como funciona</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20, marginBottom: 80 }}>
          {STEPS.map((s) => (
            <div key={s.n} style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: 28 }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 800, color: 'rgba(29,211,192,0.3)', marginBottom: 16, lineHeight: 1 }}>{s.n}</div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>{s.title}</h3>
              <p style={{ fontSize: 14, color: '#B8C1E0', margin: 0, lineHeight: 1.65 }}>{s.desc}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 32px', textAlign: 'center' }}>Perguntas frequentes</h2>
        <div style={{ marginBottom: 80 }}>
          {FAQ.map((item) => (
            <div key={item.q} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '20px 0' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{item.q}</div>
              <div style={{ fontSize: 14, color: '#B8C1E0', lineHeight: 1.65 }}>{item.a}</div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div id="cadastro" style={{ background: 'linear-gradient(135deg,rgba(29,211,192,0.15) 0%,rgba(52,44,164,0.08) 100%)', border: '1px solid rgba(29,211,192,0.25)', borderRadius: 16, padding: '56px 40px', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', margin: '0 0 12px' }}>Comece a ganhar hoje</h2>
          <p style={{ fontSize: 16, color: '#B8C1E0', margin: '0 0 32px', maxWidth: 400, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>Cadastro gratuito. Primeiro pagamento no dia 15 do mês seguinte à sua primeira indicação.</p>
          <Link href="/demo" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#1DD3C0', color: '#0B1220', borderRadius: 10, padding: '14px 32px', fontSize: 16, fontWeight: 800, textDecoration: 'none' }}>Criar conta de afiliado →</Link>
          <div style={{ marginTop: 16, fontSize: 13, color: '#B8C1E0' }}>Também quer revender? <Link href="/partners" style={{ color: '#1DD3C0', textDecoration: 'none' }}>Veja o programa de parceiros →</Link></div>
        </div>
      </div>
    </div>
  );
}
