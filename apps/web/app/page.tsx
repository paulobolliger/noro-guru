import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Values from '@/components/Values';
import Testimonials from '@/components/Testimonials';
import Ecosystem from '@/components/Ecosystem';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Values />
      <Testimonials />
      <Ecosystem />

      {/* CTA final */}
      <section style={{
        padding: '96px 24px',
        background: '#232452',
      }}>
        <div style={{
          maxWidth: 720,
          margin: '0 auto',
          textAlign: 'center',
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.08)',
            borderRadius: 999,
            padding: '6px 14px',
            fontSize: 12, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase',
            color: '#19b8a8',
            marginBottom: 28,
          }}>
            14 dias grátis · sem cartão
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(36px, 5vw, 60px)',
            fontWeight: 400,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
            color: '#fff',
            margin: '0 0 20px',
          }}>
            Sua agência no próximo nível —{' '}
            <em style={{ fontStyle: 'italic', color: '#19b8a8' }}>começa hoje.</em>
          </h2>

          <p style={{
            fontSize: 17,
            color: 'rgba(255,255,255,0.6)',
            lineHeight: 1.55,
            margin: '0 0 40px',
          }}>
            Configure sua agência em menos de uma hora. Sem implantação, sem contrato anual, sem complicação. Suporte humano em português do Brasil.
          </p>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link
              href="https://app.noro.guru"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#19b8a8',
                color: '#232452',
                borderRadius: 12,
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 800,
                textDecoration: 'none',
                letterSpacing: '-.01em',
              }}
            >
              Começar grátis por 14 dias
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link
              href="/pricing"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.1)',
                color: '#fff',
                borderRadius: 12,
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              Ver planos e preços
            </Link>
          </div>

          <div style={{
            display: 'flex',
            gap: 28,
            justifyContent: 'center',
            marginTop: 40,
            flexWrap: 'wrap',
          }}>
            {[
              'Sem cartão de crédito',
              'Cancele a qualquer momento',
              'Suporte humano em PT-BR',
            ].map((item) => (
              <div key={item} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 13,
                color: 'rgba(255,255,255,0.5)',
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#19b8a8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
