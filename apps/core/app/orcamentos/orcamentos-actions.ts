// apps/core/(protected)/orcamentos/orcamentos-actions.ts
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';
import { revalidatePath } from 'next/cache';
import { getCurrentTenantId } from '@/lib/tenant';

// Tipos baseados na estrutura do Supabase para garantir segurança
type OrcamentoRow = Database['public']['Tables']['noro_orcamentos']['Row'];
type OrcamentoInsert = Database['public']['Tables']['noro_orcamentos']['Insert'];
type OrcamentoUpdate = Database['public']['Tables']['noro_orcamentos']['Update'];

// ============================================================================
// BUSCAR ORÇAMENTOS (LISTAGEM)
// ============================================================================

export async function getOrcamentos(): Promise<OrcamentoRow[]> {
  const supabase = createServerSupabaseClient();
  const tenantId = await getCurrentTenantId();

  // Busca todos os orçamentos, ordenados pelo mais recente
  const { data, error } = await supabase
    .from('noro_orcamentos')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Erro ao buscar orçamentos');
    return [];
  }

  return data || [];
}

// ============================================================================
// BUSCAR ORÇAMENTO POR ID (DETALHES)
// ============================================================================

export async function getOrcamentoById(orcamentoId: string) {
  const supabase = createServerSupabaseClient();
  const tenantId = await getCurrentTenantId();

  const { data, error } = await supabase
    .from('noro_orcamentos')
    .select('*')
    .eq('id', orcamentoId)
    .eq('tenant_id', tenantId)
    .single();

  if (error) {
    console.error('Erro ao buscar orçamento');
    return { success: false, error: 'Não foi possível buscar o orçamento' };
  }

  return { success: true, data };
}

// ============================================================================
// CRIAR NOVO ORÇAMENTO
// ============================================================================

export async function createOrcamento(formData: FormData) {
  const supabase = createServerSupabaseClient();
  const tenantId = await getCurrentTenantId();

  const itensString = formData.get('itens') as string;
  let itensParsed: any = [];
  try {
      itensParsed = JSON.parse(itensString);
  } catch (e) {
      console.warn("Erro ao parsear itens do orçamento. Salvando como array vazio.");
  }

  // Corrigindo a inserção: garantimos que os itens sejam inseridos como JSONB.
  // O tipo `OrcamentoInsert` deve tratar isso automaticamente, mas para forçar
  // o DB a aceitar o JSON, passamos o objeto (que é o que `JSON.parse` retorna).

  const orcamentoData: OrcamentoInsert = {
    titulo: formData.get('titulo') as string,
    lead_id: formData.get('lead_id') as string || null,
    roteiro_base_id: formData.get('roteiro_base_id') as string || null,
    valor_total: parseFloat(formData.get('valor_total') as string) || 0,
    valor_sinal: parseFloat(formData.get('valor_sinal') as string) || null,
    status: (formData.get('status') as Database['public']['Enums']['orcamento_status']) || 'rascunho',
    descricao: formData.get('descricao') as string || null,
    data_viagem_inicio: formData.get('data_viagem_inicio') as string || null,
    data_viagem_fim: formData.get('data_viagem_fim') as string || null,
    num_pessoas: parseInt(formData.get('num_pessoas') as string) || null,
    num_dias: parseInt(formData.get('num_dias') as string) || null,
    validade_ate: formData.get('validade_ate') as string || null,
    observacoes: formData.get('observacoes') as string || null,
    termos_condicoes: formData.get('termos_condicoes') as string || null,
    // CORREÇÃO AQUI: Passamos o objeto parseado. Se o erro persistir,
    // significa que o cache ou a tipagem no `types/supabase.ts` está errada
    itens: itensParsed,
    tenant_id: tenantId,
  };

  const { data, error } = await supabase
    .from('noro_orcamentos')
    .insert(orcamentoData)
    .select()
    .single();

  if (error) {
    console.error('Erro ao criar orçamento');
    // Adicionamos revalidatePath aqui para forçar um refresh no cache do Next.js
    revalidatePath('/admin/orcamentos');
    return { success: false, message: 'Não foi possível criar o orçamento. Tente novamente.' };
  }

  revalidatePath('/admin/orcamentos');
  if (data.lead_id) {
    revalidatePath(`/admin/clientes/${data.lead_id}`);
  }

  return {
    success: true,
    message: 'Orçamento criado com sucesso!',
    data
  };
}


