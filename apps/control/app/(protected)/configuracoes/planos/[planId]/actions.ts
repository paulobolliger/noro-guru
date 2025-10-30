import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"

// Função para buscar um plano específico
export async function getPlan(planId: string) {
  const supabase = createClientComponentClient()
  
  const { data: plan, error } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("id", planId)
    .single()

  if (error) {
    console.error("Erro ao buscar plano:", error)
    return null
  }

  return plan
}

// Função para atualizar um plano
export async function updatePlan(planId: string, updates: any) {
  const supabase = createClientComponentClient()
  
  // Primeiro valida as mudanças
  const { needsApproval } = await validatePlanChanges(planId, updates)
  
  if (needsApproval) {
    // Retorna sem fazer alterações, o frontend deve mostrar mensagem
    return { needsApproval: true }
  }
  
  const { error } = await supabase
    .from("subscription_plans")
    .update(updates)
    .eq("id", planId)

  if (error) {
    console.error("Erro ao atualizar plano:", error)
    throw error
  }

  revalidatePath("/configuracoes/planos")
  revalidatePath(`/configuracoes/planos/${planId}`)
  
  return { needsApproval: false }
}

// Funções para aprovações
export async function getPlanApprovals() {
  const supabase = createClientComponentClient()
  
  const { data: approvals, error } = await supabase
    .from("plan_approvals")
    .select(`
      *,
      requested_by:users(name, email)
    `)
    .eq("status", "pending")
    .order("request_date", { ascending: false })
  
  if (error) {
    console.error("Erro ao buscar aprovações:", error)
    return []
  }
  
  return approvals
}

export async function approvePlanChanges(approvalId: string) {
  const supabase = createClientComponentClient()
  
  const { data: userId } = await supabase.auth.getUser()
  
  const { error } = await supabase.rpc("approve_plan_changes", {
    p_approval_id: approvalId,
    p_approved_by: userId.user?.id
  })
  
  if (error) {
    console.error("Erro ao aprovar mudanças:", error)
    throw error
  }
  
  revalidatePath("/configuracoes/planos")
}

export async function rejectPlanChanges(approvalId: string) {
  const supabase = createClientComponentClient()
  
  const { error } = await supabase
    .from("plan_approvals")
    .update({
      status: "rejected",
      response_date: new Date().toISOString()
    })
    .eq("id", approvalId)
  
  if (error) {
    console.error("Erro ao rejeitar mudanças:", error)
    throw error
  }
  
  revalidatePath("/configuracoes/planos")
}

// Funções para métricas
export async function getPlanMetrics(planId: string, period: "daily" | "weekly" | "monthly") {
  const supabase = createClientComponentClient()
  
  const { data: metrics, error } = await supabase
    .from("plan_usage_metrics")
    .select("*")
    .eq("plan_id", planId)
    .gte("metric_date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .order("metric_date", { ascending: false })
  
  if (error) {
    console.error("Erro ao buscar métricas:", error)
    return null
  }
  
  // Agregar métricas com base no período
  const aggregated = metrics.reduce((acc, curr) => {
    return {
      activeUsers: Math.max(acc.activeUsers || 0, curr.active_users),
      storageUsed: Math.max(acc.storageUsed || 0, curr.storage_used),
      apiRequests: (acc.apiRequests || 0) + curr.api_requests,
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
}

// Função para buscar histórico
export async function getPlanHistory(planId: string) {
  const supabase = createClientComponentClient()
  
  const { data: history, error } = await supabase
    .from("plan_change_history")
    .select(`
      *,
      changed_by:users(name, email)
    `)
    .eq("plan_id", planId)
    .order("created_at", { ascending: false })
  
  if (error) {
    console.error("Erro ao buscar histórico:", error)
    return []
  }
  
  return history
}

// Função para validar mudanças
export async function validatePlanChanges(planId: string, changes: any) {
  const supabase = createClientComponentClient()
  
  // Busca plano atual
  const { data: currentPlan } = await supabase
    .from("subscription_plans")
    .select("*")
    .eq("id", planId)
    .single()
  
  // Verifica se precisa de aprovação
  const needsApproval = 
    // Preço aumentou mais que 10%
    (changes.monthly_price > currentPlan.monthly_price * 1.1) ||
    // Features removidas
    (currentPlan.features.custom_domain && !changes.features.custom_domain) ||
    (currentPlan.features.white_label && !changes.features.white_label) ||
    (currentPlan.features.priority_support && !changes.features.priority_support) ||
    (currentPlan.features.api_access && !changes.features.api_access) ||
    // Módulos removidos
    (currentPlan.modules.visa && !changes.modules.visa) ||
    (currentPlan.modules.crm && !changes.modules.crm) ||
    (currentPlan.modules.billing && !changes.modules.billing) ||
    (currentPlan.modules.support && !changes.modules.support)
    
  if (needsApproval) {
    // Busca número de assinaturas afetadas
    const { count } = await supabase
      .from("subscriptions")
      .select("*", { count: true })
      .eq("plan_id", planId)
    
    // Criar solicitação de aprovação
    const { error } = await supabase
      .from("plan_approvals")
      .insert({
        plan_id: planId,
        requested_by: (await supabase.auth.getUser()).data.user?.id,
        current_data: currentPlan,
        proposed_changes: changes,
        impact_analysis: {
          affectedSubscriptions: count,
          priceIncreasePercentage: changes.monthly_price 
            ? ((changes.monthly_price - currentPlan.monthly_price) / currentPlan.monthly_price * 100)
            : 0,
          removedFeatures: Object.entries(currentPlan.features)
            .filter(([key, value]) => value && !changes.features[key])
            .map(([key]) => key),
          removedModules: Object.entries(currentPlan.modules)
            .filter(([key, value]) => value && !changes.modules[key])
            .map(([key]) => key)
        }
      })
      
    if (error) {
      console.error("Erro ao criar solicitação de aprovação:", error)
      throw error
    }
    
    return { needsApproval: true }
  }
  
  return { needsApproval: false }
}