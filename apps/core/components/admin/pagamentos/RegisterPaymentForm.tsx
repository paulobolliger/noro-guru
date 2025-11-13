'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { registerPayment } from '@/app/pedidos/pedidos-actions'; // Server Action
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, DollarSign } from 'lucide-react';

interface RegisterPaymentFormProps {
  pedidoId: string;
  valorTotal: number;
}

const FORMAS_PAGAMENTO = [
  'Cartão de Crédito',
  'Pix',
  'Boleto Bancário',
  'Transferência',
  'Cash/Outro',
];

export default function RegisterPaymentForm({ pedidoId, valorTotal }: RegisterPaymentFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
    valor_pago: valorTotal,
    forma_pagamento: FORMAS_PAGAMENTO[0],
    data_pagamento: new Date().toISOString().substring(0, 10), // yyyy-MM-dd
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'valor_pago' ? parseFloat(value) : value,
    }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      forma_pagamento: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.valor_pago <= 0) {
        toast({ title: 'Erro', description: 'O valor pago deve ser maior que zero.', variant: 'destructive' });
        return;
    }
    
    // Simplificamos o payload para o que a Server Action espera
    const payload = {
        valor_pago: formData.valor_pago,
        forma_pagamento: formData.forma_pagamento,
        data_pagamento: formData.data_pagamento,
    };

    startTransition(async () => {
      const result = await registerPayment(pedidoId, payload);

      if (result.success) {
        toast({
          title: 'Pagamento Registrado!',
          description: result.message,
          variant: 'default',
        });
        // Força a revalidação/re-busca de dados no componente pai
        router.refresh(); 
      } else {
        toast({
          title: 'Erro no Pagamento',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Card className="border-green-500 shadow-lg">
      <CardHeader className="bg-green-50">
        <CardTitle className="text-lg flex items-center text-green-700">
            <DollarSign className="w-5 h-5 mr-2" />
            Registrar Pagamento
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Campo Valor Pago */}
                <div className="space-y-2">
                    <Label htmlFor="valor_pago">Valor Pago</Label>
                    <Input
                        id="valor_pago"
                        type="number"
                        step="0.01"
                        placeholder={formatCurrency(valorTotal)}
                        value={formData.valor_pago}
                        onChange={handleChange}
                        required
                        className="font-semibold text-lg"
                    />
                </div>

                {/* Campo Forma de Pagamento */}
                <div className="space-y-2">
                    <Label htmlFor="forma_pagamento">Forma de Pagamento</Label>
                    <Select value={formData.forma_pagamento} onValueChange={handleSelectChange}>
                        <SelectTrigger id="forma_pagamento">
                            <SelectValue placeholder="Selecione a forma" />
                        </SelectTrigger>
                        <SelectContent>
                            {FORMAS_PAGAMENTO.map(forma => (
                                <SelectItem key={forma} value={forma}>
                                    {forma}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            
            {/* Campo Data do Pagamento */}
            <div className="space-y-2">
                <Label htmlFor="data_pagamento">Data do Pagamento</Label>
                <Input
                    id="data_pagamento"
                    type="date"
                    value={formData.data_pagamento}
                    onChange={handleChange}
                    required
                />
            </div>

            <div className="flex justify-end pt-2">
                <Button type="submit" disabled={isPending} className="bg-green-600 hover:bg-green-700">
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Confirmar Recebimento'}
                </Button>
            </div>
        </form>
      </CardContent>
    </Card>
  );
}