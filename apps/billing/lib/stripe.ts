import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing Supabase credentials');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function createOrRetrieveStripeCustomer(tenantId: string, email: string) {
  const { data: tenant } = await supabase
    .from('tenants')
    .select('stripe_customer_id')
    .eq('id', tenantId)
    .single();

  if (tenant?.stripe_customer_id) {
    return tenant.stripe_customer_id;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: {
      tenantId
    }
  });

  await supabase
    .from('tenants')
    .update({ stripe_customer_id: customer.id })
    .eq('id', tenantId);

  return customer.id;
}

export async function createStripeSession(tenantId: string, priceId: string, customerEmail: string) {
  const customerId = await createOrRetrieveStripeCustomer(tenantId, customerEmail);

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing/cancel`,
    metadata: {
      tenantId
    }
  });

  return session;
}