import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Crie o Site da sua Agência de Viagens com IA | Noro Guru',
  description: 'Gere um site profissional de alta conversão para sua agência de turismo em minutos. Com SEO otimizado, botão de WhatsApp e CRM integrado.',
};

export default function SitesLandingPage() {
  const mainSiteUrl = process.env.NEXT_PUBLIC_MAIN_SITE_URL || 'http://localhost:3000';
  const ctaUrl = `${mainSiteUrl}/auth/sign-in?redirect_uri=/wizard`;

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', color: '#fff', fontFamily: 'Inter, sans-serif' }}>
      
      {/* Header */}
      <header style={{
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '20px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(11, 18, 32, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 24 }}>✨</span>
          <span style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #1DD3C0 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            NORO SITES
          </span>
        </div>
        <a href={ctaUrl} style={{
          background: 'rgba(29, 211, 192, 0.1)',
          border: '1px solid rgba(29, 211, 192, 0.3)',
          color: '#1DD3C0',
          borderRadius: 8,
          padding: '10px 20px',
          fontSize: 14,
          fontWeight: 700,
          textDecoration: 'none',
          transition: 'all 0.2s ease',
        }}>
          Acessar Painel
        </a>
      </header>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '120px 24px 80px',
        textAlign: 'center',
        overflow: 'hidden',
        background: 'radial-gradient(circle at 50% 0%, rgba(29, 211, 192, 0.08) 0%, transparent 60%)'
      }}>
        {/* Glow Orb */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 600,
          height: 300,
          background: 'radial-gradient(ellipse, rgba(29, 211, 192, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }} />

        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(29, 211, 192, 0.08)',
            border: '1px solid rgba(29, 211, 192, 0.15)',
            padding: '8px 16px',
            borderRadius: 100,
            fontSize: 13,
            color: '#1DD3C0',
            fontWeight: 600,
            marginBottom: 28,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            ⚡ Gerador de Sites com Inteligência Artificial
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 6vw, 64px)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            margin: '0 0 24px',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #D2D6E5 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            O site perfeito para sua <br />
            <span style={{ background: 'linear-gradient(90deg, #1DD3C0 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Agência de Turismo
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2.5vw, 20px)',
            color: '#B8C1E0',
            lineHeight: 1.6,
            maxWidth: 620,
            margin: '0 auto 44px',
            fontWeight: 400
          }}>
            Responda a algumas perguntas simples e nossa IA cria seu site completo, otimizado para celular, com redação de vendas de alta conversão e botão de WhatsApp integrado.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            <a href={ctaUrl} style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'linear-gradient(90deg, #1DD3C0 0%, #059669 100%)',
              color: '#0B1220',
              borderRadius: 12,
              padding: '16px 36px',
              fontSize: 16,
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(29, 211, 192, 0.25)',
              transition: 'all 0.2s ease',
              letterSpacing: '-0.01em'
            }}>
              ✨ Gerar Meu Site Grátis
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>

            <div style={{ display: 'flex', gap: 24, justifyContent: 'center', flexWrap: 'wrap', marginTop: 12 }}>
              {[
                'Sem cartão de crédito',
                'Instalação em 2 minutos',
                'Email verificado obrigatório'
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#B8C1E0' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1DD3C0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{
        maxWidth: 1100,
        margin: '0 auto',
        padding: '60px 24px 100px'
      }}>
        <h2 style={{
          textAlign: 'center',
          fontSize: 32,
          fontWeight: 800,
          letterSpacing: '-0.02em',
          marginBottom: 60
        }}>
          Por que usar o Noro Sites?
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24
        }}>
          {[
            {
              icon: '🤖',
              title: 'Copywriting de Alta Conversão',
              desc: 'Nossa IA escreve textos persuasivos e específicos de turismo baseados na proposta de valor da sua agência.'
            },
            {
              icon: '🎨',
              title: 'Cores e Variedade Sem Custo',
              desc: 'Cada site gerado possui uma combinação de cores única baseada em HSL e estruturas exclusivas para cada cliente.'
            },
            {
              icon: '⚡',
              title: '100% Mobile & Ultra Rápido',
              desc: 'Seus clientes viajam pelo celular. O site é totalmente responsivo e carrega instantaneamente.'
            },
            {
              icon: '📊',
              title: 'Captação de Clientes Integrada',
              desc: 'A base de captação qualifica o contato no CRM da sua agência e conecta direto no WhatsApp.'
            },
            {
              icon: '🛡️',
              title: 'Cadastro Seguro anti-Bot',
              desc: 'Proteção contra automações maliciosas via Cloudflare Turnstile, com verificação obrigatória de e-mail por código OTP.'
            },
            {
              icon: '🌐',
              title: 'Domínio Personalizado (Upgrade)',
              desc: 'Hospede no nosso subdomínio gratuitamente ou mapeie seu domínio próprio (.com.br) contratando um plano ERP/CRM.'
            }
          ].map((feat) => (
            <div key={feat.title} style={{
              background: '#12152C',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: '32px',
              transition: 'transform 0.2s ease, border-color 0.2s ease',
            }}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{feat.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{feat.title}</h3>
              <p style={{ fontSize: 14, color: '#B8C1E0', lineHeight: 1.6, margin: 0 }}>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Block */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(29, 211, 192, 0.08) 0%, rgba(5, 150, 105, 0.04) 100%)',
        borderTop: '1px solid rgba(29, 211, 192, 0.15)',
        borderBottom: '1px solid rgba(29, 211, 192, 0.15)',
        padding: '80px 24px',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 16 }}>
            Seu site no ar hoje
          </h2>
          <p style={{ fontSize: 16, color: '#B8C1E0', lineHeight: 1.6, marginBottom: 36 }}>
            Cadastre sua conta com verificação segura em segundos, customize as cores e deixe a inteligência artificial fazer todo o trabalho pesado.
          </p>
          <a href={ctaUrl} style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'linear-gradient(90deg, #1DD3C0 0%, #059669 100%)',
            color: '#0B1220',
            borderRadius: 12,
            padding: '16px 36px',
            fontSize: 16,
            fontWeight: 800,
            textDecoration: 'none',
            boxShadow: '0 8px 32px rgba(29, 211, 192, 0.25)',
            transition: 'all 0.2s ease',
            letterSpacing: '-0.01em'
          }}>
            🚀 Começar Agora Grátis
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '40px 24px',
        textAlign: 'center',
        fontSize: 13,
        color: '#B8C1E0',
        borderTop: '1px solid rgba(255,255,255,0.06)'
      }}>
        <p>© 2026 Noro Guru. Todos os direitos reservados. Termos de Uso · Política de Privacidade.</p>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 8 }}>
          Powered by Noro Guru — ERP, CRM e Sites Inteligentes para Agências de Turismo.
        </p>
      </footer>

    </div>
  );
}
