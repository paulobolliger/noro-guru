'use server';

const message = 'Ação legada desativada: o modelo de dados legado deste recurso foi desativado.';

export interface ConfiguracaoSistema {
  topbar_color?: string;
  logo_url_admin?: string | null;
  moeda_padrao?: 'EUR' | 'USD' | 'BRL';
  fuso_horario?: string;
  idioma?: 'pt' | 'en' | 'es';
  formato_data?: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';
}

export interface ConfiguracaoUsuario {
  tema?: 'light' | 'dark' | 'system';
  visualizacao?: 'grid' | 'list';
  notificacoes_email?: boolean;
  notificacoes_push?: boolean;
}

export async function getConfiguracaoSistema(..._args: unknown[]): Promise<any> {
  return {
    topbar_color: '#232452',
    logo_url_admin: null,
    moeda_padrao: 'EUR',
    fuso_horario: 'Europe/Lisbon',
    idioma: 'pt',
    formato_data: 'DD/MM/YYYY',
  } satisfies ConfiguracaoSistema;
}

export async function saveConfiguracaoSistema(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function getConfiguracaoUsuario(..._args: unknown[]): Promise<any> {
  return {
    tema: 'system',
    visualizacao: 'grid',
    notificacoes_email: true,
    notificacoes_push: false,
  } satisfies ConfiguracaoUsuario;
}

export async function saveConfiguracaoUsuario(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}
