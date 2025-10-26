'use client';

import React, { useState, useTransition } from 'react';
import { PedidoComRelacionamentos } from "@/app/(protected)/pedidos/[id]/page";
import { updatePedido } from "@/app/(protected)/pedidos/pedidos-actions";
import { useRouter } from 'next/navigation';

// Assumindo componentes da sua biblioteca de UI/Tailwind
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import { useToast } from "@ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";

interface EditPedidoFormProps {
  initialPedido: PedidoComRelacionamentos;
}

// Lista de status disponíveis para edição
const PEDIDO_STATUS = [
  { value: 'EM_PROCESSAMENTO', label: 'Em Processamento' },
  { value: 'AGUARDANDO_PAGAMENTO', label: 'Aguardando Pagamento' },
  { value: 'CONCLUIDO', label: 'Concluído' },
  { value: 'CANCELADO', label: 'Cancelado' },
];

export default function EditPedidoForm({ initialPedido }: EditPedidoFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Estado local para gerenciar os campos editáveis
  const [formData, setFormData] = useState({
    status: initialPedido.status,
    valor_total: initialPedido.valor_total || 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: id === 'valor_total' ? parseFloat(value) : value,
    }));
  };
  
  const handleSelectChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      status: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(async () => {
      const result = await updatePedido(initialPedido.id, formData);

      if (result.success) {
        toast({
          title: 'Sucesso!',
          description: result.message,
          variant: 'default',
        });
        // Após o sucesso, redireciona para a página de detalhes
        router.push(`/admin/pedidos/${initialPedido.id}`);
      } else {
        toast({
          title: 'Erro na Atualização',
          description: result.message,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>Dados Principais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Campo Status */}
                    <div className="space-y-2">
                        <Label htmlFor="status">Status do Pedido</Label>
                        <Select value={formData.status} onValueChange={handleSelectChange}>
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent>
                                {PEDIDO_STATUS.map(s => (
                                    <SelectItem key={s.value} value={s.value}>
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Campo Valor Total */}
                    <div className="space-y-2">
                        <Label htmlFor="valor_total">Valor Total</Label>
                        <Input
                            id="valor_total"
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            value={formData.valor_total}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Futuramente: Campos de Data de Vencimento, Notas, etc. */}
            </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isPending}>
                {isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
        </div>
    </form>
  );
}