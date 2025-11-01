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
import { Loader2, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DuplicataPagarFormModalProps {
  open: boolean;
  onClose: () => void;
  duplicata?: any;
  adiantamentos: any[];
  categorias: any[];
  onSuccess: () => void;
  tenantId: string;
}

export function DuplicataPagarFormModal({
  open,
  onClose,
  duplicata,
  adiantamentos,
  categorias,
  onSuccess,
  tenantId,
}: DuplicataPagarFormModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    numero_documento: '',
    descricao: '',
    fornecedor_id: '',
    valor_total: '',
    data_emissao: '',
    data_vencimento: '',
    marca: 'Atlantica',
    moeda: 'BRL',
    taxa_conversao: '1',
    categoria_id: '',
    reserva_id: '',
    adiantamento_id: '',
    observacoes: '',
  });

  const [adiantamentoSelecionado, setAdiantamentoSelecionado] = useState<any>(null);

  useEffect(() => {
    if (duplicata) {
      setFormData({
        numero_documento: duplicata.numero_documento || '',
        descricao: duplicata.descricao || '',
        fornecedor_id: duplicata.fornecedor_id || '',
        valor_total: duplicata.valor_total?.toString() || '',
        data_emissao: duplicata.data_emissao || '',
        data_vencimento: duplicata.data_vencimento || '',
        marca: duplicata.marca || 'Atlantica',
        moeda: duplicata.moeda || 'BRL',
        taxa_conversao: duplicata.taxa_conversao?.toString() || '1',
        categoria_id: duplicata.categoria_id || '',
        reserva_id: duplicata.reserva_id || '',
        adiantamento_id: duplicata.adiantamento_id || '',
        observacoes: duplicata.observacoes || '',
      });
    } else {
      const hoje = new Date().toISOString().split('T')[0];
      setFormData((prev) => ({
        ...prev,
        data_emissao: hoje,
        data_vencimento: hoje,
      }));
    }
  }, [duplicata]);

  useEffect(() => {
    if (formData.adiantamento_id) {
      const adiantamento = adiantamentos.find(a => a.id === formData.adiantamento_id);
      setAdiantamentoSelecionado(adiantamento || null);
    } else {
      setAdiantamentoSelecionado(null);
    }
  }, [formData.adiantamento_id, adiantamentos]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.descricao) {
      showToast('error', 'Descrição é obrigatória');
      return;
    }

    if (!formData.fornecedor_id) {
      showToast('error', 'Fornecedor é obrigatório');
      return;
    }

    if (!formData.valor_total || parseFloat(formData.valor_total) <= 0) {
      showToast('error', 'Valor total deve ser maior que zero');
      return;
    }

    if (!formData.data_vencimento) {
      showToast('error', 'Data de vencimento é obrigatória');
      return;
    }

    setLoading(true);
    
    try {
      const url = duplicata
        ? `/api/duplicatas-pagar/${duplicata.id}`
        : '/api/duplicatas-pagar';
      
      const method = duplicata ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        valor_total: parseFloat(formData.valor_total),
        taxa_conversao: parseFloat(formData.taxa_conversao),
        fornecedor_id: formData.fornecedor_id || null,
        categoria_id: formData.categoria_id || null,
        reserva_id: formData.reserva_id || null,
        adiantamento_id: formData.adiantamento_id || null,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Erro ao salvar duplicata');
      }

      showToast('success', duplicata
        ? 'Duplicata atualizada com sucesso'
        : 'Duplicata criada com sucesso');

      onSuccess();
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      showToast('error', error.message || 'Erro ao salvar duplicata');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const marcas = ['Atlantica', 'RateHawk', 'Hurb', 'MaxMilhas'];
  const moedas = ['BRL', 'USD', 'EUR', 'GBP'];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {duplicata ? 'Editar Duplicata' : 'Nova Duplicata a Pagar'}
          </DialogTitle>
          <DialogDescription>
            {duplicata
              ? 'Atualize as informações da duplicata'
              : 'Preencha as informações para criar uma nova duplicata'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="numero_documento">Número do Documento</Label>
              <Input
                id="numero_documento"
                value={formData.numero_documento}
                onChange={(e) =>
                  setFormData({ ...formData, numero_documento: e.target.value })
                }
                placeholder="Ex: NF-001"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marca">Marca *</Label>
              <Select
                value={formData.marca}
                onValueChange={(value) => setFormData({ ...formData, marca: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {marcas.map((marca) => (
                    <SelectItem key={marca} value={marca}>
                      {marca}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fornecedor_id">Fornecedor * (UUID)</Label>
            <Input
              id="fornecedor_id"
              value={formData.fornecedor_id}
              onChange={(e) =>
                setFormData({ ...formData, fornecedor_id: e.target.value })
              }
              placeholder="UUID do fornecedor"
              required
            />
            <p className="text-xs text-muted-foreground">
              Temporário: Insira o UUID do fornecedor. Em breve teremos um seletor.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição *</Label>
            <Input
              id="descricao"
              value={formData.descricao}
              onChange={(e) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              placeholder="Descrição da duplicata"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor_total">Valor Total *</Label>
              <Input
                id="valor_total"
                type="number"
                step="0.01"
                value={formData.valor_total}
                onChange={(e) =>
                  setFormData({ ...formData, valor_total: e.target.value })
                }
                placeholder="0.00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="moeda">Moeda</Label>
              <Select
                value={formData.moeda}
                onValueChange={(value) => setFormData({ ...formData, moeda: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {moedas.map((moeda) => (
                    <SelectItem key={moeda} value={moeda}>
                      {moeda}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxa_conversao">Taxa Conversão</Label>
              <Input
                id="taxa_conversao"
                type="number"
                step="0.0001"
                value={formData.taxa_conversao}
                onChange={(e) =>
                  setFormData({ ...formData, taxa_conversao: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_emissao">Data Emissão</Label>
              <Input
                id="data_emissao"
                type="date"
                value={formData.data_emissao}
                onChange={(e) =>
                  setFormData({ ...formData, data_emissao: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_vencimento">Data Vencimento *</Label>
              <Input
                id="data_vencimento"
                type="date"
                value={formData.data_vencimento}
                onChange={(e) =>
                  setFormData({ ...formData, data_vencimento: e.target.value })
                }
                required
              />
            </div>
          </div>

          {/* Seletor de Adiantamento */}
          <div className="space-y-2">
            <Label htmlFor="adiantamento_id">Vincular Adiantamento</Label>
            <Select
              value={formData.adiantamento_id}
              onValueChange={(value) =>
                setFormData({ ...formData, adiantamento_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione um adiantamento (opcional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Nenhum</SelectItem>
                {adiantamentos.map((adiant) => {
                  const saldo = adiant.valor_total - adiant.valor_utilizado;
                  return (
                    <SelectItem key={adiant.id} value={adiant.id}>
                      {adiant.descricao || 'Adiantamento'} - {adiant.marca} - Saldo: {formatCurrency(saldo)}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            
            {adiantamentoSelecionado && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Saldo disponível: <strong>{formatCurrency(adiantamentoSelecionado.valor_total - adiantamentoSelecionado.valor_utilizado)}</strong>
                  <br />
                  Ao criar esta duplicata, o valor será automaticamente deduzido do adiantamento.
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoria_id">Categoria</Label>
              <Select
                value={formData.categoria_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, categoria_id: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reserva_id">ID Reserva</Label>
              <Input
                id="reserva_id"
                value={formData.reserva_id}
                onChange={(e) =>
                  setFormData({ ...formData, reserva_id: e.target.value })
                }
                placeholder="UUID da reserva"
              />
            </div>
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

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {duplicata ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
