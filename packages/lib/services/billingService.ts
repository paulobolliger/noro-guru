import { tenantsService, type Tenant } from './tenantService';

export interface StripeCustomerClient {
  customers: {
    create(input: { email: string; metadata: { tenantId: string } }): Promise<{ id: string }>;
  };
}

export function getTenantBillingEmail(tenant: Tenant): string {
  return tenant.billingEmail || tenant.email || '';
}

export async function getStripeCustomerId(tenantId: string): Promise<string | null> {
  const tenant = await tenantsService.getById(tenantId);
  const value = tenant?.stripeCustomerId;
  return typeof value === 'string' && value.length > 0 ? value : null;
}

export async function updateStripeCustomerId(
  tenantId: string,
  customerId: string,
): Promise<Tenant> {
  return tenantsService.update(tenantId, { stripeCustomerId: customerId });
}

export async function ensureStripeCustomerId(
  stripe: StripeCustomerClient,
  tenantId: string,
  email: string,
): Promise<string> {
  const existingCustomerId = await getStripeCustomerId(tenantId);
  if (existingCustomerId) {
    return existingCustomerId;
  }

  const customer = await stripe.customers.create({
    email,
    metadata: { tenantId },
  });

  await updateStripeCustomerId(tenantId, customer.id);
  return customer.id;
}
