  import { supabaseAdmin } from './admin';
  import type Database from '@/types/supabase';

  type TarefaInsert = Database['public']['Tables']['nomade_tarefas']['Insert'];

  export async function getAllTarefas() {
    const { data, error } = await supabaseAdmin
      .from('nomade_tarefas')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  }

  export async function addTarefa(tarefa: TarefaInsert) {
    const { data, error } = await supabaseAdmin
      .from('nomade_tarefas')
      .insert(tarefa)
      .select();
    if (error) throw new Error(error.message);
    return data?.[0];
  }
  
