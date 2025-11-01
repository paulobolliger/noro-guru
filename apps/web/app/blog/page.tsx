import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Blog NORO | Insights sobre Gestão e Tecnologia',
  description: 'Artigos, tutoriais e insights sobre gestão empresarial, tecnologia, automação e transformação digital.',
  keywords: 'blog noro, gestão empresarial, tecnologia, automação, transformação digital, CRM, ERP',
};

// Mock de posts - Em produção, vir de um CMS ou API
const posts = [
  {
    id: 1,
    title: '10 Métricas Essenciais para Acompanhar em seu CRM',
    excerpt: 'Descubra as métricas que realmente importam para medir o sucesso do seu time de vendas e aumentar conversões.',
    category: 'CRM & Vendas',
    author: 'Paulo Bolliger',
    date: '2025-10-28',
    readTime: '8 min',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop',
    slug: '10-metricas-essenciais-crm',
  },
  {
    id: 2,
    title: 'Como Automatizar Processos Repetitivos e Ganhar 10h por Semana',
    excerpt: 'Aprenda a identificar e automatizar tarefas manuais que roubam o tempo produtivo da sua equipe.',
    category: 'Automação',
    author: 'Equipe NORO',
    date: '2025-10-25',
    readTime: '6 min',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop',
    slug: 'automatizar-processos-repetitivos',
  },
  {
    id: 3,
    title: 'Inteligência Artificial na Gestão: Casos de Uso Práticos',
    excerpt: 'Explore como a IA está transformando a gestão empresarial com exemplos reais e aplicáveis ao seu negócio.',
    category: 'Inteligência Artificial',
    author: 'Dr. Carlos Santos',
    date: '2025-10-22',
    readTime: '12 min',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop',
    slug: 'ia-na-gestao-casos-de-uso',
  },
  {
    id: 4,
    title: 'Dashboard Financeiro: O Que Não Pode Faltar',
    excerpt: 'Guia completo para construir um dashboard financeiro que facilite tomadas de decisão estratégicas.',
    category: 'Finanças',
    author: 'Ana Paula Lima',
    date: '2025-10-20',
    readTime: '10 min',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    slug: 'dashboard-financeiro-completo',
  },
  {
    id: 5,
    title: 'Multi-Tenant vs Single-Tenant: Qual Escolher?',
    excerpt: 'Entenda as diferenças entre arquiteturas multi-tenant e single-tenant e qual é a melhor para seu negócio.',
    category: 'Tecnologia',
    author: 'Tech Team',
    date: '2025-10-18',
    readTime: '7 min',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=400&fit=crop',
    slug: 'multi-tenant-vs-single-tenant',
  },
  {
    id: 6,
    title: 'Gestão de Leads: Do Primeiro Contato ao Fechamento',
    excerpt: 'Estratégias comprovadas para nutrir leads e aumentar sua taxa de conversão em vendas.',
    category: 'CRM & Vendas',
    author: 'Marcelo Ferreira',
    date: '2025-10-15',
    readTime: '9 min',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=400&fit=crop',
    slug: 'gestao-de-leads-completa',
  },
];

const categories = ['Todos', 'CRM & Vendas', 'Automação', 'Inteligência Artificial', 'Finanças', 'Tecnologia'];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="pt-24 pb-16 px-6 md:px-12 bg-gradient-to-br from-[#342CA4] via-[#1DD3C0]/20 to-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Blog NORO
          </h1>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Insights, tutoriais e tendências sobre gestão, tecnologia e transformação digital
          </p>
        </div>
      </section>

      {/* Filtros de Categoria */}
      <section className="py-8 px-6 md:px-12 border-b border-gray-200 sticky top-0 bg-white z-40">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full transition-all ${
                  category === 'Todos'
                    ? 'bg-[#342CA4] text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-[#342CA4]/10 hover:text-[#342CA4]'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid de Posts */}
      <section className="py-16 px-6 md:px-12">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-[#342CA4] hover:shadow-xl transition-all"
              >
                {/* Imagem */}
                <Link href={`/blog/${post.slug}`} className="block relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-[#342CA4] text-white text-xs font-semibold rounded-full">
                      {post.category}
                    </span>
                  </div>
                </Link>

                {/* Conteúdo */}
                <div className="p-6">
                  <Link href={`/blog/${post.slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-[#342CA4] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#342CA4]/10 flex items-center justify-center text-[#342CA4] font-semibold">
                        {post.author.charAt(0)}
                      </div>
                      <span>{post.author}</span>
                    </div>
                    <span>{post.readTime}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">
                    {new Date(post.date).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Paginação */}
          <div className="mt-12 flex justify-center gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Anterior</button>
            <button className="px-4 py-2 bg-[#342CA4] text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">3</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Próximo</button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-[#342CA4] to-[#1DD3C0]">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Receba Nossos Insights por Email
          </h2>
          <p className="text-white/90 text-lg mb-8">
            Assine nossa newsletter e receba conteúdos exclusivos sobre gestão e tecnologia
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Seu melhor email"
              className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-[#D4AF37] text-white font-bold px-8 py-4 rounded-xl hover:shadow-[0_0_20px_#D4AF37] transition-all">
              Assinar
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
