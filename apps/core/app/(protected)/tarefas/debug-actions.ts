'use server';

import { createServerSupabaseClient } from '@noro/lib/supabase/server';

export async function debugTarefasSchema() {
  const supabase = createServerSupabaseClient();
  
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
    // Se tiver dados, ótimo
    return { columns: Object.keys(data[0]), sample: data[0] };
  } else {
    // Se não tiver dados, insere um dummy para descobrir as colunas padrão
    // Isso pode falhar se tiver constraints NOT NULL sem default, mas vamos tentar o básico
    // Na verdade, melhor não inserir lixo.
    // Vamos assumir que se está vazia, o usuário pode ter acabado de criar.
    return { columns: [], message: 'Tabela existe mas está vazia. Impossível inferir colunas.' };
  }
}
