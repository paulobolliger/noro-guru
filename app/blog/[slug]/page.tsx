// app/blog/[slug]/page.tsx
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase/server';
import { BlogPost, Roteiro } from '@/lib/types';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

type PostComRoteiro = BlogPost & {
  nomade_roteiros: Pick<Roteiro, 'titulo' | 'slug' | 'imagem_url'> | null;
};

async function getPost(slug: string): Promise<PostComRoteiro | null> {
    const supabase = createServerSupabaseClient();
    const { data, error } = await supabase
    .from('nomade_blog_posts')
    .select('*, nomade_roteiros(titulo, slug, imagem_url)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao buscar post:', error);
    return null;
  }
  return data as PostComRoteiro;
}

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

export async function generateStaticParams() {
  const supabase = createServiceRoleSupabaseClient();
  const { data: posts } = await supabase.from('nomade_blog_posts').select('slug').eq('status', 'published');
  return posts?.map(({ slug }) => ({ slug })) || [];
}

function renderMarkdown(text: string | null): string {
  if (!text) return '';

  return text
    .split(/\n{2,}/) 
    .map(paragraph => {
      if (paragraph.startsWith('# ')) {
        return `<h2>${paragraph.substring(2)}</h2>`;
      }
      if (paragraph.startsWith('## ')) {
        return `<h2>${paragraph.substring(3)}</h2>`;
      }
      if (paragraph.startsWith('### ')) {
        return `<h3>${paragraph.substring(4)}</h3>`;
      }
      if (paragraph.startsWith('---')) {
        return '<hr />';
      }
      const processedParagraph = paragraph
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br />');
      
      return `<p>${processedParagraph}</p>`;
    })
    .join('');
}

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
    const post = await getPost(params.slug);
    if (!post) notFound();

    const formattedContent = renderMarkdown(post.conteudo);

    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Carregando post...</div>}>
            <div className="container mx-auto max-w-6xl px-4 py-16 pt-32">
                <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
                    <article className="lg:col-span-2">
                        <header className="mb-12">
                            <p className="text-primary font-semibold uppercase tracking-wider">{post.categoria}</p>
                            <h1 className="mt-2 text-4xl font-bold leading-tight text-white md:text-5xl">{post.titulo}</h1>
                        </header>

                        <div className="relative mb-12 h-64 overflow-hidden rounded-2xl shadow-2xl md:h-96">
                            <Image 
                                src={post.imagem_capa_url || '/placeholder.jpg'} 
                                alt={post.imagem_alt_text || post.titulo} 
                                fill 
                                className="object-cover" 
                                priority
                            />
                        </div>

                        <div 
                            className="prose prose-invert max-w-none prose-p:text-slate-300 prose-strong:text-white prose-h2:text-3xl prose-h3:text-2xl lg:prose-xl"
                            dangerouslySetInnerHTML={{ __html: formattedContent }} 
                        />
                    </article>

                    <aside className="mt-12 lg:mt-0">
                        <div className="sticky top-32 space-y-8">
                            <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 text-center shadow-lg">
                                <h3 className="text-lg font-bold text-white">Crie a Sua Própria Aventura</h3>
                                <p className="mt-2 mb-4 text-sm text-slate-400">Use a nossa IA para gerar um roteiro personalizado em segundos.</p>
                                <Link href="/?popup=true" className="inline-block w-full rounded-lg bg-white px-6 py-3 font-bold text-primary transition-transform hover:scale-105">
                                    Gerar Roteiro ✨
                                </Link>
                            </div>

                            {post.nomade_roteiros && (
                                <div className="rounded-2xl border border-slate-700 bg-slate-800 p-6 text-center shadow-lg">
                                    <h3 className="mb-4 text-lg font-bold text-white">Roteiro Relacionado</h3>
                                    
                                    <div className="group relative aspect-video overflow-hidden rounded-lg">
                                        <Image
                                            src={post.nomade_roteiros.imagem_url || '/placeholder.jpg'}
                                            alt={post.nomade_roteiros.titulo}
                                            fill
                                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/40"></div>
                                        <div className="absolute bottom-4 left-4 text-left">
                                            <h4 className="font-bold text-white shadow-lg">{post.nomade_roteiros.titulo}</h4>
                                        </div>
                                    </div>

                                    <Link href={`/destinos/${post.nomade_roteiros.slug}`} className="mt-4 inline-block w-full rounded-lg bg-primary px-6 py-3 font-bold text-white transition-transform hover:scale-105">
                                        Ver Roteiro
                                    </Link>
                                </div>
                            )}

                        </div>
                    </aside>

                </div>
            </div>
        </Suspense>
    );
}
