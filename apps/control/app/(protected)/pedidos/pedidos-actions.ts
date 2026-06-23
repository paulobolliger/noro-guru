// app/admin/(protected)/pedidos/pedidos-actions.ts
'use server';

import { createDatabaseClient, paymentChargesRepository } from "@noro/db";
import { criarClienteFinanceiro } from "../billing/actions";
import { revalidatePath } from 'next/cache';
import { createStripeCharge } from './providers/stripe-provider';
import { createCieloCharge } from './providers/cielo-provider'; 
import { createBTGCharge } from './providers/btg-provider'; 
import { createAsaasCharge } from './providers/asaas-provider';
import type { PedidoComRelacionamentos } from "@noro/types/admin";

// Definição da interface para o retorno padrão das Server Actions
export type ServerActionReturn = {
    success: boolean;
    message: string;
    data?: any;
};

type OrcamentoItemParaPedido = {
    descricao: string | null;
    quantidade: number | null;
    valor_unitario: number | null;
    valor_final: number | null;
};

// ================================================================
// FUNÇÃO DE UTILIDADE: Recálculo do Total
// ================================================================

async function recalculatePedidoTotal(pedidoId: string, client: any): Promise<number | null> {
    const itens = await client`
        SELECT valor_total
        FROM sales.order_items
        WHERE pedido_id = ${pedidoId}
    `;

    const newTotal = (itens || []).reduce((sum: number, item: any) => sum + (Number(item.valor_total) || 0), 0);

    await client`
        UPDATE sales.orders
        SET valor_total = ${newTotal}
        WHERE id = ${pedidoId}
    `;

    return newTotal;
}


// ================================================================
// FUNÇÃO DE CONVERSÃO (Conversão de Orçamento para Pedido)
// ================================================================

export async function convertToPedido(orcamentoId: string): Promise<ServerActionReturn> {
    const { client, close } = createDatabaseClient();
    try {
        let novoPedidoId: string | null = null;

        await client.begin(async (sql) => {
            await sql`
                UPDATE sales.proposals
                SET status = 'CONVERTIDO'
                WHERE id = ${orcamentoId}
            `;
            
            const [orcamento] = await sql`
                SELECT id, lead_id, valor_total, tenant_id
                FROM sales.proposals
                WHERE id = ${orcamentoId}
                LIMIT 1
            `;
            if(!orcamento) throw new Error('Orçamento não encontrado');

            const [novoPedido] = await sql`
                INSERT INTO sales.orders (orcamento_id, cliente_id, valor_total, status, tenant_id)
                VALUES (${orcamento.id}, ${orcamento.lead_id}, ${orcamento.valor_total}, 'EM_PROCESSAMENTO', ${orcamento.tenant_id})
                RETURNING id
            `;
            if(!novoPedido) throw new Error('Falha ao criar o pedido');
            novoPedidoId = novoPedido.id;

            const proposalItems = await sql`
                SELECT descricao, quantidade, valor_unitario_venda, valor_total
                FROM sales.proposal_items
                WHERE orcamento_id = ${orcamentoId}
            `;

            if (proposalItems && proposalItems.length > 0) {
                for (const item of proposalItems) {
                    await sql`
                        INSERT INTO sales.order_items (pedido_id, descricao, quantidade, valor_unitario, valor_total, tenant_id)
                        VALUES (${novoPedido.id}, ${item.descricao}, ${item.quantidade}, ${item.valor_unitario_venda}, ${item.valor_total}, ${orcamento.tenant_id})
                    `;
                }
            }
        });

        if (!novoPedidoId) throw new Error('Falha ao gerar o pedido.');

        revalidatePath('/admin/orcamentos');
        revalidatePath(`/admin/pedidos/${novoPedidoId}`);
        return { success: true, message: 'Orçamento convertido para Pedido com sucesso!', data: { pedidoId: novoPedidoId } };
    } catch (error: any) {
        console.error('Erro na conversão:', error);
        return { success: false, message: error.message || 'Ocorreu um erro inesperado.' };
    } finally {
        await close();
    }
}

// ================================================================
// FUNÇÕES CRUD DE PEDIDO E ITENS
// ================================================================

interface PedidoUpdatePayload { status?: string; valor_total?: number; }
export async function updatePedido(pedidoId: string, payload: PedidoUpdatePayload): Promise<ServerActionReturn> {
    if (!pedidoId) return { success: false, message: 'ID do Pedido é obrigatório.' };
    const { client, close } = createDatabaseClient();
    try {
        const updates: any = {};
        if (payload.status !== undefined) updates.status = payload.status;
        if (payload.valor_total !== undefined) updates.valor_total = payload.valor_total;

        if (Object.keys(updates).length > 0) {
            await client`
                UPDATE sales.orders
                SET ${client(updates, ...Object.keys(updates))}
                WHERE id = ${pedidoId}
            `;
        }

        revalidatePath('/admin/pedidos');
        revalidatePath(`/admin/pedidos/${pedidoId}`);
        revalidatePath('/admin/pagamentos');
        return { success: true, message: 'Pedido atualizado com sucesso!' };
    } catch (error: any) {
        return { success: false, message: error.message };
    } finally {
        await close();
    }
}

