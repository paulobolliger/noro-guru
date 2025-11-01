'use client';

import { useState, useEffect } from 'react';
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
import { useToast } from '@/components/ui/toast';
import { Loader2, CreditCard, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

interface AplicarCreditoModalProps {
  open: boolean;
  onClose: () => void;
  duplicata?: any;
  creditos: any[];
  onSuccess: () => void;
}

export function AplicarCreditoModal({
  open,
  onClose,
  duplicata,
  creditos,
  onSuccess,
}: AplicarCreditoModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    credito_id: '',
    valor_aplicar: '',
    observacoes: '',
  });

  const [creditoSelecionado, setCreditoSelecionado] = useState<any>(null);
  const [creditosCompativeis, setCreditosCompativeis] = useState<any[]>([]);

  // Filtrar créditos compatíveis com a duplicata
  useEffect(() => {
    if (duplicata && creditos.length > 0) {
      const compativeis = creditos.filter(credito => {
        // Mesmo fornecedor
        if (credito.fornecedor_id !== duplicata.fornecedor_id) return false;
        
        // Mesma moeda
        if (credito.moeda !== duplicata.moeda) return false;
        
        // Status disponível
        if (credito.status !== 'disponivel') return false;
        
        // Tem saldo disponível
        const saldo = credito.valor_total - credito.valor_utilizado;
        if (saldo <= 0) return false;
        
        return true;
      });
      
      setCreditosCompativeis(compativeis);
    }
  }, [duplicata, creditos]);

  useEffect(() => {
    if (formData.credito_id) {
      const credito = creditos.find(c => c.id === formData.credito_id);
      setCreditoSelecionado(credito || null);
      
      // Auto-preencher com o valor pendente ou saldo do crédito (o menor)
      if (credito && duplicata) {
        const saldoCredito = credito.valor_total - credito.valor_utilizado;
        const valorSugerido = Math.min(saldoCredito, duplicata.valor_pendente);
        setFormData(prev => ({ ...prev, valor_aplicar: valorSugerido.toFixed(2) }));
      }
    } else {
      setCreditoSelecionado(null);
    }
  }, [formData.credito_id, creditos, duplicata]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!duplicata) return;

    if (!formData.credito_id) {
      showToast('error', 'Selecione um crédito');
      return;
    }

    if (!formData.valor_aplicar || parseFloat(formData.valor_aplicar) <= 0) {
      showToast('error', 'Valor a aplicar deve ser maior que zero');
      return;
    }

    const valorAplicar = parseFloat(formData.valor_aplicar);

    if (valorAplicar > duplicata.valor_pendente) {
      showToast('error', `Valor não pode ser maior que o pendente (${duplicata.valor_pendente})`);
      return;
    }

    if (creditoSelecionado) {
      const saldoCredito = creditoSelecionado.valor_total - creditoSelecionado.valor_utilizado;
      if (valorAplicar > saldoCredito) {
        showToast('error', `Valor não pode ser maior que o saldo do crédito (${saldoCredito.toFixed(2)})`);
        return;
      }
    }

    setLoading(true);
    
    try {
      const response = await fetch(`/api/duplicatas-pagar/${duplicata.id}/aplicar-credito`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credito_id: formData.credito_id,
          valor_aplicar: valorAplicar,
          observacoes: formData.observacoes || null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao aplicar crédito');
      }

      const result = await response.json();

      showToast('success', `Crédito aplicado com sucesso! Novo saldo: ${formatCurrency(result.novo_saldo_credito)}`);

      onSuccess();
    } catch (error: any) {
      console.error('Erro ao aplicar crédito:', error);
      showToast('error', error.message || 'Erro ao aplicar crédito');
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

  const getTipoCreditoBadge = (tipo: string) => {
    const config: Record<string, { label: string; variant: any }> = {
      refund: { label: 'Reembolso', variant: 'success' },
      overpayment: { label: 'Pagamento Excedente', variant: 'info' },
      promotional: { label: 'Promocional', variant: 'warning' },
      other: { label: 'Outro', variant: 'secondary' },
    };
    
    const { label, variant } = config[tipo] || config.other;
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-600" />
            Aplicar Crédito
          </DialogTitle>
          <DialogDescription>
            Use créditos disponíveis para abater o valor desta duplicata
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
              <span className="text-sm text-muted-foreground">Fornecedor:</span>
              <span className="font-medium">{duplicata.fornecedor_nome || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Moeda:</span>
              <span className="font-medium">{duplicata.moeda}</span>
            </div>
            <div className="flex justify-between pt-2 border-t">
              <span className="text-sm font-semibold">Valor Pendente:</span>
              <span className="font-bold text-lg text-yellow-600">
                {formatCurrency(duplicata.valor_pendente)}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Verificar se há créditos compatíveis */}
        {creditosCompativeis.length === 0 ? (
          <Alert variant="warning">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Nenhum crédito compatível encontrado. Os créditos devem ser do mesmo fornecedor, 
              mesma moeda e ter saldo disponível.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="credito_id">Selecionar Crédito *</Label>
              <Select
                value={formData.credito_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, credito_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um crédito" />
                </SelectTrigger>
                <SelectContent>
                  {creditosCompativeis.map((credito) => {
                    const saldo = credito.valor_total - credito.valor_utilizado;
                    return (
                      <SelectItem key={credito.id} value={credito.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{credito.motivo || credito.tipo_credito} - </span>
                          <span className="font-semibold ml-2">{formatCurrency(saldo)}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {/* Info do Crédito Selecionado */}
            {creditoSelecionado && (
              <Card className="border-blue-200 bg-blue-50">
                <CardContent className="pt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tipo:</span>
                    {getTipoCreditoBadge(creditoSelecionado.tipo_credito)}
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Valor Total:</span>
                    <span className="font-medium">{formatCurrency(creditoSelecionado.valor_total)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Já Utilizado:</span>
                    <span className="font-medium text-orange-600">
                      {formatCurrency(creditoSelecionado.valor_utilizado)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-blue-200">
                    <span className="text-sm font-semibold">Saldo Disponível:</span>
                    <span className="font-bold text-blue-600">
                      {formatCurrency(creditoSelecionado.valor_total - creditoSelecionado.valor_utilizado)}
                    </span>
                  </div>
                  {creditoSelecionado.data_validade && (
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Validade:</span>
                      <span>{new Date(creditoSelecionado.data_validade).toLocaleDateString('pt-BR')}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <Label htmlFor="valor_aplicar">Valor a Aplicar *</Label>
              <Input
                id="valor_aplicar"
                type="number"
                step="0.01"
                value={formData.valor_aplicar}
                onChange={(e) =>
                  setFormData({ ...formData, valor_aplicar: e.target.value })
                }
                placeholder="0.00"
                required
              />
              {creditoSelecionado && (
                <p className="text-xs text-muted-foreground">
                  Máximo: {formatCurrency(Math.min(
                    creditoSelecionado.valor_total - creditoSelecionado.valor_utilizado,
                    duplicata.valor_pendente
                  ))}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Input
                id="observacoes"
                value={formData.observacoes}
                onChange={(e) =>
                  setFormData({ ...formData, observacoes: e.target.value })
                }
                placeholder="Motivo da aplicação..."
              />
            </div>

            {formData.valor_aplicar && parseFloat(formData.valor_aplicar) > 0 && (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  Após aplicar {formatCurrency(parseFloat(formData.valor_aplicar))}, 
                  o valor pendente será de {formatCurrency(duplicata.valor_pendente - parseFloat(formData.valor_aplicar))}.
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Aplicar Crédito
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
