'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { emitirCobranca, PaymentProvider } from "@/app/(protected)/pedidos/pedidos-actions";
import { currencyFormat } from '@/utils/currency-format';
import { useToast } from "@ui/use-toast";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Loader2, DollarSign, Copy, LinkIcon, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Database } from "@types/supabase";
import { format } from 'date-fns';

// Tipo da tabela 'cobrancas'
type Cobranca = Database['public']['Tables']['cobrancas']['Row'];

interface EmitirCobrancaFormProps {
  pedidoId: string;
  valorTotal: number;
  cobrancasExistentes: Cobranca[]; // NOVO: Passamos as cobranças existentes
}

const PAYMENT_PROVIDERS: { value: PaymentProvider, label: string }[] = [
  { value: 'STRIPE', label: 'Stripe (Cartão/Link de Pagamento)' },
  { value: 'CIELO', label: 'Cielo (Transação Direta - Cartão)' }, // Mantido como Transação Direta
  { value: 'BTG', label: 'BTG Pactual (PIX/Boleto)' },
];

// Mapeamento de status para cores (para uso na seção de Ações Ativas)
const statusMap: Record<string, string> = {
  'PENDENTE': 'bg-gray-100 text-gray-700',
  'EMITIDA': 'bg-blue-100 text-blue-700',
  'AGUARDANDO_PAGAMENTO': 'bg-red-100 text-red-700 font-bold',
  'PROCESSANDO_API': 'bg-yellow-100 text-yellow-700',
  'PAGO': 'bg-green-100 text-green-700 font-bold',
  'ERRO_API': 'bg-pink-100 text-pink-700',
};

