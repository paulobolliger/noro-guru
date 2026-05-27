'use server';

const message = 'Ação legada desativada: não há collection Appwrite oficial para este recurso.';

export async function purchaseCredits(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}
