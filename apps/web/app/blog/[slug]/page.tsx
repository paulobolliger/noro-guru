'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';

const blogPosts: Record<string, {
  title: string;
  slug: string;
  category: string;
  categoryColor: string;
  date: string;
  author: string;
  authorRole: string;
  readTime: string;
  excerpt: string;
  content: string;
}> = {
  'ia-operacional-agencias-turismo': {
    title: 'IA Operacional: como agências de turismo estão ganhando 2h por dia',
    slug: 'ia-operacional-agencias-turismo',
    category: 'IA & Tecnologia',
    categoryColor: '#342CA4',
    date: '20 de maio de 2026',
    author: 'Paulo Bolliger',
    authorRole: 'CEO, Noro Guru',
    readTime: '7 min',
    excerpt: 'Conheça como as agências mais eficientes do Brasil estão usando IA para automatizar tarefas repetitivas e focar no que importa.',
    content: `
<h2>O problema que ninguém fala</h2>
<p>A maioria das agências de turismo perdeu mais de 40% do faturamento entre 2020 e 2022. As que sobreviveram aprenderam uma lição dura: eficiência operacional não é opcional.</p>
<p>Mas eficiência não vem de trabalhar mais. Vem de trabalhar diferente — delegando para ferramentas o que pode ser automatizado, e concentrando energia humana onde ela realmente importa.</p>

<h2>O que "IA operacional" significa na prática</h2>
<p>Quando a gente fala de IA para agências, não estamos falando de robôs substituindo agentes. Estamos falando de:</p>
<ul>
<li><strong>Rascunhos automáticos de propostas</strong> — a IA cria o documento base com os dados do cliente; o agente revisa e personaliza em minutos</li>
<li><strong>Follow-ups inteligentes</strong> — o sistema detecta quando um lead está frio e sugere o momento certo de entrar em contato</li>
<li><strong>Roteiros gerados por IA</strong> — o agente descreve o destino e o perfil do cliente; a IA estrutura o itinerário</li>
<li><strong>Triagem de WhatsApp</strong> — mensagens categorizadas automaticamente por urgência e tipo</li>
</ul>

<h2>Resultados que vimos em campo</h2>
<p>Nas agências que implementaram a IA operacional da Noro Guru nos últimos 6 meses, os números foram consistentes:</p>
<ul>
<li>Redução média de 2,3h/dia por consultor em tarefas administrativas</li>
<li>Aumento de 35% na velocidade de resposta a leads</li>
<li>Propostas 60% mais rápidas de produzir</li>
<li>NPS médio subiu de 54 para 71 pontos</li>
</ul>

<blockquote>
"Antes eu passava 3 horas por dia só editando propostas. Hoje a IA faz o rascunho em 2 minutos e eu gasto 15 minutos personalizando. É outro nível."
<cite>— Juliana Fonseca, Viagens Experienza, SP</cite>
</blockquote>

<h2>Como implementar sem trauma</h2>
<p>A transição para uma operação com IA não precisa ser disruptiva. Nas agências onde vimos os melhores resultados, o processo seguiu 3 fases:</p>
<p><strong>Fase 1 — Diagnóstico (semana 1):</strong> Mapear onde o tempo está sendo gasto. Quais tarefas são repetitivas? Quais exigem julgamento humano?</p>
<p><strong>Fase 2 — Automação seletiva (semanas 2-4):</strong> Começar pelas tarefas de menor risco. Propostas padrão, follow-ups de sequência, respostas a perguntas frequentes.</p>
<p><strong>Fase 3 — Otimização (mês 2 em diante):</strong> Medir, ajustar, expandir. A IA aprende com o uso e melhora as sugestões ao longo do tempo.</p>

<h2>O que a IA não substitui</h2>
<p>É importante ser honesto: a IA operacional não substitui o relacionamento, a empatia e o julgamento que fazem de um agente de viagens um especialista de confiança.</p>
<p>O que ela substitui é o tempo gasto em burocracia. E isso libera o agente para fazer o que só ele pode fazer: entender o cliente, interpretar seus sonhos e transformar isso em uma viagem inesquecível.</p>
    `,
  },
  'crm-agencias-turismo-guia': {
    title: 'CRM para agências de turismo: guia completo 2026',
    slug: 'crm-agencias-turismo-guia',
    category: 'CRM & Vendas',
    categoryColor: '#1DD3C0',
    date: '15 de maio de 2026',
    author: 'Marina Costa',
    authorRole: 'Head of Product, Noro Guru',
    readTime: '10 min',
    excerpt: 'Tudo que você precisa saber para escolher, implementar e tirar valor máximo de um CRM na sua agência de viagens.',
    content: `
<h2>Por que a maioria das agências ainda usa planilha</h2>
<p>A resposta é simples: CRMs genéricos não foram feitos para o turismo. O Salesforce não sabe o que é um "roteiro personalizado". O HubSpot não entende de "janela de reserva". E as agências acabam desistindo e voltando para o Excel.</p>
<p>A Noro Guru nasceu exatamente para resolver esse problema. Mas independente de qual CRM você escolher, este guia vai te ajudar a implementar corretamente.</p>

<h2>O que um CRM para turismo precisa ter</h2>
<ul>
<li><strong>Pipeline visual por fase:</strong> Cada agência tem suas etapas — cotação, aprovação, confirmação, pré-viagem, pós-viagem. O CRM precisa refletir isso.</li>
<li><strong>Histórico completo por cliente:</strong> Destinos já visitados, preferências, datas importantes, reclamações anteriores.</li>
<li><strong>Integração com WhatsApp:</strong> Mais de 80% das vendas de turismo passam pelo WhatsApp no Brasil.</li>
<li><strong>Controle de orçamentos:</strong> Da cotação à confirmação, tudo rastreado e acessível.</li>
<li><strong>Relatórios de funil:</strong> Taxa de conversão por origem de lead, por consultor, por destino.</li>
</ul>

<h2>Como implementar em 30 dias</h2>
<p><strong>Semana 1 — Migração de dados:</strong> Exporte seus clientes de onde eles estão (planilhas, outro CRM, cartões de visita). Importe no novo sistema. Não precisa ser perfeito — comece com os ativos dos últimos 12 meses.</p>
<p><strong>Semana 2 — Configure o pipeline:</strong> Defina suas etapas de venda. Regra: entre 5 e 8 etapas. Menos que isso é muito simplificado; mais do que isso, a equipe abandona.</p>
<p><strong>Semana 3 — Treine a equipe:</strong> O maior erro é implementar sem treinar. Dedique pelo menos 4 horas de treinamento prático com casos reais da agência.</p>
<p><strong>Semana 4 — Medir e ajustar:</strong> Quais etapas têm mais "travamento"? Onde os leads estão sumindo? Use os dados para otimizar o processo.</p>

<blockquote>
"Em 3 semanas, nossa taxa de follow-up subiu de 40% para 95%. O CRM simplesmente não deixa nada cair."
<cite>— Carlos Mendes, Destinos do Mundo, RJ</cite>
</blockquote>
    `,
  },
  'lgpd-agencias-viagem': {
    title: 'LGPD e agências de viagem: o que você precisa fazer agora',
    slug: 'lgpd-agencias-viagem',
    category: 'Legal & Compliance',
    categoryColor: '#D4AF37',
    date: '10 de maio de 2026',
    author: 'Rafael Souza',
    authorRole: 'DPO, Noro Guru',
    readTime: '6 min',
    excerpt: 'A LGPD se aplica à sua agência. Veja o checklist do que você precisa implementar para ficar em conformidade sem complicar a operação.',
    content: `
<h2>A LGPD se aplica à sua agência?</h2>
<p>Sim. Qualquer empresa brasileira que coleta e trata dados pessoais está sujeita à LGPD (Lei 13.709/2018). Isso inclui: nome, e-mail, CPF, dados de pagamento, passaporte, histórico de viagens.</p>
<p>A boa notícia: adequação à LGPD não precisa ser complicada. Começa com boas práticas que toda empresa deveria ter de qualquer forma.</p>

<h2>Checklist básico de conformidade</h2>
<ul>
<li><strong>Política de Privacidade atualizada</strong> — deve estar acessível no site, em linguagem clara</li>
<li><strong>Consentimento explícito</strong> — seus formulários precisam de checkbox de aceite, não pré-marcado</li>
<li><strong>Direito de acesso</strong> — o cliente pode pedir os dados que você tem sobre ele; você precisa ter como responder</li>
<li><strong>Direito de exclusão</strong> — se o cliente pedir para apagar os dados, você precisa conseguir fazer isso</li>
<li><strong>DPO definido</strong> — para empresas médias, pode ser um funcionário interno com essa responsabilidade</li>
<li><strong>Contratos com fornecedores</strong> — seus sistemas (CRM, ERP, etc.) precisam ter cláusulas de DPA (Data Processing Agreement)</li>
</ul>

<h2>O que a Noro Guru faz pela sua conformidade</h2>
<p>Ao usar a Noro Guru, você conta com:</p>
<ul>
<li>Dados armazenados em servidores no Brasil</li>
<li>Criptografia AES-256 em repouso e TLS 1.3 em trânsito</li>
<li>DPA disponível para assinar com clientes Enterprise</li>
<li>Ferramentas para exportar e excluir dados de clientes específicos</li>
<li>Logs de acesso para auditoria</li>
</ul>
    `,
  },
};

