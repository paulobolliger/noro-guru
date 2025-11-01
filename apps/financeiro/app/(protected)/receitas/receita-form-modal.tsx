'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog-simple';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';

interface ReceitaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  receita?: any;
  categorias: any[];
  contas: any[];
  tenantId: string;
}

export function ReceitaFormModal({
  isOpen,
  onClose,
  receita,
  categorias,
  contas,
  tenantId,
}: ReceitaFormModalProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    descricao: receita?.descricao || '',
    marca: receita?.marca || 'noro',
    valor: receita?.valor || '',
    categoria_id: receita?.categoria_id || '',
    status: receita?.status || 'pendente',
    data_vencimento: receita?.data_vencimento || '',
    data_competencia: receita?.data_competencia || '',
    tipo_receita: receita?.tipo_receita || 'servico',
    conta_bancaria_id: receita?.conta_bancaria_id || '',
    forma_pagamento: receita?.forma_pagamento || 'pix',
    recorrente: receita?.recorrente || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const url = receita 
        ? `/api/receitas/${receita.id}` 
        : '/api/receitas';
      
      const method = receita ? 'PUT' : 'POST';

      // Preparar dados convertendo strings vazias em null para campos UUID
      const dadosParaEnviar = {
        ...formData,
        tenant_id: tenantId,
        valor: parseFloat(formData.valor),
        // Converter strings vazias para null (campos UUID não aceitam "")
        categoria_id: formData.categoria_id || null,
        conta_bancaria_id: formData.conta_bancaria_id || null,
      };

      console.log('📤 Enviando dados:', {
        url,
        method,
        data: dadosParaEnviar
      });

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaEnviar),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Sucesso:', data);
        showToast('success', `Receita ${receita ? 'atualizada' : 'criada'} com sucesso!`);
        router.refresh();
        onClose();
      } else {
        console.error('❌ Erro na resposta:', data);
        setError(data.error || 'Erro desconhecido ao salvar receita');
        showToast('error', 'Erro ao salvar', data.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('❌ Erro ao salvar receita:', error);
      setError('Erro ao conectar com o servidor');
      showToast('error', 'Erro ao salvar receita', 'Verifique o console para mais detalhes');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {receita ? 'Editar Receita' : 'Nova Receita'}
          </DialogTitle>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded p-3 text-sm text-red-800">
              ⚠️ {error}
            </div>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium mb-1">Descrição*</label>
            <Input
              required
              value={formData.descricao}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, descricao: e.target.value })
              }
              placeholder="Ex: Assinatura Mensal - Cliente X"
            />
          </div>

          {/* Marca e Valor */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Marca*</label>
              <Select
                value={formData.marca}
                onValueChange={(value) => setFormData({ ...formData, marca: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="noro">NORO</SelectItem>
                  <SelectItem value="nomade">Nomade</SelectItem>
                  <SelectItem value="safetrip">SafeTrip</SelectItem>
                  <SelectItem value="vistos">Vistos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Valor (R$)*</label>
              <Input
                required
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, valor: e.target.value })
                }
                placeholder="0.00"
              />
            </div>
          </div>

          {/* Categoria e Tipo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Categoria</label>
              <Select
                value={formData.categoria_id}
                onValueChange={(value) => setFormData({ ...formData, categoria_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icone} {cat.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tipo</label>
              <Select
                value={formData.tipo_receita}
                onValueChange={(value) => setFormData({ ...formData, tipo_receita: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="servico">Serviço</SelectItem>
                  <SelectItem value="produto">Produto</SelectItem>
                  <SelectItem value="recorrente">Recorrente</SelectItem>
                  <SelectItem value="comissao">Comissão</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Datas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Vencimento*</label>
              <Input
                required
                type="date"
                value={formData.data_vencimento}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, data_vencimento: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Competência*</label>
              <Input
                required
                type="date"
                value={formData.data_competencia}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setFormData({ ...formData, data_competencia: e.target.value })
                }
              />
            </div>
          </div>

          {/* Status e Forma de Pagamento */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Status*</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendente">Pendente</SelectItem>
                  <SelectItem value="pago">Pago</SelectItem>
                  <SelectItem value="cancelado">Cancelado</SelectItem>
                  <SelectItem value="atrasado">Atrasado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Forma de Pagamento</label>
              <Select
                value={formData.forma_pagamento}
                onValueChange={(value) => setFormData({ ...formData, forma_pagamento: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="cartao_credito">Cartão de Crédito</SelectItem>
                  <SelectItem value="cartao_debito">Cartão de Débito</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="transferencia">Transferência</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conta Bancária */}
          <div>
            <label className="block text-sm font-medium mb-1">Conta Bancária</label>
            <Select
              value={formData.conta_bancaria_id}
              onValueChange={(value) => setFormData({ ...formData, conta_bancaria_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {contas.map((conta) => (
                  <SelectItem key={conta.id} value={conta.id}>
                    {conta.nome} - {conta.banco}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Recorrente */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="recorrente"
              checked={formData.recorrente}
              onChange={(e) => setFormData({ ...formData, recorrente: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="recorrente" className="text-sm font-medium">
              Receita Recorrente
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : receita ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
