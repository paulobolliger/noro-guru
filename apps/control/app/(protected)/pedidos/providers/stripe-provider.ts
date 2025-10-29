import 'server-only';
import Stripe from 'stripe';
import { ServerActionReturn } from '../pedidos-actions';
import { Database } from "@noro-types/supabase"; // Para tipagem dos itens

// A chave secreta deve vir do .env
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not defined in environment variables.');
}

// Inicializa o cliente Stripe para Node.js
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-06-20', // Use a versão mais recente ou a versão default da sua conta
});

// Tipo de item do pedido para o payload
type PedidoItem = Database['public']['Tables']['pedido_itens']['Row'];

interface StripeChargePayload {
    cobrancaId: string;
    pedidoId: string;
    clienteEmail: string;
    itens: PedidoItem[];
    successUrl: string; 
    cancelUrl: string;
}

/**
 * Converte os itens do pedido para o formato esperado pelo Stripe Line Items.
 * O valor deve ser em centavos.
 */
function mapToStripeLineItems(items: PedidoItem[]): Stripe.Checkout.SessionCreateParams.LineItem[] {
    return items.map(item => {
        if (!item.valor_unitario || !item.quantidade || !item.servico_nome) {
            throw new Error(`Item do pedido inválido: ${item.id}`);
        }

        // Stripe espera o valor em centavos
        const unitAmountCents = Math.round(item.valor_unitario * 100);

        return {
            price_data: {
                currency: 'brl',
                unit_amount: unitAmountCents,
                product_data: {
                    name: item.servico_nome,
                    // description: item.descricao // Se a tabela tiver descrição
                },
            },
            quantity: item.quantidade,
        };
    });
}


/**
 * Cria uma Stripe Checkout Session para o pedido.
 * @param payload Dados necessários para criar a sessão.
 * @returns ServerActionReturn com a URL de checkout ou erro.
 */
export async function createStripeCharge(payload: StripeChargePayload): Promise<ServerActionReturn> {
    const { cobrancaId, pedidoId, clienteEmail, itens, successUrl, cancelUrl } = payload;
    
    try {
        const lineItems = mapToStripeLineItems(itens);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card', 'pix'], // Aceita cartão e Pix (se configurado na sua conta)
            line_items: lineItems,
            mode: 'payment', // Modo de pagamento único
            customer_email: clienteEmail, // Pre-preenche o email do cliente
            
            // CRÍTICO: Usamos client_reference_id e metadata para rastreamento
            client_reference_id: pedidoId, // Referência visível no painel do Stripe
            metadata: {
                cobranca_id: cobrancaId,
                pedido_id: pedidoId,
            },

            // URLs de redirecionamento
            success_url: successUrl,
            cancel_url: cancelUrl,
        });

        if (!session.url) {
            return { success: false, message: 'Stripe não retornou um URL de checkout válido.' };
        }

        return {
            success: true,
            message: `Sessão de pagamento Stripe criada com sucesso!`,
            data: { 
                sessionId: session.id, 
                checkoutUrl: session.url 
            },
        };

    } catch (error) {
        // O erro do Stripe pode ser um objeto complexo, logamos para debug
        console.error('Erro na API do Stripe ao criar sessão:', error);
        return {
            success: false,
            message: 'Falha na comunicação com a API do Stripe. Verifique as chaves e a estrutura dos dados.',
        };
    }
}
