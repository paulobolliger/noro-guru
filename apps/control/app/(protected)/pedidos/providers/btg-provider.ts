import 'server-only';
import { ServerActionReturn } from '../pedidos-actions';
import axios, { AxiosRequestConfig } from 'axios';
import { PedidoComRelacionamentos } from "@/app/(protected)/pedidos/[id]/page";

// ================================================================
// CONFIGURAÇÕES E CREDENCIAIS
// ================================================================
const CLIENT_ID = process.env.BTG_CLIENT_ID;
const CLIENT_SECRET = process.env.BTG_CLIENT_SECRET;
const COMPANY_ID = process.env.BTG_COMPANY_ID; // CNPJ da empresa BTG (necessário na URL)

const BTG_AUTH_URL = 'https://auth.empresas.btgpactual.com/oauth/token'; 
const BTG_API_URL = 'https://api.empresas.btgpactual.com/'; 

let cachedToken: { accessToken: string; expiresAt: number } | null = null;

/**
 * Obtém ou renova o Access Token OAuth 2.0 do BTG via Client Credentials Grant.
 */
async function getBTGToken(): Promise<string | null> {
    // Renova 60s antes de expirar
    if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) { 
        return cachedToken.accessToken;
    }

    if (!CLIENT_ID || !CLIENT_SECRET) {
        console.error("BTG: Client ID ou Secret ausente.");
        return null;
    }

    try {
        const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

        const response = await axios.post(
            BTG_AUTH_URL,
            'grant_type=client_credentials&scope=brn:btg:empresas:banking:collections', // Escopo Collections é o mínimo para criar
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${authString}`,
                },
            }
        );

        const { access_token, expires_in } = response.data;
        const expirationTime = expires_in * 1000;

        cachedToken = {
            accessToken: access_token,
            expiresAt: Date.now() + expirationTime,
        };

        return access_token;
    } catch (error: any) {
        console.error('Erro ao obter token do BTG:', error.response?.data || error.message);
        return null;
    }
}

// ================================================================
// CRIAÇÃO DE COBRANÇA (BOLEPIX)
// ================================================================

interface BTGChargePayload {
    pedido: PedidoComRelacionamentos;
    cobrancaId: string;
    dataVencimento: string; // YYYY-MM-DD
}

/**
 * Emite uma cobrança Boleto Híbrido (Bolepix) via API do BTG.
 */
export async function createBTGCharge(payload: BTGChargePayload): Promise<ServerActionReturn> {
    const { pedido, cobrancaId, dataVencimento } = payload;
    
    const accessToken = await getBTGToken();
    if (!accessToken) {
        return { success: false, message: 'Falha na autenticação BTG. Não foi possível obter o token.' };
    }
    
    if (!COMPANY_ID) {
        return { success: false, message: 'BTG Company ID (CNPJ da empresa) ausente.' };
    }
    
    // Assumindo que o cliente tem os campos taxId e address
    const cliente = pedido.clientes;
    if (!cliente || !cliente.taxId || !cliente.nome_completo) {
        return { success: false, message: 'Dados de cliente (CPF/CNPJ, Nome) são obrigatórios para Boleto/PIX BTG.' };
    }
    
    // Valor total em centavos
    const valorEmCentavos = Math.round((pedido.valor_total || 0) * 100); 

    // O MerchantOrderId do pedido deve ser alfanumérico
    const correlationId = pedido.id.replace(/-/g, '').slice(0, 20); 

    const requestPayload = {
        amount: valorEmCentavos,
        dueDate: dataVencimento,
        type: "BANKSLIP_QRCODE", // Boleto Híbrido
        
        // Tags para conciliação via Webhook
        tags: {
            pedido_id: pedido.id,
            cobranca_id: cobrancaId,
            correlationId: correlationId,
        },
        
        // Dados do Pagador (Cliente)
        payer: {
            name: cliente.nome_completo,
            taxId: cliente.taxId,
            personType: cliente.taxId.length <= 11 ? 'F' : 'J', // Inferindo tipo de pessoa
            email: cliente.email,
            // O endereço é obrigatório para Boleto. Assumindo campos básicos no cliente
            address: { 
                zipCode: cliente.cep || '00000000',
                street: cliente.logradouro || 'Rua Desconhecida',
                number: cliente.numero || 'SN',
                neighborhood: cliente.bairro || 'Centro',
                city: cliente.cidade || 'São Paulo',
                state: cliente.estado || 'SP',
            }
        },
        
        // Dados do Beneficiário (Payee) - Deve vir das configurações do BTG
        payee: {
            taxId: COMPANY_ID,
            // Outros campos do beneficiário devem ser preenchidos corretamente
        },
        
        // Dados do Detalhe (Será populado pelo BTG)
        detail: {
            documentNumber: `PD${pedido.id.slice(0, 8)}`,
            correlationId: correlationId,
        }
    };
    
    const endpoint = `${BTG_API_URL}${COMPANY_ID}/banking/collections`;

    try {
        const response = await axios.post(
            endpoint, 
            requestPayload, 
            { 
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                    // Adicionar x-idempotency-key se o BTG exigir
                } 
            }
        );

        const data = response.data;

        if (response.status === 201 && data.status === 'CREATED') {
            return {
                success: true,
                message: `Boleto Híbrido (PIX/Boleto) BTG criado com sucesso!`,
                data: {
                    collectionId: data.collectionId,
                    linkUrl: data.detail?.digitableLine, // Linha digitável ou QR code para display
                    pdfUrl: data.linkUrl, // Se a API retornar um link para PDF
                    status: data.status,
                },
            };
        }
        
        // Tratamento de erros 400/422/500
        const errorMessage = data.errorMessage || data.detail || 'Erro desconhecido na API do BTG.';
        return {
            success: false,
            message: `BTG Falha na Criação: ${errorMessage}`,
            data: data,
        };

    } catch (error: any) {
        const errorData = error.response?.data || error.message;
        console.error('Erro na API BTG (Collections):', errorData);
        return {
            success: false,
            message: `Falha na comunicação BTG: ${errorData.errorMessage || errorData.message || 'Erro de rede/servidor.'}`,
            data: errorData,
        };
    }
}