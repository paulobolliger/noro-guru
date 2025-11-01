'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/toast';
import { Loader2 } from 'lucide-react';

interface DuplicataReceberFormModalProps {
  open: boolean;
  onClose: () => void;
  duplicata?: any;
  categorias: any[];
  onSuccess: () => void;
  tenantId: string;
}

export function DuplicataReceberFormModal({
  open,
  onClose,
  duplicata,
  categorias,
  onSuccess,
  tenantId,
}: DuplicataReceberFormModalProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    numero_documento: '',
    descricao: '',
    cliente_id: '',
    valor_total: '',
    data_emissao: '',
    data_vencimento: '',
    marca: 'Atlantica',
    moeda: 'BRL',
    taxa_conversao: '1',
    categoria_id: '',
    reserva_id: '',
    observacoes: '',
  });

  useEffect(() => {
    if (duplicata) {
      setFormData({
        numero_documento: duplicata.numero_documento || '',
        descricao: duplicata.descricao || '',
        cliente_id: duplicata.cliente_id || '',
        valor_total: duplicata.valor_total?.toString() || '',
        data_emissao: duplicata.data_emissao || '',
        data_vencimento: duplicata.data_vencimento || '',
        marca: duplicata.marca || 'Atlantica',
        moeda: duplicata.moeda || 'BRL',
        taxa_conversao: duplicata.taxa_conversao?.toString() || '1',
        categoria_id: duplicata.categoria_id || '',
        reserva_id: duplicata.reserva_id || '',
        observacoes: duplicata.observacoes || '',
      });
    } else {
      // Data padrão: hoje
      const hoje = new Date().toISOString().split('T')[0];
      setFormData((prev) => ({
        ...prev,
        data_emissao: hoje,
        data_vencimento: hoje,
      }));
    }
  }, [duplicata]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações
    if (!formData.descricao) {
      showToast({
        title: 'Erro',
        description: 'Descrição é obrigatória',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.valor_total || parseFloat(formData.valor_total) <= 0) {
      showToast({
        title: 'Erro',
        description: 'Valor total deve ser maior que zero',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.data_vencimento) {
      showToast({
        title: 'Erro',
        description: 'Data de vencimento é obrigatória',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    
    try {
      const url = duplicata
        ? `/api/duplicatas-receber/${duplicata.id}`
        : '/api/duplicatas-receber';
      
      const method = duplicata ? 'PUT' : 'POST';
      
      const payload = {
        ...formData,
        valor_total: parseFloat(formData.valor_total),
        taxa_conversao: parseFloat(formData.taxa_conversao),
        cliente_id: formData.cliente_id || null,
        categoria_id: formData.categoria_id || null,
        reserva_id: formData.reserva_id || null,
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

      showToast({
        title: 'Sucesso',
        description: duplicata
          ? 'Duplicata atualizada com sucesso'
          : 'Duplicata criada com sucesso',
        variant: 'success',
      });

      onSuccess();
    } catch (error: any) {
      console.error('Erro ao salvar:', error);
      showToast({
        title: 'Erro',
        description: error.message || 'Erro ao salvar duplicata',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const marcas = ['Atlantica', 'RateHawk', 'Hurb', 'MaxMilhas'];
  const moedas = ['BRL', 'USD', 'EUR', 'GBP'];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {duplicata ? 'Editar Duplicata' : 'Nova Duplicata a Receber'}
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
            <Textarea
              id="observacoes"
              value={formData.observacoes}
              onChange={(e) =>
                setFormData({ ...formData, observacoes: e.target.value })
              }
              placeholder="Informações adicionais..."
              rows={3}
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
