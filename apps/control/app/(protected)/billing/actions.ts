'use server';

import {
  createDatabaseClient,
  paymentProviderAccountsRepository,
  paymentCustomersRepository,
  paymentChargesRepository,
} from '@noro/db';
import { asaasProvider, createAsaasSubaccount } from '@noro/lib/providers/asaas-provider';

function getDb() {
  return createDatabaseClient();
}

// ---------------------------------------------------------------------------
// Onboarding de subconta Asaas
// ---------------------------------------------------------------------------

export async function ativarBillingAsaas(
  tenantId: string,
  activatedByUserId: string,
  tenantData: {
    name: string;
    email: string;
    cpfCnpj: string;        // obrigatório no Asaas
    mobilePhone: string;    // obrigatório no Asaas
    incomeValue: number;    // faturamento mensal estimado
    address: string;
    addressNumber: string;
    province: string;       // bairro
    postalCode: string;
    complement?: string;
    companyType?: 'MEI' | 'LIMITED' | 'INDIVIDUAL' | 'ASSOCIATION';
  },
) {
  const { db, close } = getDb();
  try {
    const existing = await paymentProviderAccountsRepository.getProviderAccount(db, tenantId);
    if (existing?.status === 'active') {
      return { success: false, message: 'Billing Asaas já está ativo para este tenant.' };
    }

    // Registra consentimento explícito antes de qualquer chamada ao gateway
    const account = await paymentProviderAccountsRepository.createProviderAccount(db, {
      tenantId,
      consentRegisteredAt: new Date(),
      consentRegisteredBy: activatedByUserId,
    });
    if (!account) return { success: false, message: 'Erro ao registrar consentimento.' };

    // Cria subconta Asaas via API master da NORO
    const subconta = await createAsaasSubaccount(tenantData);

    // ATENÇÃO: apiKey retornada UMA única vez — persistir imediatamente
    // Em produção, criptografar antes de armazenar
    await paymentProviderAccountsRepository.updateProviderAccountOnboarding(db, tenantId, {
      providerAccountId: subconta.id,
      providerWalletId: subconta.walletId,
      onboardingStatus: 'approved',
      status: 'active',
      metadata: {
        apiKey: subconta.apiKey,   // TODO: criptografar em produção
        createdAt: new Date().toISOString(),
      },
    });

    return { success: true, walletId: subconta.walletId };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao ativar billing';
    // Reverte para pending se a criação no Asaas falhou
    await paymentProviderAccountsRepository.updateProviderAccountOnboarding(
      createDatabaseClient().db, tenantId,
      { onboardingStatus: 'rejected', metadata: { error: message } },
    );
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function getBillingStatus(tenantId: string) {
  const { db, close } = getDb();
  try {
    return await paymentProviderAccountsRepository.getProviderAccount(db, tenantId);
  } finally {
    await close();
  }
}

// ---------------------------------------------------------------------------
// Criação de cliente financeiro e cobrança
// ---------------------------------------------------------------------------

export async function criarClienteFinanceiro(
  tenantId: string,
  clientData: {
    clientId?: string;
    name: string;
    email: string;
    cpfCnpj?: string;
    phone?: string;
  },
) {
  const { db, close } = getDb();
  try {
    // Verifica se o cliente já existe no gateway
    if (clientData.clientId) {
      const existing = await paymentCustomersRepository.findCustomer(
        db, tenantId, clientData.clientId,
      );
      if (existing) return { success: true, customer: existing };
    }

    // Busca walletId da subconta do tenant para criar cliente no contexto correto
    const account = await paymentProviderAccountsRepository.getProviderAccount(db, tenantId);
    const walletId = account?.providerWalletId ?? null;

    const providerCustomer = await asaasProvider.createCustomer({
      ...clientData,
      walletId,
    });

    const customer = await paymentCustomersRepository.createCustomer(db, {
      tenantId,
      clientId: clientData.clientId ?? null,
      providerCustomerId: providerCustomer.providerCustomerId,
      name: providerCustomer.name,
      email: providerCustomer.email,
      cpfCnpj: providerCustomer.cpfCnpj,
    });

    return { success: true, customer };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao criar cliente financeiro';
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function emitirCobranca(
  tenantId: string,
  input: {
    proposalId: string;
    paymentCustomerId: string;
    providerCustomerId: string;
    repasseModelo: 'plataforma' | 'agencia';
    amountCents: number;
    billingType: 'PIX' | 'BOLETO' | 'CREDIT_CARD';
    dueDate: string;
    installments?: number;
    description?: string;
    splitNoroPct?: number;
    taxaCambioSnapshot?: string;
    callbackSuccessUrl?: string;
  },
) {
  const { db, close } = getDb();
  try {
    // Busca walletId da subconta do tenant para split automático
    const account = await paymentProviderAccountsRepository.getProviderAccount(db, tenantId);
    const walletId = account?.providerWalletId ?? null;

    // Calcula split em cents
    const splitNoroPct = input.splitNoroPct ?? 0;
    const splitNoroCents = Math.round(input.amountCents * (splitNoroPct / 100));
    const splitTenantCents = input.amountCents - splitNoroCents;

    // Cria cobrança no banco (draft)
    const charge = await paymentChargesRepository.createCharge(db, {
      tenantId,
      proposalId: input.proposalId,
      paymentCustomerId: input.paymentCustomerId,
      repasseModelo: input.repasseModelo,
      amountCents: input.amountCents,
      billingType: input.billingType,
      dueDate: input.dueDate,
      installments: input.installments,
      taxaCambioSnapshot: input.taxaCambioSnapshot,
      splitNoroPct: splitNoroPct.toString(),
      splitNoroCents,
      splitTenantCents,
    });

    if (!charge) return { success: false, message: 'Erro ao criar registro de cobrança.' };

    // Emite no Asaas
    const providerCharge = await asaasProvider.createCharge({
      providerCustomerId: input.providerCustomerId,
      amountCents: input.amountCents,
      billingType: input.billingType,
      dueDate: input.dueDate,
      installments: input.installments,
      description: input.description,
      externalReference: charge.id,
      // Split apenas para Modelo B (agência): tenant recebe %, NORO fica com o resto
      tenantWalletId: input.repasseModelo === 'agencia' ? walletId : null,
      splitNoroPct: input.repasseModelo === 'agencia' ? splitNoroPct : null,
      callbackSuccessUrl: input.callbackSuccessUrl,
    });

    // Atualiza com dados do provider
    const updated = await paymentChargesRepository.updateChargeFromWebhook(db, charge.id, {
      providerPaymentId: providerCharge.providerPaymentId,
      status: providerCharge.status as any,
      netAmountCents: providerCharge.netAmountCents ?? undefined,
      checkoutUrl: providerCharge.checkoutUrl ?? undefined,
      invoiceUrl: providerCharge.invoiceUrl ?? undefined,
      bankSlipUrl: providerCharge.bankSlipUrl ?? undefined,
      pixQrCode: providerCharge.pixQrCode ?? undefined,
      pixCopyPaste: providerCharge.pixCopyPaste ?? undefined,
      providerPayload: providerCharge.raw,
    });

    // Escrow lógico apenas para modelo plataforma
    if (input.repasseModelo === 'plataforma' && updated) {
      await paymentChargesRepository.setChargeEscrow(db, charge.id, 'held');
    }

    return { success: true, charge: updated };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro ao emitir cobrança';
    return { success: false, message };
  } finally {
    await close();
  }
}

export async function getCobrancas(tenantId: string, filters?: {
  status?: 'draft' | 'pending' | 'confirmed' | 'received' | 'overdue' | 'refunded' | 'canceled' | 'failed';
  limit?: number;
}) {
  const { db, close } = getDb();
  try {
    return await paymentChargesRepository.getChargesByTenant(db, tenantId, filters);
  } finally {
    await close();
  }
}
