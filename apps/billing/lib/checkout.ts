import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { stripeService } from '@/lib/stripe';

export interface CheckoutParams {
  planId: string;
  tenantId: string;
  currency?: 'brl' | 'usd';
  email?: string;
}

export async function createCheckoutSession({
  planId,
  tenantId,
  currency = 'brl',
  email
}: CheckoutParams) {
  try {
    const plan = await db.query.plans.findFirst({
      where: (plans, { eq }) => eq(plans.id, planId)
    });

    if (!plan) {
      throw new Error('Plano não encontrado');
    }

    // Sincronizar plano com Stripe se necessário
    if (!plan.stripePriceId) {
      const stripeData = await stripeService.syncPlanWithStripe(plan);
      await db
        .update(plans)
        .set({
          stripePriceId: currency === 'brl' ? stripeData.priceBrl.id : stripeData.priceUsd.id,
          metadata: {
            ...plan.metadata,
            stripeProductId: stripeData.product.id
          }
        })
        .where(eq(plans.id, planId));
    }

    const host = headers().get('host');
    const protocol = process?.env.NODE_ENV === 'development' ? 'http' : 'https';

    const session = await stripeService.createCheckoutSession({
      priceId: plan.stripePriceId!,
      successUrl: `${protocol}://${host}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${protocol}://${host}/billing/cancel`,
      customerEmail: email,
      clientReferenceId: tenantId,
      metadata: {
        planId: plan.id,
        tenantId
      }
    });

    redirect(session.url!);
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    throw error;
  }
}