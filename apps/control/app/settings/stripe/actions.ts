'use server';

import { sql } from '@vercel/postgres';
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
  try {
    const result = await sql`
      SELECT *
      FROM cp.settings
      WHERE key = 'stripe'
      LIMIT 1
    `;

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0].value as z.infer<typeof stripeConfigSchema>;
  } catch (error) {
    console.error('Erro ao buscar configurações do Stripe:', error);
    throw new Error('Erro ao buscar configurações do Stripe');
  }
}

export async function updateStripeConfig(data: z.infer<typeof stripeConfigSchema>) {
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
  }
}