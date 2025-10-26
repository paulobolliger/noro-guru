// components/BlogClient.tsx

'use client'; // <-- Marca este como um Componente de Cliente

import { useState, useMemo } from 'react';
import { BlogPost, BlogCategorias } from "@lib/types";
import Link from 'next/link';
import Image from 'next/image';

// Este componente recebe a lista de todos os posts e cuida da interatividade
export default function BlogClient({ allPosts }: { allPosts: BlogPost[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  // Filtra os posts com base na categoria ativa e no termo de busca
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesCategory = activeCategory === 'Todos' || post.categoria === activeCategory;
      const matchesSearch = searchTerm === '' || 
                            post.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            post.resumo?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [allPosts, activeCategory, searchTerm]);

  const featuredPost = filteredPosts[0];
  const otherPosts = filteredPosts.slice(1);

  return (
    <div className="pt-20">
      <section className="bg-gradient-to-r from-primary to-primary-dark py-6 text-center text-white">
        <div className="container mx-auto px-5">
          <h1 className="text-4xl font-bold md:text-5xl">Blog Nomade Guru</h1>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            Descubra o mundo com propósito: experiências, insights e dicas que despertam o viajante em você.
          </p>
        </div>
      </section>

      {/* Secção de Filtros e Busca */}
      <section className="py-8 sticky top-[72px] bg-slate-900/80 backdrop-blur-sm z-40 border-b border-slate-700">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="w-full flex-shrink-0 overflow-x-auto md:w-auto">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveCategory('Todos')}
                  className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors ${activeCategory === 'Todos' ? 'bg-primary text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                >
                  Todos
                </button>
                {BlogCategorias.map(category => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors flex-shrink-0 ${activeCategory === category ? 'bg-primary text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative w-full md:max-w-xs ml-auto">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar artigos..."
                className="w-full rounded-full border-2 border-slate-700 bg-slate-800 py-2 pl-10 pr-4 text-white focus:border-primary focus:outline-none"
              />
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <i className="fa-solid fa-search text-slate-500"></i>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Container para o conteúdo do blog */}
      <div className="container mx-auto px-4 pt-6 pb-16">
        {filteredPosts.length > 0 ? (
          <>
            {featuredPost && (
              <section className="mb-16">
                <Link href={`/blog/${featuredPost.slug}`} className="group block overflow-hidden rounded-2xl shadow-2xl">
                  <div className="relative grid grid-cols-1 md:grid-cols-2">
                    <div className="relative h-64 md:h-auto">
                      <Image
                        src={featuredPost.imagem_capa_url || '/placeholder.jpg'}
                        alt={featuredPost.imagem_alt_text || featuredPost.titulo}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-col justify-center bg-slate-800 p-8 md:p-12">
                      <p className="text-sm font-semibold text-primary">Artigo em Destaque</p>
                      <h2 className="mt-2 text-2xl font-bold text-white transition-colors group-hover:text-primary md:text-3xl">
                        {featuredPost.titulo}
                      </h2>
                      <p className="mt-4 text-slate-400 line-clamp-3">{featuredPost.resumo}</p>
                      <div className="mt-6 font-semibold text-white">Ler Artigo →</div>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {otherPosts.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {otherPosts.map((post) => (
                  <Link href={`/blog/${post.slug}`} key={post.id} className="group block overflow-hidden rounded-lg bg-slate-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/50">
                    <div className="relative h-56">
                      <Image
                        src={post.imagem_capa_url || '/placeholder.jpg'}
                        alt={post.imagem_alt_text || post.titulo}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-6">
                      <p className="text-sm font-semibold text-primary">{post.categoria}</p>
                      <h2 className="mt-2 text-xl font-bold text-white transition-colors group-hover:text-primary">{post.titulo}</h2>
                      <p className="mt-4 text-sm text-slate-400 line-clamp-3">{post.resumo}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white">Nenhum artigo encontrado</h2>
            <p className="mt-4 text-slate-400">Tente ajustar a sua busca ou limpar os filtros.</p>
          </div>
        )}
      </div>
    </div>
  );
}