'use server';

const message = 'Ação legada desativada: não há collection Appwrite oficial para este recurso.';

export type ServerActionReturn<T = unknown> = Promise<{
  success: boolean;
  message: string;
  data?: T;
  [key: string]: unknown;
}>;

export type PaymentProvider = 'EREDE_CREDITO' | 'EREDE_DEBITO' | 'EREDE_PIX';

export async function convertToPedido(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function updatePedido(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function addPedidoItem(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function updatePedidoItem(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function deletePedidoItem(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function emitirCobranca(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function registerPayment(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}
