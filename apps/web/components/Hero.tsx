import React from 'react';
import Link from 'next/link';

// Social-proof logos
const LOGOS = ['Wanderlust', 'Voa Brasil', 'Honda Viagens', 'Topázio Tours', 'Atlas & Co.', 'Mirante'];

// Stats
const STATS = [
  { v: '+2.400', l: 'agências ativas' },
  { v: 'R$ 18M', l: 'em pedidos/mês' },
  { v: '14 dias', l: 'de teste grátis' },
];

const Hero: React.FC = () => {
  return (
    <>
      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section style={{
        maxWidth: 1320, margin: '0 auto',
        padding: '80px 56px 56px',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.05fr)',
        gap: 64, alignItems: 'center',
      }}>
        {/* Left — copy */}
        <div>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(35,36,82,0.07)', border: '1px solid rgba(35,36,82,0.12)',
            borderRadius: 999, padding: '6px 14px',
            fontSize: 12, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
            color: '#232452',
          }}>
            SaaS para agências de viagem · Brasil
          </div>

          {/* Headline */}
          <h1 style={{
            marginTop: 22,
            fontFamily: 'var(--font-display, Georgia)',
            fontSize: 'clamp(40px, 5vw, 62px)',
            fontWeight: 600,
            letterSpacing: '-0.025em',
            lineHeight: 1.06,
            color: '#1f2433',
          }}>
            Sua agência<br/>no{' '}
            <em style={{ fontStyle: 'italic', color: '#232452', fontWeight: 500 }}>próximo nível</em>.
          </h1>

          <p style={{
            marginTop: 22,
            fontSize: 18.5, lineHeight: 1.5,
            color: 'rgba(31,36,51,0.65)',
            maxWidth: 520,
          }}>
            CRM, financeiro, marketing e o site da sua agência — tudo num só portal,
            feito para o jeito brasileiro de vender viagem.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 12, marginTop: 32, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link
              href="/register"
              style={{
                padding: '13px 24px', borderRadius: 10,
                background: '#232452', color: '#fff',
                fontSize: 15, fontWeight: 700, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
                boxShadow: '0 4px 16px rgba(35,36,82,0.35)',
              }}
            >
              Começar grátis por 14 dias
            </Link>
            <Link
              href="/demo"
              style={{
                padding: '13px 24px', borderRadius: 10,
                border: '1.5px solid #dfe2ea', background: '#fff',
                color: '#1f2433', fontSize: 15, fontWeight: 600,
                textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              Ver demonstração (2 min)
            </Link>
          </div>

          {/* Trust bullets */}
          <div style={{
            marginTop: 32, display: 'flex', alignItems: 'center', gap: 20,
            fontSize: 12.5, color: 'rgba(31,36,51,0.55)', flexWrap: 'wrap',
          }}>
            {['Sem cartão de crédito', 'Migração em 48h', 'Suporte humano em PT-BR'].map((t) => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ color: '#19b8a8', fontSize: 14 }}>✓</span>
                {t}
              </div>
            ))}
          </div>
        </div>

        {/* Right — portal mockup */}
        <div style={{ position: 'relative', height: 480 }}>
          {/* Background card */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #232452 0%, #161637 100%)',
            borderRadius: 24,
            overflow: 'hidden',
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', right: -80, top: -80, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(25,184,168,0.2), transparent 65%)' }}/>
            <div style={{ position: 'absolute', left: -60, bottom: -60, width: 240, height: 240, borderRadius: '50%', background: 'radial-gradient(circle, rgba(25,184,168,0.1), transparent 65%)' }}/>

            {/* Fake portal UI */}
            <div style={{ position: 'absolute', inset: 0, padding: '28px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Topbar mock */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: '#19b8a8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, color: '#232452' }}>N</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '-.01em' }}>NORO Guru</div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                  {['#fff', '#fff', '#fff'].map((c, i) => (
                    <div key={i} style={{ width: 22, height: 22, borderRadius: 6, background: 'rgba(255,255,255,0.1)' }}/>
                  ))}
                </div>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                {[
                  { label: 'Receita do mês', value: 'R$ 142k', delta: '+18%', c: 'rgba(255,255,255,0.08)' },
                  { label: 'Leads ativos', value: '38', delta: '+12', c: 'rgba(25,184,168,0.15)' },
                  { label: 'A receber', value: 'R$ 38k', delta: '3 cobr.', c: 'rgba(255,255,255,0.06)' },
                ].map((s) => (
                  <div key={s.label} style={{ background: s.c, borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.5)', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>{s.label}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginTop: 4, letterSpacing: '-.01em' }}>{s.value}</div>
                    <div style={{ fontSize: 10, color: '#19b8a8', fontWeight: 700, marginTop: 2 }}>{s.delta}</div>
                  </div>
                ))}
              </div>

              {/* Bar chart */}
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 10, padding: '14px', flex: 1 }}>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600, marginBottom: 12 }}>RECEITA POR MÊS</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 80 }}>
                  {[30, 45, 28, 60, 50, 75, 65, 90, 78, 102, 88, 120].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${(h/120)*100}%`, borderRadius: '3px 3px 1px 1px', background: i === 11 ? '#19b8a8' : 'rgba(255,255,255,0.15)' }}/>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Floating badge — AI response */}
          <div style={{
            position: 'absolute', right: -32, bottom: 56,
            background: '#232452', color: '#fff', borderRadius: 14,
            padding: '14px 18px',
            boxShadow: '0 20px 40px -16px rgba(15,16,32,.55)',
            maxWidth: 230, border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{ fontFamily: 'monospace', fontSize: 9.5, color: '#19b8a8', letterSpacing: '.1em', fontWeight: 600 }}>NORO IA · AGORA</div>
            <div style={{ fontSize: 12.5, marginTop: 6, lineHeight: 1.45, color: 'rgba(255,255,255,0.9)' }}>
              "Maria fechou as Maldivas. Envio a confirmação e roteiro pelo WhatsApp?"
            </div>
          </div>

          {/* Floating badge — growth */}
          <div style={{
            position: 'absolute', left: -32, top: 60,
            background: '#fff', borderRadius: 14,
            padding: '14px 18px',
            boxShadow: '0 20px 40px -16px rgba(15,20,40,.25)',
            display: 'flex', alignItems: 'center', gap: 12,
            border: '1px solid #eceef3',
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(25,184,168,0.12)', color: '#19b8a8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>↗</div>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(31,36,51,0.5)', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>Vendas no mês</div>
              <div style={{ fontFamily: 'var(--font-display, Georgia)', fontSize: 22, fontWeight: 600, letterSpacing: '-0.01em', color: '#1f2433' }}>+ 38%</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Logos band ───────────────────────────────────────────── */}
      <section style={{
        maxWidth: 1320, margin: '0 auto',
        padding: '32px 56px',
        borderTop: '1px solid #eceef3',
        borderBottom: '1px solid #eceef3',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 24, flexWrap: 'wrap',
        }}>
          <div style={{ fontSize: 11.5, color: 'rgba(31,36,51,0.45)', textTransform: 'uppercase', letterSpacing: '.1em', fontWeight: 600 }}>
            + 480 agências em 23 estados
          </div>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
            {LOGOS.map((n) => (
              <span key={n} style={{
                fontFamily: 'var(--font-display, Georgia)',
                fontSize: 18, fontWeight: 500, fontStyle: 'italic',
                color: 'rgba(31,36,51,0.35)', letterSpacing: '-0.01em',
              }}>{n}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats band ───────────────────────────────────────────── */}
      <section style={{
        maxWidth: 1320, margin: '0 auto',
        padding: '48px 56px',
        display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap',
      }}>
        {STATS.map((s) => (
          <div key={s.l} style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-display, Georgia)', fontSize: 42, fontWeight: 600, letterSpacing: '-0.02em', color: '#232452' }}>{s.v}</div>
            <div style={{ fontSize: 13, color: 'rgba(31,36,51,0.5)', marginTop: 4, fontWeight: 500 }}>{s.l}</div>
          </div>
        ))}
      </section>
    </>
  );
};

export default Hero;
