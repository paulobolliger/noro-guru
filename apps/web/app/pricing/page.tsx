import { Metadata } from 'next';
import Link from 'next/link';
import StructuredData from '@/components/StructuredData';
import { getWebPageSchema, getSoftwareApplicationSchema } from '@/lib/schema';
import NoroPricingCards from '@/components/NoroPricingCards';

export const metadata: Metadata = {
  title: 'Planos e Preços | NORO Guru',
  description: 'Escolha o plano ideal para sua agência de turismo. Preços simples, sem pegadinhas. Trial de 14 dias sem cartão.',
  openGraph: {
    title: 'Planos e Preços | NORO Guru',
    description: 'Escolha o plano ideal para sua agência.',
  },
};

const FAQS = [
  {
    q: 'Posso trocar de plano a qualquer momento?',
    a: 'Sim! Upgrade ou downgrade a qualquer momento. O valor é ajustado proporcionalmente no próximo ciclo de cobrança.',
  },
  {
    q: 'O que acontece após os 14 dias de teste?',
    a: 'Você escolhe o plano que faz sentido ou volta para o gratuito. Sem cobrança automática sem aviso.',
  },
  {
    q: 'Quais formas de pagamento são aceitas?',
    a: 'PIX, cartão de crédito (Visa, Master, Amex) via e.Rede. Pagamento anual com 20% de desconto.',
  },
  {
    q: 'O módulo "Meu Site" precisa de conhecimento técnico?',
    a: 'Não. É um editor visual sem código. Você escolhe o template, personaliza e publica em minutos.',
  },
  {
    q: 'Como funciona a migração de dados?',
    a: 'Nossa equipe faz a migração em até 48h a partir de planilhas ou outros CRMs. Incluído em todos os planos pagos.',
  },
];

