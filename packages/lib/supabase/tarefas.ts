  import { supabaseAdmin } from './admin';
    type TarefaInsert = Database['public']['Tables']['noro_tarefas']['Insert'];

  export async function getAllTarefas() {
    const { data, error } = await supabaseAdmin
      .from('noro_tarefas')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  export async function addTarefa(tarefa: TarefaInsert) {
    const { data, error } = await supabaseAdmin
      .from('noro_tarefas')
      .insert(tarefa)
      .select();
    if (error) throw new Error(error.message);
    return data?.[0];
  }
  


