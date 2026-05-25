import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Segurança | Noro Guru',
  description: 'Como a Noro Guru protege seus dados com criptografia, auditorias e conformidade com os mais altos padrões de segurança.',
};

const PILLARS = [
  {
    icon: '🔐',
    color: '#342CA4',
    title: 'Criptografia de ponta a ponta',
    desc: 'Todos os dados em repouso usam AES-256. Em trânsito, TLS 1.3 em todas as conexões. Chaves gerenciadas com rotação automática trimestral.',
  },
  {
    icon: '🏗️',
    color: '#1DD3C0',
    title: 'Infraestrutura no Brasil',
    desc: 'Servidores em data centers tier-3 localizados em São Paulo, com certificação ISO 27001. Nenhum dado sai do território nacional sem autorização.',
  },
  {
    icon: '🔍',
    color: '#D4AF37',
    title: 'Auditorias independentes',
    desc: 'Realizamos pentests trimestrais com empresas independentes. Resultados disponíveis para clientes Enterprise mediante NDA.',
  },
  {
    icon: '👁️',
    color: '#7C3AED',
    title: 'Monitoramento 24/7',
    desc: 'SIEM ativo com alertas em tempo real para anomalias de acesso. Logs imutáveis com retenção de 12 meses para rastreabilidade completa.',
  },
  {
    icon: '🛡️',
    color: '#059669',
    title: 'Controle de acesso',
    desc: 'RBAC granular por agência, MFA obrigatório para admins, sessões com timeout automático e IP allowlisting disponível para Enterprise.',
  },
  {
    icon: '⚡',
    color: '#DC2626',
    title: 'Resposta a incidentes',
    desc: 'Plano de resposta a incidentes documentado. Notificação aos titulares em até 72h conforme LGPD. SLA de contenção de 4 horas para P0.',
  },
];

const CERTS = [
  { label: 'ISO 27001', desc: 'Gestão de Segurança da Informação', status: 'Em processo' },
  { label: 'SOC 2 Type II', desc: 'Controles de segurança e disponibilidade', status: 'Em processo' },
  { label: 'LGPD', desc: 'Lei Geral de Proteção de Dados', status: 'Compliant ✓' },
  { label: 'PCI DSS', desc: 'Segurança de dados de pagamento', status: 'Via Stripe ✓' },
];

export default function SegurancaPage() {
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
        {/* Orb */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 600,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(52,44,164,0.2) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        <div style={{ maxWidth: 760, margin: '0 auto', position: 'relative' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 40 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            Voltar
          </Link>

          {/* Shield icon */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: 'rgba(52,44,164,0.2)',
              border: '1px solid rgba(52,44,164,0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              margin: '0 auto 28px',
            }}
          >
            🛡️
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
            Segurança é prioridade,<br />não um extra
          </h1>
          <p style={{ fontSize: 18, color: '#B8C1E0', margin: '0 0 40px', lineHeight: 1.6, maxWidth: 560, marginLeft: 'auto', marginRight: 'auto' }}>
            Cada dado da sua agência é protegido com os mesmos padrões de empresas do setor financeiro.
          </p>

          {/* Trust badges */}
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 10 }}>
            {['AES-256', 'TLS 1.3', 'LGPD Compliant', 'Dados no Brasil 🇧🇷', '99.95% Uptime'].map((badge) => (
              <span
                key={badge}
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#1DD3C0',
                  background: 'rgba(29,211,192,0.1)',
                  border: '1px solid rgba(29,211,192,0.25)',
                  borderRadius: 999,
                  padding: '5px 14px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '80px 24px 96px' }}>

        {/* Security Pillars */}
        <div style={{ marginBottom: 96 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(24px, 3vw, 36px)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
              margin: '0 0 48px',
              textAlign: 'center',
            }}
          >
            Como protegemos seus dados
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 24,
            }}
          >
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                style={{
                  background: '#12152C',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 14,
                  padding: 28,
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${pillar.color}22`,
                    border: `1px solid ${pillar.color}44`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    marginBottom: 16,
                  }}
                >
                  {pillar.icon}
                </div>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 17,
                    fontWeight: 700,
                    color: '#fff',
                    margin: '0 0 10px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {pillar.title}
                </h3>
                <p style={{ fontSize: 14, color: '#B8C1E0', margin: 0, lineHeight: 1.65 }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Architecture */}
        <div
          style={{
            background: '#12152C',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 16,
            padding: '48px 40px',
            marginBottom: 96,
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
              margin: '0 0 32px',
            }}
          >
            Arquitetura de segurança
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 1,
              background: 'rgba(255,255,255,0.06)',
              borderRadius: 10,
              overflow: 'hidden',
            }}
          >
            {[
              { layer: 'Camada 1', name: 'WAF + DDoS', detail: 'Cloudflare Enterprise' },
              { layer: 'Camada 2', name: 'Load Balancer', detail: 'TLS Termination' },
              { layer: 'Camada 3', name: 'API Gateway', detail: 'Rate limiting + Auth' },
              { layer: 'Camada 4', name: 'Aplicação', detail: 'Isolamento por tenant' },
              { layer: 'Camada 5', name: 'Banco de dados', detail: 'Row-level security' },
              { layer: 'Camada 6', name: 'Storage', detail: 'AES-256 at rest' },
            ].map((layer) => (
              <div
                key={layer.layer}
                style={{
                  background: '#0B1220',
                  padding: '20px 24px',
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: '#342CA4',
                    fontFamily: 'var(--font-mono)',
                    marginBottom: 6,
                  }}
                >
                  {layer.layer}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                  {layer.name}
                </div>
                <div style={{ fontSize: 13, color: '#B8C1E0' }}>{layer.detail}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div style={{ marginBottom: 96 }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 28,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
              margin: '0 0 32px',
              textAlign: 'center',
            }}
          >
            Certificações e conformidade
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 16,
            }}
          >
            {CERTS.map((cert) => (
              <div
                key={cert.label}
                style={{
                  background: '#12152C',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 12,
                  padding: 24,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#342CA4',
                  }}
                >
                  {cert.label}
                </div>
                <div style={{ fontSize: 13, color: '#D1D5F0' }}>{cert.desc}</div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: cert.status.includes('✓') ? '#1DD3C0' : '#D4AF37',
                    marginTop: 4,
                  }}
                >
                  {cert.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Vulnerability Disclosure */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(52,44,164,0.15) 0%, rgba(29,211,192,0.08) 100%)',
            border: '1px solid rgba(52,44,164,0.3)',
            borderRadius: 16,
            padding: '48px 40px',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 20 }}>🔎</div>
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
            Encontrou uma vulnerabilidade?
          </h2>
          <p style={{ fontSize: 15, color: '#B8C1E0', margin: '0 0 28px', maxWidth: 480, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.6 }}>
            Temos um programa de divulgação responsável. Reporte de forma privada e trabalharemos juntos para corrigir com agilidade.
          </p>
          <a
            href="mailto:security@noro.guru"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: '#342CA4',
              color: '#fff',
              borderRadius: 10,
              padding: '12px 28px',
              fontSize: 15,
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            security@noro.guru
          </a>
          <p style={{ fontSize: 13, color: '#B8C1E0', marginTop: 16 }}>
            Resposta garantida em até 48 horas · PGP disponível sob solicitação
          </p>
        </div>
      </div>
    </div>
  );
}
