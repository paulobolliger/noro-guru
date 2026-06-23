import 'server-only';
import { ServerActionReturn } from '../pedidos-actions';
import { asaasProvider } from '@noro/lib/providers/asaas-provider';
import type { PedidoComRelacionamentos } from "@noro/types/admin";

interface AsaasChargePayload {
    pedido: PedidoComRelacionamentos;
    cobrancaId: string;
    dataVencimento: string; // YYYY-MM-DD
}

/**
 * Emite uma cobrança via Asaas (PIX por padrão) no ambiente Sandbox/Produção.
 */
export async function createAsaasCharge(payload: AsaasChargePayload): Promise<ServerActionReturn> {
    const { pedido, cobrancaId, dataVencimento } = payload;
    
    try {
        const cliente = pedido.clientes;
        if (!cliente || !cliente.taxId || !cliente.nome_completo) {
            return { 
                success: false, 
                message: 'Dados de cliente (CPF/CNPJ, Nome) são obrigatórios para cobrança Asaas.' 
            };
        }

        // Limpa CPF/CNPJ para validação do Asaas
        const cleanCpfCnpj = cliente.taxId.replace(/\D/g, '');

        console.log(`[Asaas] Criando/Buscando cliente no gateway para email: ${cliente.email}...`);
        const customer = await asaasProvider.createCustomer({
            name: cliente.nome_completo,
            email: cliente.email || '',
            cpfCnpj: cleanCpfCnpj,
            phone: cliente.telefone || undefined
        });

        if (!customer.providerCustomerId) {
            return {
                success: false,
                message: 'Não foi possível obter o ID do cliente no Asaas.'
            };
        }

        // Valor total em centavos
        const amountCents = Math.round((pedido.valor_total || 0) * 100);
        if (amountCents <= 0) {
            return {
                success: false,
                message: 'O valor do pedido deve ser maior que zero.'
            };
        }

        console.log(`[Asaas] Emitindo cobrança de ${pedido.valor_total} via PIX...`);
        const charge = await asaasProvider.createCharge({
            providerCustomerId: customer.providerCustomerId,
            amountCents,
            billingType: 'PIX', // Default to PIX for the instant checkout flow
            dueDate: dataVencimento,
            description: `Pedido #${pedido.id.slice(0, 8)} - NORO`,
            externalReference: cobrancaId
        });

        return {
            success: true,
            message: 'Cobrança Asaas emitida com sucesso!',
            data: {
                collectionId: charge.providerPaymentId,
                checkoutUrl: charge.invoiceUrl, // Usar invoiceUrl como checkoutUrl
                bankSlipUrl: charge.bankSlipUrl,
                pixCopyPaste: charge.pixCopyPaste,
                status: charge.status,
                raw: charge.raw
            }
        };

    } catch (error: any) {
        console.error('[Asaas] Erro ao criar cobrança:', error);
        return {
            success: false,
            message: `Erro na API do Asaas: ${error.message || error}`
        };
    }
}
