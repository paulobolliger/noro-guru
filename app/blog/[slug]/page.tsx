// app/blog/[slug]/page.tsx
import { supabase } from '@/lib/supabaseClient';
import { BlogPost, Roteiro } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

// Tipagem para o post com o roteiro relacionado expandido
type PostComRoteiro = BlogPost & {
  nomade_roteiros: Pick<Roteiro, 'titulo' | 'slug'> | null;
};

// Função para buscar um post pelo slug
async function getPost(slug: string): Promise<PostComRoteiro | null> {
    const { data, error } = await supabase
    .from('nomade_blog_posts')
    .select('*, nomade_roteiros(titulo, slug)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao buscar post:', error);
    return null;
  }
  return data as PostComRoteiro;
}

// Geração de metadados para SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPost(params.slug);
  if (!post) return { title: 'Post não encontrado' };

  return {
    title: post.meta_title || post.titulo,
    description: post.meta_description || post.resumo || '',
    keywords: post.keywords || [],
    openGraph: {
      title: post.og_title || post.titulo,
      description: post.og_description || post.resumo || '',
      images: post.og_image_url ? [{ url: post.og_image_url, alt: post.og_image_alt_text || '' }] : [],
    },
    alternates: {
      canonical: post.canonical_url || `/blog/${post.slug}`,
    },
  };
}

// Pré-renderização das páginas
export async function generateStaticParams() {
  const { data: posts } = await supabase.from('nomade_blog_posts').select('slug').eq('status', 'published');
  return posts?.map(({ slug }) => ({ slug })) || [];
}

// Componente da página
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);
    if (!post) notFound();

    // Simples conversor de Markdown para HTML
    const renderMarkdown = (text: string) => {
        return text
            .replace(/### (.*)/g, '<h3 class="text-2xl font-bold text-white mt-8 mb-4">$1</h3>')
            .replace(/## (.*)/g, '<h2 class="text-3xl font-bold text-white mt-10 mb-6">$1</h2>')
            .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
            .replace(/\n/g, '<br />');
    };

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Carregando post...</div>}>
            <article className="pt-32 container mx-auto px-4 max-w-3xl pb-20">
                <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl shadow-slate-950/50">
                    <Image 
                        src={post.imagem_capa_url || '/placeholder.jpg'} 
                        alt={post.imagem_alt_text || post.titulo} 
                        fill 
                        className="object-cover" 
                        priority
                    />
                </div>

                <header className="text-center mb-12">
                    <p className="text-primary font-semibold uppercase tracking-wider">{post.categoria}</p>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mt-2 leading-tight">{post.titulo}</h1>
                </header>

                <div 
                    className="prose prose-invert lg:prose-xl mx-auto prose-p:text-slate-300 prose-strong:text-white"
                    dangerouslySetInnerHTML={{ __html: post.conteudo ? renderMarkdown(post.conteudo) : '' }} 
                />
                
                {post.nomade_roteiros && (
                    <div className="mt-20 p-8 bg-slate-800 rounded-2xl text-center border border-slate-700">
                        <h3 className="text-xl font-bold text-white">Gostou deste post?</h3>
                        <p className="text-slate-400 mt-2 mb-6">Este conteúdo está relacionado com o nosso roteiro:</p>
                        <Link href={`/destinos/${post.nomade_roteiros.slug}`} className="bg-gradient-to-r from-primary to-denary text-white font-bold py-3 px-8 rounded-full inline-block hover:scale-105 transition-transform">
                            Ver Roteiro: {post.nomade_roteiros.titulo}
                        </Link>
                    </div>
                )}
            </article>
        </Suspense>
    );
}

