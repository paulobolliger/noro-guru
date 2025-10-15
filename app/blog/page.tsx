// app/blog/page.tsx

import { supabase } from '@/lib/supabaseClient';
import { BlogPost } from '@/lib/types';
import BlogClient from '@/components/BlogClient'; // <-- Importa o novo componente

// Função que busca os dados no servidor
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

// O componente da página (Server Component) que busca os dados
// e os passa para o Client Component
export default async function BlogPage() {
  const allPosts = await getBlogPosts();
  return <BlogClient allPosts={allPosts} />;
}