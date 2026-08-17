'use server';

import { 
  createDatabaseClient, 
  paymentChargesRepository, 
  paymentCustomersRepository, 
  paymentProviderAccountsRepository 
} from "@noro/db";
import { requireUser, keycloakSessionAdapter } from '@noro/auth';
import { getServerSession, getSessionClaims } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { createERedeCardCharge, createERedePixCharge } from './providers/erede-provider';
import { createAsaasCharge } from './providers/asaas-provider';
import { asaasProvider } from '@noro/lib/providers/asaas-provider';
import type { PedidoComRelacionamentos } from '@/types/pedidos';

export type ServerActionReturn<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  [key: string]: unknown;
};

export type PaymentProvider = 'EREDE_CREDITO' | 'EREDE_DEBITO' | 'EREDE_PIX' | 'ASAAS';

// ================================================================
// FUNÇÕES DE UTILIDADE E CONTROLE DE TENANT
// ================================================================

async function getTenantId(client: any, userId: string): Promise<string> {
  const memberships = await client`
    SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userId} LIMIT 1
  `;
  if (!memberships || memberships.length === 0) {
    throw new Error('Usuário não associado a nenhuma agência.');
  }
  return memberships[0].tenant_id;
}

async function recalculatePedidoTotal(pedidoId: string, tenantId: string, client: any): Promise<number | null> {
  const itens = await client`
    SELECT valor_total
    FROM sales.order_items
    WHERE pedido_id = ${pedidoId} AND tenant_id = ${tenantId}
  `;

  const newTotal = (itens || []).reduce((sum: number, item: any) => sum + (Number(item.valor_total) || 0), 0);

  await client`
    UPDATE sales.orders
    SET valor_total = ${newTotal}
    WHERE id = ${pedidoId} AND tenant_id = ${tenantId}
  `;

  return newTotal;
}

async function criarClienteFinanceiro(
  db: any,
  tenantId: string,
  clientData: {
    clientId?: string;
    name: string;
    email: string;
    cpfCnpj?: string;
    phone?: string;
  },
): Promise<{ success: boolean; customer?: any; message?: string }> {
  // Verifica se o cliente já existe no gateway
  if (clientData.clientId) {
    const existing = await paymentCustomersRepository.findCustomer(
      db, tenantId, clientData.clientId,
    );
    if (existing) return { success: true, customer: existing };
  }

  // Busca walletId da subconta do tenant para criar cliente no contexto correto
  const account = await paymentProviderAccountsRepository.getProviderAccount(db, tenantId);
  const walletId = account?.providerWalletId ?? null;

  const providerCustomer = await asaasProvider.createCustomer({
    ...clientData,
    walletId,
  });

  const customer = await paymentCustomersRepository.createCustomer(db, {
    tenantId,
    clientId: clientData.clientId ?? null,
    providerCustomerId: providerCustomer.providerCustomerId,
    name: providerCustomer.name,
    email: providerCustomer.email,
    cpfCnpj: providerCustomer.cpfCnpj,
  });

  return { success: true, customer };
}

// ================================================================
// FUNÇÕES DE QUERIES (BUSCA DE DADOS)
// ================================================================

export async function getPedidos(): Promise<any[]> {
  const { client, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: keycloakSessionAdapter(getServerSession),
    });
    const tenantId = await getTenantId(client, userCtx.user.id);

    return await client`
      SELECT * 
      FROM sales.orders
      WHERE tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `;
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    return [];
  } finally {
    await close();
  }
}

export async function getPedidoById(id: string): Promise<any | null> {
  const { client, db, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: keycloakSessionAdapter(getServerSession),
    });
    const tenantId = await getTenantId(client, userCtx.user.id);

    const orders = await client`
      SELECT * FROM sales.orders WHERE id = ${id} AND tenant_id = ${tenantId} LIMIT 1
    `;
    if (!orders || orders.length === 0) return null;
    const order = orders[0];

    const [items, clients, charges] = await Promise.all([
      client`SELECT * FROM sales.order_items WHERE pedido_id = ${id} AND tenant_id = ${tenantId}`,
      client`SELECT * FROM crm.clients WHERE id = ${order.cliente_id} AND tenant_id = ${tenantId} LIMIT 1`,
      client`SELECT * FROM noro.payment_charges WHERE proposal_id = ${id} AND tenant_id = ${tenantId} ORDER BY created_at DESC`
    ]);

    return {
      ...order,
      pedido_itens: items,
      clientes: clients[0] || null,
      cobrancas: charges || []
    };
  } catch (error) {
    console.error('Erro ao buscar detalhes do pedido:', error);
    return null;
  } finally {
    await close();
  }
}

