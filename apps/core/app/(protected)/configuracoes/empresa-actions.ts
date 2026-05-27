'use server';

const message = 'Ação legada desativada: não há collection Appwrite oficial para este recurso.';

export interface EmpresaDados {
  id: string;
  nome_empresa?: string | null;
  documento?: string | null;
  email_principal?: string | null;
  telefone_comercial?: string | null;
  redes_sociais?: {
    instagram?: string | null;
    facebook?: string | null;
    linkedin?: string | null;
    whatsapp?: string | null;
  } | null;
}

export async function getEmpresaDados(..._args: unknown[]): Promise<any> {
  return {
    id: 'appwrite-disabled',
    nome_empresa: null,
    documento: null,
    email_principal: null,
    telefone_comercial: null,
    redes_sociais: null,
  } satisfies EmpresaDados;
}

export async function updateEmpresaDados(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}
