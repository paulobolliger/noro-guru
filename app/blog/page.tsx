// app/blog/page.tsx
import { supabase } from '@/lib/supabaseClient';
import { BlogPost } from '@/lib/types';
import Link from 'next/link';
import Image from 'next/image';

async function getBlogPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('nomade_blog_posts')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar posts do blog:', error);
    return [];
  }
  return data;
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="container mx-auto px-4 py-16 pt-32">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white">Blog Nomade Guru</h1>
        <p className="text-lg text-slate-400 mt-4 max-w-2xl mx-auto">
          Inspiração e dicas para transformar as suas viagens em experiências inesquecíveis.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <Link href={`/blog/${post.slug}`} key={post.id} className="group block bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:-translate-y-1">
            <div className="relative h-56">
              <Image
                src={post.imagem_capa_url || '/placeholder.jpg'}
                alt={post.imagem_alt_text || post.titulo}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <p className="text-sm text-primary font-semibold">{post.categoria}</p>
              <h2 className="text-xl font-bold text-white mt-2 mb-4 group-hover:text-primary transition-colors">{post.titulo}</h2>
              <p className="text-slate-400 text-sm line-clamp-3">{post.resumo}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

