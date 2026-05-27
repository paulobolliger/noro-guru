'use server';

import { createPostgresClient } from '@noro/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const stripeConfigSchema = z.object({
  enabled: z.boolean(),
  liveMode: z.boolean(),
  publishableKey: z.string().min(1),
  secretKey: z.string().min(1),
  webhookSecret: z.string().min(1),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional()
});

export async function getStripeConfig() {
  const sql = createPostgresClient();

  try {
    const result = await sql<Array<{ value: z.infer<typeof stripeConfigSchema> }>>`
      SELECT *
      FROM cp.settings
      WHERE key = 'stripe'
      LIMIT 1
    `;

    if (result.length === 0) {
      return null;
    }

    return result[0].value;
  } catch (error) {
    console.error('Erro ao buscar configurações do Stripe:', error);
    throw new Error('Erro ao buscar configurações do Stripe');
  } finally {
    await sql.end();
  }
}

export async function checkStripeIntegration() {
  const sql = createPostgresClient();
  const errors: string[] = [];

  try {
    const config = await getStripeConfig();
    const apiConnection = Boolean(config?.enabled && config?.secretKey && config?.publishableKey);
    const webhookConfiguration = Boolean(config?.webhookSecret);

    if (!apiConnection) {
      errors.push('Configuração de API do Stripe incompleta.');
    }

    if (!webhookConfiguration) {
      errors.push('Webhook secret do Stripe não configurado.');
    }

    const productCount = await sql<Array<{ count: number }>>`
      SELECT COUNT(*)::int AS count
      FROM cp.produtos_precos
      WHERE provider = 'stripe'
    `;

    const subscriptionProducts = (productCount[0]?.count ?? 0) > 0;

    if (!subscriptionProducts) {
      errors.push('Nenhum produto/preço Stripe encontrado.');
    }

    return {
      apiConnection,
      webhookConfiguration,
      subscriptionProducts,
      errors,
    };
  } catch (error) {
    console.error('Erro ao verificar integração Stripe:', error);
    return {
      apiConnection: false,
      webhookConfiguration: false,
      subscriptionProducts: false,
      errors: ['Erro ao verificar integração Stripe.'],
    };
  } finally {
    await sql.end();
  }
}

export async function updateStripeConfig(data: z.infer<typeof stripeConfigSchema>) {
  const sql = createPostgresClient();

  try {
    const validated = stripeConfigSchema.parse(data);

    await sql`
      INSERT INTO cp.settings (key, value, updated_at)
      VALUES ('stripe', ${JSON.stringify(validated)}, NOW())
      ON CONFLICT (key)
      DO UPDATE SET
        value = ${JSON.stringify(validated)},
        updated_at = NOW()
    `;

    revalidatePath('/settings/stripe');
    return { success: true };
  } catch (error) {
    console.error('Erro ao atualizar configurações do Stripe:', error);
    throw new Error('Erro ao atualizar configurações do Stripe');
  } finally {
    await sql.end();
  }
}
