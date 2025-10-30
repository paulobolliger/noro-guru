export type BillingCycle = 'monthly' | 'quarterly' | 'yearly';
export type BillingStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'pending';
export type PaymentMethod = 'credit_card' | 'pix' | 'bank_transfer' | 'boleto';

export interface PlanFeatures {
  users: number;
  storage_gb: number;
  api_requests_per_day: number;
  custom_domain: boolean;
  white_label: boolean;
  priority_support: boolean;
  api_access: boolean;
}

export interface PlanModules {
  core: boolean;
  visa: boolean;
  crm: boolean;
  billing: boolean;
  support: boolean;
}

export interface Plan {
  id: string;
  name: string;
  slug: string;
  description: string;
  is_public: boolean;
  is_custom: boolean;
  sort_order: number;
  
  // Preços
  monthly_price: number;
  quarterly_price: number;
  yearly_price: number;
  setup_fee: number;
  trial_days: number;
  
  // Recursos
  features: PlanFeatures;
  modules: PlanModules;
  
  // Metadados
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  tenant_id: string;
  plan_id: string;
  status: BillingStatus;
  billing_cycle: BillingCycle;
  
  // Datas
  current_period_start: string;
  current_period_end: string;
  trial_start?: string;
  trial_end?: string;
  canceled_at?: string;
  
  // Pagamento
  payment_method?: PaymentMethod;
  auto_renew: boolean;
  next_billing_date?: string;
  
  // Preços
  base_price: number;
  discounts: number;
  add_ons: number;
  final_price: number;
  
  // Customizações
  custom_features?: Partial<PlanFeatures>;
  custom_modules?: Partial<PlanModules>;
  
  // Metadados
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface SubscriptionAddon {
  id: string;
  name: string;
  description?: string;
  type: 'feature' | 'module' | 'service';
  price: number;
  billing_cycle: BillingCycle;
  is_public: boolean;
  metadata?: Record<string, any>;
}