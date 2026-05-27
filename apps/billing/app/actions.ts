'use server';

import { stripe } from '@/lib/stripe';
import {
  getStripeCustomerId,
  updateStripeCustomerId,
} from '@noro/lib/services/billingService';

interface CreatePortalSessionParams {
  tenantId: string;
  customerEmail: string;
}

export async function createBillingPortalSession({
  tenantId,
  customerEmail,
}: CreatePortalSessionParams) {
  try {
    let customerId = await getStripeCustomerId(tenantId);

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: customerEmail,
        metadata: { tenantId },
      });
      customerId = customer.id;
      await updateStripeCustomerId(tenantId, customer.id);
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    });

    return { url: session.url };
  } catch (error) {
    console.error('Erro ao criar sessão do portal:', error);
    throw new Error('Não foi possível criar a sessão do portal de faturamento');
  }
}
