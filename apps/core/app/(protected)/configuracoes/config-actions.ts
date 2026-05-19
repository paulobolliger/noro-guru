// app/admin/(protected)/configuracoes/config-actions.ts
'use server';

import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server"; // Para pegar o usuário logado
import { revalidatePath } from "next/cache";

// Tipos para as configurações
export interface ConfiguracaoSistema {
  moeda_padrao: 'EUR' | 'USD' | 'BRL';
  fuso_horario: string;
  idioma: 'pt' | 'en' | 'es';
  formato_data: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
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

// --- Helper: Obter Tenant ID do Usuário Atual ---
async function getCurrentTenantId(userId: string): Promise<string> {
   const supabaseAdmin = getSupabaseAdmin();
   
   // 1. Tenta buscar o tenant do usuário
   const { data, error } = await supabaseAdmin
     .from('user_tenants')
     .select('tenant_id')
     .eq('user_id', userId)
     .limit(1)
     .maybeSingle(); // Use maybeSingle to avoid 406/PGRST116 errors immediately

   const tenantRow = data as { tenant_id?: string } | null;
   if (tenantRow?.tenant_id) {
     return tenantRow.tenant_id;
   }

   console.warn(`Usuário ${userId} sem tenant vinculado. Tentando fallback para tenant padrão...`);

   // 2. Fallback: Busca o primeiro tenant disponível (ex: 'noro' ou qualquer um)
   // Isso evita que o sistema quebre em ambiente de dev/teste mal configurado
   const { data: defaultTenant, error: fallbackError } = await supabaseAdmin
     .from('tenants')
     .select('id')
     .limit(1)
     .single();

   const defaultTenantRow = defaultTenant as { id?: string } | null;
   if (defaultTenantRow?.id) {
     return defaultTenantRow.id;
   }

   console.error("Erro fatal: Nenhum tenant encontrado no sistema.", fallbackError);
   throw new Error("Erro de configuração: Sistema sem tenants cadastrados.");
}


// --- Funções de Sistema (Agora por Tenant) ---

export async function getConfiguracaoSistema(): Promise<ConfiguracaoSistema> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error("Não autenticado");

    const tenantId = await getCurrentTenantId(user.id);
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('noro_configuracoes')
      .select('*')
      .eq('tenant_id', tenantId) // Filtra pelo tenant
      .eq('tipo', 'sistema')
      .is('user_id', null);

    if (error) throw error;

    // Valores padrão
    const defaultConfig: ConfiguracaoSistema = {
      moeda_padrao: 'EUR',
      fuso_horario: 'Europe/Lisbon',
      idioma: 'pt',
      formato_data: 'DD/MM/YYYY',
      logo_url_admin: '', 
      topbar_color: '#232452'
    };

    if (!data || data.length === 0) return defaultConfig;

    // Agregar
    const config: any = { ...defaultConfig };
    const configRows = (data ?? []) as Array<{ chave: string; valor: unknown }>;
    configRows.forEach(item => {
      config[item.chave] = item.valor;
    });

    return config as ConfiguracaoSistema;
  } catch (error: any) {
    console.error('Erro ao buscar configurações do sistema:', error);
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
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return { success: false, message: 'Usuário não autenticado' };

    const tenantId = await getCurrentTenantId(user.id);
    const supabaseAdmin = getSupabaseAdmin();
    
    const configs = Object.entries(config).map(([chave, valor]) => ({
      tipo: 'sistema',
      chave,
      valor: valor || '',
      user_id: null
    }));

    for (const item of configs) {
      const { error } = await (supabaseAdmin as any)
        .from('noro_configuracoes')
        .upsert({
          tenant_id: tenantId, // Usa o ID real do tenant
          tipo: item.tipo,
          chave: item.chave,
          valor: item.valor,
          user_id: item.user_id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'tenant_id,tipo,chave,user_id',
          ignoreDuplicates: false
        });

      if (error) throw error;
    }

    revalidatePath('/admin', 'layout');
    return { success: true, message: 'Configurações do sistema salvas com sucesso!' };
  } catch (error: any) {
    console.error('Erro ao salvar configurações do sistema:', error);
    return { success: false, message: `Erro: ${error.message}` };
  }
}

// --- Funções de Usuário ---

export async function getConfiguracaoUsuario(userId: string): Promise<ConfiguracaoUsuario> {
  try {
    const tenantId = await getCurrentTenantId(userId);
    const supabaseAdmin = getSupabaseAdmin();
    
    const { data, error } = await supabaseAdmin
      .from('noro_configuracoes')
      .select('*')
      .eq('tenant_id', tenantId)
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
    const configRows = (data ?? []) as Array<{ chave: string; valor: unknown }>;
    configRows.forEach(item => {
      config[item.chave] = item.valor;
    });

    return config as ConfiguracaoUsuario;
  } catch (error: any) {
    console.error('Erro ao buscar configurações do usuário:', error);
    // Em caso de erro, retorna padrão em vez de quebrar
    return {
      tema: 'light',
      densidade_tabela: 'confortavel',
      notificacoes_ativadas: true,
      notificacoes_email: true,
      notificacoes_push: false
    };
  }
}

export async function saveConfiguracaoUsuario(userId: string, config: ConfiguracaoUsuario) {
  try {
    const tenantId = await getCurrentTenantId(userId);
    const supabaseAdmin = getSupabaseAdmin();
    
    const configs = Object.entries(config).map(([chave, valor]) => ({
      tipo: 'usuario',
      chave,
      valor,
      user_id: userId
    }));

    for (const item of configs) {
      const { error } = await (supabaseAdmin as any)
        .from('noro_configuracoes')
        .upsert({
          tenant_id: tenantId, // Usa o ID real do tenant
          tipo: item.tipo,
          chave: item.chave,
          valor: item.valor,
          user_id: item.user_id,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'tenant_id,tipo,chave,user_id',
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