// Posts mais recentes para a seção "Relacionados"
const ALL_POSTS = Object.values(blogPosts);

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = blogPosts[slug];

  if (!post) {
    return (
      <div
        style={{
          background: '#0B1220',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 24,
          padding: '80px 24px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 64 }}>📄</div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 32,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          Post não encontrado
        </h1>
        <p style={{ fontSize: 16, color: '#B8C1E0', margin: 0 }}>
          Este artigo não existe ou foi removido.
        </p>
        <Link
          href="/blog"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: '#342CA4',
            color: '#fff',
            borderRadius: 10,
            padding: '11px 24px',
            fontSize: 14,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          ← Voltar ao Blog
        </Link>
      </div>
    );
  }

  const related = ALL_POSTS.filter((p) => p.slug !== slug).slice(0, 2);

  return (
    <div style={{ background: '#0B1220', minHeight: '100vh' }}>

      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(180deg, #0D1526 0%, #0B1220 100%)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          padding: '80px 24px 64px',
        }}
      >
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <Link
            href="/blog"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: 13,
              color: '#B8C1E0',
              textDecoration: 'none',
              marginBottom: 32,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Blog
          </Link>

          {/* Category */}
          <div style={{ marginBottom: 16 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: post.categoryColor,
                background: `${post.categoryColor}20`,
                border: `1px solid ${post.categoryColor}40`,
                borderRadius: 999,
                padding: '4px 12px',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}
            >
              {post.category}
            </span>
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(26px, 4vw, 42px)',
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.03em',
              lineHeight: 1.15,
              margin: '0 0 24px',
            }}
          >
            {post.title}
          </h1>

          <p
            style={{
              fontSize: 18,
              color: '#B8C1E0',
              lineHeight: 1.65,
              margin: '0 0 32px',
            }}
          >
            {post.excerpt}
          </p>

          {/* Meta */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            {/* Author avatar */}
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: `${post.categoryColor}33`,
                border: `1px solid ${post.categoryColor}55`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-display)',
                fontWeight: 700,
                fontSize: 14,
                color: post.categoryColor,
                flexShrink: 0,
              }}
            >
              {post.author.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#E0E3FF' }}>{post.author}</div>
              <div style={{ fontSize: 12, color: '#B8C1E0' }}>{post.authorRole}</div>
            </div>
            <div
              style={{
                width: 1,
                height: 28,
                background: 'rgba(255,255,255,0.12)',
                marginLeft: 4,
              }}
            />
            <div style={{ fontSize: 13, color: '#B8C1E0' }}>{post.date}</div>
            <div style={{ fontSize: 13, color: '#B8C1E0' }}>· {post.readTime} de leitura</div>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '64px 24px 96px' }}>
        <div
          style={{ fontSize: 17, color: '#D1D5F0', lineHeight: 1.85 }}
          dangerouslySetInnerHTML={{ __html: post.content.replace(
            /<h2>/g, `<h2 style="font-family:var(--font-display);font-size:24px;font-weight:700;color:#fff;letter-spacing:-0.02em;margin:48px 0 16px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:12px;">`
          ).replace(
            /<h3>/g, `<h3 style="font-family:var(--font-display);font-size:19px;font-weight:700;color:#fff;letter-spacing:-0.01em;margin:32px 0 12px;">`
          ).replace(
            /<ul>/g, `<ul style="margin:16px 0 24px 0;padding:0;list-style:none;">`
          ).replace(
            /<li>/g, `<li style="padding:6px 0 6px 20px;position:relative;color:#D1D5F0;" data-bullet="true">`
          ).replace(
            /<blockquote>/g, `<blockquote style="margin:40px 0;padding:20px 24px;background:rgba(52,44,164,0.12);border-left:3px solid #342CA4;border-radius:0 10px 10px 0;">`
          ).replace(
            /<cite>/g, `<cite style="display:block;margin-top:12px;font-size:13px;font-style:normal;color:#B8C1E0;">`
          ).replace(
            /<p>/g, `<p style="margin:0 0 20px;">`
          ).replace(
            /<strong>/g, `<strong style="color:#fff;font-weight:700;">`
          )}}
        />

        {/* Share */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.08)',
            paddingTop: 32,
            marginTop: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
          }}
        >
          <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: 0 }}>
            Gostou do artigo? Compartilhe!
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {['LinkedIn', 'WhatsApp', 'Copiar link'].map((s) => (
              <button
                key={s}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#B8C1E0',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8,
                  padding: '8px 14px',
                  cursor: 'pointer',
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Newsletter CTA */}
        <div
          style={{
            marginTop: 64,
            background: 'linear-gradient(135deg, rgba(52,44,164,0.2) 0%, rgba(29,211,192,0.08) 100%)',
            border: '1px solid rgba(52,44,164,0.3)',
            borderRadius: 16,
            padding: '40px 36px',
            textAlign: 'center',
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 22,
              fontWeight: 700,
              color: '#fff',
              letterSpacing: '-0.02em',
              margin: '0 0 8px',
            }}
          >
            Receba os próximos artigos
          </h3>
          <p style={{ fontSize: 14, color: '#B8C1E0', margin: '0 0 24px' }}>
            Conteúdo sobre tecnologia, gestão e turismo — sem spam.
          </p>
          <div style={{ display: 'flex', gap: 10, maxWidth: 400, margin: '0 auto', flexWrap: 'wrap', justifyContent: 'center' }}>
            <input
              type="email"
              placeholder="seu@email.com.br"
              style={{
                flex: 1,
                minWidth: 200,
                padding: '11px 16px',
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 8,
                fontSize: 14,
                color: '#fff',
                outline: 'none',
              }}
            />
            <button
              style={{
                padding: '11px 22px',
                background: '#342CA4',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Assinar
            </button>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <div style={{ marginTop: 80 }}>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 22,
                fontWeight: 700,
                color: '#fff',
                letterSpacing: '-0.02em',
                margin: '0 0 24px',
              }}
            >
              Artigos relacionados
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {related.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/blog/${rel.slug}`}
                  style={{
                    background: '#12152C',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 12,
                    padding: '24px',
                    textDecoration: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                  }}
                >
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: rel.categoryColor,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {rel.category}
                  </span>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 15,
                      fontWeight: 700,
                      color: '#fff',
                      margin: 0,
                      lineHeight: 1.4,
                    }}
                  >
                    {rel.title}
                  </h3>
                  <span style={{ fontSize: 12, color: '#B8C1E0', marginTop: 'auto' }}>
                    {rel.readTime} · {rel.date}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