interface PedidoItemPayload { pedido_id: string; servico_nome: string; quantidade: number; valor_unitario: number; }
export async function addPedidoItem(payload: PedidoItemPayload): Promise<ServerActionReturn> {
    const { client, close } = createDatabaseClient();
    try {
        const valor_total = payload.quantidade * payload.valor_unitario;

        const [pedido] = await client`
            SELECT tenant_id
            FROM sales.orders
            WHERE id = ${payload.pedido_id}
            LIMIT 1
        `;
        const tenantId = pedido?.tenant_id || null;

        const [item] = await client`
            INSERT INTO sales.order_items (pedido_id, descricao, quantidade, valor_unitario, valor_total, tenant_id)
            VALUES (${payload.pedido_id}, ${payload.servico_nome}, ${payload.quantidade}, ${payload.valor_unitario}, ${valor_total}, ${tenantId})
            RETURNING id
        `;

        await recalculatePedidoTotal(payload.pedido_id, client);
        revalidatePath(`/admin/pedidos/${payload.pedido_id}`);
        return { success: true, message: 'Item adicionado com sucesso!', data: item };
    } catch (error: any) {
        return { success: false, message: error.message };
    } finally {
        await close();
    }
}

export async function updatePedidoItem(itemId: string, payload: Partial<PedidoItemPayload>): Promise<ServerActionReturn> {
    const { client, close } = createDatabaseClient();
    try {
        const [currentItem] = await client`
            SELECT *
            FROM sales.order_items
            WHERE id = ${itemId}
            LIMIT 1
        `;
        if (!currentItem) throw new Error('Item não encontrado.');
        
        const newQty = payload.quantidade ?? currentItem.quantidade;
        const newValorUnit = payload.valor_unitario ?? currentItem.valor_unitario;
        const valor_total = (newQty || 0) * (newValorUnit || 0);

        const updates: any = {
            valor_total
        };
        if (payload.quantidade !== undefined) updates.quantidade = payload.quantidade;
        if (payload.valor_unitario !== undefined) updates.valor_unitario = payload.valor_unitario;
        if (payload.servico_nome !== undefined) updates.descricao = payload.servico_nome;

        await client`
            UPDATE sales.order_items
            SET ${client(updates, ...Object.keys(updates))}
            WHERE id = ${itemId}
        `;

        await recalculatePedidoTotal(currentItem.pedido_id, client);
        revalidatePath(`/admin/pedidos/${currentItem.pedido_id}`);
        return { success: true, message: 'Item atualizado com sucesso!' };
    } catch (error: any) {
        return { success: false, message: error.message };
    } finally {
        await close();
    }
}

export async function deletePedidoItem(itemId: string): Promise<ServerActionReturn> {
    const { client, close } = createDatabaseClient();
    try {
        const [item] = await client`
            SELECT pedido_id
            FROM sales.order_items
            WHERE id = ${itemId}
            LIMIT 1
        `;
        if(!item) throw new Error('Item não encontrado');

        await client`
            DELETE FROM sales.order_items
            WHERE id = ${itemId}
        `;

        await recalculatePedidoTotal(item.pedido_id, client);
        revalidatePath(`/admin/pedidos/${item.pedido_id}`);
        return { success: true, message: 'Item excluído com sucesso!' };
    } catch (error: any) {
        return { success: false, message: error.message };
    } finally {
        await close();
    }
}

