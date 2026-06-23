"use server"

import { createDatabaseClient } from "@noro/db"
import { revalidatePath } from "next/cache"
import { getLogtoContext } from "@logto/next/server-actions"
import { logtoConfig } from "@/lib/logto"

// Função para buscar um plano específico
export async function getPlan(planId: string) {
  const { client, close } = createDatabaseClient()
  try {
    const rows = await client`
      SELECT * 
      FROM platform.subscription_plans
      WHERE id = ${planId}
      LIMIT 1
    `
    if (!rows || rows.length === 0) return null
    return rows[0] as any
  } catch (error) {
    console.error("Erro ao buscar plano:", error)
    return null
  } finally {
    await close()
  }
}

// Função para atualizar um plano
export async function updatePlan(planId: string, updates: any) {
  const { client, close } = createDatabaseClient()
  try {
    // Primeiro valida as mudanças
    const { needsApproval } = await validatePlanChanges(planId, updates)
    
    if (needsApproval) {
      // Retorna sem fazer alterações, o frontend deve mostrar mensagem
      return { needsApproval: true }
    }
    
    const updatesData: any = {}
    Object.entries(updates).forEach(([key, val]) => {
      if (val && typeof val === 'object') {
        updatesData[key] = client.json(val as any)
      } else {
        updatesData[key] = val
      }
    })

    await client`
      UPDATE platform.subscription_plans
      SET ${client(updatesData)}
      WHERE id = ${planId}
    `

    revalidatePath("/configuracoes/planos")
    revalidatePath(`/configuracoes/planos/${planId}`)
    
    return { needsApproval: false }
  } catch (error) {
    console.error("Erro ao atualizar plano:", error)
    throw error
  } finally {
    await close()
  }
}

// Funções para aprovações
export async function getPlanApprovals() {
  const { client, close } = createDatabaseClient()
  try {
    const approvals = await client`
      SELECT 
        a.*,
        u.nome as requested_by_name,
        u.email as requested_by_email
      FROM public.plan_approvals a
      LEFT JOIN noro_auth.users_legado u ON u.id = a.requested_by
      WHERE a.status = 'pending'
      ORDER BY a.request_date DESC
    `
    
    return approvals.map((a: any) => ({
      ...a,
      requested_by: {
        name: a.requested_by_name,
        email: a.requested_by_email
      }
    }))
  } catch (error) {
    console.error("Erro ao buscar aprovações:", error)
    return []
  } finally {
    await close()
  }
}

export async function approvePlanChanges(approvalId: string) {
  const { client, close } = createDatabaseClient()
  try {
    const ctx = await getLogtoContext(logtoConfig)
    const userId = ctx.claims?.sub

    // Executa a procedure RPC do banco
    await client`
      SELECT approve_plan_changes(${approvalId}, ${userId || null})
    `
    
    revalidatePath("/configuracoes/planos")
  } catch (error) {
    console.error("Erro ao aprovar mudanças:", error)
    throw error
  } finally {
    await close()
  }
}

export async function rejectPlanChanges(approvalId: string) {
  const { client, close } = createDatabaseClient()
  try {
    await client`
      UPDATE public.plan_approvals
      SET 
        status = 'rejected',
        response_date = NOW()
      WHERE id = ${approvalId}
    `
    
    revalidatePath("/configuracoes/planos")
  } catch (error) {
    console.error("Erro ao rejeitar mudanças:", error)
    throw error
  } finally {
    await close()
  }
}

// Funções para métricas
export async function getPlanMetrics(planId: string, period: "daily" | "weekly" | "monthly") {
  const { client, close } = createDatabaseClient()
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const metrics = await client`
      SELECT * 
      FROM public.plan_usage_metrics
      WHERE plan_id = ${planId}
        AND metric_date >= ${thirtyDaysAgo}
      ORDER BY metric_date DESC
    `
    
    // Agregar métricas com base no período
    const aggregated = metrics.reduce((acc: any, curr: any) => {
      return {
        activeUsers: Math.max(acc.activeUsers || 0, curr.active_users || 0),
        storageUsed: Math.max(acc.storageUsed || 0, curr.storage_used || 0),
        apiRequests: (acc.apiRequests || 0) + (curr.api_requests || 0),
        featuresUsed: {
          ...acc.featuresUsed,
          ...curr.features_used
        },
        modulesUsed: {
          ...acc.modulesUsed,
          ...curr.modules_used
        }
      }
    }, {
      activeUsers: 0,
      storageUsed: 0,
      apiRequests: 0,
      featuresUsed: {},
      modulesUsed: {}
    })
    
    return aggregated
  } catch (error) {
    console.error("Erro ao buscar métricas:", error)
    return null
  } finally {
    await close()
  }
}

