// apps/core/(protected)/pedidos/pedidos-actions.ts
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/supabase';
import { createERedeCardCharge, createERedePixCharge } from './providers/erede-provider';
import { PedidoComRelacionamentos } from '@/types/pedidos';

export type ServerActionReturn = {
  success: boolean;
  message: string;
  data?: any;
};

// Tabelas canônicas — padronizadas com prefixo noro_
const TABELAS = {
  pedidos: 'noro_pedidos',
  pedidoItens: 'noro_pedidos_itens',
  cobrancas: 'noro_cobrancas',
  clientes: 'noro_clientes',
  orcamentos: 'noro_orcamentos',
  leads: 'noro_leads',
} as const;

async function requireAuth() {
  const supabase = createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    throw new Error('Não autenticado. Faça login para continuar.');
  }
  return { supabase, user };
}

// ================================================================
// RECÁLCULO DO TOTAL
// ================================================================

async function recalculatePedidoTotal(
  pedidoId: string,
  supabase: ReturnType<typeof createServerSupabaseClient>
): Promise<number | null> {
  const { data: itens, error: fetchError } = await supabase
    .from(TABELAS.pedidoItens)
    .select('valor_total')
    .eq('pedido_id', pedidoId);

  if (fetchError || !itens) {
    console.error(`Erro ao buscar itens para recálculo do Pedido ${pedidoId}:`, fetchError);
    return null;
  }

  const newTotal = itens.reduce((sum, item) => sum + (item.valor_total || 0), 0);

  const { error: updateError } = await supabase
    .from(TABELAS.pedidos)
    .update({ valor_total: newTotal })
    .eq('id', pedidoId);

  if (updateError) {
    console.error(`Erro ao atualizar valor total do Pedido ${pedidoId}:`, updateError);
    return null;
  }

  return newTotal;
}

// ================================================================
// CONVERSÃO DE ORÇAMENTO PARA PEDIDO
// ================================================================