// ================================================================
// FUNÇÕES DE PAGAMENTO E COBRANÇA
// ================================================================
export type PaymentProvider = 'CIELO' | 'STRIPE' | 'BOLETO' | 'BTG' | 'ASAAS'; 
interface EmitirCobrancaPayload { pedido_id: string; provider: PaymentProvider; data_vencimento: string; cartaoToken?: string; parcelas?: number; }
export async function emitirCobranca(payload: EmitirCobrancaPayload): Promise<ServerActionReturn> {
    const { db, client, close } = createDatabaseClient();
    const { pedido_id, provider, data_vencimento, cartaoToken, parcelas = 1 } = payload; 
    
    try {
        const [pedido] = await client`
            SELECT *
            FROM sales.orders
            WHERE id = ${pedido_id}
            LIMIT 1
        `;
        if (!pedido || !pedido.valor_total) throw new Error('Pedido não encontrado ou sem valor.');
        
        const orderItems = await client`
            SELECT id, pedido_id, tipo, categoria, fornecedor, produto, descricao as servico_nome, quantidade, valor_unitario, valor_total
            FROM sales.order_items
            WHERE pedido_id = ${pedido_id}
        `;

        const [cliente] = await client`
            SELECT id, nome as nome_completo, email, cpf as tax_id, cnpj as tax_id_cnpj, telefone
            FROM crm.clients
            WHERE id = ${pedido.cliente_id}
            LIMIT 1
        `;
        if (!cliente) throw new Error('Cliente não encontrado.');

        // Garante cliente financeiro
        const customerResult = await criarClienteFinanceiro(pedido.tenant_id, {
            clientId: pedido.cliente_id,
            name: cliente.nome_completo,
            email: cliente.email || '',
            cpfCnpj: (cliente.cnpj || cliente.tax_id || cliente.tax_id_cnpj || '').replace(/\D/g, ''),
            phone: cliente.telefone || undefined
        });
        if (!customerResult.success || !customerResult.customer) {
            throw new Error(customerResult.message || 'Falha ao criar cliente financeiro.');
        }

        const amountCents = Math.round(Number(pedido.valor_total) * 100);

        // Cria cobrança no banco (draft)
        const charge = await paymentChargesRepository.createCharge(db, {
            tenantId: pedido.tenant_id,
            proposalId: pedido_id,
            paymentCustomerId: customerResult.customer.id,
            repasseModelo: 'agencia', 
            amountCents: amountCents,
            billingType: provider === 'STRIPE' ? 'CREDIT_CARD' : provider === 'BTG' ? 'BOLETO' : 'PIX',
            dueDate: data_vencimento,
            installments: parcelas,
            provider: provider.toLowerCase(),
        });

        if (!charge) throw new Error('Falha ao criar registro de cobrança.');
        
        const pedidoComRelacionamentos = {
            ...pedido,
            pedido_itens: orderItems,
            clientes: {
                ...cliente,
                taxId: cliente.tax_id || cliente.tax_id_cnpj || ''
            }
        } as unknown as PedidoComRelacionamentos;

        let providerResult: ServerActionReturn;
        const successUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/pedidos/${pedido_id}?payment=success`;
        const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/admin/pedidos/${pedido_id}?payment=cancelled`;

        switch (provider) {
            case 'STRIPE': providerResult = await createStripeCharge({ cobrancaId: charge.id, pedidoId: pedido_id, clienteEmail: cliente.email || '', itens: orderItems || [], successUrl, cancelUrl }); break;
            case 'CIELO': if (!cartaoToken) throw new Error('Token do cartão é necessário para Cielo.'); providerResult = await createCieloCharge({ pedido: pedidoComRelacionamentos, cartaoToken, parcelas }); break;
            case 'BTG': providerResult = await createBTGCharge({ pedido: pedidoComRelacionamentos, cobrancaId: charge.id, dataVencimento: data_vencimento }); break;
            case 'ASAAS': providerResult = await createAsaasCharge({ pedido: pedidoComRelacionamentos, cobrancaId: charge.id, dataVencimento: data_vencimento }); break;
            default: providerResult = { success: true, message: `Cobrança ${provider} registrada.` }; break;
        }

        if (!providerResult.success) {
            await paymentChargesRepository.updateChargeFromWebhook(db, charge.id, {
                status: 'failed'
            });
            return providerResult;
        }
        
        await paymentChargesRepository.updateChargeFromWebhook(db, charge.id, {
            status: 'pending',
            providerPaymentId: providerResult.data?.collectionId || providerResult.data?.sessionId,
            providerPayload: providerResult.data || null
        });

        await client`
            UPDATE sales.orders
            SET status = 'AGUARDANDO_PAGAMENTO'
            WHERE id = ${pedido_id}
        `;

        revalidatePath(`/admin/pedidos/${pedido_id}`);
        revalidatePath('/admin/pagamentos');
        return { success: true, message: `Cobrança emitida via ${provider} com sucesso!`, data: { ...providerResult.data, cobrancaId: charge.id }};
    } catch (error: any) {
        return { success: false, message: error.message };
    } finally {
        await close();
    }
}

interface RegisterPaymentPayload { valor_pago: number; forma_pagamento: string; data_pagamento: string; }
export async function registerPayment(pedidoId: string, payload: RegisterPaymentPayload): Promise<ServerActionReturn> {
    const { client, close } = createDatabaseClient();
    try {
        if (!pedidoId) throw new Error("ID do Pedido não fornecido.");

        await client`
            UPDATE sales.orders
            SET status = 'CONCLUIDO', valor_pago = ${payload.valor_pago}
            WHERE id = ${pedidoId}
        `;
        
        revalidatePath(`/admin/pedidos/${pedidoId}`);
        revalidatePath('/admin/pagamentos');
        
        return { success: true, message: "Pagamento manual registrado e pedido concluído." };
    } catch (error: any) {
        return { success: false, message: error.message };
    } finally {
        await close();
    }
}
