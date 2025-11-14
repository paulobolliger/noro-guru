'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { getCurrentTenantId, validateTenantOwnership } from '@/lib/tenant'

export async function getLeads() {
  try {
    const supabase = createServerSupabaseClient()
    const tenantId = await getCurrentTenantId()

    const { data, error } = await supabase
      .from('noro_leads')
      .select('*')
      .eq('tenant_id', tenantId)  // ✅ Filtro de isolamento multi-tenant
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar leads:', error)
      return []
    }

    return data || []
  } catch (error: any) {
    console.error('Erro ao buscar leads:', error)
    return []
  }
}

export async function getLeadById(leadId: string) {
  try {
    const supabase = createServerSupabaseClient()
    const tenantId = await getCurrentTenantId()

    const { data, error } = await supabase
      .from('noro_leads')
      .select('*')
      .eq('id', leadId)
      .eq('tenant_id', tenantId)  // ✅ Filtro de isolamento multi-tenant
      .single()

    if (error) throw error

    return data
  } catch (error: any) {
    console.error('Erro ao buscar lead:', error)
    return null
  }
}

export async function createLeadAction(formData: FormData) {
  const organization_name = formData.get('organization_name') as string
  const email = formData.get('email') as string
  const phone = formData.get('phone') as string
  const source = formData.get('source') as string
  const value_cents = formData.get('value_cents') as string
  const stage = formData.get('stage') as string
  const notes = formData.get('notes') as string

  if (!organization_name || !email) {
    return { success: false, message: 'Nome e e-mail são obrigatórios.' }
  }

  try {
    const supabase = createServerSupabaseClient()
    const tenantId = await getCurrentTenantId()

    const novoLead = {
      organization_name,
      email,
      phone: phone || null,
      source: source || 'manual',
      value_cents: value_cents ? parseInt(value_cents) : 0,
      stage: stage || 'novo',
      notes: notes || null,
      tenant_id: tenantId,  // ✅ Sempre incluir tenant_id em INSERTs
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('noro_leads')
      .insert(novoLead)
      .select()
      .single()

    if (error) throw error

    revalidatePath('/leads')
    return { success: true, message: 'Lead criado com sucesso!', data }
  } catch (error: any) {
    console.error('Erro ao criar lead:', error)
    return { success: false, message: 'Erro ao criar lead. Tente novamente.' }
  }
}

export async function updateLeadAction(leadId: string, formData: FormData) {
  if (!leadId) {
    return { success: false, message: 'ID do lead não fornecido.' }
  }

  const stage = formData.get('stage') as string
  const notes = formData.get('notes') as string

  try {
    const supabase = createServerSupabaseClient()
    const tenantId = await getCurrentTenantId()

    const updates = {
      stage: stage || 'novo',
      notes: notes || null,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('noro_leads')
      .update(updates)
      .eq('id', leadId)
      .eq('tenant_id', tenantId)  // ✅ Filtro de isolamento multi-tenant

    if (error) throw error

    revalidatePath('/leads')
    return { success: true, message: 'Lead atualizado com sucesso!' }
  } catch (error: any) {
    console.error('Erro ao atualizar lead:', error)
    return { success: false, message: 'Erro ao atualizar lead. Tente novamente.' }
  }
}

export async function updateLeadStageAction(leadId: string, newStage: string) {
  if (!leadId || !newStage) {
    return { success: false, message: 'Dados incompletos.' }
  }

  try {
    const supabase = createServerSupabaseClient()
    const tenantId = await getCurrentTenantId()

    const { error } = await supabase
      .from('noro_leads')
      .update({
        stage: newStage,
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId)
      .eq('tenant_id', tenantId)  // ✅ Filtro de isolamento multi-tenant

    if (error) throw error

    revalidatePath('/leads')
    return { success: true, message: 'Stage atualizado!' }
  } catch (error: any) {
    console.error('Erro ao atualizar stage:', error)
    return { success: false, message: 'Erro ao atualizar stage. Tente novamente.' }
  }
}

export async function deleteLeadAction(leadId: string) {
  if (!leadId) {
    return { success: false, message: 'ID do lead não fornecido.' }
  }

  try {
    const supabase = createServerSupabaseClient()
    const tenantId = await getCurrentTenantId()

    const { error } = await supabase
      .from('noro_leads')
      .delete()
      .eq('id', leadId)
      .eq('tenant_id', tenantId)  // ✅ Filtro de isolamento multi-tenant

    if (error) throw error

    revalidatePath('/leads')
    return { success: true, message: 'Lead removido com sucesso!' }
  } catch (error: any) {
    console.error('Erro ao deletar lead:', error)
    return { success: false, message: 'Erro ao deletar lead. Tente novamente.' }
  }
}
