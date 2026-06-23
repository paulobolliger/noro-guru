'use server';

import { createDatabaseClient, paymentProviderAccountsRepository } from '@noro/db';
import { requireUser, logtoSessionAdapter } from '@noro/auth';
import { logtoConfig } from '@/lib/logto';
import { createAsaasSubaccount } from '@noro/lib/providers/asaas-provider';

function getDb() {
  return createDatabaseClient();
}

export async function getBillingStatusAction() {
  const { client, db, close } = getDb();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });

    const memberships = await client`
      SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userCtx.user.id} LIMIT 1
    `;
    if (!memberships || memberships.length === 0) {
      return null;
    }
    const tenantId = memberships[0].tenant_id;

    return await paymentProviderAccountsRepository.getProviderAccount(db, tenantId);
  } catch (error) {
    console.error('Error in getBillingStatusAction:', error);
    return null;
  } finally {
    await close();
  }
}

export async function ativarBillingAsaasAction(tenantData: {
  name: string;
  email: string;
  cpfCnpj: string;
  mobilePhone: string;
  incomeValue: number;
  address: string;
  addressNumber: string;
  province: string;
  postalCode: string;
  complement?: string;
  companyType?: 'MEI' | 'LIMITED' | 'INDIVIDUAL' | 'ASSOCIATION';
}) {
  const { client, db, close } = getDb();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });

    const memberships = await client`
      SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userCtx.user.id} LIMIT 1
    `;
    if (!memberships || memberships.length === 0) {
      return { success: false, message: 'Usuário não associado a nenhuma agência.' };
    }
    const tenantId = memberships[0].tenant_id;
    const userId = userCtx.user.id;

    const existing = await paymentProviderAccountsRepository.getProviderAccount(db, tenantId);
    if (existing?.status === 'active') {
      return { success: false, message: 'Billing Asaas já está ativo para esta agência.' };
    }

    // Registra consentimento
    const account = await paymentProviderAccountsRepository.createProviderAccount(db, {
      tenantId,
      consentRegisteredAt: new Date(),
      consentRegisteredBy: userId,
    });
    if (!account) return { success: false, message: 'Erro ao registrar consentimento.' };

    // Cria subconta Asaas
    const subconta = await createAsaasSubaccount(tenantData);

    // Persiste dados da subconta
    await paymentProviderAccountsRepository.updateProviderAccountOnboarding(db, tenantId, {
      providerAccountId: subconta.id,
      providerWalletId: subconta.walletId,
      onboardingStatus: 'approved',
      status: 'active',
      metadata: {
        apiKey: subconta.apiKey,
        createdAt: new Date().toISOString(),
      },
    });

    return { success: true, walletId: subconta.walletId };
  } catch (err: any) {
    const message = err instanceof Error ? err.message : 'Erro ao ativar billing';
    console.error('Error in ativarBillingAsaasAction:', err);
    return { success: false, message };
  } finally {
    await close();
  }
}
