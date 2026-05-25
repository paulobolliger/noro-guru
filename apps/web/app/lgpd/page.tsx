import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'LGPD | Noro Guru',
  description: 'Como a Noro Guru aplica a Lei Geral de Proteção de Dados (LGPD) e seus direitos como titular.',
};

export default function LGPDPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', padding: '80px 24px 96px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 40 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Voltar
        </Link>

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(29,211,192,0.1)', border: '1px solid rgba(29,211,192,0.3)', borderRadius: 999, padding: '6px 16px', fontSize: 12, fontWeight: 700, color: '#1DD3C0', marginBottom: 24 }}>
          🇧🇷 Dados no Brasil · LGPD Compliant
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 700, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, margin: '0 0 12px' }}>
          Noro Guru e a LGPD
        </h1>
        <p style={{ fontSize: 14, color: '#B8C1E0', margin: '0 0 48px' }}>Última atualização: 24 de maio de 2026</p>

        <div style={{ fontSize: 16, color: '#D1D5F0', lineHeight: 1.8 }}>
          {[
            {
              title: 'Nosso compromisso',
              content: 'A Noro Guru está em conformidade com a Lei Geral de Proteção de Dados Pessoais (LGPD — Lei nº 13.709/2018). Tratamos seus dados com responsabilidade, transparência e segurança.',
            },
            {
              title: 'Seus direitos como titular',
              content: 'A LGPD garante os seguintes direitos: (1) Confirmação da existência de tratamento; (2) Acesso aos dados; (3) Correção de dados incompletos, inexatos ou desatualizados; (4) Anonimização, bloqueio ou eliminação; (5) Portabilidade dos dados; (6) Informação sobre compartilhamento; (7) Revogação de consentimento; (8) Oposição ao tratamento.',
            },
            {
              title: 'Base legal para tratamento',
              content: 'Tratamos seus dados com base em: execução contratual (art. 7º, V), cumprimento de obrigação legal (art. 7º, II), interesses legítimos (art. 7º, IX) e consentimento explícito quando necessário (art. 7º, I). Nunca tratamos dados sem uma base legal válida.',
            },
            {
              title: 'Encarregado de Dados (DPO)',
              content: 'Nossa Encarregada de Dados (DPO) é responsável por garantir a conformidade com a LGPD e atender requisições de titulares. Contato: privacidade@noro.guru',
            },
            {
              title: 'Como exercer seus direitos',
              content: 'Para exercer qualquer direito previsto na LGPD, envie um e-mail para privacidade@noro.guru com seu nome, CPF/CNPJ e a descrição do pedido. Respondemos em até 15 dias corridos.',
            },
            {
              title: 'Armazenamento no Brasil',
              content: 'Todos os dados pessoais tratados pela Noro Guru são armazenados em servidores localizados no Brasil, em infraestrutura certificada. Transferências internacionais são realizadas apenas quando necessário para prestação do serviço e com garantias adequadas.',
            },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: 40 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: 12, margin: '0 0 16px' }}>
                {section.title}
              </h2>
              <p style={{ margin: 0 }}>{section.content}</p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div style={{ background: '#12152C', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 28, marginTop: 16 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: '#fff', margin: '0 0 8px' }}>Dúvidas sobre privacidade?</h3>
          <p style={{ fontSize: 14, color: '#B8C1E0', margin: '0 0 16px' }}>Nossa equipe de proteção de dados está disponível para ajudar.</p>
          <a href="mailto:privacidade@noro.guru" style={{ fontSize: 14, fontWeight: 700, color: '#1DD3C0', textDecoration: 'none' }}>
            privacidade@noro.guru →
          </a>
        </div>
      </div>
    </div>
  );
}
