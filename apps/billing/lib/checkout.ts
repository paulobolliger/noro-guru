import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { createStripeSession } from '@/lib/stripe';

export interface CheckoutParams {
  priceId: string;
  tenantId: string;
  email: string;
}

export async function createCheckoutSession({ priceId, tenantId, email }: CheckoutParams) {
  const host = headers().get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const session = await createStripeSession(tenantId, priceId, email);
  const url = session.url || `${protocol}://${host}/billing`;

  redirect(url);
}
