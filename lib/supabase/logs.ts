import { getSupabaseAdmin } from './admin';

export async function registrarLog(tipo: string, mensagem: string) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from('nomade_logs')
    .insert([{ tipo, mensagem }]);
  if (error) console.error('Erro ao registrar log:', error.message);
}
