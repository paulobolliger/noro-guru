'use server';

const message = 'Ação legada desativada: não há collection Appwrite oficial para este recurso.';

export async function generateRoteirosAction(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function generateArtigosAction(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}
