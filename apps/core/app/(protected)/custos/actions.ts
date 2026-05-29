'use server';

const message = 'Ação legada desativada: o modelo de dados legado deste recurso foi desativado.';

export async function purchaseCredits(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}
