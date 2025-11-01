'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Newsletter from '@/components/Newsletter';

// Mock data - substituir por fetch real de API/CMS
const blogPosts = {
  'ia-revolucionando-gestao': {
    title: 'Como a IA está revolucionando a gestão empresarial',
    slug: 'ia-revolucionando-gestao',
    category: 'Inovação',
    date: '15 de Outubro, 2024',
    author: 'Equipe NORO',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200',
    excerpt: 'Descubra como a inteligência artificial está transformando processos de negócio e otimizando resultados.',
    content: `
      <h2>A nova era da gestão empresarial</h2>
      <p>A inteligência artificial deixou de ser ficção científica para se tornar uma ferramenta essencial no mundo corporativo. Empresas que adotam IA em seus processos estão vendo aumentos significativos em produtividade e eficiência.</p>
      
      <h3>Principais aplicações da IA na gestão</h3>
      <ul>
        <li><strong>Automação de processos:</strong> Redução de tarefas repetitivas em até 80%</li>
        <li><strong>Análise preditiva:</strong> Antecipação de tendências e comportamentos</li>
        <li><strong>Atendimento inteligente:</strong> Chatbots que resolvem 70% das demandas</li>
        <li><strong>Tomada de decisão:</strong> Insights baseados em dados em tempo real</li>
      </ul>

      <h3>Casos de sucesso</h3>
      <p>Empresas que implementaram IA com a NORO relatam:</p>
      <ul>
        <li>Redução de 40% no tempo de processos administrativos</li>
        <li>Aumento de 35% na satisfação do cliente</li>
        <li>Economia de 50% em custos operacionais</li>
      </ul>

      <h3>O futuro é agora</h3>
      <p>Não espere a concorrência dar o primeiro passo. A transformação digital começa com a decisão de inovar hoje. Com plataformas como NORO, implementar IA na sua empresa nunca foi tão acessível.</p>

      <blockquote>
        "A IA não substitui pessoas, ela potencializa talentos. Nossa missão é democratizar essa tecnologia para empresas de todos os portes."
        <cite>— Equipe NORO</cite>
      </blockquote>
    `,
  },
  'crm-vendas-2024': {
    title: 'CRM: A chave para aumentar suas vendas em 2024',
    slug: 'crm-vendas-2024',
    category: 'Vendas',
    date: '12 de Outubro, 2024',
    author: 'Paulo Silva',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
    excerpt: 'Entenda como um CRM moderno pode transformar seu processo de vendas e aumentar conversões.',
    content: `
      <h2>Por que CRM é essencial?</h2>
      <p>Um CRM (Customer Relationship Management) é muito mais que um software de gestão de contatos. É o coração do seu processo comercial.</p>
      
      <h3>Benefícios comprovados</h3>
      <ul>
        <li>Aumento de 29% nas vendas</li>
        <li>Melhoria de 34% na produtividade da equipe</li>
        <li>Redução de 47% no ciclo de vendas</li>
        <li>Crescimento de 45% na satisfação do cliente</li>
      </ul>

      <h3>Funcionalidades essenciais</h3>
      <p>Um CRM moderno deve incluir:</p>
      <ul>
        <li><strong>Funil de vendas visual:</strong> Acompanhe cada oportunidade em tempo real</li>
        <li><strong>Automação de follow-ups:</strong> Nunca perca uma oportunidade</li>
        <li><strong>Integração com WhatsApp:</strong> Atenda onde seu cliente está</li>
        <li><strong>Relatórios inteligentes:</strong> Decisões baseadas em dados</li>
      </ul>

      <h3>Implementação rápida</h3>
      <p>Com NORO, você pode ter um CRM completo funcionando em menos de 24 horas. Nossa equipe cuida de toda a configuração e treinamento.</p>
    `,
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const post = blogPosts[slug as keyof typeof blogPosts];

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Post não encontrado</h1>
          <Link 
            href="/blog"
            className="inline-block px-6 py-3 bg-[#342CA4] text-white rounded-lg hover:bg-[#342CA4]/80 transition-colors"
          >
            ← Voltar ao Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B1220] via-[#0B1220] to-[#1a1f35]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-[#1DD3C0] hover:text-[#1DD3C0]/80 transition-colors mb-8"
          >
            <span className="mr-2">←</span> Voltar ao Blog
          </Link>

          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-[#342CA4]/20 text-[#1DD3C0] rounded-full text-sm font-semibold mb-4">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-[#A9ADC4] text-sm mb-8">
            <div className="flex items-center gap-2">
              <span>👤</span>
              <span>{post.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>⏱️</span>
              <span>{post.readTime} de leitura</span>
            </div>
          </div>

          <div className="flex gap-4 mb-12">
            <button className="px-4 py-2 bg-[#342CA4]/20 text-[#1DD3C0] rounded-lg hover:bg-[#342CA4]/30 transition-colors text-sm">
              <span className="mr-2">🔗</span> Compartilhar
            </button>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="container mx-auto px-4 max-w-4xl mb-12">
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 max-w-4xl pb-20">
        <article 
          className="prose prose-invert prose-lg max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-[#A9ADC4] prose-p:leading-relaxed prose-p:mb-6
            prose-ul:text-[#A9ADC4] prose-ul:mb-6
            prose-li:mb-2
            prose-strong:text-white prose-strong:font-semibold
            prose-blockquote:border-l-4 prose-blockquote:border-[#1DD3C0] 
            prose-blockquote:bg-[#342CA4]/10 prose-blockquote:p-6 
            prose-blockquote:rounded-r-lg prose-blockquote:my-8
            prose-blockquote:text-white prose-blockquote:italic
            prose-cite:text-[#1DD3C0] prose-cite:text-sm prose-cite:not-italic prose-cite:block prose-cite:mt-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Share Section */}
        <div className="mt-16 pt-8 border-t border-gray-700/50">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <p className="text-white font-semibold">Gostou do artigo? Compartilhe!</p>
            <button className="px-4 py-2 bg-[#342CA4] text-white rounded-lg hover:bg-[#342CA4]/80 transition-colors">
              <span className="mr-2">🔗</span> Compartilhar
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="container mx-auto px-4 max-w-4xl pb-20">
        <div className="bg-gradient-to-r from-[#342CA4]/20 to-[#1DD3C0]/20 rounded-3xl p-8 md:p-12 backdrop-blur-sm border border-[#342CA4]/30">
          <Newsletter />
        </div>
      </section>

      {/* Related Posts */}
      <section className="container mx-auto px-4 max-w-6xl pb-20">
        <h2 className="text-3xl font-bold text-white mb-8">Artigos relacionados</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {Object.values(blogPosts)
            .filter(p => p.slug !== slug)
            .slice(0, 2)
            .map((relatedPost) => (
              <Link 
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="group"
              >
                <div className="bg-[#1a1f35]/50 rounded-2xl overflow-hidden border border-gray-700/50 hover:border-[#1DD3C0]/50 transition-all duration-300">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={relatedPost.image} 
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-[#1DD3C0] text-sm font-semibold">
                      {relatedPost.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mt-2 mb-3 group-hover:text-[#1DD3C0] transition-colors">
                      {relatedPost.title}
                    </h3>
                    <p className="text-[#A9ADC4] text-sm mb-4">
                      {relatedPost.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-[#A9ADC4] text-xs">
                      <span>{relatedPost.date}</span>
                      <span>{relatedPost.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </section>
    </div>
  );
}