export async function convertToPedido(orcamentoId: string): Promise<ServerActionReturn> {
  const { supabase } = await requireAuth();
  try {
    const { data: orcamento, error: orcamentoError } = await supabase
      .from(TABELAS.orcamentos)
      .select(`*, ${TABELAS.leads}(*)`)
      .eq('id', orcamentoId)
      .single();

    if (orcamentoError || !orcamento) {
      throw new Error('Orçamento não encontrado: ' + (orcamentoError?.message || ''));
    }

    if (orcamento.status === 'aprovado' || orcamento.status === 'aceito') {
      throw new Error('Este orçamento já foi aprovado/convertido.');
    }

    let clienteId = orcamento.cliente_id;

    if (!clienteId && orcamento.lead_id) {
      const lead = orcamento.noro_leads;
      if (!lead) throw new Error('Lead associado não encontrado.');

      const { data: clienteExistente } = await supabase
        .from(TABELAS.clientes)
        .select('id')
        .eq('email', lead.email)
        .single();

      if (clienteExistente) {
        clienteId = clienteExistente.id;
      } else {
        const { data: novoCliente, error: clienteError } = await supabase
          .from(TABELAS.clientes)
          .insert({
            nome: lead.nome,
            email: lead.email,
            telefone: lead.telefone,
            whatsapp: lead.telefone_whatsapp ? lead.telefone : null,
            origem_lead_id: lead.id,
            status: 'ativo',
            tipo: 'pessoa_fisica',
            data_primeiro_contato: new Date().toISOString(),
            tags: ['novo_cliente', 'convertido_orcamento'],
          })
          .select('id')
          .single();

        if (clienteError || !novoCliente) {
          throw new Error('Erro ao criar cliente: ' + (clienteError?.message || ''));
        }

        clienteId = novoCliente.id;

        await supabase
          .from(TABELAS.leads)
          .update({ cliente_id: clienteId, status: 'ganho' })
          .eq('id', lead.id);
      }
    }

    if (!clienteId) {
      throw new Error('Não foi possível determinar o cliente para este orçamento.');
    }

    // Número de pedido com timestamp+random para evitar race condition
    const numeroPedido = `PED-${new Date().getFullYear()}-${Date.now().toString(36).toUpperCase()}`;

    const dataInicio =
      orcamento.data_viagem_inicio ||
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dataFim =
      orcamento.data_viagem_fim ||
      new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const pedidoData: any = {
      numero_pedido: numeroPedido,
      orcamento_id: orcamento.id,
      cliente_id: clienteId,
      titulo: orcamento.titulo || 'Pedido sem título',
      destinos: orcamento.destinos || [],
      data_viagem_inicio: dataInicio,
      data_viagem_fim: dataFim,
      num_dias: orcamento.num_dias || 7,
      num_pessoas: orcamento.num_pessoas || 2,
      valor_total: orcamento.valor_total,
      valor_pago: 0,
      valor_pendente: orcamento.valor_total,
      moeda: orcamento.moeda || 'EUR',
      status_pagamento: 'pendente',
      status: 'confirmado',
      urgente: orcamento.prioridade === 'alta',
      observacoes_internas: orcamento.observacoes_internas,
      tags: [...(orcamento.tags || []), 'convertido_orcamento'],
    };

    const { data: novoPedido, error: pedidoError } = await supabase
      .from(TABELAS.pedidos)
      .insert(pedidoData)
      .select('id')
      .single();

    if (pedidoError || !novoPedido) {
      throw new Error('Erro ao criar pedido: ' + (pedidoError?.message || ''));
    }

    await supabase
      .from(TABELAS.orcamentos)
      .update({
        status: 'aprovado',
        cliente_id: clienteId,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orcamentoId);

    revalidatePath('/(protected)/orcamentos');
    revalidatePath(`/(protected)/orcamentos/${orcamentoId}`);
    revalidatePath('/(protected)/pedidos');
    revalidatePath(`/(protected)/pedidos/${novoPedido.id}`);
    if (orcamento.lead_id) {
      revalidatePath('/(protected)/leads');
    }

    return {
      success: true,
      message: `Orçamento ${orcamento.numero_orcamento} convertido em Pedido ${numeroPedido} com sucesso!`,
      data: { pedidoId: novoPedido.id },
    };
  } catch (error: any) {
    console.error('Erro na conversão de orçamento:', error);
    return { success: false, message: error.message || 'Ocorreu um erro inesperado.' };
  }
}

// ================================================================
// CRUD DE PEDIDO E ITENS
// ================================================================

interface PedidoUpdatePayload {
  status?: string;
  valor_total?: number;
}

export async function updatePedido(
  pedidoId: string,
  payload: PedidoUpdatePayload
): Promise<ServerActionReturn> {
  const { supabase } = await requireAuth();
  if (!pedidoId) return { success: false, message: 'ID do Pedido é obrigatório.' };
  try {
    await supabase.from(TABELAS.pedidos).update(payload).eq('id', pedidoId).throwOnError();
    revalidatePath('/(protected)/pedidos');
    revalidatePath(`/(protected)/pedidos/${pedidoId}`);
    revalidatePath('/(protected)/pagamentos');
    return { success: true, message: 'Pedido atualizado com sucesso!' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

interface PedidoItemPayload {
  pedido_id: string;
  servico_nome: string;
  quantidade: number;
  valor_unitario: number;
}

export async function addPedidoItem(payload: PedidoItemPayload): Promise<ServerActionReturn> {
  const { supabase } = await requireAuth();
  try {
    const valor_total = payload.quantidade * payload.valor_unitario;
    const { data } = await supabase
      .from(TABELAS.pedidoItens)
      .insert({ ...payload, valor_total })
      .select('id')
      .single()
      .throwOnError();
    await recalculatePedidoTotal(payload.pedido_id, supabase);
    revalidatePath(`/(protected)/pedidos/${payload.pedido_id}`);
    return { success: true, message: 'Item adicionado com sucesso!', data };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updatePedidoItem(
  itemId: string,
  payload: Partial<PedidoItemPayload>
): Promise<ServerActionReturn> {
  const { supabase } = await requireAuth();
  try {
    const { data: currentItem } = await supabase
      .from(TABELAS.pedidoItens)
      .select('*')
      .eq('id', itemId)
      .single();
    if (!currentItem) throw new Error('Item não encontrado.');

    const newQty = payload.quantidade ?? currentItem.quantidade;
    const newValorUnit = payload.valor_unitario ?? currentItem.valor_unitario;
    const updates = { ...payload, valor_total: (newQty || 0) * (newValorUnit || 0) };

    const { data: itemData } = await supabase
      .from(TABELAS.pedidoItens)
      .update(updates)
      .eq('id', itemId)
      .select('pedido_id')
      .single()
      .throwOnError();

    if (!itemData) throw new Error('Item não encontrado após atualização');
    await recalculatePedidoTotal(itemData.pedido_id, supabase);
    revalidatePath(`/(protected)/pedidos/${itemData.pedido_id}`);
    return { success: true, message: 'Item atualizado com sucesso!' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function deletePedidoItem(itemId: string): Promise<ServerActionReturn> {
  const { supabase } = await requireAuth();
  try {
    const { data: item } = await supabase
      .from(TABELAS.pedidoItens)
      .select('pedido_id')
      .eq('id', itemId)
      .single()
      .throwOnError();
    if (!item) throw new Error('Item não encontrado');
    await supabase.from(TABELAS.pedidoItens).delete().eq('id', itemId).throwOnError();
    await recalculatePedidoTotal(item.pedido_id, supabase);
    revalidatePath(`/(protected)/pedidos/${item.pedido_id}`);
    return { success: true, message: 'Item excluído com sucesso!' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// ================================================================
// PAGAMENTO E COBRANÇA
// ================================================================

export type PaymentProvider = 'EREDE_CREDITO' | 'EREDE_DEBITO' | 'EREDE_PIX';

interface EmitirCobrancaPayload {
  pedido_id: string;
  provider: PaymentProvider;
  data_vencimento: string;
  // e.Rede — cartão (crédito / débito)
  cardholderName?: string;
  cardNumber?: string;
  expirationMonth?: number;
  expirationYear?: number;
  securityCode?: string;
  parcelas?: number;
  // e.Rede — PIX
  pixExpirationSeconds?: number;
}

export async function emitirCobranca(payload: EmitirCobrancaPayload): Promise<ServerActionReturn> {
  const { supabase } = await requireAuth();
  const {
    pedido_id,
    provider,
    data_vencimento,
    cardholderName,
    cardNumber,
    expirationMonth,
    expirationYear,
    securityCode,
    parcelas = 1,
    pixExpirationSeconds,
  } = payload;

  try {
    const { data: pedido } = await supabase
      .from(TABELAS.pedidos)
      .select(`*, pedido_itens:${TABELAS.pedidoItens}(*), clientes:${TABELAS.clientes}(*)`)
      .eq('id', pedido_id)
      .single()
      .throwOnError();

    if (!pedido || !pedido.valor_total) throw new Error('Pedido não encontrado ou sem valor.');

    const pedidoComRelacionamentos = pedido as PedidoComRelacionamentos;

    const { data: novaCobranca } = await supabase
      .from(TABELAS.cobrancas)
      .insert({
        pedido_id,
        cliente_id: pedidoComRelacionamentos.cliente_id,
        valor: pedidoComRelacionamentos.valor_total,
        provider,
        status: 'PENDENTE',
        data_vencimento,
        parcelas,
      })
      .select('id')
      .single()
      .throwOnError();

    if (!novaCobranca) throw new Error('Falha ao criar registro de cobrança.');

    let providerResult: ServerActionReturn;

    switch (provider) {
      case 'EREDE_CREDITO':
      case 'EREDE_DEBITO': {
        if (!cardholderName || !cardNumber || !expirationMonth || !expirationYear || !securityCode) {
          throw new Error('Dados do cartão são obrigatórios para pagamento e.Rede.');
        }
        providerResult = await createERedeCardCharge({
          pedido: pedidoComRelacionamentos,
          cardholderName,
          cardNumber,
          expirationMonth,
          expirationYear,
          securityCode,
          kind: provider === 'EREDE_DEBITO' ? 'debit' : 'credit',
          installments: provider === 'EREDE_CREDITO' ? parcelas : 1,
          softDescriptor: 'NORO',
        });
        break;
      }

      case 'EREDE_PIX':
        providerResult = await createERedePixCharge({
          pedido: pedidoComRelacionamentos,
          expirationSeconds: pixExpirationSeconds ?? 3600,
        });
        break;

      default:
        providerResult = { success: false, message: `Provedor ${provider} não reconhecido.` };
    }

    // 3DS redirect: not a failure — awaiting customer authentication
    const requires3DS = providerResult.data?.requiresRedirect === true;

    if (!providerResult.success && !requires3DS) {
      await supabase.from(TABELAS.cobrancas).update({ status: 'ERRO_API' }).eq('id', novaCobranca.id);
      return providerResult;
    }

    // Determina status final com base no provider e resultado
    // - Cartão aprovado na hora → PAGO
    // - 3DS redirect → AGUARDANDO_PAGAMENTO (autenticação pendente)
    // - PIX e.Rede → AGUARDANDO_PAGAMENTO (pagamento assíncrono via webhook)
    const isCardApproved =
      (provider === 'EREDE_CREDITO' || provider === 'EREDE_DEBITO') &&
      providerResult.success &&
      !requires3DS;

    const cobrancaStatus = isCardApproved ? 'PAGO' : 'AGUARDANDO_PAGAMENTO';
    const pedidoStatus = isCardApproved ? 'PAGO' : 'AGUARDANDO_PAGAMENTO';

    await supabase
      .from(TABELAS.cobrancas)
      .update({
        status: cobrancaStatus,
        transaction_id:
          providerResult.data?.tid ||
          providerResult.data?.collectionId ||
          providerResult.data?.sessionId ||
          null,
        provider_data: providerResult.data || null,
      })
      .eq('id', novaCobranca.id);

    await supabase
      .from(TABELAS.pedidos)
      .update({ status: pedidoStatus })
      .eq('id', pedido_id);

    revalidatePath(`/(protected)/pedidos/${pedido_id}`);
    revalidatePath('/(protected)/pagamentos');

    return {
      success: true,
      message: requires3DS
        ? 'Autenticação 3DS necessária. Redirecionando o cliente.'
        : `Cobrança emitida via ${provider} com sucesso!`,
      data: { ...providerResult.data, cobrancaId: novaCobranca.id },
    };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

interface RegisterPaymentPayload {
  valor_pago: number;
  forma_pagamento: string;
  data_pagamento: string;
}

export async function registerPayment(
  pedidoId: string,
  payload: RegisterPaymentPayload
): Promise<ServerActionReturn> {
  const { supabase } = await requireAuth();
  try {
    if (!pedidoId) throw new Error('ID do Pedido não fornecido.');

    const { error } = await supabase
      .from(TABELAS.pedidos)
      .update({ status: 'CONCLUIDO', valor_pago: payload.valor_pago })
      .eq('id', pedidoId);

    if (error) throw error;

    revalidatePath(`/(protected)/pedidos/${pedidoId}`);
    revalidatePath('/(protected)/pagamentos');

    return { success: true, message: 'Pagamento manual registrado e pedido concluído.' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}
