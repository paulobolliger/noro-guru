// apps/core/(protected)/pedidos/pedidos-actions.ts
'use server';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/supabase';
import { createStripeCharge } from './providers/stripe-provider';
import { createCieloCharge } from './providers/cielo-provider'; 
import { createBTGCharge } from './providers/btg-provider'; 
import { PedidoComRelacionamentos } from '@/types/admin';

// Definição da interface para o retorno padrão das Server Actions
export type ServerActionReturn = {
    success: boolean;
    message: string;
    data?: any;
};

// ================================================================
// FUNÇÃO DE UTILIDADE: Recálculo do Total
// ================================================================

async function recalculatePedidoTotal(pedidoId: string, supabase: ReturnType<typeof createServerSupabaseClient>): Promise<number | null> {
    const { data: itens, error: fetchError } = await supabase
        .from('pedido_itens')
        .select('valor_total')
        .eq('pedido_id', pedidoId);

    if (fetchError || !itens) {
        console.error(`Erro ao buscar itens para recálculo do Pedido ${pedidoId}:`, fetchError);
        return null;
    }

    const newTotal = itens.reduce((sum, item) => sum + (item.valor_total || 0), 0);

    const { error: updateError } = await supabase
        .from('pedidos')
        .update({ valor_total: newTotal })
        .eq('id', pedidoId);

    if (updateError) {
        console.error(`Erro ao atualizar valor total do Pedido ${pedidoId}:`, updateError);
        return null;
    }

    return newTotal;
}


// ================================================================
// FUNÇÃO DE CONVERSÃO (Conversão de Orçamento para Pedido)
// ================================================================

