import { and, eq } from 'drizzle-orm';
import { paymentCustomers } from '../schema';
import type { NoroDatabase } from '../index';

export async function findCustomer(
  db: NoroDatabase,
  tenantId: string,
  clientId: string,
  provider = 'asaas',
) {
  return db.query.paymentCustomers.findFirst({
    where: and(
      eq(paymentCustomers.tenantId, tenantId),
      eq(paymentCustomers.clientId, clientId),
      eq(paymentCustomers.provider, provider),
    ),
  });
}

export async function createCustomer(
  db: NoroDatabase,
  input: {
    tenantId: string;
    clientId?: string | null;
    provider?: string;
    providerCustomerId: string;
    name?: string | null;
    email?: string | null;
    cpfCnpj?: string | null;
    metadata?: Record<string, unknown>;
  },
) {
  const [created] = await db
    .insert(paymentCustomers)
    .values({ ...input, provider: input.provider ?? 'asaas' })
    .returning();
  return created ?? null;
}
