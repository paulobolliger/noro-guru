import type {
  PaymentProvider,
  CreateCustomerInput,
  CreateChargeInput,
  ParseWebhookInput,
  ProviderCustomer,
  ProviderCharge,
  ProviderWebhookEvent,
} from './payment-provider';

// Chaves Asaas via variáveis de ambiente — nunca hardcoded
// ASAAS_API_KEY     = chave da conta master NORO
// ASAAS_SANDBOX     = 'true' para sandbox, 'false' para produção
// ASAAS_BASE_URL é derivado de ASAAS_SANDBOX

function getAsaasConfig() {
  const apiKey = process.env.ASAAS_API_KEY;
  const sandbox = process.env.ASAAS_SANDBOX !== 'false';

  if (!apiKey) {
    throw new Error('ASAAS_API_KEY não configurada. Defina a variável de ambiente.');
  }

  return {
    apiKey,
    baseUrl: sandbox
      ? 'https://sandbox.asaas.com/api/v3'
      : 'https://www.asaas.com/api/v3',
  };
}

// Mapeamento de status Asaas → status interno canônico
const ASAAS_STATUS_MAP: Record<string, string> = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  RECEIVED: 'received',
  RECEIVED_IN_CASH: 'received',
  OVERDUE: 'overdue',
  REFUNDED: 'refunded',
  REFUND_REQUESTED: 'refunded',
  CHARGEBACK_REQUESTED: 'refunded',
  CHARGEBACK_DISPUTE: 'refunded',
  AWAITING_CHARGEBACK_REVERSAL: 'refunded',
  DUNNING_REQUESTED: 'overdue',
  DUNNING_RECEIVED: 'received',
  AWAITING_RISK_ANALYSIS: 'processing',
};

export function mapAsaasStatus(asaasStatus: string): string {
  return ASAAS_STATUS_MAP[asaasStatus] ?? 'pending';
}

async function asaasFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const { apiKey, baseUrl } = getAsaasConfig();

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'access_token': apiKey,
      ...(options.headers ?? {}),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Asaas API error ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

export class AsaasProvider implements PaymentProvider {
  async createCustomer(input: CreateCustomerInput): Promise<ProviderCustomer> {
    const body: Record<string, unknown> = {
      name: input.name,
      email: input.email,
    };
    if (input.cpfCnpj) body.cpfCnpj = input.cpfCnpj.replace(/\D/g, '');
    if (input.phone) body.phone = input.phone;
    // walletId da subconta — cliente criado no contexto do tenant
    if (input.walletId) body.walletId = input.walletId;

    const data = await asaasFetch<{
      id: string;
      name: string;
      email: string;
      cpfCnpj?: string;
    }>('/customers', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return {
      providerCustomerId: data.id,
      name: data.name,
      email: data.email,
      cpfCnpj: data.cpfCnpj ?? null,
    };
  }

  async createCharge(input: CreateChargeInput): Promise<ProviderCharge> {
    const body: Record<string, unknown> = {
      customer: input.providerCustomerId,
      billingType: input.billingType,
      value: input.amountCents / 100,
      dueDate: input.dueDate,
      description: input.description ?? 'Pagamento NORO',
    };

    if (input.installments && input.installments > 1) {
      body.installmentCount = input.installments;
      body.installmentValue = input.amountCents / 100 / input.installments;
    }

    if (input.callbackSuccessUrl) {
      body.callback = { successUrl: input.callbackSuccessUrl };
    }

    // Split automático: walletId do tenant + percentual NORO
    if (input.walletId && input.splitNoroPct != null) {
      body.split = [
        {
          walletId: input.walletId,
          percentualValue: 100 - input.splitNoroPct,
        },
      ];
    }

    const data = await asaasFetch<{
      id: string;
      status: string;
      invoiceUrl?: string;
      bankSlipUrl?: string;
      pixQrCodeUrl?: string;
      pixCopiaECola?: string;
      netValue?: number;
    }>('/payments', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    return {
      providerPaymentId: data.id,
      status: mapAsaasStatus(data.status),
      invoiceUrl: data.invoiceUrl ?? null,
      bankSlipUrl: data.bankSlipUrl ?? null,
      pixQrCode: data.pixQrCodeUrl ?? null,
      pixCopyPaste: data.pixCopiaECola ?? null,
      netAmountCents: data.netValue ? Math.round(data.netValue * 100) : null,
      raw: data as Record<string, unknown>,
    };
  }

  async getCharge(providerPaymentId: string): Promise<ProviderCharge | null> {
    try {
      const data = await asaasFetch<{
        id: string;
        status: string;
        invoiceUrl?: string;
        bankSlipUrl?: string;
        pixQrCodeUrl?: string;
        pixCopiaECola?: string;
        netValue?: number;
      }>(`/payments/${providerPaymentId}`);

      return {
        providerPaymentId: data.id,
        status: mapAsaasStatus(data.status),
        invoiceUrl: data.invoiceUrl ?? null,
        bankSlipUrl: data.bankSlipUrl ?? null,
        pixQrCode: data.pixQrCodeUrl ?? null,
        pixCopyPaste: data.pixCopiaECola ?? null,
        netAmountCents: data.netValue ? Math.round(data.netValue * 100) : null,
        raw: data as Record<string, unknown>,
      };
    } catch {
      return null;
    }
  }

  async parseWebhook(input: ParseWebhookInput): Promise<ProviderWebhookEvent> {
    let body: Record<string, unknown>;
    try {
      body = JSON.parse(input.body);
    } catch {
      throw new Error('Asaas webhook: body inválido (não é JSON)');
    }

    const event = body.event as string | undefined;
    const payment = body.payment as Record<string, unknown> | undefined;

    if (!event) throw new Error('Asaas webhook: campo event ausente');

    return {
      providerEventId: (body.id as string) ?? `${event}_${Date.now()}`,
      eventType: event,
      providerPaymentId: (payment?.id as string) ?? null,
      raw: body,
    };
  }
}

// Instância singleton — usar em actions e route handlers
export const asaasProvider = new AsaasProvider();