// ================================================================
// FUNÇÕES CRUD DE CONVERSÃO, PEDIDO E ITENS
// ================================================================

export async function convertToPedido(orcamentoId: string): Promise<ServerActionReturn> {
  const { client, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: keycloakSessionAdapter(getServerSession),
    });
    const tenantId = await getTenantId(client, userCtx.user.id);
    let novoPedidoId: string | null = null;

    await client.begin(async (sql) => {
      // Verifica se o orçamento existe e pertence ao tenant
      const [orcamento] = await sql`
        SELECT id, lead_id, valor_total, tenant_id
        FROM sales.proposals
        WHERE id = ${orcamentoId} AND tenant_id = ${tenantId}
        LIMIT 1
      `;
      if (!orcamento) throw new Error('Orçamento não encontrado ou acesso negado.');

      await sql`
        UPDATE sales.proposals
        SET status = 'CONVERTIDO'
        WHERE id = ${orcamentoId} AND tenant_id = ${tenantId}
      `;

      const [novoPedido] = await sql`
        INSERT INTO sales.orders (orcamento_id, cliente_id, valor_total, status, tenant_id)
        VALUES (${orcamento.id}, ${orcamento.lead_id}, ${orcamento.valor_total}, 'EM_PROCESSAMENTO', ${tenantId})
        RETURNING id
      `;
      if (!novoPedido) throw new Error('Falha ao criar o pedido');
      novoPedidoId = novoPedido.id;

      const proposalItems = await sql`
        SELECT descricao, quantidade, valor_unitario_venda, valor_total
        FROM sales.proposal_items
        WHERE orcamento_id = ${orcamentoId} AND tenant_id = ${tenantId}
      `;

      if (proposalItems && proposalItems.length > 0) {
        for (const item of proposalItems) {
          await sql`
            INSERT INTO sales.order_items (pedido_id, descricao, quantidade, valor_unitario, valor_total, tenant_id)
            VALUES (${novoPedido.id}, ${item.descricao}, ${item.quantidade}, ${item.valor_unitario_venda}, ${item.valor_total}, ${tenantId})
          `;
        }
      }
    });

    if (!novoPedidoId) throw new Error('Falha ao gerar o pedido.');

    revalidatePath('/orcamentos');
    revalidatePath(`/pedidos/${novoPedidoId}`);
    return { success: true, message: 'Orçamento convertido para Pedido com sucesso!', data: { pedidoId: novoPedidoId } };
  } catch (error: any) {
    console.error('Erro na conversão:', error);
    return { success: false, message: error.message || 'Ocorreu um erro inesperado.' };
  } finally {
    await close();
  }
}

