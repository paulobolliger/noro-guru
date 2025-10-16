  import { supabaseAdmin } from './admin'; // Corrigido

  export async function uploadArquivo(bucket: string, path: string, file: File) {
    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(path, file, { upsert: true });
    if (error) throw new Error(error.message);
    return data;
  }

  export async function getUrlPublica(bucket: string, path: string) {
    const { data } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
  }
  
