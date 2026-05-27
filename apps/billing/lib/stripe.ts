import { ensureStripeCustomerId } from '@noro/lib/services/billingService';

const stripeRequest = async <TResponse>(
  path: string,
  body: Record<string, string>,
): Promise<TResponse> => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY');
  }

  const params = new URLSearchParams(body);
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Stripe request failed: ${text}`);
  }

  return response.json() as Promise<TResponse>;
};

export const stripe = {
  customers: {
    create(input: { email: string; metadata: { tenantId: string } }) {
      return stripeRequest<{ id: string }>('/customers', {
        email: input.email,
        'metadata[tenantId]': input.metadata.tenantId,
      });
    },
  },
  billingPortal: {
    sessions: {
      create(input: { customer: string; return_url: string }) {
        return stripeRequest<{ url: string }>('/billing_portal/sessions', {
          customer: input.customer,
          return_url: input.return_url,
        });
      },
    },
  },
  checkout: {
    sessions: {
      create(input: {
        customer: string;
        mode: string;
        line_items: Array<{ price: string; quantity: number }>;
        success_url: string;
        cancel_url: string;
        metadata: { tenantId: string };
      }) {
        return stripeRequest<{ id: string; url: string | null }>('/checkout/sessions', {
          customer: input.customer,
          mode: input.mode,
          'line_items[0][price]': input.line_items[0]?.price ?? '',
          'line_items[0][quantity]': String(input.line_items[0]?.quantity ?? 1),
          success_url: input.success_url,
          cancel_url: input.cancel_url,
          'metadata[tenantId]': input.metadata.tenantId,
        });
      },
      retrieve(sessionId: string) {
        if (!process.env.STRIPE_SECRET_KEY) {
          throw new Error('Missing STRIPE_SECRET_KEY');
        }

        return fetch(`https://api.stripe.com/v1/checkout/sessions/${sessionId}`, {
          headers: {
            Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`,
          },
        }).then(async (response) => {
          if (!response.ok) {
            throw new Error(await response.text());
          }
          return response.json() as Promise<{ metadata?: { tenantId?: string } }>;
        });
      },
    },
  },
};

export async function createOrRetrieveStripeCustomer(tenantId: string, email: string) {
  return ensureStripeCustomerId(stripe, tenantId, email);
}

export async function createStripeSession(
  tenantId: string,
  priceId: string,
  customerEmail: string,
) {
  const customerId = await createOrRetrieveStripeCustomer(tenantId, customerEmail);

  return stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/billing/cancel`,
    metadata: { tenantId },
  });
}
