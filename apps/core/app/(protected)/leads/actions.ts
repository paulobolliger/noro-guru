'use server';

const message = 'Ação legada desativada: o modelo de dados legado deste recurso foi desativado.';

export async function getLeads(..._args: unknown[]): Promise<any> {
  return [];
}

export async function getLeadById(..._args: unknown[]): Promise<any> {
  return [];
}

export async function createLeadAction(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function updateLeadAction(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function updateLeadStageAction(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function deleteLeadAction(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}
