import { redirect } from 'next/navigation';
import { getCurrentUser } from '@noro/lib/services/authService';
import LoginForm from './LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { redirect?: string; error?: string };
}) {
  const user = await getCurrentUser();

  if (user) {
    return redirect(searchParams.redirect || '/');
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: '100vh',
        background: '#fff',
      }}
    >
      {/* ── LEFT — form ──────────────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          padding: '40px 56px',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: '#232452',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 15,
              letterSpacing: '.02em',
            }}
          >
            N
          </div>
          <div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 14,
                letterSpacing: '-.012em',
                color: '#1f2433',
              }}
            >
              NORO Guru
            </div>
            <div
              style={{
                fontSize: 10.5,
                color: 'rgba(31,36,51,0.5)',
                fontFamily: 'monospace',
              }}
            >
              app.noro.guru
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ maxWidth: 360, width: '100%', margin: '0 auto' }}>
          <h1
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: '-.02em',
              margin: 0,
              color: '#1f2433',
            }}
          >
            Bem-vindo de volta
          </h1>
          <p
            style={{
              fontSize: 14,
              color: 'rgba(31,36,51,0.55)',
              marginTop: 8,
              marginBottom: 28,
            }}
          >
            Entre para gerenciar sua agência, leads e roteiros.
          </p>

          {searchParams.error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 8,
                padding: '10px 14px',
                marginBottom: 16,
                fontSize: 13,
                color: '#dc2626',
              }}
            >
              {searchParams.error}
            </div>
          )}

          <LoginForm redirectTo={searchParams.redirect} />
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: 11,
            color: 'rgba(31,36,51,0.45)',
            display: 'flex',
            gap: 16,
          }}
        >
          <span>© 2026 NORO Guru</span>
          <span>Termos</span>
          <span>Privacidade</span>
          <span style={{ marginLeft: 'auto' }}>PT-BR</span>
        </div>
      </div>

      {/* ── RIGHT — hero ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'relative',
          background: 'linear-gradient(160deg, #232452 0%, #161637 100%)',
          color: '#fff',
          padding: '40px 48px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            right: -120,
            top: -120,
            width: 480,
            height: 480,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.08)',
            background:
              'radial-gradient(circle at 30% 30%, rgba(25,184,168,0.15), transparent 60%)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: 60,
            top: 100,
            width: 280,
            height: 280,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.10)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: -200,
            bottom: -100,
            width: 360,
            height: 360,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at center, rgba(25,184,168,0.25), transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Badge */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <span
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '.14em',
              textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.1)',
              padding: '5px 10px',
              borderRadius: 999,
              color: '#19b8a8',
            }}
          >
            Plataforma para agências
          </span>
        </div>

        {/* Main headline */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 420 }}>
          <h2
            style={{
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: '-.025em',
              lineHeight: 1.08,
              margin: 0,
            }}
          >
            Sua agência inteira em um só lugar.
          </h2>
          <p
            style={{
              fontSize: 15,
              color: 'rgba(255,255,255,0.7)',
              marginTop: 14,
              lineHeight: 1.5,
            }}
          >
            CRM, pedidos, cobranças PIX, roteiros gerados por IA e o seu
            próprio site de vendas — sem precisar de outros sistemas.
          </p>

          <div
            style={{ display: 'flex', gap: 24, marginTop: 28, flexWrap: 'wrap' }}
          >
            {[
              { v: '+2.400', l: 'agências' },
              { v: 'R$ 18M', l: 'em pedidos/mês' },
              { v: '98%', l: 'uptime' },
            ].map((s) => (
              <div key={s.l}>
                <div
                  style={{
                    fontFamily: 'monospace',
                    fontSize: 22,
                    fontWeight: 700,
                    color: '#19b8a8',
                    letterSpacing: '-.01em',
                  }}
                >
                  {s.v}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.55)',
                    letterSpacing: '.04em',
                    textTransform: 'uppercase',
                    marginTop: 2,
                  }}
                >
                  {s.l}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex' }}>
            {['#f59e0b', '#ec4899', '#06b6d4'].map((c, i) => (
              <div
                key={i}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: c,
                  border: '2px solid #232452',
                  marginLeft: i ? -10 : 0,
                }}
              />
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
            <strong style={{ color: '#fff' }}>Joana, Carlos e +800</strong>{' '}
            agências confiam na NORO.
          </div>
        </div>
      </div>
    </div>
  );
}
