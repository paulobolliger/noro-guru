import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Termos de Uso | Noro Guru',
  description: 'Termos e condições de uso da plataforma Noro Guru. Conheça seus direitos e obrigações.',
};

const TOC = [
  { id: 'aceitacao', label: 'Aceitação dos termos' },
  { id: 'descricao', label: 'Descrição dos serviços' },
  { id: 'cadastro', label: 'Cadastro e conta' },
  { id: 'pagamento', label: 'Pagamento e Assinaturas' },
  { id: 'uso-aceitavel', label: 'Uso aceitável' },
  { id: 'propriedade', label: 'Propriedade intelectual' },
  { id: 'responsabilidade', label: 'Limitação de responsabilidade' },
  { id: 'rescisao', label: 'Rescisão' },
  { id: 'alteracoes', label: 'Alterações nos termos' },
  { id: 'foro', label: 'Foro e lei aplicável' },
];

const SECTIONS = [
  {
    id: 'aceitacao',
    title: '1. Aceitação dos termos',
    paragraphs: [
      'Ao acessar e utilizar a plataforma Noro Guru, você concorda expressamente em cumprir e estar vinculado aos seguintes Termos e Condições de Uso. Estes termos regem todo o acesso e uso de nosso software, site e serviços relacionados.',
      'Se você não concordar com qualquer parte destes termos, você não deve acessar ou utilizar nossos serviços. O uso continuado da plataforma após quaisquer alterações nestes termos constituirá sua aceitação de tais mudanças.',
    ],
  },
  {
    id: 'descricao',
    title: '2. Descrição dos serviços',
    paragraphs: [
      'A Noro Guru é uma plataforma SaaS para agências de turismo que inclui CRM, financeiro, atendimento omnichannel, geração de sites com IA e assistência operacional. Os serviços disponíveis variam conforme o plano contratado.',
    ],
    bullets: [
      'CRM e pipeline de vendas para o ciclo real de viagens',
      'Atendimento omnichannel (WhatsApp, e-mail, chat)',
      'Geração de sites e landing pages com IA',
      'Financeiro integrado com comissões automáticas',
      'IA operacional para roteiros, propostas e follow-ups',
    ],
  },
  {
    id: 'cadastro',
    title: '3. Cadastro e conta',
    paragraphs: [
      'Para utilizar as funcionalidades principais da Noro Guru, você deve criar uma conta de usuário. Você se compromete a fornecer informações precisas, completas e atualizadas.',
      'Você é o único responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrem sob sua conta. Notifique-nos imediatamente sobre qualquer uso não autorizado ou violação de segurança.',
    ],
  },
  {
    id: 'pagamento',
    title: '4. Pagamento e Assinaturas',
    paragraphs: [
      'Os planos são cobrados mensalmente ou anualmente (com desconto). O preço é fixado no momento da contratação e atualizado mediante comunicação com 30 dias de antecedência.',
      'O faturamento é realizado de forma antecipada no ciclo escolhido. Em caso de cancelamento, o acesso permanecerá ativo até o final do período já pago, não havendo reembolso proporcional — exceto nos primeiros 14 dias corridos (garantia de satisfação).',
    ],
  },
  {
    id: 'uso-aceitavel',
    title: '5. Uso aceitável',
    paragraphs: [
      'Você concorda em não utilizar a Noro Guru para qualquer finalidade ilegal ou proibida por estes termos. Proibimos estritamente:',
    ],
    bullets: [
      'Engenharia reversa do software',
      'Tentativa de comprometer a segurança da infraestrutura',
      'Upload de conteúdo malicioso ou vírus',
      'Uso do serviço para fins de spam ou assédio',
    ],
  },
  {
    id: 'propriedade',
    title: '6. Propriedade intelectual',
    paragraphs: [
      'Todo o conteúdo, software e marca da plataforma Noro Guru é propriedade da Nomade Group. Os dados inseridos por você na plataforma permanecem de sua propriedade. Ao usar a plataforma, você concede à Noro Guru licença limitada e não exclusiva para processar esses dados conforme necessário para prestar os serviços.',
    ],
  },
  {
    id: 'responsabilidade',
    title: '7. Limitação de responsabilidade',
    paragraphs: [
      'Na extensão máxima permitida pela legislação brasileira, a Noro Guru não será responsável por danos indiretos, incidentais, especiais ou consequenciais. Nossa responsabilidade total por qualquer reclamação não excederá o valor pago nos 12 meses anteriores ao evento que originou a reclamação.',
    ],
  },
  {
    id: 'rescisao',
    title: '8. Rescisão',
    paragraphs: [
      'Você pode cancelar sua conta a qualquer momento pelo painel de configurações. A Noro Guru pode suspender ou encerrar sua conta por violação destes termos, com aviso prévio de 30 dias, salvo em casos de violação grave. Após encerramento, seus dados ficam disponíveis para exportação por 90 dias corridos.',
    ],
  },
  {
    id: 'alteracoes',
    title: '9. Alterações nos termos',
    paragraphs: [
      'A Noro Guru pode atualizar estes termos com aviso prévio mínimo de 30 dias, comunicado por e-mail e notificação dentro da plataforma. O uso continuado após a data de vigência implica aceite automático das novas condições.',
    ],
  },
  {
    id: 'foro',
    title: '10. Foro e lei aplicável',
    paragraphs: [
      'Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil, em especial a LGPD (Lei nº 13.709/2018), o Código de Defesa do Consumidor e o Marco Civil da Internet. O foro da Comarca de São Paulo, SP, é eleito para resolução de quaisquer disputas.',
    ],
  },
];