export default function PricingPage() {
  return (
    <>
      <StructuredData
        data={[
          getWebPageSchema({
            url: 'https://noro.guru/precos',
            title: 'Planos e Preços | NORO Guru',
            description: 'Planos simples para agências de turismo. Trial de 14 dias, sem cartão de crédito.',
          }),
          getSoftwareApplicationSchema(),
        ]}
      />

      {/* ── Header ─────────────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '88px 56px 40px', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center',
          background: 'rgba(35,36,82,0.07)', border: '1px solid rgba(35,36,82,0.12)',
          borderRadius: 999, padding: '6px 14px',
          fontSize: 11.5, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase',
          color: '#232452', marginBottom: 20,
        }}>
          Preços simples · sem pegadinha
        </div>
        <h1 style={{
          fontFamily: 'var(--font-display, Georgia)', fontWeight: 500,
          fontSize: 'clamp(44px, 5.6vw, 68px)', lineHeight: 1.05, letterSpacing: '-0.025em',
          margin: '0 0 18px', color: '#1f2433',
        }}>
          Um plano para cada<br/>tamanho de{' '}
          <em style={{ fontStyle: 'italic', color: '#232452' }}>agência</em>.
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(31,36,51,0.6)', margin: '0 auto 32px', maxWidth: 580, lineHeight: 1.5 }}>
          Trial de 14 dias · sem cartão de crédito · migração gratuita em 48h.
        </p>
      </section>

      {/* ── Plan cards (client component with billing toggle) ──── */}
      <NoroPricingCards />

      {/* ── Comparison table ─────────────────────────────────────── */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 56px 32px' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-display, Georgia)', fontWeight: 500, fontSize: 38, letterSpacing: '-0.02em', color: '#1f2433', marginBottom: 40 }}>
          Comparação detalhada
        </h2>

        {[
          { label: 'CRM & Vendas', rows: [
            { f: 'Leads ativos',         s: '500',        p: 'Ilimitado',   a: 'Ilimitado' },
            { f: 'Pipeline kanban',       s: true,         p: true,          a: true },
            { f: 'Pedidos & propostas',   s: true,         p: true,          a: true },
            { f: 'Automações de funil',   s: false,        p: true,          a: true },
            { f: 'Multi-empresa',         s: false,        p: false,         a: true },
          ]},
          { label: 'Meu Site', rows: [
            { f: 'Editor visual',         s: false,        p: true,          a: true },
            { f: 'Domínio próprio',       s: false,        p: true,          a: true },
            { f: 'Sites simultâneos',     s: false,        p: '1',           a: 'Ilimitado' },
          ]},
          { label: 'Comunicação & IA', rows: [
            { f: 'Inbox unificada',       s: 'WA + email', p: '+ Instagram', a: '+ Instagram + FB' },
            { f: 'Conteúdo IA',           s: false,        p: '200/mês',     a: 'Ilimitado' },
          ]},
          { label: 'Financeiro', rows: [
            { f: 'Cobrança Pix & cartão', s: true,         p: true,          a: true },
            { f: 'Conciliação automática',s: false,        p: true,          a: true },
          ]},
          { label: 'Plataforma', rows: [
            { f: 'Usuários',              s: '2',          p: '8',           a: 'Ilimitado' },
            { f: 'API pública',           s: false,        p: false,         a: true },
            { f: 'Suporte',               s: 'Chat',       p: 'Prioritário', a: 'Gerente dedicado' },
          ]},
        ].map((group) => (
          <div key={group.label} style={{ marginBottom: 32 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase', color: 'rgba(31,36,51,0.45)', padding: '8px 0 4px', borderBottom: '1px solid #eceef3', marginBottom: 0 }}>
              {group.label}
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ color: 'rgba(31,36,51,0.5)', fontSize: 11, fontWeight: 700, textAlign: 'center' }}>
                  <th style={{ padding: '8px 0', textAlign: 'left', width: '44%' }}></th>
                  <th style={{ padding: '8px 0', width: '18%' }}>Starter</th>
                  <th style={{ padding: '8px 0', width: '20%', color: '#232452' }}>Pro ★</th>
                  <th style={{ padding: '8px 0', width: '18%' }}>Agency+</th>
                </tr>
              </thead>
              <tbody>
                {group.rows.map((row) => (
                  <tr key={row.f} style={{ borderTop: '1px solid #eceef3' }}>
                    <td style={{ padding: '10px 0', fontWeight: 500, color: '#1f2433' }}>{row.f}</td>
                    {[row.s, row.p, row.a].map((v, i) => (
                      <td key={i} style={{ padding: '10px 0', textAlign: 'center', color: '#1f2433' }}>
                        {v === true ? (
                          <span style={{ color: '#19b8a8', fontSize: 16 }}>✓</span>
                        ) : v === false ? (
                          <span style={{ color: 'rgba(31,36,51,0.25)', fontSize: 15 }}>—</span>
                        ) : (
                          <span style={{ fontSize: 12.5, fontWeight: 500, color: 'rgba(31,36,51,0.65)' }}>{v}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      {/* ── FAQ ─────────────────────────────────────────────────── */}
      <section style={{ maxWidth: 740, margin: '0 auto', padding: '32px 56px 64px' }}>
        <h2 style={{ textAlign: 'center', fontFamily: 'var(--font-display, Georgia)', fontWeight: 500, fontSize: 34, letterSpacing: '-0.02em', color: '#1f2433', marginBottom: 32 }}>
          Perguntas frequentes
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {FAQS.map((faq, i) => (
            <details key={i} style={{ borderTop: '1px solid #eceef3', padding: '18px 0' }}>
              <summary style={{ fontSize: 15, fontWeight: 600, color: '#1f2433', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {faq.q}
                <span style={{ fontSize: 18, color: 'rgba(31,36,51,0.4)', flexShrink: 0, marginLeft: 16 }}>+</span>
              </summary>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(31,36,51,0.65)', marginTop: 12, marginBottom: 0 }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section style={{ background: '#232452', padding: '72px 56px', textAlign: 'center' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display, Georgia)', fontWeight: 500, fontSize: 38, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 14px' }}>
            Ainda tem dúvidas?
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.7)', marginBottom: 28 }}>
            Nossa equipe fala português e está pronta para ajudar a escolher o plano certo.
          </p>
          <Link
            href="/contato"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '13px 28px', borderRadius: 10,
              background: '#19b8a8', color: '#232452',
              fontSize: 15, fontWeight: 700, textDecoration: 'none',
            }}
          >
            Falar com um especialista
          </Link>
        </div>
      </section>
    </>
  );
}
