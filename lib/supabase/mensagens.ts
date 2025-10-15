import { getSupabaseAdmin } from './admin';

export async function getMensagensContato() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('nomade_mensagens')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}
