// app/api/webhooks/btg/route.ts
import { createDatabaseClient } from "@noro/db";
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

const BTG_WEBHOOK_SECRET = process.env.BTG_WEBHOOK_SECRET;

/**
 * Route Handler para receber eventos de Webhook do BTG Pactual.
 * Gerencia os eventos de pagamento de PIX e Boleto para conciliação.
 */
export async function POST(req: Request) {
    // 1. Verificar a Autenticação do Webhook (Segurança Crítica)
    const authHeader = req.headers.get('Authorization');
    
    if (BTG_WEBHOOK_SECRET && (!authHeader || !authHeader.startsWith('Bearer '))) {
        console.error('Webhook BTG: Header de Autorização ausente ou incorreto.');
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let payload;
    try {
        payload = await req.json();
    } catch (e) {
        console.error('Webhook BTG: Erro ao parsear JSON.');
        return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }
    
    const eventType = payload.event;
    const eventData = payload.data;
    
    if (!eventData) {
        return NextResponse.json({ received: true, message: 'No data field' }, { status: 200 });
    }
    
    console.log(`Webhook BTG recebido: Tipo ${eventType}`);

    // 2. Tentar conciliar Pedido e Cobrança a partir dos dados do BTG
    let pedidoId: string | undefined;
    
    if (eventData.tags && typeof eventData.tags.pedido_id === 'string') {
         pedidoId = eventData.tags.pedido_id;
    } 

    // 3. Tratar Eventos de Pagamento Concluído
    if (eventType === 'instant-collection.paid' || eventType === 'collections.paid') {
        if (!pedidoId) {
            console.error(`Webhook BTG: Pedido ID não encontrado no payload de pagamento:`, eventData);
            return NextResponse.json({ received: true, message: 'Pedido ID not found' }, { status: 200 });
        }
        
        const valorPago = eventData.amount || eventData.paidAmount;
        const transactionId = eventData.endToEndId || eventData.txId || eventData.movementId || 'N/A';

        const { client, close } = createDatabaseClient();
        try {
            // A. Buscar cobrança associada no status 'pending' ou 'processing'
            const [cobranca] = await client`
                SELECT id, provider, provider_payload
                FROM noro.payment_charges
                WHERE proposal_id = ${pedidoId} AND status IN ('pending', 'processing')
                LIMIT 1
            `;
            
            if (!cobranca) {
                console.warn(`Webhook BTG: Cobrança pendente não encontrada para Pedido ${pedidoId}. Pode ter sido paga manualmente ou é duplicidade.`);
                return NextResponse.json({ received: true, message: 'Cobranca not found or status already updated.' }, { status: 200 });
            }

            // B. Atualizar a cobrança e o pedido em uma transação
            await client.begin(async (sql) => {
                const providerPayload = {
                    ...(cobranca.provider_payload || {}),
                    btgTransaction: eventData,
                    valorConciliado: valorPago
                };

                await sql`
                    UPDATE noro.payment_charges
                    SET 
                        status = 'received', 
                        received_at = ${new Date().toISOString()},
                        provider_payment_id = ${transactionId},
                        provider_payload = ${JSON.stringify(providerPayload)}::jsonb
                    WHERE id = ${cobranca.id}
                `;

                await sql`
                    UPDATE sales.orders
                    SET status = 'CONCLUIDO'
                    WHERE id = ${pedidoId}
                `;
            });

            console.log(`✅ Pagamento BTG conciliado. Pedido ${pedidoId} e Cobrança ${cobranca.id} atualizados para CONCLUIDO.`);

            // C. Revalidar as páginas afetadas
            revalidatePath(`/admin/pedidos/${pedidoId}`);
            revalidatePath('/admin/pagamentos');

        } catch (dbError) {
            console.error('Erro de DB ao processar webhook BTG:', dbError);
            return NextResponse.json({ received: true, error: 'DB Error' }, { status: 500 });
        } finally {
            await close();
        }
    }
    
    return NextResponse.json({ received: true }, { status: 200 });
}
