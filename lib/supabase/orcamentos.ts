import { getSupabaseAdmin } from './admin';

export async function getAllOrcamentos() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('nomade_orcamentos')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function addOrcamento(orcamento: any) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('nomade_orcamentos')
    .insert([orcamento])
    .select();
  if (error) throw new Error(error.message);
  return data?.[0];
}
