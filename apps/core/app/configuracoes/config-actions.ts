// app/admin/(protected)/configuracoes/config-actions.ts
'use server';

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// Tipos para as configurações
export interface ConfiguracaoSistema {
  moeda_padrao: 'EUR' | 'USD' | 'BRL';
  fuso_horario: string;
  idioma: 'pt' | 'en' | 'es';
  formato_data: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
  // NOVOS CAMPOS ADICIONADOS
  logo_url_admin?: string;
  topbar_color?: string;
}

export interface ConfiguracaoUsuario {
  tema: 'light' | 'dark' | 'auto';
  densidade_tabela: 'compacta' | 'confortavel' | 'espaçosa';
  notificacoes_ativadas: boolean;
  notificacoes_email: boolean;
  notificacoes_push: boolean;
}

// --- Funções de Sistema ---

export async function getConfiguracaoSistema(): Promise<ConfiguracaoSistema> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('noro_configuracoes')
      .select('*')
      .eq('tipo', 'sistema')
      .is('user_id', null);

    if (error) throw error;

    // Valores padrão se não existir configuração
    const defaultConfig: ConfiguracaoSistema = {
      moeda_padrao: 'EUR',
      fuso_horario: 'Europe/Lisbon',
      idioma: 'pt',
      formato_data: 'DD/MM/YYYY',
      // VALORES PADRÃO PARA OS NOVOS CAMPOS
      logo_url_admin: '', 
      topbar_color: '#232452' // Cor secundária padrão
    };

    if (!data || data.length === 0) return defaultConfig;

    // Agregar todas as configurações em um objeto
    const config: any = { ...defaultConfig };
    data.forEach(item => {
      config[item.chave] = item.valor;
    });

    return config as ConfiguracaoSistema;
  } catch (error: any) {
    console.error('Erro ao buscar configurações do sistema:', error);
    // Retorna o padrão em caso de erro para não quebrar a aplicação
    return {
      moeda_padrao: 'EUR',
      fuso_horario: 'Europe/Lisbon',
      idioma: 'pt',
      formato_data: 'DD/MM/YYYY',
      logo_url_admin: '',
      topbar_color: '#232452'
    };
  }
}

export async function saveConfiguracaoSistema(config: ConfiguracaoSistema) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    // Preparar os dados para inserção/atualização
    const configs = Object.entries(config).map(([chave, valor]) => ({
      tipo: 'sistema',
      chave,
      valor: valor || '', // Garante que não salvamos undefined
      user_id: null
    }));

    // Upsert (inserir ou atualizar)
    for (const item of configs) {
      const { error } = await supabaseAdmin
        .from('noro_configuracoes')
        .upsert({
          tipo: item.tipo,
          chave: item.chave,
          valor: item.valor,
          user_id: item.user_id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'tipo,chave,user_id',
          ignoreDuplicates: false
        });

      if (error) throw error;
    }

    revalidatePath('/admin', 'layout'); // Revalida todo o layout do admin
    return { success: true, message: 'Configurações do sistema salvas com sucesso!' };
  } catch (error: any) {
    console.error('Erro ao salvar configurações do sistema:', error);
    return { success: false, message: `Erro: ${error.message}` };
  }
}

// --- Funções de Usuário (sem alterações) ---

export async function getConfiguracaoUsuario(userId: string): Promise<ConfiguracaoUsuario> {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('noro_configuracoes')
      .select('*')
      .eq('tipo', 'usuario')
      .eq('user_id', userId);

    if (error) throw error;

    const defaultConfig: ConfiguracaoUsuario = {
      tema: 'light',
      densidade_tabela: 'confortavel',
      notificacoes_ativadas: true,
      notificacoes_email: true,
      notificacoes_push: false
    };

    if (!data || data.length === 0) return defaultConfig;

    const config: any = { ...defaultConfig };
    data.forEach(item => {
      config[item.chave] = item.valor;
    });

    return config as ConfiguracaoUsuario;
  } catch (error: any) {
    console.error('Erro ao buscar configurações do usuário:', error);
    throw error;
  }
}

export async function saveConfiguracaoUsuario(userId: string, config: ConfiguracaoUsuario) {
  try {
    const supabaseAdmin = getSupabaseAdmin();
    
    const configs = Object.entries(config).map(([chave, valor]) => ({
      tipo: 'usuario',
      chave,
      valor,
      user_id: userId
    }));

    for (const item of configs) {
      const { error } = await supabaseAdmin
        .from('noro_configuracoes')
        .upsert({
          tipo: item.tipo,
          chave: item.chave,
          valor: item.valor,
          user_id: item.user_id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'tipo,chave,user_id',
          ignoreDuplicates: false
        });

      if (error) throw error;
    }

    revalidatePath('/admin/configuracoes');
    return { success: true, message: 'Suas preferências foram salvas!' };
  } catch (error: any) {
    console.error('Erro ao salvar configurações do usuário:', error);
    return { success: false, message: `Erro: ${error.message}` };
  }
}