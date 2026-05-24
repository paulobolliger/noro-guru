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
      <Values />
      <Features />
      <Testimonials />
      <Ecosystem />

      {/* CTA final — gradient purple */}
      <section
        style={{
          background: 'linear-gradient(135deg, #342CA4 0%, #232452 100%)',
          padding: '96px 24px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Orb glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 600,
            height: 400,
            background: 'radial-gradient(ellipse, rgba(29,211,192,0.15) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ position: 'relative', zIndex: 10, maxWidth: 700, margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 4.5vw, 48px)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 0 20px',
            }}
          >
            Pronto para modernizar sua agência?
          </h2>

          <p
            style={{
              fontSize: 18,
              color: 'rgba(255,255,255,0.75)',
              lineHeight: 1.55,
              margin: '0 0 40px',
            }}
          >
            Configure sua agência em menos de uma hora. Sem implantação, sem contrato anual. Suporte humano em PT-BR.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
            <Link
              href="https://app.noro.guru"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: '#fff',
                color: '#342CA4',
                borderRadius: 10,
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 700,
                textDecoration: 'none',
                letterSpacing: '-0.01em',
              }}
            >
              Começar gratuitamente
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link
              href="/demo"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                background: 'transparent',
                color: '#fff',
                borderRadius: 10,
                padding: '14px 28px',
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                border: '1px solid rgba(255,255,255,0.35)',
              }}
            >
              Falar com especialista
            </Link>
          </div>

          {/* Trust indicators */}
          <div style={{ display: 'flex', gap: 28, justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              'Sem cartão de crédito',
              'Cancele a qualquer momento',
              'Suporte humano em PT-BR',
            ].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(29,211,192,0.9)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
