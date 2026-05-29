'use server';

const message = 'Ação legada desativada: o modelo de dados legado deste recurso foi desativado.';

export async function getOrcamentos(..._args: unknown[]): Promise<any> {
  return [];
}

export async function getOrcamentoById(..._args: unknown[]): Promise<any> {
  return [];
}

export async function createOrcamento(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function updateOrcamento(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function deleteOrcamento(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}
