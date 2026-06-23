// app/admin/(protected)/configuracoes/planos/actions.ts
'use server'

import { createDatabaseClient } from '@noro/db'
import { Plan, Subscription, BillingCycle } from './types'

export async function getPlans() {
  const { client, close } = createDatabaseClient()
  try {
    const plans = await client`
      SELECT * 
      FROM platform.subscription_plans
      ORDER BY sort_order ASC
    `
    return plans as unknown as Plan[]
  } finally {
    await close()
  }
}

export async function getPlan(id: string) {
  const { client, close } = createDatabaseClient()
  try {
    const rows = await client`
      SELECT * 
      FROM platform.subscription_plans
      WHERE id = ${id}
      LIMIT 1
    `
    if (!rows || rows.length === 0) throw new Error('Plan not found')
    return rows[0] as unknown as Plan
  } finally {
    await close()
  }
}

export async function createPlan(plan: Partial<Plan>) {
  const { client, close } = createDatabaseClient()
  try {
    const serializedPlan = {
      ...plan,
      modules: plan.modules ? JSON.stringify(plan.modules) : undefined,
      features: plan.features ? JSON.stringify(plan.features) : undefined,
      metadata: plan.metadata ? JSON.stringify(plan.metadata) : undefined,
    };
    const rows = await client`
      INSERT INTO platform.subscription_plans ${client(serializedPlan as any)}
      RETURNING *
    `
    if (!rows || rows.length === 0) throw new Error('Failed to create plan')
    return rows[0] as unknown as Plan
  } finally {
    await close()
  }
}

export async function updatePlan(id: string, plan: Partial<Plan>) {
  const { client, close } = createDatabaseClient()
  try {
    const serializedPlan = {
      ...plan,
      modules: plan.modules ? JSON.stringify(plan.modules) : undefined,
      features: plan.features ? JSON.stringify(plan.features) : undefined,
      metadata: plan.metadata ? JSON.stringify(plan.metadata) : undefined,
    };
    const rows = await client`
      UPDATE platform.subscription_plans
      SET ${client(serializedPlan as any)}
      WHERE id = ${id}
      RETURNING *
    `
    if (!rows || rows.length === 0) throw new Error('Failed to update plan')
    return rows[0] as unknown as Plan
  } finally {
    await close()
  }
}

export async function deletePlan(id: string) {
  const { client, close } = createDatabaseClient()
  try {
    await client`
      DELETE FROM platform.subscription_plans
      WHERE id = ${id}
    `
  } finally {
    await close()
  }
}

export async function createSubscription(
  tenant_id: string,
  plan_id: string,
  billing_cycle: BillingCycle
) {
  const { client, close } = createDatabaseClient()
  try {
    const rows = await client`
      SELECT create_subscription(${tenant_id}, ${plan_id}, ${billing_cycle}) as sub_id
    `
    return rows[0]?.sub_id as string
  } finally {
    await close()
  }
}

export async function getSubscription(id: string) {
  const { client, close } = createDatabaseClient()
  try {
    const rows = await client`
      SELECT * 
      FROM public.subscriptions
      WHERE id = ${id}
      LIMIT 1
    `
    if (!rows || rows.length === 0) throw new Error('Subscription not found')
    return rows[0] as unknown as Subscription
  } finally {
    await close()
  }
}

export async function getTenantSubscription(tenant_id: string) {
  const { client, close } = createDatabaseClient()
  try {
    const rows = await client`
      SELECT * 
      FROM public.subscriptions
      WHERE tenant_id = ${tenant_id}
      ORDER BY created_at DESC
      LIMIT 1
    `
    if (!rows || rows.length === 0) return null
    return rows[0] as unknown as Subscription
  } finally {
    await close()
  }
}

interface TenantSubscription {
  tenant_id: string
  tenant_name: string
  status: string
  created_at: string
}

export async function getTenantSubscriptions(plan_id: string) {
  const { client, close } = createDatabaseClient()
  try {
    const rows = await client`
      SELECT 
        s.tenant_id,
        t.name as tenant_name,
        s.status,
        s.created_at
      FROM public.subscriptions s
      LEFT JOIN platform.tenants t ON t.id = s.tenant_id
      WHERE s.plan_id = ${plan_id}
      ORDER BY s.created_at DESC
    `
    return rows as unknown as TenantSubscription[]
  } finally {
    await close()
  }
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
  const { client, close } = createDatabaseClient()
  try {
    const rows = await client`
      SELECT 
        h.id,
        h.changed_by,
        u.nome as changed_by_name,
        h.old_plan,
        h.new_plan,
        h.old_features,
        h.new_features,
        h.old_modules,
        h.new_modules,
        h.changed_at
      FROM public.tenant_plan_history h
      LEFT JOIN noro_auth.users_legado u ON u.id = h.changed_by
      WHERE h.plan_id = ${plan_id}
      ORDER BY h.changed_at DESC
    `
    
    return rows.map((entry: any) => ({
      id: entry.id,
      changed_by_name: entry.changed_by_name || 'Usuário desconhecido',
      old_plan: entry.old_plan,
      new_plan: entry.new_plan,
      price_changed: entry.old_features?.monthly_price !== entry.new_features?.monthly_price,
      old_price: entry.old_features?.monthly_price,
      new_price: entry.new_features?.monthly_price,
      features_changed: JSON.stringify(entry.old_features) !== JSON.stringify(entry.new_features),
      modules_changed: JSON.stringify(entry.old_modules) !== JSON.stringify(entry.new_modules),
      changed_at: entry.changed_at
    })) as PlanHistoryEntry[]
  } finally {
    await close()
  }
}
