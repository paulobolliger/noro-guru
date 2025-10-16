import { supabaseAdmin } from './admin';
import type Database from '@/types/supabase'; // CORRIGIDO: Importação default

type PostInsert = Database['public']['Tables']['nomade_blog_posts']['Insert'];

export async function getAllPosts() {
  const { data, error } = await supabaseAdmin
    .from('nomade_blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function addPost(post: PostInsert) {
  const { data, error } = await supabaseAdmin
    .from('nomade_blog_posts')
    .insert(post)
    .select();
  if (error) throw new Error(error.message);
  return data?.[0];
}

export async function getAllCategorias() {
  const { data, error } = await supabaseAdmin
    .from('nomade_blog_categorias')
    .select('*');
  if (error) throw new Error(error.message);
  return data;
}
