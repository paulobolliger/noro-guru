'use client';

import React from 'react';
import { format } from 'date-fns';
import { currencyFormat } from '@/utils/currency-format'; // Assumindo este utilitário
import { Database } from "@types/supabase";
import { Badge } from "@ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Copy, LinkIcon, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from "@ui/button";
import { useToast } from "@ui/use-toast";

// Tipo da tabela 'cobrancas'
type Cobranca = Database['public']['Tables']['cobrancas']['Row'];

interface PedidoCobrancasListProps {
  cobrancas: Cobranca[];
}

// Mapeamento de status para cores
const statusMap: Record<string, string> = {
  'PENDENTE': 'bg-gray-100 text-gray-700',
  'EMITIDA': 'bg-blue-100 text-blue-700',
  'AGUARDANDO_PAGAMENTO': 'bg-red-100 text-red-700 font-bold',
  'PROCESSANDO_API': 'bg-yellow-100 text-yellow-700',
  'PAGO': 'bg-green-100 text-green-700 font-bold',
  'ERRO_API': 'bg-pink-100 text-pink-700',
};

export default function PedidoCobrancasList({ cobrancas }: PedidoCobrancasListProps) {
    const { toast } = useToast();

    if (cobrancas.length === 0) {
        return (
            <div className="p-4 border border-dashed border-gray-300 rounded-lg text-center text-gray-500">
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
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Interno</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provedor</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalhe de Pagamento</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {cobrancas.map((cobranca) => {
                                const { link, detail, isCopiable } = getPaymentDetail(cobranca);
                                const isPaid = cobranca.status === 'PAGO';

                                return (
                                    <tr key={cobranca.id} className="hover:bg-gray-50 transition duration-150 ease-in-out">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {cobranca.id.slice(0, 8)}...
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {cobranca.provider}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold text-gray-800">
                                            {currencyFormat(cobranca.valor || 0)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Badge className={statusMap[cobranca.status] || 'bg-gray-100 text-gray-800'}>
                                                {isPaid && <CheckCircle className="h-3 w-3 mr-1" />}
                                                {cobranca.status.replace(/_/g, ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {format(new Date(cobranca.data_vencimento), 'dd/MM/yyyy')}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-mono text-xs text-gray-700">{detail}</span>
                                                
                                                {link && (
                                                    <a href={link} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="ghost" size="sm" className="p-1 h-auto text-indigo-600 hover:bg-indigo-50">
                                                            <LinkIcon className="h-4 w-4" />
                                                        </Button>
                                                    </a>
                                                )}

                                                {isCopiable && detail && (
                                                     <Button 
                                                        variant="ghost" 
                                                        size="sm" 
                                                        className="p-1 h-auto text-gray-600 hover:bg-gray-100"
                                                        onClick={() => handleCopy(link || detail, cobranca.provider)}
                                                     >
                                                        <Copy className="h-4 w-4" />
                                                    </Button>
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