'use server';

import { createServerSupabaseClient } from '@noro/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export type Tarefa = {
  id: string;
  titulo: string;
  descricao?: string;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada';
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  data_vencimento?: string;
  tenant_id: string;
  created_at: string;
};

export async function getTarefas(): Promise<Tarefa[]> {
  const supabase = createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from('noro_tarefas')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar tarefas:', error);
    return [];
  }
  
  return data as Tarefa[];
}

export async function createTarefa(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // ... (tenant logic)
  const { data: userRole } = await supabase
    .from('cp.user_tenant_roles')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();
    
  let tenant_id = userRole?.tenant_id;
  
  if (!tenant_id) {
       const { data: tenants } = await supabase.from('cp.tenants').select('id').limit(1).single();
       tenant_id = tenants?.id;
  }

  const titulo = formData.get('titulo') as string;
  const descricao = formData.get('descricao') as string;
  const status = formData.get('status') as string || 'pendente';
  const prioridade = formData.get('prioridade') as string || 'media';
  const data_vencimento = formData.get('data_vencimento') as string;

  const payload: any = {
    titulo,
    descricao,
    status,
    prioridade,
    tenant_id,
    data_vencimento: data_vencimento || null,
  };

  const { error } = await supabase.from('noro_tarefas').insert(payload);

  if (error) {
    console.error('Erro criar tarefa:', error);
    throw new Error('Falha ao criar tarefa');
  }

  revalidatePath('/tarefas');
  return { success: true };
}

export async function updateTarefaStatus(id: string, newStatus: string) {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase
        .from('noro_tarefas')
        .update({ status: newStatus })
        .eq('id', id);
        
    if (error) throw new Error(error.message);
    revalidatePath('/tarefas');
}

export async function deleteTarefa(id: string) {
    const supabase = createServerSupabaseClient();
    const { error } = await supabase
        .from('noro_tarefas')
        .delete()
        .eq('id', id);
        
    if (error) throw new Error(error.message);
    revalidatePath('/tarefas');
}
