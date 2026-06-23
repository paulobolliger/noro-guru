// app/admin/(protected)/orcamentos/orcamentos-actions.ts
'use server';

import { createDatabaseClient } from "@noro/db";
import { revalidatePath } from 'next/cache';

// Tipos definidos localmente
type OrcamentoRow = any;
type OrcamentoInsert = any;
type OrcamentoUpdate = any;

// ============================================================================
// BUSCAR ORÇAMENTOS (LISTAGEM)
// ============================================================================

export async function getOrcamentos(): Promise<OrcamentoRow[]> {
  const { client, close } = createDatabaseClient();
  try {
    const rows = await client`
      SELECT * 
      FROM sales.proposals
      ORDER BY created_at DESC
    `;
    return rows || [];
  } catch (error: any) {
    console.error('Erro ao buscar orçamentos:', error.message);
    return [];
  } finally {
    await close();
  }
}

// ============================================================================
// BUSCAR ORÇAMENTO POR ID (DETALHES)
// ============================================================================

export async function getOrcamentoById(orcamentoId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const rows = await client`
      SELECT * 
      FROM sales.proposals
      WHERE id = ${orcamentoId}
      LIMIT 1
    `;
    if (!rows || rows.length === 0) {
      return { success: false, error: 'Orçamento não encontrado' };
    }
    return { success: true, data: rows[0] };
  } catch (error: any) {
    console.error(`Erro ao buscar orçamento ${orcamentoId}:`, error.message);
    return { success: false, error: error.message };
  } finally {
    await close();
  }
}

// ============================================================================
// CRIAR NOVO ORÇAMENTO
// ============================================================================

export async function createOrcamento(formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const itensString = formData.get('itens') as string;
    let itensParsed: any = [];
    try {
      itensParsed = JSON.parse(itensString);
    } catch (e) {
      console.warn("Erro ao parsear itens do orçamento. Salvando como array vazio.");
    }

    const payload = {
      titulo: formData.get('titulo') as string,
      lead_id: formData.get('lead_id') as string || null,
      roteiro_base_id: formData.get('roteiro_base_id') as string || null,
      valor_total: parseFloat(formData.get('valor_total') as string) || 0,
      valor_sinal: parseFloat(formData.get('valor_sinal') as string) || null,
      status: formData.get('status') as string || 'rascunho',
      descricao: formData.get('descricao') as string || null,
      data_viagem_inicio: formData.get('data_viagem_inicio') as string || null,
      data_viagem_fim: formData.get('data_viagem_fim') as string || null,
      num_pessoas: parseInt(formData.get('num_pessoas') as string) || null,
      num_dias: parseInt(formData.get('num_dias') as string) || null,
      validade_ate: formData.get('validade_ate') as string || null,
      observacoes: formData.get('observacoes') as string || null,
      termos_condicoes: formData.get('termos_condicoes') as string || null,
      itens: client.json(itensParsed)
    };

    const rows = await client`
      INSERT INTO sales.proposals (
        titulo, lead_id, roteiro_base_id, valor_total, valor_sinal, 
        status, descricao, data_viagem_inicio, data_viagem_fim, 
        num_pessoas, num_dias, validade_ate, observacoes, termos_condicoes, itens
      ) VALUES (
        ${payload.titulo}, ${payload.lead_id}, ${payload.roteiro_base_id}, ${payload.valor_total}, ${payload.valor_sinal},
        ${payload.status}, ${payload.descricao}, ${payload.data_viagem_inicio}, ${payload.data_viagem_fim},
        ${payload.num_pessoas}, ${payload.num_dias}, ${payload.validade_ate}, ${payload.observacoes}, ${payload.termos_condicoes}, ${payload.itens}
      ) RETURNING *
    `;

    if (!rows || rows.length === 0) throw new Error('Falha ao criar orçamento');
    const data = rows[0];

    revalidatePath('/admin/orcamentos');
    if (data.lead_id) {
      revalidatePath(`/admin/clientes/${data.lead_id}`);
    }

    return { 
      success: true, 
      message: 'Orçamento criado com sucesso!', 
      data 
    };
  } catch (error: any) {
    console.error('Erro ao criar orçamento:', error.message);
    revalidatePath('/admin/orcamentos'); 
    return { success: false, message: `Erro ao criar orçamento: ${error.message}. Tente recarregar a página.` };
  } finally {
    await close();
  }
}

// ============================================================================
// ATUALIZAR ORÇAMENTO
// ============================================================================

export async function updateOrcamento(orcamentoId: string, formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const itensString = formData.get('itens') as string;
    let itensParsed: any = undefined;

    if (itensString !== null) {
      try {
        itensParsed = JSON.parse(itensString);
      } catch (e) {
        console.warn("Erro ao parsear itens do orçamento durante atualização.");
      }
    }

    const updates: any = {
      titulo: formData.get('titulo') as string,
      valor_total: parseFloat(formData.get('valor_total') as string) || 0,
      valor_sinal: parseFloat(formData.get('valor_sinal') as string) || null,
      status: formData.get('status') as string,
      descricao: formData.get('descricao') as string || null,
      data_viagem_inicio: formData.get('data_viagem_inicio') as string || null,
      data_viagem_fim: formData.get('data_viagem_fim') as string || null,
      num_pessoas: parseInt(formData.get('num_pessoas') as string) || null,
      num_dias: parseInt(formData.get('num_dias') as string) || null,
      validade_ate: formData.get('validade_ate') as string || null,
      observacoes: formData.get('observacoes') as string || null,
      termos_condicoes: formData.get('termos_condicoes') as string || null,
      updated_at: new Date()
    };

    if (itensParsed !== undefined) {
      updates.itens = client.json(itensParsed);
    }

    const orcamentos = await client`
      SELECT lead_id FROM sales.proposals WHERE id = ${orcamentoId} LIMIT 1
    `;
    const orcamento = orcamentos[0];

    await client`
      UPDATE sales.proposals
      SET ${client(updates)}
      WHERE id = ${orcamentoId}
    `;

    revalidatePath(`/admin/orcamentos/${orcamentoId}`);
    if (orcamento?.lead_id) {
      revalidatePath(`/admin/clientes/${orcamento.lead_id}`);
    }
    
    return { success: true, message: 'Orçamento atualizado com sucesso!' };
  } catch (error: any) {
    console.error('Erro ao atualizar orçamento:', error.message);
    return { success: false, message: `Erro ao atualizar orçamento: ${error.message}` };
  } finally {
    await close();
  }
}

// ============================================================================
// DELETAR ORÇAMENTO (PERMANENTE)
// ============================================================================

export async function deleteOrcamento(orcamentoId: string) {
  const { client, close } = createDatabaseClient();
  try {
    const orcamentos = await client`
      SELECT lead_id FROM sales.proposals WHERE id = ${orcamentoId} LIMIT 1
    `;
    const orcamento = orcamentos[0];

    await client`
      DELETE FROM sales.proposals
      WHERE id = ${orcamentoId}
    `;

    revalidatePath('/admin/orcamentos');
    if (orcamento?.lead_id) {
      revalidatePath(`/admin/clientes/${orcamento.lead_id}`);
    }
    
    return { success: true, message: 'Orçamento deletado com sucesso.' };
  } catch (error: any) {
    console.error('Erro ao deletar orçamento:', error.message);
    return { success: false, message: `Erro ao deletar orçamento: ${error.message}` };
  } finally {
    await close();
  }
}
