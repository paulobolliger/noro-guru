import 'server-only';
import { createServerClient } from '@/utils/supabase/server'; // Corrigido o erro TS2307, assumindo o caminho correto
import { revalidatePath } from 'next/cache';
import { Database } from '@/types/supabase';
import { createStripeCharge } from './providers/stripe-provider';
import { createCieloCharge } from './providers/cielo-provider'; 
import { createBTGCharge } from './providers/btg-provider'; 
import { PedidoComRelacionamentos } from '../pedidos/[id]/page'; 

// Definição da interface para o retorno padrão das Server Actions
export type ServerActionReturn = {
    success: boolean;
    message: string;
    data?: any;
};

// ================================================================
// FUNÇÃO DE UTILIDADE: Recálculo do Total
// ================================================================

/**
 * Recalcula o valor total de um pedido baseado na soma dos seus itens.
 */
async function recalculatePedidoTotal(pedidoId: string, supabase: ReturnType<typeof createServerClient>): Promise<number | null> {
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

/**
 * Converte um Orçamento para um Pedido (Venda) no banco de dados.
 */
export async function convertToPedido(orcamentoId: string): Promise<ServerActionReturn> {
    const supabase = createServerClient();

    try {
        // 1. Atualizar o status do Orçamento para 'Convertido'
        const { error: updateError } = await supabase
            .from('orcamentos')
            .update({ status: 'CONVERTIDO' }) 
            .eq('id', orcamentoId);

        if (updateError) {
            console.error('Erro ao atualizar status do orçamento:', updateError);
            return { success: false, message: 'Falha ao atualizar status do orçamento.' };
        }

        // 2. Obter os dados do Orçamento, incluindo os itens
        const { data: orcamento, error: fetchError } = await supabase
            .from('orcamentos')
            .select('*, orcamento_itens(*)')
            .eq('id', orcamentoId)
            .single();

        if (fetchError || !orcamento) {
            console.error('Erro ao buscar orçamento ou orçamento não encontrado:', fetchError);
            return { success: false, message: 'Orçamento não encontrado ou erro ao buscar dados.' };
        }

        // 3. Criar o novo Pedido (Venda)
        const { data: novoPedido, error: pedidoError } = await supabase
            .from('pedidos')
            .insert({
                orcamento_id: orcamento.id,
                cliente_id: orcamento.cliente_id,
                valor_total: orcamento.valor_total,
                status: 'EM_PROCESSAMENTO', // Status inicial de um novo pedido
            })
            .select('id')
            .single();

        if (pedidoError || !novoPedido) {
            console.error('Erro ao criar o novo pedido:', pedidoError);
            return { success: false, message: 'Falha ao criar o novo pedido.' };
        }

        // 4. Copiar os Itens do Orçamento para Itens do Pedido
        const pedidoItensPayload = orcamento.orcamento_itens.map(item => ({
            pedido_id: novoPedido.id,
            servico_nome: item.servico_nome,
            quantidade: item.quantidade,
            valor_unitario: item.valor_unitario,
            valor_total: item.valor_total,
        }));

        const { error: itensError } = await supabase
            .from('pedido_itens')
            .insert(pedidoItensPayload);

        if (itensError) {
            console.error('Erro ao copiar itens para o pedido:', itensError);
            return { success: false, message: 'Falha ao copiar itens para o pedido.' };
        }

        // 5. Sucesso e Revalidação/Redirecionamento
        revalidatePath('/admin/orcamentos');
        revalidatePath(`/admin/pedidos/${novoPedido.id}`); 

        return { 
            success: true, 
            message: 'Orçamento convertido para Pedido com sucesso!',
            data: { pedidoId: novoPedido.id }
        };

    } catch (error) {
        console.error('Erro fatal na conversão:', error);
        return { success: false, message: 'Ocorreu um erro inesperado durante a conversão.' };
    }
}

// ================================================================
// FUNÇÃO DE ATUALIZAÇÃO DO PEDIDO (CRUD)
// ================================================================

interface PedidoUpdatePayload {
    status?: string;
    valor_total?: number;
}

/**
 * Atualiza os dados principais de um Pedido.
 */
export async function updatePedido(
    pedidoId: string, 
    payload: PedidoUpdatePayload
): Promise<ServerActionReturn> {
    const supabase = createServerClient();

    if (!pedidoId) {
        return { success: false, message: 'ID do Pedido é obrigatório para atualização.' };
    }
    
    const updates: Partial<PedidoUpdatePayload> = {};
    if (payload.status) updates.status = payload.status;
    if (payload.valor_total !== undefined && payload.valor_total !== null) {
        updates.valor_total = payload.valor_total;
    }
    
    if (Object.keys(updates).length === 0) {
        return { success: false, message: 'Nenhum dado válido fornecido para atualização.' };
    }

    try {
        const { error } = await supabase
            .from('pedidos')
            .update(updates)
            .eq('id', pedidoId);

        if (error) {
            console.error('Erro ao atualizar pedido:', error);
            return { success: false, message: 'Falha ao atualizar o pedido. Tente novamente.' };
        }

        revalidatePath('/admin/pedidos');
        revalidatePath(`/admin/pedidos/${pedidoId}`);
        revalidatePath('/admin/pagamentos'); 

        return { 
            success: true, 
            message: 'Pedido atualizado com sucesso!',
            data: { id: pedidoId, updates }
        };

    } catch (error) {
        console.error('Erro fatal na atualização do pedido:', error);
        return { success: false, message: 'Ocorreu um erro inesperado durante a atualização.' };
    }
}


// ================================================================
// CRUD DE ITENS DE PEDIDO
// ================================================================

interface PedidoItemPayload {
    pedido_id: string;
    servico_nome: string;
    quantidade: number;
    valor_unitario: number;
}

/**
 * Adiciona um novo item ao pedido e recalcula o total.
 */
export async function addPedidoItem(payload: PedidoItemPayload): Promise<ServerActionReturn> {
    const supabase = createServerClient();
    const { pedido_id, quantidade, valor_unitario } = payload;
    const valor_total = quantidade * valor_unitario;

    if (!pedido_id || !payload.servico_nome || quantidade <= 0) {
        return { success: false, message: 'Dados do item inválidos ou incompletos.' };
    }

    try {
        const { data, error } = await supabase
            .from('pedido_itens')
            .insert({ ...payload, valor_total })
            .select('id')
            .single();

        if (error || !data) {
            console.error('Erro ao adicionar item do pedido:', error);
            return { success: false, message: 'Falha ao adicionar o item.' };
        }

        await recalculatePedidoTotal(pedido_id, supabase);
        revalidatePath(`/admin/pedidos/${pedido_id}`);
        revalidatePath('/admin/pagamentos'); 

        return { 
            success: true, 
            message: 'Item adicionado e total recalculado com sucesso!',
            data: { id: data.id } 
        };
    } catch (error) {
        console.error('Erro fatal ao adicionar item:', error);
        return { success: false, message: 'Ocorreu um erro inesperado.' };
    }
}

/**
 * Atualiza um item do pedido existente e recalcula o total.
 */
export async function updatePedidoItem(itemId: string, payload: Partial<PedidoItemPayload>): Promise<ServerActionReturn> {
    const supabase = createServerClient();

    if (!itemId) {
        return { success: false, message: 'ID do item é obrigatório.' };
    }
    
    // Calcula o novo valor total do item, se quantidade ou valor_unitario foram modificados
    let valor_total: number | undefined;
    if (payload.quantidade !== undefined && payload.valor_unitario !== undefined) {
        valor_total = payload.quantidade * payload.valor_unitario;
    }
    
    const updates = { ...payload, valor_total };

    try {
        const { data: itemData, error } = await supabase
            .from('pedido_itens')
            .update(updates)
            .eq('id', itemId)
            .select('pedido_id')
            .single(); 

        if (error || !itemData) {
            console.error('Erro ao atualizar item do pedido:', error);
            return { success: false, message: 'Falha ao atualizar o item.' };
        }
        
        const { pedido_id } = itemData;

        await recalculatePedidoTotal(pedido_id, supabase);
        revalidatePath(`/admin/pedidos/${pedido_id}`);
        revalidatePath('/admin/pagamentos'); 

        return { 
            success: true, 
            message: 'Item atualizado e total recalculado com sucesso!',
            data: { id: itemId }
        };

    } catch (error) {
        console.error('Erro fatal ao atualizar item:', error);
        return { success: false, message: 'Ocorreu um erro inesperado.' };
    }
}

/**
 * Exclui um item do pedido e recalcula o total.
 */
export async function deletePedidoItem(itemId: string): Promise<ServerActionReturn> {
    const supabase = createServerClient();

    if (!itemId) {
        return { success: false, message: 'ID do item é obrigatório.' };
    }

    try {
        // 1. Obter o pedido_id antes de deletar
        const { data: item, error: fetchError } = await supabase
            .from('pedido_itens')
            .select('pedido_id')
            .eq('id', itemId)
            .single();
        
        if (fetchError || !item?.pedido_id) {
            return { success: false, message: 'Item não encontrado ou ID do pedido ausente.' };
        }
        
        const pedido_id = item.pedido_id;

        // 2. Deletar o item
        const { error: deleteError } = await supabase
            .from('pedido_itens')
            .delete()
            .eq('id', itemId);

        if (deleteError) {
            console.error('Erro ao deletar item do pedido:', deleteError);
            return { success: false, message: 'Falha ao deletar o item.' };
        }

        // 3. Recalcular e atualizar o valor total do pedido principal
        await recalculatePedidoTotal(pedido_id, supabase);
        revalidatePath(`/admin/pedidos/${pedido_id}`);
        revalidatePath('/admin/pagamentos');

        return { 
            success: true, 
            message: 'Item excluído e total recalculado com sucesso!',
            data: { id: itemId }
        };
    } catch (error) {
        console.error('Erro fatal ao deletar item:', error);
        return { success: false, message: 'Ocorreu um erro inesperado.' };
    }
}


// ================================================================
// FASE 4: COBRANÇAS / FATURAMENTO
// ================================================================

export type PaymentProvider = 'CIELO' | 'STRIPE' | 'BOLETO' | 'BTG'; 

interface EmitirCobrancaPayload {
    pedido_id: string;
    provider: PaymentProvider;
    data_vencimento: string; 
    cartaoToken?: string; 
    parcelas?: number;
}

/**
 * Emite uma cobrança usando um provedor específico (Stripe, Cielo, BTG).
 */
export async function emitirCobranca(payload: EmitirCobrancaPayload): Promise<ServerActionReturn> {
    const supabase = createServerClient();
    const { pedido_id, provider, data_vencimento, cartaoToken, parcelas = 1 } = payload; 
    
    if (!pedido_id || !provider) {
        return { success: false, message: 'ID do Pedido e Provedor são obrigatórios.' };
    }

    try {
        // 1. Obter os detalhes do pedido e cliente com todos os relacionamentos necessários
        const { data: pedido, error: pedidoError } = await supabase
            .from('pedidos')
            .select('*, pedido_itens(*), clientes(*)') 
            .eq('id', pedido_id)
            .single();

        if (pedidoError || !pedido || !pedido.valor_total) {
            console.error('Erro ao buscar pedido para cobrança:', pedidoError);
            return { success: false, message: 'Pedido não encontrado ou sem valor total.' };
        }
        
        const pedidoComRelacionamentos = pedido as PedidoComRelacionamentos;

        // 2. Criar um registro de Cobrança (Fatura) no banco de dados
        const { data: novaCobranca, error: cobrancaError } = await supabase
            .from('cobrancas') 
            .insert({
                pedido_id: pedido_id,
                cliente_id: pedidoComRelacionamentos.cliente_id,
                valor: pedidoComRelacionamentos.valor_total,
                provider: provider,
                status: 'PENDENTE', 
                data_vencimento: data_vencimento,
                parcelas: parcelas, 
            })
            .select('id')
            .single();

        if (cobrancaError || !novaCobranca) {
            console.error('Erro ao criar registro de cobrança:', cobrancaError);
            return { success: false, message: 'Falha ao criar o registro de cobrança interna.' };
        }
        
        // 3. Chamar a lógica específica do provedor
        let providerResult: ServerActionReturn;

        const successUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/pedidos/${pedido_id}?payment=success`;
        const cancelUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/pedidos/${pedido_id}?payment=cancelled`;

        switch (provider) {
            case 'STRIPE':
                providerResult = await createStripeCharge({ 
                    cobrancaId: novaCobranca.id,
                    valor: Math.round(pedidoComRelacionamentos.valor_total * 100), 
                    clienteEmail: pedidoComRelacionamentos.clientes?.email || '',
                    pedidoId: pedido_id,
                    itens: pedidoComRelacionamentos.pedido_itens || [], 
                    successUrl,
                    cancelUrl,
                });
                break;
            case 'CIELO':
                if (!cartaoToken) {
                    return { success: false, message: 'Para a Cielo Transação Direta, é necessário o token do cartão.' };
                }
                providerResult = await createCieloCharge({ 
                    pedido: pedidoComRelacionamentos,
                    cartaoToken,
                    parcelas,
                });
                break;
            case 'BTG':
                providerResult = await createBTGCharge({
                    pedido: pedidoComRelacionamentos,
                    cobrancaId: novaCobranca.id,
                    dataVencimento: data_vencimento,
                });
                break;
            default:
                providerResult = { success: true, message: `Cobrança Boleto registrada internamente (Cobranca ID: ${novaCobranca.id})` };
                break;
        }

        if (!providerResult.success) {
            // Se a API externa falhar, marca o registro interno como erro.
            await supabase.from('cobrancas').update({ status: 'ERRO_API' }).eq('id', novaCobranca.id);
            return { success: false, message: `Falha na API ${provider}: ${providerResult.message}` };
        }
        
        // 5. Atualizar registro de Cobrança com dados do Provedor
        const newStatus = 'AGUARDANDO_PAGAMENTO'; 
        
        await supabase.from('cobrancas').update({ 
            status: newStatus, 
            transaction_id: providerResult.data?.collectionId || providerResult.data?.sessionId,
            provider_data: providerResult.data || null 
        }).eq('id', novaCobranca.id);
        
        // 6. Atualizar o status do Pedido para 'AGUARDANDO_PAGAMENTO'
        const { error: statusUpdateError } = await supabase
            .from('pedidos')
            .update({ status: 'AGUARDANDO_PAGAMENTO' })
            .eq('id', pedido_id);

        if (statusUpdateError) {
             console.error('Erro ao atualizar status do pedido para AGUARDANDO_PAGAMENTO:', statusUpdateError);
        }

        // 7. Revalidação de Cache
        revalidatePath(`/admin/pedidos/${pedido_id}`);
        revalidatePath('/admin/pagamentos'); 

        return { 
            success: true, 
            message: `Cobrança emitida via ${provider} com sucesso!`,
            data: { 
                ...providerResult.data, 
                pedidoId: pedido_id, 
                cobrancaId: novaCobranca.id 
            }
        };

    } catch (error) {
        console.error('Erro fatal ao emitir cobrança:', error);
        return { success: false, message: 'Ocorreu um erro inesperado ao emitir a cobrança.' };
    }
}