interface PedidoUpdatePayload { status?: string; valor_total?: number; }
export async function updatePedido(pedidoId: string, payload: PedidoUpdatePayload): Promise<ServerActionReturn> {
  if (!pedidoId) return { success: false, message: 'ID do Pedido é obrigatório.' };
  const { client, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: keycloakSessionAdapter(getServerSession),
    });
    const tenantId = await getTenantId(client, userCtx.user.id);

    const updates: any = {};
    if (payload.status !== undefined) updates.status = payload.status;
    if (payload.valor_total !== undefined) updates.valor_total = payload.valor_total;

    if (Object.keys(updates).length > 0) {
      await client`
        UPDATE sales.orders
        SET ${client(updates, ...Object.keys(updates))}
        WHERE id = ${pedidoId} AND tenant_id = ${tenantId}
      `;
    }

    revalidatePath('/pedidos');
    revalidatePath(`/pedidos/${pedidoId}`);
    revalidatePath('/financeiro');
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
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: keycloakSessionAdapter(getServerSession),
    });
    const tenantId = await getTenantId(client, userCtx.user.id);

    // Verifica se o pedido existe e pertence ao tenant
    const [pedido] = await client`
      SELECT id FROM sales.orders
      WHERE id = ${payload.pedido_id} AND tenant_id = ${tenantId}
      LIMIT 1
    `;
    if (!pedido) throw new Error('Pedido não encontrado ou acesso negado.');

    const valor_total = payload.quantidade * payload.valor_unitario;

    const [item] = await client`
      INSERT INTO sales.order_items (pedido_id, descricao, quantidade, valor_unitario, valor_total, tenant_id)
      VALUES (${payload.pedido_id}, ${payload.servico_nome}, ${payload.quantidade}, ${payload.valor_unitario}, ${valor_total}, ${tenantId})
      RETURNING id
    `;

    await recalculatePedidoTotal(payload.pedido_id, tenantId, client);
    revalidatePath(`/pedidos/${payload.pedido_id}`);
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
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: keycloakSessionAdapter(getServerSession),
    });
    const tenantId = await getTenantId(client, userCtx.user.id);

    const [currentItem] = await client`
      SELECT *
      FROM sales.order_items
      WHERE id = ${itemId} AND tenant_id = ${tenantId}
      LIMIT 1
    `;
    if (!currentItem) throw new Error('Item não encontrado ou acesso negado.');
    
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
      WHERE id = ${itemId} AND tenant_id = ${tenantId}
    `;

    await recalculatePedidoTotal(currentItem.pedido_id, tenantId, client);
    revalidatePath(`/pedidos/${currentItem.pedido_id}`);
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
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: keycloakSessionAdapter(getServerSession),
    });
    const tenantId = await getTenantId(client, userCtx.user.id);

    const [item] = await client`
      SELECT pedido_id
      FROM sales.order_items
      WHERE id = ${itemId} AND tenant_id = ${tenantId}
      LIMIT 1
    `;
    if (!item) throw new Error('Item não encontrado ou acesso negado.');

    await client`
      DELETE FROM sales.order_items
      WHERE id = ${itemId} AND tenant_id = ${tenantId}
    `;

    await recalculatePedidoTotal(item.pedido_id, tenantId, client);
    revalidatePath(`/pedidos/${item.pedido_id}`);
    return { success: true, message: 'Item excluído com sucesso!' };
  } catch (error: any) {
    return { success: false, message: error.message };
  } finally {
    await close();
  }
}

// ================================================================
// FUNÇÕES DE PAGAMENTO E EMISSÃO DE COBRANÇAS
// ================================================================

interface EmitirCobrancaPayload {
  pedido_id: string;
  provider: PaymentProvider;
  data_vencimento: string;
  cardholderName?: string;
  cardNumber?: string;
  expirationMonth?: number;
  expirationYear?: number;
  securityCode?: string;
  parcelas?: number;
  pixExpirationSeconds?: number;
}

export async function emitirCobranca(payload: EmitirCobrancaPayload): Promise<ServerActionReturn> {
  const { client, db, close } = createDatabaseClient();
  const { pedido_id, provider, data_vencimento, cardholderName, cardNumber, expirationMonth, expirationYear, securityCode, parcelas = 1 } = payload; 
  
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: keycloakSessionAdapter(getServerSession),
    });
    const tenantId = await getTenantId(client, userCtx.user.id);

    const [pedido] = await client`
      SELECT *
      FROM sales.orders
      WHERE id = ${pedido_id} AND tenant_id = ${tenantId}
      LIMIT 1
    `;
    if (!pedido || !pedido.valor_total) throw new Error('Pedido não encontrado ou sem valor.');
    
    const orderItems = await client`
      SELECT id, pedido_id, tipo, categoria, fornecedor, produto, descricao as servico_nome, quantidade, valor_unitario, valor_total
      FROM sales.order_items
      WHERE pedido_id = ${pedido_id} AND tenant_id = ${tenantId}
    `;

    const [cliente] = await client`
      SELECT id, nome as nome_completo, email, cpf as tax_id, cnpj as tax_id_cnpj, telefone
      FROM crm.clients
      WHERE id = ${pedido.cliente_id} AND tenant_id = ${tenantId}
      LIMIT 1
    `;
    if (!cliente) throw new Error('Cliente não encontrado.');

    // Busca walletId da subconta do tenant
    const account = await paymentProviderAccountsRepository.getProviderAccount(db, tenantId);
    const walletId = account?.providerWalletId ?? null;

    if (provider === 'ASAAS' && !walletId) {
      throw new Error('Agência não possui integração Asaas configurada em Configurações > Assinatura.');
    }

    // Garante cliente financeiro
    const customerResult = await criarClienteFinanceiro(db, tenantId, {
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
      tenantId,
      proposalId: pedido_id, // Usamos pedido_id no proposalId das cobranças locais
      paymentCustomerId: customerResult.customer.id,
      repasseModelo: 'agencia', 
      amountCents: amountCents,
      billingType: (provider === 'EREDE_PIX' || provider === 'ASAAS') ? 'PIX' : 'CREDIT_CARD',
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

    switch (provider) {
      case 'EREDE_PIX':
        providerResult = await createERedePixCharge({
          pedido: pedidoComRelacionamentos,
          expirationSeconds: payload.pixExpirationSeconds ?? 3600
        });
        break;
      case 'EREDE_CREDITO':
      case 'EREDE_DEBITO':
        if (!cardholderName || !cardNumber || !expirationMonth || !expirationYear || !securityCode) {
          throw new Error('Dados do cartão incompletos.');
        }
        providerResult = await createERedeCardCharge({
          pedido: pedidoComRelacionamentos,
          cardholderName,
          cardNumber,
          expirationMonth,
          expirationYear,
          securityCode,
          kind: provider === 'EREDE_CREDITO' ? 'credit' : 'debit',
          installments: parcelas
        });
        break;
      case 'ASAAS':
        providerResult = await createAsaasCharge({
          pedido: pedidoComRelacionamentos,
          cobrancaId: charge.id,
          dataVencimento: data_vencimento,
          walletId
        });
        break;
      default:
        throw new Error(`Provedor de pagamento ${provider} não suportado.`);
    }

    if (!providerResult.success) {
      await paymentChargesRepository.updateChargeFromWebhook(db, charge.id, {
        status: 'failed'
      });
      return providerResult;
    }
    
    await paymentChargesRepository.updateChargeFromWebhook(db, charge.id, {
      status: 'pending',
      providerPaymentId: providerResult.data?.collectionId || providerResult.data?.sessionId || providerResult.data?.tid,
      providerPayload: providerResult.data || null,
      checkoutUrl: providerResult.data?.checkoutUrl ?? undefined,
      bankSlipUrl: providerResult.data?.bankSlipUrl ?? undefined,
      pixCopyPaste: providerResult.data?.pixCopyPaste ?? providerResult.data?.qrCode ?? undefined
    });

    await client`
      UPDATE sales.orders
      SET status = 'AGUARDANDO_PAGAMENTO'
      WHERE id = ${pedido_id} AND tenant_id = ${tenantId}
    `;

    revalidatePath(`/pedidos/${pedido_id}`);
    revalidatePath('/financeiro');
    return { 
      success: true, 
      message: `Cobrança emitida via ${provider} com sucesso!`, 
      data: { 
        ...providerResult.data, 
        cobrancaId: charge.id 
      }
    };
  } catch (error: any) {
    console.error('[Emitir Cobranca Core Error]:', error);
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
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: keycloakSessionAdapter(getServerSession),
    });
    const tenantId = await getTenantId(client, userCtx.user.id);

    await client`
      UPDATE sales.orders
      SET status = 'CONCLUIDO', valor_pago = ${payload.valor_pago}
      WHERE id = ${pedidoId} AND tenant_id = ${tenantId}
    `;
    
    revalidatePath(`/pedidos/${pedidoId}`);
    revalidatePath('/financeiro');
    
    return { success: true, message: "Pagamento manual registrado e pedido concluído." };
  } catch (error: any) {
    return { success: false, message: error.message };
  } finally {
    await close();
  }
}
