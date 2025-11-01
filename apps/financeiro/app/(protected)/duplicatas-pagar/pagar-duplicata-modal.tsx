'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/toast';
import { Loader2, DollarSign } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface PagarDuplicataModalProps {
  open: boolean;
  onClose: () => void;
  duplicata?: any;
  contas: any[];
  onSuccess: () => void;
}

export function PagarDuplicataModal({
  open,
  onClose,
  duplicata,
  contas,
  onSuccess,
}: PagarDuplicataModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    valor_pago: '',
    data_pagamento: new Date().toISOString().split('T')[0],
    forma_pagamento_id: '',
    conta_bancaria_id: '',
    observacoes: '',
    criar_despesa: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!duplicata) return;

    if (!formData.valor_pago || parseFloat(formData.valor_pago) <= 0) {
      showToast('error', 'Valor pago deve ser maior que zero');
      return;
    }

    if (parseFloat(formData.valor_pago) > duplicata.valor_pendente) {
      showToast('error', `Valor pago não pode ser maior que o pendente (${duplicata.valor_pendente})`);
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`/api/duplicatas-pagar/${duplicata.id}/pagar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valor_pago: parseFloat(formData.valor_pago),
          data_pagamento: formData.data_pagamento,
          forma_pagamento_id: formData.forma_pagamento_id || null,
          conta_bancaria_id: formData.conta_bancaria_id || null,
          observacoes: formData.observacoes || null,
          criar_despesa: formData.criar_despesa,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao registrar pagamento');
      }

      const result = await response.json();

      showToast('success', `Pagamento registrado com sucesso. ${result.despesa ? 'Despesa criada.' : ''}`);

      onSuccess();
    } catch (error: any) {
      console.error('Erro ao registrar pagamento:', error);
      showToast('error', error.message || 'Erro ao registrar pagamento');
    } finally {
      setLoading(false);
    }
  };

  if (!duplicata) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            Pagar Duplicata
          </DialogTitle>
          <DialogDescription>
            Registre o pagamento efetuado para esta duplicata
          </DialogDescription>
        </DialogHeader>

        {/* Info da Duplicata */}
        <Card>
          <CardContent className="pt-6 space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Documento:</span>
              <span className="font-medium">{duplicata.numero_documento || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Valor Total:</span>
              <span className="font-medium">{formatCurrency(duplicata.valor_total)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Já Pago:</span>
              <span className="font-medium text-green-600">
                {formatCurrency(duplicata.valor_pago || 0)}
              </span>
            </div>
            {duplicata.valor_credito_aplicado > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Crédito Aplicado:</span>
                <span className="font-medium text-blue-600">
                  {formatCurrency(duplicata.valor_credito_aplicado)}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm font-semibold">Valor Pendente:</span>
              <span className="font-bold text-lg text-yellow-600">
                {formatCurrency(duplicata.valor_pendente)}
              </span>
            </div>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="valor_pago">Valor Pago *</Label>
            <Input
              id="valor_pago"
              type="number"
              step="0.01"
              value={formData.valor_pago}
              onChange={(e) =>
                setFormData({ ...formData, valor_pago: e.target.value })
              }
              placeholder={`Máximo: ${duplicata.valor_pendente}`}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_pagamento">Data Pagamento *</Label>
            <Input
              id="data_pagamento"
              type="date"
              value={formData.data_pagamento}
              onChange={(e) =>
                setFormData({ ...formData, data_pagamento: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="conta_bancaria_id">Conta Bancária</Label>
            <Select
              value={formData.conta_bancaria_id}
              onValueChange={(value) =>
                setFormData({ ...formData, conta_bancaria_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma conta" />
              </SelectTrigger>
              <SelectContent>
                {contas.map((conta: any) => (
                  <SelectItem key={conta.id} value={conta.id}>
                    {conta.nome_banco} - {conta.agencia}/{conta.conta}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="observacoes">Observações</Label>
            <Input
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) =>
                setFormData({ ...formData, observacoes: e.target.value })
              }
              placeholder="Informações adicionais..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="criar_despesa"
              checked={formData.criar_despesa}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, criar_despesa: checked as boolean })
              }
            />
            <Label
              htmlFor="criar_despesa"
              className="text-sm font-normal cursor-pointer"
            >
              Criar despesa correspondente automaticamente
            </Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Registrar Pagamento
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
