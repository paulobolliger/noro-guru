import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Política de Privacidade | Noro Guru',
  description: 'Como a Noro Guru coleta, usa e protege seus dados pessoais, em conformidade com a LGPD.',
};

const TOC = [
  'Introdução',
  'Dados que coletamos',
  'Como usamos seus dados',
  'Compartilhamento de dados',
  'Seus direitos (LGPD)',
  'Cookies e rastreamento',
  'Segurança',
  'Alterações nesta política',
  'Contato',
];

export default function PrivacyPolicyPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', padding: '80px 24px 96px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>

        {/* Back link */}
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 40 }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 5l-7 7 7 7"/>
          </svg>
          Voltar
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 40,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              margin: '0 0 12px',
            }}
          >
            Política de Privacidade
          </h1>
          <p style={{ fontSize: 14, color: '#B8C1E0', margin: 0 }}>
            Última atualização: 24 de maio de 2026
          </p>
        </div>

        {/* TOC */}
        <div
          style={{
            background: '#12152C',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: 24,
            marginBottom: 48,
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#B8C1E0', marginBottom: 16 }}>
            Índice
          </div>
          <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TOC.map((item, i) => (
              <li key={item}>
                <a
                  href={`#sec-${i + 1}`}
                  style={{ fontSize: 14, color: '#1DD3C0', textDecoration: 'none', display: 'flex', gap: 8, alignItems: 'center' }}
                >
                  <span style={{ fontSize: 12, color: '#B8C1E0', fontFamily: 'var(--font-mono)', width: 20 }}>{i + 1}.</span>
                  {item}
                </a>
              </li>
            ))}
          </ol>
        </div>

        {/* Content */}
        <div style={{ fontSize: 16, color: '#D1D5F0', lineHeight: 1.8 }}>

          {[
            {
              id: 'sec-1',
              title: '1. Introdução',
              content: 'A Noro Guru respeita sua privacidade e está comprometida em proteger seus dados pessoais. Esta Política de Privacidade informa como coletamos, usamos e protegemos seus dados quando você usa nossa plataforma, em conformidade com a Lei Geral de Proteção de Dados (LGPD — Lei nº 13.709/2018).',
            },
            {
              id: 'sec-2',
              title: '2. Dados que coletamos',
              content: 'Coletamos dados que você nos fornece diretamente (nome, e-mail, CNPJ, dados de pagamento) e dados gerados pelo uso da plataforma (logs de acesso, preferências, histórico de ações). Também coletamos dados técnicos como endereço IP, tipo de navegador e dispositivo.',
            },
            {
              id: 'sec-3',
              title: '3. Como usamos seus dados',
              content: 'Usamos seus dados para: (a) prestar os serviços contratados; (b) enviar comunicações sobre a plataforma; (c) melhorar a experiência do produto; (d) cumprir obrigações legais; (e) prevenir fraudes e garantir segurança. Não vendemos seus dados para terceiros.',
            },
            {
              id: 'sec-4',
              title: '4. Compartilhamento de dados',
              content: 'Compartilhamos dados apenas com: parceiros de infraestrutura necessários para operar a plataforma (ex: processadores de pagamento, CDN); autoridades quando exigido por lei; terceiros com seu consentimento explícito. Todos os parceiros assinam acordos de processamento de dados (DPA).',
            },
            {
              id: 'sec-5',
              title: '5. Seus direitos (LGPD)',
              content: 'Você tem direito a: confirmar a existência de tratamento; acessar seus dados; corrigir dados incompletos ou desatualizados; solicitar anonimização, bloqueio ou eliminação; revogar consentimento; portabilidade dos dados. Para exercer esses direitos, entre em contato: privacidade@noro.guru',
            },
            {
              id: 'sec-6',
              title: '6. Cookies e rastreamento',
              content: 'Usamos cookies essenciais (necessários para funcionamento), cookies de análise (para entender como você usa a plataforma, via dados agregados e anonimizados) e cookies de preferências (para lembrar suas configurações). Você pode gerenciar cookies pelo painel de privacidade.',
            },
            {
              id: 'sec-7',
              title: '7. Segurança',
              content: 'Todos os dados são armazenados em servidores no Brasil, com criptografia AES-256 em repouso e TLS 1.3 em trânsito. Realizamos auditorias de segurança periódicas e monitoramento contínuo contra acessos não autorizados. Em caso de incidente, notificaremos os titulares em até 72 horas.',
            },
            {
              id: 'sec-8',
              title: '8. Alterações nesta política',
              content: 'Podemos atualizar esta política periodicamente. Quando houver alterações materiais, notificaremos por e-mail e dentro da plataforma com pelo menos 30 dias de antecedência. O uso continuado após a data de vigência implica aceite das novas condições.',
            },
            {
              id: 'sec-9',
              title: '9. Contato',
              content: 'Para dúvidas sobre privacidade e proteção de dados: privacidade@noro.guru | Encarregado de Dados (DPO): Rafael Souza | Noro Guru — Nomade Group | São Paulo, SP, Brasil.',
            },
          ].map((section) => (
            <div key={section.id} id={section.id} style={{ marginBottom: 40 }}>
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 22,
                  fontWeight: 600,
                  color: '#fff',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  paddingBottom: 12,
                  margin: '0 0 16px',
                }}
              >
                {section.title}
              </h2>
              <p style={{ margin: 0 }}>{section.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