export async function convertToPedido(orcamentoId: string): Promise<ServerActionReturn> {
    const supabase = createServerSupabaseClient();
    try {
        console.log('🔄 Iniciando conversão de orçamento para pedido:', orcamentoId);

        // 1. Buscar orçamento com dados do lead
        const { data: orcamento, error: orcamentoError } = await supabase
            .from('noro_orcamentos')
            .select('*, noro_leads(*)')
            .eq('id', orcamentoId)
            .single();

        if (orcamentoError || !orcamento) {
            throw new Error('Orçamento não encontrado: ' + (orcamentoError?.message || ''));
        }

        console.log('📋 Orçamento encontrado:', {
            numero: orcamento.numero_orcamento,
            lead_id: orcamento.lead_id,
            cliente_id: orcamento.cliente_id,
            status: orcamento.status
        });

        // 2. Verificar se já foi convertido
        if (orcamento.status === 'aprovado' || orcamento.status === 'aceito') {
            throw new Error('Este orçamento já foi aprovado/convertido.');
        }

        // 3. Obter ou criar cliente
        let clienteId = orcamento.cliente_id;

        if (!clienteId && orcamento.lead_id) {
            const lead = orcamento.noro_leads;
            if (!lead) {
                throw new Error('Lead associado não encontrado.');
            }

            console.log('👤 Lead encontrado:', lead.nome);

            // Verificar se já existe cliente com este email
            const { data: clienteExistente } = await supabase
                .from('noro_clientes')
                .select('id')
                .eq('email', lead.email)
                .single();

            if (clienteExistente) {
                console.log('✅ Cliente já existe:', clienteExistente.id);
                clienteId = clienteExistente.id;
            } else {
                // Criar novo cliente a partir do lead
                console.log('➕ Criando novo cliente...');
                const { data: novoCliente, error: clienteError } = await supabase
                    .from('noro_clientes')
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
                console.log('✅ Cliente criado:', clienteId);

                // Atualizar lead com cliente_id
                await supabase
                    .from('noro_leads')
                    .update({ cliente_id: clienteId, status: 'ganho' })
                    .eq('id', lead.id);
            }
        }

        if (!clienteId) {
            throw new Error('Não foi possível determinar o cliente para este orçamento.');
        }

        // 4. Gerar número do pedido
        const { count } = await supabase
            .from('noro_pedidos')
            .select('*', { count: 'exact', head: true });

        const numeroPedido = `PED-${new Date().getFullYear()}-${String((count || 0) + 1).padStart(4, '0')}`;

        // 5. Criar pedido - usando as colunas corretas de noro_pedidos
        console.log('📦 Criando pedido:', numeroPedido);

        // Se não tiver datas, usar data de hoje + 30 dias como padrão
        const dataInicio = orcamento.data_viagem_inicio || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const dataFim = orcamento.data_viagem_fim || new Date(Date.now() + 37 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

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

        console.log('📦 Dados do pedido a inserir:', pedidoData);

        const { data: novoPedido, error: pedidoError } = await supabase
            .from('noro_pedidos')
            .insert(pedidoData)
            .select('id')
            .single();

        if (pedidoError || !novoPedido) {
            throw new Error('Erro ao criar pedido: ' + (pedidoError?.message || ''));
        }

        console.log('✅ Pedido criado:', novoPedido.id);

        // 6. Atualizar orçamento para status aprovado
        await supabase
            .from('noro_orcamentos')
            .update({
                status: 'aprovado',
                cliente_id: clienteId,
                updated_at: new Date().toISOString()
            })
            .eq('id', orcamentoId);

        console.log('✅ Orçamento atualizado para status aprovado');

        // 7. Revalidar caches
        revalidatePath('/admin/orcamentos');
        revalidatePath(`/admin/orcamentos/${orcamentoId}`);
        revalidatePath('/admin/pedidos');
        revalidatePath(`/admin/pedidos/${novoPedido.id}`);
        if (orcamento.lead_id) {
            revalidatePath('/admin/leads');
        }

        return {
            success: true,
            message: `Orçamento ${orcamento.numero_orcamento} convertido em Pedido ${numeroPedido} com sucesso!`,
            data: { pedidoId: novoPedido.id }
        };
    } catch (error: any) {
        console.error('❌ Erro na conversão:', error);
        return { success: false, message: error.message || 'Ocorreu um erro inesperado.' };
    }
}

// ================================================================
// FUNÇÕES CRUD DE PEDIDO E ITENS
// ================================================================

interface PedidoUpdatePayload { status?: string; valor_total?: number; }
export async function updatePedido(pedidoId: string, payload: PedidoUpdatePayload): Promise<ServerActionReturn> {
    const supabase = createServerSupabaseClient();
    if (!pedidoId) return { success: false, message: 'ID do Pedido é obrigatório.' };
    try {
        await supabase.from('pedidos').update(payload).eq('id', pedidoId).throwOnError();
        revalidatePath('/admin/pedidos');
        revalidatePath(`/admin/pedidos/${pedidoId}`);
        revalidatePath('/admin/pagamentos');
        return { success: true, message: 'Pedido atualizado com sucesso!' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

interface PedidoItemPayload { pedido_id: string; servico_nome: string; quantidade: number; valor_unitario: number; }
export async function addPedidoItem(payload: PedidoItemPayload): Promise<ServerActionReturn> {
    const supabase = createServerSupabaseClient();
    try {
        const valor_total = payload.quantidade * payload.valor_unitario;
        const { data } = await supabase.from('pedido_itens').insert({ ...payload, valor_total }).select('id').single().throwOnError();
        await recalculatePedidoTotal(payload.pedido_id, supabase);
        revalidatePath(`/admin/pedidos/${payload.pedido_id}`);
        return { success: true, message: 'Item adicionado com sucesso!', data };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function updatePedidoItem(itemId: string, payload: Partial<PedidoItemPayload>): Promise<ServerActionReturn> {
    const supabase = createServerSupabaseClient();
    try {
        const { data: currentItem } = await supabase.from('pedido_itens').select('*').eq('id', itemId).single();
        if (!currentItem) throw new Error('Item não encontrado.');
        
        const newQty = payload.quantidade ?? currentItem.quantidade;
        const newValorUnit = payload.valor_unitario ?? currentItem.valor_unitario;

        const updates = {
            ...payload,
            valor_total: (newQty || 0) * (newValorUnit || 0)
        }

        const { data: itemData } = await supabase.from('pedido_itens').update(updates).eq('id', itemId).select('pedido_id').single().throwOnError();
        if(!itemData) throw new Error('Item não encontrado após atualização');
        await recalculatePedidoTotal(itemData.pedido_id, supabase);
        revalidatePath(`/admin/pedidos/${itemData.pedido_id}`);
        return { success: true, message: 'Item atualizado com sucesso!' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

export async function deletePedidoItem(itemId: string): Promise<ServerActionReturn> {
    const supabase = createServerSupabaseClient();
    try {
        const { data: item } = await supabase.from('pedido_itens').select('pedido_id').eq('id', itemId).single().throwOnError();
        if(!item) throw new Error('Item não encontrado');
        await supabase.from('pedido_itens').delete().eq('id', itemId).throwOnError();
        await recalculatePedidoTotal(item.pedido_id, supabase);
        revalidatePath(`/admin/pedidos/${item.pedido_id}`);
        return { success: true, message: 'Item excluído com sucesso!' };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// ================================================================
// FUNÇÕES DE PAGAMENTO E COBRANÇA
// ================================================================
export type PaymentProvider = 'CIELO' | 'STRIPE' | 'BOLETO' | 'BTG'; 
interface EmitirCobrancaPayload { pedido_id: string; provider: PaymentProvider; data_vencimento: string; cartaoToken?: string; parcelas?: number; }
export async function emitirCobranca(payload: EmitirCobrancaPayload): Promise<ServerActionReturn> {
    const supabase = createServerSupabaseClient();
    const { pedido_id, provider, data_vencimento, cartaoToken, parcelas = 1 } = payload; 
    
    try {
        const { data: pedido } = await supabase.from('pedidos').select('*, pedido_itens(*), clientes:noro_clientes(*)').eq('id', pedido_id).single().throwOnError();
        if (!pedido || !pedido.valor_total) throw new Error('Pedido não encontrado ou sem valor.');
        
        const pedidoComRelacionamentos = pedido as PedidoComRelacionamentos;

        const { data: novaCobranca } = await supabase.from('cobrancas').insert({ pedido_id: pedido_id, cliente_id: pedidoComRelacionamentos.cliente_id, valor: pedidoComRelacionamentos.valor_total, provider: provider, status: 'PENDENTE', data_vencimento: data_vencimento, parcelas: parcelas, }).select('id').single().throwOnError();
        if (!novaCobranca) throw new Error('Falha ao criar registro de cobrança.');
        
        let providerResult: ServerActionReturn;
        const successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/pedidos/${pedido_id}?payment=success`;
        const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/pedidos/${pedido_id}?payment=cancelled`;

        switch (provider) {
            case 'STRIPE': providerResult = await createStripeCharge({ cobrancaId: novaCobranca.id, pedidoId: pedido_id, clienteEmail: pedidoComRelacionamentos.clientes?.email || '', itens: pedidoComRelacionamentos.pedido_itens || [], successUrl, cancelUrl }); break;
            case 'CIELO': if (!cartaoToken) throw new Error('Token do cartão é necessário para Cielo.'); providerResult = await createCieloCharge({ pedido: pedidoComRelacionamentos, cartaoToken, parcelas }); break;
            case 'BTG': providerResult = await createBTGCharge({ pedido: pedidoComRelacionamentos, cobrancaId: novaCobranca.id, dataVencimento: data_vencimento }); break;
            default: providerResult = { success: true, message: `Cobrança ${provider} registrada.` }; break;
        }

        if (!providerResult.success) {
            await supabase.from('cobrancas').update({ status: 'ERRO_API' }).eq('id', novaCobranca.id);
            return providerResult;
        }
        
        await supabase.from('cobrancas').update({ status: 'AGUARDANDO_PAGAMENTO', transaction_id: providerResult.data?.collectionId || providerResult.data?.sessionId, provider_data: providerResult.data || null }).eq('id', novaCobranca.id);
        await supabase.from('pedidos').update({ status: 'AGUARDANDO_PAGAMENTO' }).eq('id', pedido_id);

        revalidatePath(`/admin/pedidos/${pedido_id}`);
        revalidatePath('/admin/pagamentos');
        return { success: true, message: `Cobrança emitida via ${provider} com sucesso!`, data: { ...providerResult.data, cobrancaId: novaCobranca.id }};
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

interface RegisterPaymentPayload { valor_pago: number; forma_pagamento: string; data_pagamento: string; }
export async function registerPayment(pedidoId: string, payload: RegisterPaymentPayload): Promise<ServerActionReturn> {
    const supabase = createServerSupabaseClient();
    try {
        if (!pedidoId) throw new Error("ID do Pedido não fornecido.");

        const { error } = await supabase.from('pedidos').update({ status: 'CONCLUIDO', valor_pago: payload.valor_pago }).eq('id', pedidoId);
        if (error) throw error;
        
        revalidatePath(`/admin/pedidos/${pedidoId}`);
        revalidatePath('/admin/pagamentos');
        
        return { success: true, message: "Pagamento manual registrado e pedido concluído." };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}