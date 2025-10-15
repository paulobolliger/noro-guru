import { getSupabaseAdmin } from './admin';

export async function uploadArquivo(bucket: string, path: string, file: File) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true });
  if (error) throw new Error(error.message);
  return data;
}

export async function getUrlPublica(bucket: string, path: string) {
  const supabase = getSupabaseAdmin();
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
