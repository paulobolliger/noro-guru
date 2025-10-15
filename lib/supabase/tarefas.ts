import { getSupabaseAdmin } from './admin';

export async function getAllTarefas() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('nomade_tarefas')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function addTarefa(tarefa: any) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('nomade_tarefas')
    .insert([tarefa])
    .select();
  if (error) throw new Error(error.message);
  return data?.[0];
}
