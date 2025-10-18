// app/api/webhooks/stripe/route.ts
import { createServerSupabaseClient } from '@/lib/supabase/server'; // CORRIGIDO
import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import Stripe from 'stripe';

// ================================================================
// CONFIGURAÇÃO DE SEGURANÇA
// As variáveis de ambiente devem ser configuradas para o ambiente LIVE
// ================================================================
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables.');
}
if (!process.env.STRIPE_WEBHOOK_SECRET) {
    // Usaremos a variável que você configurará com um dos valores 'whsec_...'
    throw new Error('STRIPE_WEBHOOK_SECRET is not defined in environment variables.');
}

// Inicializa o cliente Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20',
});

/**
 * Route Handler para receber eventos de Webhook do Stripe.
 * Gerencia o evento de pagamento concluído para atualizar o status do Pedido.
 */
export async function POST(req: Request) {
    const supabase = createServerClient();
    let event: Stripe.Event;

    // 1. Verificar a Assinatura do Webhook (Segurança Crítica)
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('stripe-signature');
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
        
        if (!signature) {
            console.error('Webhook: Stripe-Signature header ausente.');
            return NextResponse.json({ received: false, error: 'Signature required' }, { status: 400 });
        }

        event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            webhookSecret
        );
        
    } catch (err: any) {
        // Se a assinatura falhar, retorna 400
        console.log(`⚠️ Webhook signature verification failed: ${err.message}`);
        return NextResponse.json({ received: false, error: err.message }, { status: 400 });
    }
    
    // 2. Tratar o Evento de Pagamento Bem-sucedido
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const pedidoId = session.client_reference_id;
        const cobrancaId = session.metadata?.cobranca_id;
        const paymentIntentId = session.payment_intent as string; // ID da transação no Stripe

        if (!pedidoId || !cobrancaId || !paymentIntentId) {
            console.error(`Webhook: IDs customizados ou Payment Intent ausentes na sessão ${session.id}.`);
            // Retorna 200 para não re-tentar, mas loga o erro
            return NextResponse.json({ received: true, message: 'IDs customizados ausentes.' }, { status: 200 }); 
        }
        
        try {
            // 3. Atualizar o status da Cobrança para PAGO
            await supabase
                .from('cobrancas')
                .update({ 
                    status: 'PAGO', 
                    data_pagamento: new Date().toISOString(),
                    transaction_id: paymentIntentId,
                    // Salvar URL do recibo se disponível, ou outros dados
                    provider_data: { sessionId: session.id, receiptUrl: session.url } 
                })
                .eq('id', cobrancaId);

            // 4. Atualizar o status do Pedido para CONCLUIDO
            await supabase
                .from('pedidos')
                .update({ status: 'CONCLUIDO' })
                .eq('id', pedidoId);
                
            console.log(`✅ Pagamento Stripe concluído. Pedido ${pedidoId} e Cobrança ${cobrancaId} atualizados.`);

            // 5. Revalidar as páginas afetadas
            revalidatePath(`/admin/pedidos/${pedidoId}`);
            revalidatePath('/admin/pagamentos');

        } catch (dbError) {
            console.error('Erro de Banco de Dados ao processar webhook:', dbError);
            // Retorna 500 para que o Stripe re-tente o webhook mais tarde
            return NextResponse.json({ received: true, error: 'Erro de DB interno.' }, { status: 500 });
        }
    } else {
        // Loga outros eventos que podem ser úteis, mas não afetam o status
        console.log(`Evento Stripe recebido (Tipo: ${event.type})`);
    }
    
    // Retornar 200 OK para o Stripe (mesmo se o evento não for o 'completed'), 
    // indicando que o evento foi recebido com sucesso.
    return NextResponse.json({ received: true }, { status: 200 });
}