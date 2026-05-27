'use server';

const message = 'Ação legada desativada: não há collection Appwrite oficial para este recurso.';

export async function getClientes(..._args: unknown[]): Promise<any> {
  return [];
}

export async function getClienteById(..._args: unknown[]): Promise<any> {
  return [];
}

export async function createClienteAction(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function updateClienteAction(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function deleteClienteAction(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function getClientesStats(..._args: unknown[]): Promise<any> {
  return [];
}
