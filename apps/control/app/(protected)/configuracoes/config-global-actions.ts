'use server';

import { createServerSupabaseClient } from '@/../../packages/lib/supabase/server';
import type { ConfiguracaoGlobal } from '@/../../packages/types/control-plane';

export async function getConfiguracoesGlobais(): Promise<ConfiguracaoGlobal> {
  const supabase = await createServerSupabaseClient();
  
  // Buscar configurações da tabela control_plane_config
  const { data, error } = await supabase
    .from('control_plane_config')
    .select('*')
    .single();

  if (error) throw new Error('Erro ao buscar configurações globais');

  return data as ConfiguracaoGlobal;
}

export async function salvarConfiguracaoGlobal(
  secao: keyof ConfiguracaoGlobal,
  dados: any
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createServerSupabaseClient();

    // Atualizar apenas a seção específica
    const { error } = await supabase
      .from('control_plane_config')
      .update({ [secao]: dados })
      .eq('id', 1); // Assumindo que temos apenas uma linha de config

    if (error) throw error;

    return {
      success: true,
      message: 'Configurações atualizadas com sucesso'
    };
  } catch (error: any) {
    console.error('Erro ao salvar configurações:', error);
    return {
      success: false,
      message: error.message || 'Erro ao salvar configurações'
    };
  }
}