// Função para buscar histórico
export async function getPlanHistory(planId: string) {
  const { client, close } = createDatabaseClient()
  try {
    const history = await client`
      SELECT 
        h.*,
        u.nome as changed_by_name,
        u.email as changed_by_email
      FROM public.plan_change_history h
      LEFT JOIN noro_auth.users_legado u ON u.id = h.changed_by
      WHERE h.plan_id = ${planId}
      ORDER BY h.created_at DESC
    `
    
    return history.map((h: any) => ({
      ...h,
      changed_by: {
        name: h.changed_by_name,
        email: h.changed_by_email
      }
    }))
  } catch (error) {
    console.error("Erro ao buscar histórico:", error)
    return []
  } finally {
    await close()
  }
}

// Função para validar mudanças
export async function validatePlanChanges(planId: string, changes: any) {
  const { client, close } = createDatabaseClient()
  try {
    // Busca plano atual
    const rows = await client`
      SELECT * 
      FROM platform.subscription_plans
      WHERE id = ${planId}
      LIMIT 1
    `
    if (!rows || rows.length === 0) {
      return { needsApproval: false }
    }
    const currentPlan = rows[0]
    
    // Verifica se precisa de aprovação
    const needsApproval = 
      // Preço aumentou mais que 10%
      (changes.monthly_price > (currentPlan.monthly_price || 0) * 1.1) ||
      // Features removidas
      (currentPlan.features?.custom_domain && !changes.features?.custom_domain) ||
      (currentPlan.features?.white_label && !changes.features?.white_label) ||
      (currentPlan.features?.priority_support && !changes.features?.priority_support) ||
      (currentPlan.features?.api_access && !changes.features?.api_access) ||
      // Módulos removidos
      (currentPlan.modules?.visa && !changes.modules?.visa) ||
      (currentPlan.modules?.crm && !changes.modules?.crm) ||
      (currentPlan.modules?.billing && !changes.modules?.billing) ||
      (currentPlan.modules?.support && !changes.modules?.support)
      
    if (needsApproval) {
      // Busca número de assinaturas afetadas
      const subCountRows = await client`
        SELECT count(*)::int as count 
        FROM public.subscriptions 
        WHERE plan_id = ${planId}
      `
      const count = subCountRows[0]?.count || 0
      
      const ctx = await getLogtoContext(logtoConfig)
      const userId = ctx.claims?.sub
      
      const impactAnalysis = {
        affectedSubscriptions: count,
        priceIncreasePercentage: changes.monthly_price 
          ? ((changes.monthly_price - currentPlan.monthly_price) / currentPlan.monthly_price * 100)
          : 0,
        removedFeatures: Object.entries(currentPlan.features || {})
          .filter(([key, value]) => value && !changes.features?.[key])
          .map(([key]) => key),
        removedModules: Object.entries(currentPlan.modules || {})
          .filter(([key, value]) => value && !changes.modules?.[key])
          .map(([key]) => key)
      }

      await client`
        INSERT INTO public.plan_approvals (plan_id, requested_by, current_data, proposed_changes, impact_analysis, status, request_date)
        VALUES (${planId}, ${userId || null}, ${client.json(currentPlan)}, ${client.json(changes)}, ${client.json(impactAnalysis)}, 'pending', NOW())
      `
      
      return { needsApproval: true }
    }
    
    return { needsApproval: false }
  } catch (error) {
    console.error("Erro ao validar mudanças do plano:", error)
    throw error
  } finally {
    await close()
  }
}