export default function EmitirCobrancaForm({ pedidoId, valorTotal, cobrancasExistentes }: EmitirCobrancaFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const today = new Date();
  const sevenDaysLater = new Date(today.setDate(today.getDate() + 7));
  const defaultDueDate = sevenDaysLater.toISOString().substring(0, 10); 

  const [formData, setFormData] = useState({
    provider: 'STRIPE' as PaymentProvider,
    data_vencimento: defaultDueDate,
  });
  
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  // Determina se já existe uma cobrança ativa (aguardando pagamento)
  const hasActiveCobranca = cobrancasExistentes.some(c => 
    c.status === 'EMITIDA' || 
    c.status === 'AGUARDANDO_PAGAMENTO' || 
    c.status === 'PROCESSANDO_API'
  );

  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      provider: value as PaymentProvider,
    }));
    setCheckoutUrl(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCheckoutUrl(null);

    const { provider, data_vencimento } = formData;
    
    startTransition(async () => {
      // Chama a Server Action com os dados do formulário
      const result = await emitirCobranca({ pedido_id: pedidoId, provider, data_vencimento });

      if (result.success) {
        toast({
          title: 'Cobrança Emitida!',
          description: result.message,
          variant: 'default',
        });
        
        // Captura o URL de checkout para exibição imediata (principalmente Stripe)
        if (result.data?.checkoutUrl) {
            setCheckoutUrl(result.data.checkoutUrl);
        }
        
        // Força a revalidação para atualizar o Card com a nova cobrança
        router.refresh(); 
        
      } else {
        toast({
          title: 'Erro na Emissão',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };
  
  /**
   * Analisa o provider_data para extrair o link, linha digitável ou código PIX.
   */
  const getPaymentDetail = (cobranca: Cobranca) => {
    const data = cobranca.provider_data as any;
    if (!data) return { link: null, detail: cobranca.transaction_id || 'N/A', isCopiable: false, copyValue: '' };

    // Ordem de prioridade para exibição/cópia
    if (data.checkoutUrl) { // Stripe e Link de Pagamento BTG/Cielo (se implementado)
        return { link: data.checkoutUrl, detail: 'Link de Checkout', isCopiable: true, copyValue: data.checkoutUrl };
    }
    if (data.digitableLine) { // BTG Boleto (Linha Digitável)
         return { link: null, detail: data.digitableLine, isCopiable: true, copyValue: data.digitableLine };
    }
    if (data.emv) { // BTG PIX Copia e Cola
        return { link: null, detail: 'PIX Copia e Cola', isCopiable: true, copyValue: data.emv };
    }
    return { link: null, detail: cobranca.transaction_id || 'N/A', isCopiable: false, copyValue: '' };
  };
  
  const handleCopy = (text: string, provider: string) => {
        navigator.clipboard.writeText(text);
        toast({
            title: 'Copiado!',
            description: `Detalhe de pagamento ${provider} copiado para a área de transferência.`,
        });
  };

  return (
    <Card className={`shadow-lg ${hasActiveCobranca ? 'border-yellow-500' : 'border-indigo-500'}`}>
      <CardHeader className={`${hasActiveCobranca ? 'bg-yellow-50' : 'bg-indigo-50'}`}>
        <CardTitle className="text-lg flex items-center text-indigo-700">
            <DollarSign className="w-5 h-5 mr-2" />
            {hasActiveCobranca ? 'Cobrança Pendente' : 'Emitir Nova Cobrança'}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        
        {/* Formulário de Emissão (Visível se não houver cobrança ativa) */}
        {!hasActiveCobranca && (
            <form onSubmit={handleSubmit} className="space-y-4 border-b pb-4 mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="provider">Provedor de Pagamento</Label>
                        <Select value={formData.provider} onValueChange={handleSelectChange} disabled={isPending}>
                            <SelectTrigger id="provider">
                                <SelectValue placeholder="Selecione o provedor" />
                            </SelectTrigger>
                            <SelectContent>
                                {PAYMENT_PROVIDERS.map(p => (
                                    <SelectItem key={p.value} value={p.value}>
                                        {p.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="data_vencimento">Data de Vencimento</Label>
                        <Input
                            id="data_vencimento"
                            type="date"
                            value={formData.data_vencimento}
                            onChange={handleNewItemChange}
                            required
                            disabled={isPending}
                        />
                    </div>
                </div>
                
                <div className="flex justify-between pt-2">
                    <p className="text-sm text-gray-500">Valor: <span className="font-semibold text-gray-800">{currencyFormat(valorTotal)}</span></p>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Emitir Cobrança'}
                    </Button>
                </div>
            </form>
        )}
        
        {/* Histórico/Ações de Cobrança (Visível sempre que houver cobranças ativas) */}
        {cobrancasExistentes.length > 0 && (
            <div className="space-y-4">
                <h4 className="font-semibold text-md border-b pb-2">Ações de Cobranças Ativas</h4>
                {cobrancasExistentes
                    // Filtra para mostrar apenas cobranças que o usuário pode interagir (reenviar/copiar)
                    .filter(c => c.status !== 'PAGO' && c.status !== 'CANCELADO' && c.status !== 'ERRO_API')
                    .map(cobranca => {
                        const { link, detail, isCopiable, copyValue } = getPaymentDetail(cobranca);
                        const isAguardando = cobranca.status === 'AGUARDANDO_PAGAMENTO';

                        return (
                            <div key={cobranca.id} className={`p-3 rounded-lg border flex items-center justify-between ${isAguardando ? 'border-red-300 bg-red-50' : 'border-blue-200 bg-blue-50'}`}>
                                <div>
                                    <p className="text-sm font-medium">
                                        <Badge className={statusMap[cobranca.status]}>{cobranca.status.replace(/_/g, ' ')}</Badge>
                                        <span className="ml-2 text-xs text-gray-700">via {cobranca.provider} ({format(new Date(cobranca.data_vencimento), 'dd/MM/yyyy')})</span>
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    {/* Botão de Link/Abertura */}
                                    {link && (
                                        <a href={link} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="sm" className="bg-white hover:bg-gray-100">
                                                <LinkIcon className="h-4 w-4 mr-2" /> Acessar Checkout
                                            </Button>
                                        </a>
                                    )}

                                    {/* Botão de Cópia (PIX/Linha Digitável) */}
                                    {isCopiable && copyValue && (
                                        <Button 
                                            variant="secondary" 
                                            size="sm"
                                            onClick={() => handleCopy(copyValue, cobranca.provider)}
                                        >
                                            <Copy className="h-4 w-4 mr-2" /> Copiar Detalhe
                                        </Button>
                                    )}
                                    {/* Futuro: Botão de Cancelamento da Cobrança */}
                                </div>
                            </div>
                        );
                    })
                }
                
                {/* Mensagem se todas as cobranças ativas foram removidas */}
                {cobrancasExistentes.length > 0 && cobrancasExistentes.filter(c => c.status !== 'PAGO' && c.status !== 'CANCELADO' && c.status !== 'ERRO_API').length === 0 && (
                    <div className="text-center text-sm text-gray-500 pt-4">
                        Todas as cobranças ativas foram removidas ou finalizadas. Você pode emitir uma nova.
                    </div>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}