export default function TermsPage() {
  return (
    <div style={{ background: '#0B1220', minHeight: '100vh', fontFamily: 'var(--font-sans)', color: '#D1D5F0' }}>
      {/* Hero */}
      <header style={{ background: '#0D1526', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingTop: 80, paddingBottom: 64, paddingLeft: 24, paddingRight: 24 }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#B8C1E0', textDecoration: 'none', marginBottom: 28, fontWeight: 500 }}>
            ← Políticas
          </Link>
          <span style={{ display: 'inline-block', padding: '3px 12px', background: 'rgba(52,44,164,0.2)', border: '1px solid #342CA4', color: '#342CA4', fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700, borderRadius: 999, marginBottom: 20, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Termos de Uso
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 700, color: '#fff', margin: '0 0 16px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
            Termos e condições de uso da plataforma
          </h1>
          <p style={{ fontSize: 13, color: '#B8C1E0', margin: 0, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>🕐</span>
            Última atualização: maio de 2026 • Lei 13.709/2018 (LGPD)
          </p>
        </div>
      </header>

      {/* Body */}
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '64px 24px 80px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 48, alignItems: 'start' }}>
        {/* Sidebar */}
        <aside style={{ position: 'sticky', top: 28 }}>
          <div style={{ padding: 24, background: '#12152C', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              ÍNDICE
            </h3>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {TOC.map((item, i) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  style={{ display: 'flex', gap: 8, alignItems: 'flex-start', fontSize: 13, color: '#1DD3C0', textDecoration: 'none', fontWeight: 500, lineHeight: 1.4 }}
                >
                  <span style={{ opacity: 0.45, fontSize: 12, fontFamily: 'var(--font-mono)', flexShrink: 0 }}>{i + 1}.</span>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          {SECTIONS.map((section) => (
            <section key={section.id} id={section.id} style={{ scrollMarginTop: 32 }}>
              <h2 style={{ fontFamily: 'var(--font-display)', color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ width: 4, height: 24, background: '#342CA4', borderRadius: 4, flexShrink: 0, display: 'inline-block' }} />
                {section.title}
              </h2>
              <div style={{ fontSize: 14, color: '#B8C1E0', lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: 14 }}>
                {section.paragraphs.map((p, i) => (
                  <p key={i} style={{ margin: 0 }}>{p}</p>
                ))}
                {section.bullets && (
                  <ul style={{ listStyle: 'disc', paddingLeft: 20, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 48 }} />
            </section>
          ))}

          {/* Footer card */}
          <div style={{ padding: '28px 32px', background: '#12152C', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 16, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
            <p style={{ fontFamily: 'var(--font-display)', color: '#fff', fontWeight: 700, margin: 0, fontSize: 15 }}>Documentação adicional:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28 }}>
              {[
                { label: 'Privacidade', href: '/privacy-policy' },
                { label: 'Cookies', href: '/cookies' },
                { label: 'SLA', href: '/sla' },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{ color: '#1DD3C0', fontSize: 14, fontWeight: 500, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
                  {link.label} →
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
