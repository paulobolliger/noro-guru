'use server';

import { createClient } from '@noro/lib/supabase/server';

export async function debugTarefasSchema() {
  const supabase = createClient();
  
  // Tenta pegar 1 tarefa para ver a estrutura
  const { data, error } = await supabase
    .from('noro_tarefas')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Debug Error:', error);
    return { error: error.message };
  }

  if (data && data.length > 0) {
    console.log('Tarefas Schema (First Row Keys):', Object.keys(data[0]));
    return { columns: Object.keys(data[0]), sample: data[0] };
  } else {
    // Se não tiver dados, tentamos inferir de um erro proposital?
    // Ou simplesmente retornamos vazio dizendo que a tabela existe mas está vazia.
    return { columns: [], message: 'Tabela existe mas está vazia' };
  }
}
