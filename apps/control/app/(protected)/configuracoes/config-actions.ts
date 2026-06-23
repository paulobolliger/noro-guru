// app/admin/(protected)/configuracoes/config-actions.ts
'use server';

import { createDatabaseClient } from "@noro/db";
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
  const { client, close } = createDatabaseClient();
  try {
    const rows = await client`
      SELECT chave, valor 
      FROM sites.configuracoes 
      WHERE tipo = 'sistema' AND user_id IS NULL
    `;

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

    if (!rows || rows.length === 0) return defaultConfig;

    // Agregar todas as configurações em um objeto
    const config: any = { ...defaultConfig };
    rows.forEach(item => {
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
  } finally {
    await close();
  }
}

export async function saveConfiguracaoSistema(config: ConfiguracaoSistema) {
  const { client, close } = createDatabaseClient();
  try {
    // Preparar os dados para inserção/atualização
    const configs = Object.entries(config).map(([chave, valor]) => ({
      tipo: 'sistema',
      chave,
      valor: valor || '', // Garante que não salvamos undefined
      user_id: null
    }));

    // Upsert (inserir ou atualizar)
    for (const item of configs) {
      await client`
        INSERT INTO sites.configuracoes (tipo, chave, valor, user_id, updated_at)
        VALUES (${item.tipo}, ${item.chave}, ${item.valor}, ${item.user_id}, NOW())
        ON CONFLICT (tipo, chave, user_id) 
        DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW()
      `;
    }

    revalidatePath('/admin', 'layout'); // Revalida todo o layout do admin
    return { success: true, message: 'Configurações do sistema salvas com sucesso!' };
  } catch (error: any) {
    console.error('Erro ao salvar configurações do sistema:', error);
    return { success: false, message: `Erro: ${error.message}` };
  } finally {
    await close();
  }
}

// --- Funções de Usuário ---

export async function getConfiguracaoUsuario(userId: string): Promise<ConfiguracaoUsuario> {
  const { client, close } = createDatabaseClient();
  try {
    const rows = await client`
      SELECT chave, valor 
      FROM sites.configuracoes 
      WHERE tipo = 'usuario' AND user_id = ${userId}
    `;

    const defaultConfig: ConfiguracaoUsuario = {
      tema: 'light',
      densidade_tabela: 'confortavel',
      notificacoes_ativadas: true,
      notificacoes_email: true,
      notificacoes_push: false
    };

    if (!rows || rows.length === 0) return defaultConfig;

    const config: any = { ...defaultConfig };
    rows.forEach(item => {
      let val: any = item.valor;
      if (val === 'true') val = true;
      if (val === 'false') val = false;
      config[item.chave] = val;
    });

    return config as ConfiguracaoUsuario;
  } catch (error: any) {
    console.error('Erro ao buscar configurações do usuário:', error);
    throw error;
  } finally {
    await close();
  }
}

export async function saveConfiguracaoUsuario(userId: string, config: ConfiguracaoUsuario) {
  const { client, close } = createDatabaseClient();
  try {
    const configs = Object.entries(config).map(([chave, valor]) => ({
      tipo: 'usuario',
      chave,
      valor: String(valor),
      user_id: userId
    }));

    for (const item of configs) {
      await client`
        INSERT INTO sites.configuracoes (tipo, chave, valor, user_id, updated_at)
        VALUES (${item.tipo}, ${item.chave}, ${item.valor}, ${item.user_id}, NOW())
        ON CONFLICT (tipo, chave, user_id) 
        DO UPDATE SET valor = EXCLUDED.valor, updated_at = NOW()
      `;
    }

    revalidatePath('/admin/configuracoes');
    return { success: true, message: 'Suas preferências foram salvas!' };
  } catch (error: any) {
    console.error('Erro ao salvar configurações do usuário:', error);
    return { success: false, message: `Erro: ${error.message}` };
  } finally {
    await close();
  }
}