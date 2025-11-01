'use server';

import { stripe } from '@/lib/stripe';
import { createAuditLog } from '@/lib/audit';

interface CreatePortalSessionParams {
  tenantId: string;
  customerEmail: string;
}

export async function createBillingPortalSession({ tenantId, customerEmail }: CreatePortalSessionParams) {
  try {
    // Buscar ou criar cliente no Stripe
    let customer = await getStripeCustomer(tenantId);
    
    if (!customer) {
      customer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          tenantId
        }
      });
      
      // Salvar ID do cliente no banco
      await updateTenantStripeCustomerId(tenantId, customer.id);
    }

    // Criar sessão do portal
    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });

    // Registrar log de auditoria
    await createAuditLog({
      action: 'billing_portal.accessed',
      tenantId,
      metadata: {
        customerEmail
      }
    });

    return { url: session.url };
  } catch (error) {
    console.error('Erro ao criar sessão do portal:', error);
    throw new Error('Não foi possível criar a sessão do portal de faturamento');
  }
}

// Funções auxiliares
async function getStripeCustomer(tenantId: string) {
  // TODO: Implementar busca do cliente no banco usando o tenantId
  return null;
}

async function updateTenantStripeCustomerId(tenantId: string, customerId: string) {
  // TODO: Implementar atualização do customerId no tenant
}