// ============================================================================
// ATUALIZAR ORÇAMENTO
// ============================================================================

export async function updateOrcamento(orcamentoId: string, formData: FormData) {
    const supabase = createServerSupabaseClient();
    const tenantId = await getCurrentTenantId();

    const itensString = formData.get('itens') as string;
    let itensParsed: any = undefined;

    if (itensString !== null) {
        try {
            itensParsed = JSON.parse(itensString);
        } catch (e) {
            console.warn("Erro ao parsear itens do orçamento durante atualização.");
        }
    }

    const updates: OrcamentoUpdate = {
        titulo: formData.get('titulo') as string,
        valor_total: parseFloat(formData.get('valor_total') as string) || 0,
        valor_sinal: parseFloat(formData.get('valor_sinal') as string) || null,
        status: (formData.get('status') as Database['public']['Enums']['orcamento_status']),
        descricao: formData.get('descricao') as string || null,
        data_viagem_inicio: formData.get('data_viagem_inicio') as string || null,
        data_viagem_fim: formData.get('data_viagem_fim') as string || null,
        num_pessoas: parseInt(formData.get('num_pessoas') as string) || null,
        num_dias: parseInt(formData.get('num_dias') as string) || null,
        validade_ate: formData.get('validade_ate') as string || null,
        observacoes: formData.get('observacoes') as string || null,
        termos_condicoes: formData.get('termos_condicoes') as string || null,
        updated_at: new Date().toISOString(),
        ...(itensParsed !== undefined && { itens: itensParsed })
    };

    const { data: orcamento } = await supabase
      .from('noro_orcamentos')
      .select('lead_id')
      .eq('id', orcamentoId)
      .eq('tenant_id', tenantId)
      .limit(1)
      .single();


    const { error } = await supabase
        .from('noro_orcamentos')
        .update(updates)
        .eq('id', orcamentoId)
        .eq('tenant_id', tenantId);

    if (error) {
        console.error('Erro ao atualizar orçamento');
        return { success: false, message: 'Não foi possível atualizar o orçamento' };
    }

    revalidatePath(`/admin/orcamentos/${orcamentoId}`);
    if (orcamento?.lead_id) {
        revalidatePath(`/admin/clientes/${orcamento.lead_id}`);
    }

    return { success: true, message: 'Orçamento atualizado com sucesso!' };
}

// ============================================================================
// DELETAR ORÇAMENTO (PERMANENTE)
// ============================================================================

export async function deleteOrcamento(orcamentoId: string) {
    const supabase = createServerSupabaseClient();
    const tenantId = await getCurrentTenantId();

    const { data: orcamento } = await supabase
      .from('noro_orcamentos')
      .select('lead_id')
      .eq('id', orcamentoId)
      .eq('tenant_id', tenantId)
      .limit(1)
      .single();

    const { error } = await supabase
        .from('noro_orcamentos')
        .delete()
        .eq('id', orcamentoId)
        .eq('tenant_id', tenantId);

    if (error) {
        console.error('Erro ao deletar orçamento');
        return { success: false, message: 'Não foi possível deletar o orçamento' };
    }

    revalidatePath('/admin/orcamentos');
    if (orcamento?.lead_id) {
        revalidatePath(`/admin/clientes/${orcamento.lead_id}`);
    }

    return { success: true, message: 'Orçamento deletado com sucesso.' };
}