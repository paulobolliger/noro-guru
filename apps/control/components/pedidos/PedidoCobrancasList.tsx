'use client';

import React from 'react';
import { format } from 'date-fns';
import { currencyFormat } from '@/utils/currency-format'; // Assumindo este utilitário
import { Database } from "@noro-types/supabase";
import { NBadge, NButton } from "@/components/ui";
import { cobrancaStatusText } from "@ui/status";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Copy, LinkIcon, AlertTriangle, CheckCircle } from 'lucide-react';
import { useToast } from "@ui/use-toast";

// Tipo da tabela 'cobrancas'
type Cobranca = Database['public']['Tables']['cobrancas']['Row'];

interface PedidoCobrancasListProps {
  cobrancas: Cobranca[];
}

// Mapeamento de status centralizado
const statusMap: Record<string, string> = new Proxy({}, {
  get: (_t, key: string) => (cobrancaStatusText as any)[key] || 'text-slate-300'
}) as any;

export default function PedidoCobrancasList({ cobrancas }: PedidoCobrancasListProps) {
    const { toast } = useToast();

    if (cobrancas.length === 0) {
        return (
            <div className="p-4 border border-dashed border-white/10 rounded-lg text-center text-muted">
                <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
                <p>Nenhuma cobrança emitida para este pedido. Utilize o formulário acima para gerar a primeira fatura.</p>
            </div>
        );
    }
    
    // Extrai o link de pagamento ou linha digitável do provider_data
    const getPaymentDetail = (cobranca: Cobranca) => {
        const data = cobranca.provider_data as any;
        if (!data) return { link: null, detail: null, isCopiable: false };

        if (data.checkoutUrl) { // Stripe e Link de Pagamento BTG/Cielo (se implementado)
            return { link: data.checkoutUrl, detail: 'Link de Checkout', isCopiable: true };
        }
        if (data.digitableLine) { // BTG Boleto
             return { link: null, detail: data.digitableLine, isCopiable: true };
        }
        if (data.emv) { // BTG PIX
            return { link: null, detail: 'PIX Copia e Cola', isCopiable: true };
        }
        return { link: null, detail: cobranca.transaction_id || 'N/A', isCopiable: false };
    };

    const handleCopy = (text: string, provider: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copiado!',
            description: `${provider} copiado para a área de transferência.`,
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Histórico de Cobranças</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/5">
                        <thead className="bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent border-b border-default border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/20">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">ID Interno</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Provedor</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-muted uppercase tracking-wider">Valor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Vencimento</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Detalhe de Pagamento</th>
                            </tr>
                        </thead>
                        <tbody className="bg-[#0B1220] divide-y divide-white/5">
                            {cobrancas.map((cobranca) => {
                                const { link, detail, isCopiable } = getPaymentDetail(cobranca);
                                const isPaid = cobranca.status === 'PAGO';

                                return (
                                    <tr key={cobranca.id} className="hover:bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent border-b border-default border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/20 transition duration-150 ease-in-out">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary">
                                            {cobranca.id.slice(0, 8)}...
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                                            {cobranca.provider}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-primary">
                                            {currencyFormat(cobranca.valor || 0)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <NBadge variant={
                                              cobranca.status === 'PAGO' ? 'success' :
                                              cobranca.status === 'AGUARDANDO_PAGAMENTO' ? 'warning' :
                                              cobranca.status === 'ERRO_API' ? 'error' : 'info'
                                            }>
                                                {isPaid && <CheckCircle className="h-3 w-3 mr-1" />}
                                                {cobranca.status.replace(/_/g, ' ')}
                                            </NBadge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                                            {format(new Date(cobranca.data_vencimento), 'dd/MM/yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-mono text-xs text-slate-300">{detail}</span>
                                                
                                                {link && (
                                                    <a href={link} target="_blank" rel="noopener noreferrer">
                                                        <NButton variant="tertiary" size="sm" className="p-1 h-auto" leftIcon={<LinkIcon className="h-4 w-4" />} />
                                                    </a>
                                                )}

                                                {isCopiable && detail && (
                                                     <NButton 
                                                        variant="tertiary" 
                                                        size="sm" 
                                                        className="p-1 h-auto"
                                                        onClick={() => handleCopy(link || detail, cobranca.provider)}
                                                        leftIcon={<Copy className="h-4 w-4" />}
                                                     />
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    );
}
