'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';

const planSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().nullable(),
  price_brl: z.number().min(0, 'Preço em BRL deve ser maior que 0'),
  price_usd: z.number().min(0, 'Preço em USD deve ser maior que 0'),
  interval: z.enum(['monthly', 'quarterly', 'yearly']),
  features: z.record(z.any()).default({}),
  is_active: z.boolean().default(true),
  metadata: z.record(z.any()).default({})
});

export type PlanFormData = z.infer<typeof planSchema>;

export async function createPlan(formData: PlanFormData) {
  const supabase = createServerActionClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('Não autorizado');
  }

  const { error } = await supabase
    .from('billing.plans')
    .insert(formData);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/plans');
}

export async function updatePlan(id: string, formData: PlanFormData) {
  const supabase = createServerActionClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('Não autorizado');
  }

  const { error } = await supabase
    .from('billing.plans')
    .update(formData)
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath('/plans');
}