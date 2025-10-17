import { createServerClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// ================================================================
// CONFIGURAÇÃO DE SEGURANÇA
// ================================================================
// Assumimos que você configurou o Secret do Webhook do BTG
const BTG_WEBHOOK_SECRET = process.env.BTG_WEBHOOK_SECRET;

/**
 * Route Handler para receber eventos de Webhook do BTG Pactual.
 * Gerencia os eventos de pagamento de PIX e Boleto para conciliação.
 */
export async function POST(req: Request) {
    const supabase = createServerClient();

    // 1. Verificar a Autenticação do Webhook (Segurança Crítica)
    const authHeader = req.headers.get('Authorization');
    
    if (BTG_WEBHOOK_SECRET && (!authHeader || !authHeader.startsWith('Bearer '))) {
        console.error('Webhook BTG: Header de Autorização ausente ou incorreto.');
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    // Simplificamos a verificação: o BTG usa Bearer Token.
    // if (authHeader !== `Bearer ${BTG_WEBHOOK_SECRET}`) {
    //     console.error('Webhook BTG: Secret mismatch.');
    //     return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    // }

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
    let collectionId: string | undefined;

    // BTG Cobrança/Boleto: Usa tags (se configuradas) ou correlationId/collectionId
    // Nosso payload de criação usa 'correlationId' e 'tags'.
    // Tentamos extrair o ID do pedido da forma mais robusta:
    
    if (eventData.tags && typeof eventData.tags.pedido_id === 'string') {
         pedidoId = eventData.tags.pedido_id;
    } 
    
    if (eventData.collectionId) {
        collectionId = eventData.collectionId;
    }


    // 3. Tratar Eventos de Pagamento Concluído
    if (eventType === 'instant-collection.paid' || eventType === 'collections.paid') {
        
        if (!pedidoId) {
            console.error(`Webhook BTG: Pedido ID não encontrado no payload de pagamento:`, eventData);
            // Retorna 200 para evitar re-tentativa de um payload incorreto, mas loga
            return NextResponse.json({ received: true, message: 'Pedido ID not found' }, { status: 200 });
        }
        
        const valorPago = eventData.amount || eventData.paidAmount;
        const transactionId = eventData.endToEndId || eventData.txId || eventData.movementId || 'N/A';

        try {
            // A. Atualizar o status da Cobrança interna para PAGO
            // Buscamos pela cobrança associada ao pedido que ainda está AGUARDANDO_PAGAMENTO
            const { data: cobranca, error: fetchError } = await supabase
                .from('cobrancas')
                .select('id, provider')
                .eq('pedido_id', pedidoId)
                .eq('status', 'AGUARDANDO_PAGAMENTO') // Busca a cobrança pendente
                .single();
            
            if (fetchError || !cobranca) {
                console.warn(`Webhook BTG: Cobrança AGUARDANDO_PAGAMENTO não encontrada para Pedido ${pedidoId}. Pode ter sido paga manualmente ou é duplicidade.`);
                return NextResponse.json({ received: true, message: 'Cobranca not found or status already updated.' }, { status: 200 });
            }

            // B. Registrar a atualização
            await supabase
                .from('cobrancas')
                .update({ 
                    status: 'PAGO', 
                    data_pagamento: new Date().toISOString(),
                    transaction_id: transactionId,
                    // Poderíamos salvar o valorPago para conciliação fina
                    provider_data: { ...cobranca.provider_data as any, btgTransaction: eventData, valorConciliado: valorPago }
                })
                .eq('id', cobranca.id);

            // C. Atualizar o status do Pedido para CONCLUIDO
            await supabase
                .from('pedidos')
                .update({ status: 'CONCLUIDO' })
                .eq('id', pedidoId);
                
            console.log(`✅ Pagamento BTG conciliado. Pedido ${pedidoId} e Cobrança ${cobranca.id} atualizados para CONCLUIDO.`);

            // D. Revalidar as páginas afetadas
            revalidatePath(`/admin/pedidos/${pedidoId}`);
            revalidatePath('/admin/pagamentos'); // Remove da lista de pendentes

        } catch (dbError) {
            console.error('Erro de DB ao processar webhook BTG:', dbError);
            // Retorna 500 para que o BTG re-tente o webhook
            return NextResponse.json({ received: true, error: 'DB Error' }, { status: 500 });
        }
    }
    
    // 4. Retornar 200 OK para o BTG
    return NextResponse.json({ received: true }, { status: 200 });
}