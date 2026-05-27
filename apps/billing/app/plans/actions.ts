'use server';

import { z } from 'zod';

const planSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().nullable(),
  price_brl: z.number().min(0, 'Preço em BRL deve ser maior que 0'),
  price_usd: z.number().min(0, 'Preço em USD deve ser maior que 0'),
  interval: z.enum(['monthly', 'quarterly', 'yearly']),
  features: z.record(z.unknown()).default({}),
  is_active: z.boolean().default(true),
  metadata: z.record(z.unknown()).default({}),
});

export type PlanFormData = z.infer<typeof planSchema>;

export async function createPlan(formData: PlanFormData) {
  planSchema.parse(formData);
  throw new Error('Planos devem ser criados no Stripe. Não há collection Appwrite oficial para planos.');
}

export async function updatePlan(_id: string, formData: PlanFormData) {
  planSchema.parse(formData);
  throw new Error('Planos devem ser atualizados no Stripe. Não há collection Appwrite oficial para planos.');
}
