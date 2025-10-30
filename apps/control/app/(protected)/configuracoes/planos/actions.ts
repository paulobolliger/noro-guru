'use server'

// Usa o helper server do pacote lib para criar cliente supabase no server
import { createServerSupabaseClient } from '@noro/lib/supabase/server'
import { Plan, Subscription, BillingCycle } from './types'

export async function getPlans() {
  const supabase = createServerSupabaseClient()

  const { data: plans, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) throw error
  return plans as Plan[]
}

export async function getPlan(id: string) {
  const supabase = createServerSupabaseClient()

  const { data: plan, error } = await supabase
    .from('subscription_plans')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return plan as Plan
}

export async function createPlan(plan: Partial<Plan>) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from('subscription_plans')
    .insert(plan)
    .select()
    .single()

  if (error) throw error
  return data as Plan
}

export async function updatePlan(id: string, plan: Partial<Plan>) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from('subscription_plans')
    .update(plan)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data as Plan
}

export async function deletePlan(id: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase
    .from('subscription_plans')
    .delete()
    .eq('id', id)

  if (error) throw error
}

export async function createSubscription(
  tenant_id: string,
  plan_id: string,
  billing_cycle: BillingCycle
) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .rpc('create_subscription', {
      p_tenant_id: tenant_id,
      p_plan_id: plan_id,
      p_billing_cycle: billing_cycle
    })

  if (error) throw error
  return data as string // Returns subscription ID
}

export async function getSubscription(id: string) {
  const supabase = createServerSupabaseClient()

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return subscription as Subscription
}

export async function getTenantSubscription(tenant_id: string) {
  const supabase = createServerSupabaseClient()

  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('tenant_id', tenant_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error // Ignore not found error
  return subscription as Subscription | null
}

interface TenantSubscription {
  tenant_id: string
  tenant_name: string
  status: string
  created_at: string
}

export async function getTenantSubscriptions(plan_id: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from('subscriptions')
    .select(`
      tenant_id,
      tenants (
        name
      ),
      status,
      created_at
    `)
    .eq('plan_id', plan_id)
    .order('created_at', { ascending: false })

  if (error) throw error
  
  return (data || []).map(sub => ({
    tenant_id: sub.tenant_id,
    tenant_name: sub.tenants?.name,
    status: sub.status,
    created_at: sub.created_at
  })) as TenantSubscription[]
}

interface PlanHistoryEntry {
  id: string
  changed_by_name: string
  old_plan: string
  new_plan: string
  price_changed: boolean
  old_price: number
  new_price: number
  features_changed: boolean
  modules_changed: boolean
  changed_at: string
}

export async function getPlanHistory(plan_id: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from('tenant_plan_history')
    .select(`
      id,
      changed_by,
      auth.users (
        raw_user_meta_data->>'nome' as name
      ),
      old_plan,
      new_plan,
      old_features,
      new_features,
      old_modules,
      new_modules,
      changed_at
    `)
    .eq('plan_id', plan_id)
    .order('changed_at', { ascending: false })

  if (error) throw error
  
  return (data || []).map(entry => ({
    id: entry.id,
    changed_by_name: entry.users?.name || 'Usuário desconhecido',
    old_plan: entry.old_plan,
    new_plan: entry.new_plan,
    price_changed: entry.old_features?.monthly_price !== entry.new_features?.monthly_price,
    old_price: entry.old_features?.monthly_price,
    new_price: entry.new_features?.monthly_price,
    features_changed: JSON.stringify(entry.old_features) !== JSON.stringify(entry.new_features),
    modules_changed: JSON.stringify(entry.old_modules) !== JSON.stringify(entry.new_modules),
    changed_at: entry.changed_at
  })) as PlanHistoryEntry[]
}