import { getSupabaseAdmin } from './admin';

export async function getAllPosts() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('nomade_blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function addPost(post: any) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('nomade_blog_posts')
    .insert([post])
    .select();
  if (error) throw new Error(error.message);
  return data?.[0];
}

export async function getAllCategorias() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('nomade_blog_categorias')
    .select('*');
  if (error) throw new Error(error.message);
  return data;
}
