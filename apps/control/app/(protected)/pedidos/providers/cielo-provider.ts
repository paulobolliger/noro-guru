import 'server-only';
import { ServerActionReturn } from '../pedidos-actions';
import { PedidoComRelacionamentos } from "@/app/(protected)/pedidos/[id]/page";
import axios, { AxiosRequestConfig } from 'axios'; // Usaremos Axios para requisições HTTP

// ================================================================
// CONFIGURAÇÕES
// ================================================================
const MERCHANT_ID = process.env.CIELO_MERCHANT_ID;
const MERCHANT_KEY = process.env.CIELO_MERCHANT_KEY;
// Usaremos a URL de produção. Para testes, mude para apisandbox.cieloecommerce.cielo.com.br
const CIELO_API_URL = 'https://api.cieloecommerce.cielo.com.br/1/sales/'; 

// Define a estrutura do Header de Autenticação
const cieloHeaders: AxiosRequestConfig['headers'] = {
    'Content-Type': 'application/json',
    'MerchantId': MERCHANT_ID, // Credencial da loja
    'MerchantKey': MERCHANT_KEY, // Chave de autenticação dupla
};

interface CieloChargePayload {
    pedido: PedidoComRelacionamentos;
    cartaoToken: string; // Futuro: Token do cartão (ou dados diretos se permitido/necessário)
    parcelas: number;
}

/**
 * Cria uma transação na API da Cielo para cartão de crédito.
 * @param payload Dados necessários para iniciar a transação.
 * @returns ServerActionReturn com dados da transação ou erro.
 */
export async function createCieloCharge(payload: CieloChargePayload): Promise<ServerActionReturn> {
    const { pedido, cartaoToken, parcelas } = payload;
    
    if (!MERCHANT_ID || !MERCHANT_KEY) {
        return { success: false, message: 'Credenciais da Cielo ausentes.' };
    }
    
    if (!pedido.valor_total || pedido.valor_total <= 0) {
        return { success: false, message: 'Valor do pedido inválido.' };
    }

    // Valor total em centavos (Cielo espera int32)
    const valorEmCentavos = Math.round(pedido.valor_total * 100); 

    // O MerchantOrderId deve ser alfanumérico e ter no máximo 50 caracteres
    const merchantOrderId = pedido.id.replace(/-/g, '').slice(0, 50);

    // Estrutura do payload da requisição POST /1/sales
    const payloadCielo = {
        MerchantOrderId: merchantOrderId,
        Customer: {
            Name: pedido.clientes?.nome_completo || 'Cliente Vistos Guru',
            Email: pedido.clientes?.email,
            // Outros campos do Customer (Endereço, etc.)
        },
        Payment: {
            Type: 'CreditCard',
            Amount: valorEmCentavos, // Valor em centavos
            Installments: parcelas, // Número de parcelas
            CreditCard: {
                // Aqui entrariam os dados do cartão (número, validade, CVV) 
                // ou um Token, que é a melhor prática.
                CardToken: cartaoToken, // Assumindo que o cartão foi tokenizado
                Brand: 'Visa', // Precisa ser dinâmico!
            },
            Capture: true, // Captura automática
        }
    };

    try {
        const response = await axios.post(CIELO_API_URL, payloadCielo, { headers: cieloHeaders });

        const data = response.data;

        if (response.status === 201 && data.Payment?.Status === 2) { // Status 2 = Autorizada
            return {
                success: true,
                message: `Transação Cielo Autorizada! PaymentId: ${data.Payment.PaymentId}`,
                data: {
                    paymentId: data.Payment.PaymentId,
                    tid: data.Payment.Tid,
                    status: data.Payment.Status,
                },
            };
        }
        
        // Trata a autorização negada ou outro status não-201
        const returnMessage = data.Payment?.ReturnMessage || data.ReturnMessage || 'Transação negada ou status inesperado.';

        return {
            success: false,
            message: `Cielo: ${returnMessage} (Status: ${data.Payment?.Status || response.status})`,
            data: data,
        };


    } catch (error: any) {
        // Erro de comunicação HTTP ou 400/500 da Cielo
        const errorResponse = error.response?.data || error.message;
        console.error('Erro na API da Cielo:', errorResponse);

        return {
            success: false,
            message: `Falha na comunicação com a Cielo: ${errorResponse[0]?.Code} - ${errorResponse[0]?.Message || error.message}`,
            data: errorResponse,
        };
    }
}