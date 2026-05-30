// Interface canônica de payment provider
// Toda integração de gateway passa por aqui — nunca chamada direta de tela ou action

export type ProviderCustomer = {
  providerCustomerId: string;
  name: string;
  email: string;
  cpfCnpj?: string | null;
};

export type ProviderCharge = {
  providerPaymentId: string;
  status: string;
  checkoutUrl?: string | null;
  invoiceUrl?: string | null;
  bankSlipUrl?: string | null;
  pixQrCode?: string | null;
  pixCopyPaste?: string | null;
  netAmountCents?: number | null;
  raw: Record<string, unknown>;
};

export type ProviderWebhookEvent = {
  providerEventId: string;
  eventType: string;
  providerPaymentId?: string | null;
  raw: Record<string, unknown>;
};

export type CreateCustomerInput = {
  name: string;
  email: string;
  cpfCnpj?: string | null;
  phone?: string | null;
  // ID da subconta Asaas do tenant (walletId) — null para Modelo A (plataforma)
  walletId?: string | null;
};

export type CreateChargeInput = {
  providerCustomerId: string;
  amountCents: number;
  billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
  dueDate: string;       // YYYY-MM-DD
  installments?: number;
  description?: string;
  // Split: walletId da subconta do tenant + percentual da NORO
  walletId?: string | null;
  splitNoroPct?: number | null;
  // URL de callback após pagamento hospedado
  callbackSuccessUrl?: string | null;
};

export type ParseWebhookInput = {
  body: string;
  headers: Record<string, string | string[] | undefined>;
};

export interface PaymentProvider {
  createCustomer(input: CreateCustomerInput): Promise<ProviderCustomer>;
  createCharge(input: CreateChargeInput): Promise<ProviderCharge>;
  getCharge(providerPaymentId: string): Promise<ProviderCharge | null>;
  parseWebhook(input: ParseWebhookInput): Promise<ProviderWebhookEvent>;
}
