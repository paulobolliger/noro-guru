'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog-simple';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/toast';
import type { FinCentroCusto, TipoCentroCusto, StatusCentroCusto, Marca } from '@/types/financeiro';

interface CentroCustoFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  centroCusto?: any;
  tenantId: string;
}

export function CentroCustoFormModal({
  isOpen,
  onClose,
  centroCusto,
  tenantId,
}: CentroCustoFormModalProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    codigo: centroCusto?.codigo || '',
    nome: centroCusto?.nome || '',
    descricao: centroCusto?.descricao || '',
    tipo: centroCusto?.tipo || 'projeto',
    marca: centroCusto?.marca || 'noro',
    data_inicio: centroCusto?.data_inicio || '',
    data_fim: centroCusto?.data_fim || '',
    orcamento_previsto: centroCusto?.orcamento_previsto || '',
    meta_margem_percentual: centroCusto?.meta_margem_percentual || 15,
    meta_receita: centroCusto?.meta_receita || '',
    status: centroCusto?.status || 'planejamento',
    moeda: centroCusto?.moeda || 'BRL',
    tags: centroCusto?.tags?.join(', ') || '',
  });

  useEffect(() => {
    if (centroCusto) {
      setFormData({
        codigo: centroCusto.codigo || '',
        nome: centroCusto.nome || '',
        descricao: centroCusto.descricao || '',
        tipo: centroCusto.tipo || 'projeto',
        marca: centroCusto.marca || 'noro',
        data_inicio: centroCusto.data_inicio || '',
        data_fim: centroCusto.data_fim || '',
        orcamento_previsto: centroCusto.orcamento_previsto || '',
        meta_margem_percentual: centroCusto.meta_margem_percentual || 15,
        meta_receita: centroCusto.meta_receita || '',
        status: centroCusto.status || 'planejamento',
        moeda: centroCusto.moeda || 'BRL',
        tags: centroCusto.tags?.join(', ') || '',
      });
    }
  }, [centroCusto]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Converter tags de string para array
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(t => t.trim()).filter(t => t)
        : [];

      const dadosParaEnviar = {
        ...formData,
        tenant_id: tenantId,
        orcamento_previsto: parseFloat(formData.orcamento_previsto.toString()) || 0,
        meta_margem_percentual: parseFloat(formData.meta_margem_percentual.toString()) || 15,
        meta_receita: formData.meta_receita ? parseFloat(formData.meta_receita.toString()) : null,
        data_fim: formData.data_fim || null,
        tags: tagsArray,
      };

      const url = centroCusto
        ? `/api/centros-custo/${centroCusto.id}`
        : '/api/centros-custo';
      const method = centroCusto ? 'PUT' : 'POST';

      console.log('💾 Salvando centro de custo:', { url, method, data: dadosParaEnviar });

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosParaEnviar),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Sucesso:', data);
        showToast('success', `Centro de custo ${centroCusto ? 'atualizado' : 'criado'} com sucesso!`);
        router.refresh();
        onClose();
      } else {
        console.error('❌ Erro na resposta:', data);
        showToast('error', 'Erro ao salvar', data.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('❌ Erro ao salvar centro de custo:', error);
      showToast('error', 'Erro ao salvar centro de custo', 'Verifique o console para mais detalhes');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {centroCusto ? 'Editar Centro de Custo' : 'Novo Centro de Custo'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identificação */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground">IDENTIFICAÇÃO</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Código <span className="text-red-500">*</span>
                </label>
                <Input
                  placeholder="Ex: RIO-OUT-25"
                  value={formData.codigo}
                  onChange={(e) => handleChange('codigo', e.target.value)}
                  required
                  disabled={!!centroCusto} // Não permitir editar código
                />
                <p className="text-xs text-muted-foreground">
                  Identificador único (ex: RIO-OUT-25, GRUPO-123)
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Status <span className="text-red-500">*</span>
                </label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planejamento">Planejamento</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Nome do Projeto <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Ex: Viagem Rio de Janeiro - Outubro 2025"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição</label>
              <textarea
                className="w-full min-h-[80px] px-3 py-2 border rounded-md resize-none"
                placeholder="Descrição detalhada do projeto..."
                value={formData.descricao}
                onChange={(e) => handleChange('descricao', e.target.value)}
              />
            </div>
          </div>

          {/* Classificação */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground">CLASSIFICAÇÃO</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Tipo <span className="text-red-500">*</span>
                </label>
                <Select value={formData.tipo} onValueChange={(value) => handleChange('tipo', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viagem">🗺️ Viagem</SelectItem>
                    <SelectItem value="grupo">👥 Grupo</SelectItem>
                    <SelectItem value="cliente">💼 Cliente</SelectItem>
                    <SelectItem value="projeto">📦 Projeto</SelectItem>
                    <SelectItem value="evento">📅 Evento</SelectItem>
                    <SelectItem value="outros">📋 Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Marca</label>
                <Select value={formData.marca} onValueChange={(value) => handleChange('marca', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="noro">NORO</SelectItem>
                    <SelectItem value="nomade">Nomade</SelectItem>
                    <SelectItem value="safetrip">SafeTrip</SelectItem>
                    <SelectItem value="vistos">Vistos</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tags</label>
              <Input
                placeholder="Ex: urgente, internacional, grupo-vip (separadas por vírgula)"
                value={formData.tags}
                onChange={(e) => handleChange('tags', e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Separar tags por vírgula
              </p>
            </div>
          </div>

          {/* Período */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground">PERÍODO</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Data de Início <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.data_inicio}
                  onChange={(e) => handleChange('data_inicio', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Data de Término</label>
                <Input
                  type="date"
                  value={formData.data_fim}
                  onChange={(e) => handleChange('data_fim', e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Financeiro */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm text-muted-foreground">FINANCEIRO</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Orçamento Previsto <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.orcamento_previsto}
                  onChange={(e) => handleChange('orcamento_previsto', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Moeda</label>
                <Select value={formData.moeda} onValueChange={(value) => handleChange('moeda', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BRL">BRL - Real</SelectItem>
                    <SelectItem value="USD">USD - Dólar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Meta de Margem (%) <span className="text-red-500">*</span>
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="15"
                  value={formData.meta_margem_percentual}
                  onChange={(e) => handleChange('meta_margem_percentual', e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Margem líquida desejada (padrão: 15%)
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Meta de Receita</label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.meta_receita}
                  onChange={(e) => handleChange('meta_receita', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Receita esperada (opcional)
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : centroCusto ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
