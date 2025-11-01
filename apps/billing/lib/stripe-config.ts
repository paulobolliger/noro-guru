import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { settings } from '@/lib/schema';

export interface StripeConfig {
  enabled: boolean;
  liveMode: boolean;
  publishableKey: string;
  secretKey: string;
  webhookSecret: string;
  successUrl?: string;
  cancelUrl?: string;
}

export async function getStripeConfig(): Promise<StripeConfig | null> {
  try {
    const config = await db
      .select()
      .from(settings)
      .where(eq(settings.key, 'stripe'))
      .limit(1)
      .then(rows => rows[0]);

    if (!config) {
      return null;
    }

    return config.value as StripeConfig;
  } catch (error) {
    console.error('Erro ao buscar configuração do Stripe:', error);
    return null;
  }
}

export async function isStripeEnabled(): Promise<boolean> {
  const config = await getStripeConfig();
  return Boolean(config?.enabled);
}

export async function getStripeKeys() {
  const config = await getStripeConfig();
  
  if (!config) {
    throw new Error('Configuração do Stripe não encontrada');
  }

  if (!config.enabled) {
    throw new Error('Stripe não está habilitado');
  }

  return {
    publishableKey: config.publishableKey,
    secretKey: config.secretKey,
    webhookSecret: config.webhookSecret,
    liveMode: config.liveMode
  };
}