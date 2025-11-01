export type Plan = {
  id: string;
  name: string;
  description: string | null;
  price_brl: number;
  price_usd: number;
  interval: 'monthly' | 'quarterly' | 'yearly';
  features: Record<string, any>;
  stripe_price_id: string | null;
  cielo_plan_id: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export type Subscription = {
  id: string;
  tenant_id: string;
  plan_id: string;
  status: 'active' | 'canceled' | 'past_due' | 'pending' | 'trialing' | 'incomplete' | 'incomplete_expired';
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  canceled_at: string | null;
  trial_start: string | null;
  trial_end: string | null;
  stripe_subscription_id: string | null;
  cielo_subscription_id: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export type PaymentMethod = {
  id: string;
  tenant_id: string;
  provider: 'stripe' | 'cielo';
  type: 'credit_card' | 'debit_card' | 'boleto' | 'pix';
  last_four: string | null;
  expiry_month: string | null;
  expiry_year: string | null;
  card_brand: string | null;
  is_default: boolean;
  stripe_payment_method_id: string | null;
  cielo_payment_method_id: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export type Invoice = {
  id: string;
  tenant_id: string;
  subscription_id: string;
  amount_brl: number;
  amount_usd: number;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded' | 'canceled';
  due_date: string;
  paid_at: string | null;
  stripe_invoice_id: string | null;
  cielo_invoice_id: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}

export type Transaction = {
  id: string;
  tenant_id: string;
  invoice_id: string;
  payment_method_id: string | null;
  amount_brl: number;
  amount_usd: number;
  provider: 'stripe' | 'cielo';
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded' | 'canceled';
  stripe_payment_intent_id: string | null;
  cielo_payment_id: string | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
  metadata: Record<string, any>;
}