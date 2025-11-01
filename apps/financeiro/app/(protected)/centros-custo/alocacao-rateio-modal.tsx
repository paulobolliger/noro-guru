'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { Search, Plus, Trash2, Edit, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { FinCentroCusto, FinAlocacao, TipoRateio, FinReceita, FinDespesa } from '@/types/financeiro';

interface AlocacaoRateioModalProps {
  centroCusto: FinCentroCusto;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AlocacaoFormData {
  tipo_origem: 'receita' | 'despesa';
  origem_id: string;
  tipo_rateio: TipoRateio;
  percentual_alocacao?: number;
  valor_alocado?: number;
  observacoes?: string;
}

export default function AlocacaoRateioModal({
  centroCusto,
  open,
  onOpenChange,
}: AlocacaoRateioModalProps) {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'receitas' | 'despesas'>('receitas');
  
  // Listas de receitas e despesas disponíveis
  const [receitas, setReceitas] = useState<FinReceita[]>([]);
  const [despesas, setDespesas] = useState<FinDespesa[]>([]);
  
  // Alocações existentes
  const [alocacoes, setAlocacoes] = useState<FinAlocacao[]>([]);
  
  // Filtros de busca
  const [searchReceita, setSearchReceita] = useState('');
  const [searchDespesa, setSearchDespesa] = useState('');
  
  // Formulário de nova alocação
  const [showForm, setShowForm] = useState(false);
  const [editingAlocacao, setEditingAlocacao] = useState<FinAlocacao | null>(null);
  const [formData, setFormData] = useState<AlocacaoFormData>({
    tipo_origem: 'receita',
    origem_id: '',
    tipo_rateio: 'percentual',
  });

  // Carregar receitas, despesas e alocações
  useEffect(() => {
    if (open) {
      loadData();
    }
  }, [open, centroCusto.id]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Carregar receitas não alocadas
      const resReceitas = await fetch('/api/receitas?status=confirmada');
      if (resReceitas.ok) {
        const dataReceitas = await resReceitas.json();
        setReceitas(dataReceitas);
      }

      // Carregar despesas não alocadas
      const resDespesas = await fetch('/api/despesas?status=confirmada');
      if (resDespesas.ok) {
        const dataDespesas = await resDespesas.json();
        setDespesas(dataDespesas);
      }

      // Carregar alocações existentes do centro de custo
      const resAlocacoes = await fetch(`/api/alocacoes?centro_custo_id=${centroCusto.id}`);
      if (resAlocacoes.ok) {
        const dataAlocacoes = await resAlocacoes.json();
        setAlocacoes(dataAlocacoes);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      showToast('error', 'Erro', 'Não foi possível carregar os dados.');
    } finally {
      setLoading(false);
    }
  };

  // Filtrar receitas
  const receitasFiltradas = useMemo(() => {
    return receitas.filter((receita) => {
      const matchSearch = searchReceita === '' || 
        receita.descricao?.toLowerCase().includes(searchReceita.toLowerCase()) ||
        receita.categoria_id?.toLowerCase().includes(searchReceita.toLowerCase());
      
      // Verificar se já está alocada
      const jaAlocada = alocacoes.some(a => a.receita_id === receita.id);
      
      return matchSearch && !jaAlocada;
    });
  }, [receitas, searchReceita, alocacoes]);

  // Filtrar despesas
  const despesasFiltradas = useMemo(() => {
    return despesas.filter((despesa) => {
      const matchSearch = searchDespesa === '' || 
        despesa.descricao?.toLowerCase().includes(searchDespesa.toLowerCase()) ||
        despesa.categoria_id?.toLowerCase().includes(searchDespesa.toLowerCase());
      
      // Verificar se já está alocada
      const jaAlocada = alocacoes.some(a => a.despesa_id === despesa.id);
      
      return matchSearch && !jaAlocada;
    });
  }, [despesas, searchDespesa, alocacoes]);

  // Alocações separadas por tipo
  const alocacoesReceitas = useMemo(() => {
    return alocacoes.filter(a => a.receita_id).map(a => {
      const receita = receitas.find(r => r.id === a.receita_id);
      return { ...a, origem: receita };
    });
  }, [alocacoes, receitas]);

  const alocacoesDespesas = useMemo(() => {
    return alocacoes.filter(a => a.despesa_id).map(a => {
      const despesa = despesas.find(d => d.id === a.despesa_id);
      return { ...a, origem: despesa };
    });
  }, [alocacoes, despesas]);

  // Calcular totais de alocação
  const totaisAlocacao = useMemo(() => {
    const totalReceitasPercentual = alocacoesReceitas
      .filter(a => a.tipo_rateio === 'percentual')
      .reduce((sum, a) => sum + (a.percentual_alocacao || 0), 0);
    
    const totalDespesasPercentual = alocacoesDespesas
      .filter(a => a.tipo_rateio === 'percentual')
      .reduce((sum, a) => sum + (a.percentual_alocacao || 0), 0);
    
    const totalReceitasValor = alocacoesReceitas
      .reduce((sum, a) => sum + (a.valor_alocado || 0), 0);
    
    const totalDespesasValor = alocacoesDespesas
      .reduce((sum, a) => sum + (a.valor_alocado || 0), 0);

    return {
      receitasPercentual: totalReceitasPercentual,
      despesasPercentual: totalDespesasPercentual,
      receitasValor: totalReceitasValor,
      despesasValor: totalDespesasValor,
    };
  }, [alocacoesReceitas, alocacoesDespesas]);

  const handleAddAlocacao = (tipo: 'receita' | 'despesa', id: string) => {
    setFormData({
      tipo_origem: tipo,
      origem_id: id,
      tipo_rateio: 'percentual',
      percentual_alocacao: 100,
    });
    setEditingAlocacao(null);
    setShowForm(true);
  };

  const handleEditAlocacao = (alocacao: FinAlocacao) => {
    setFormData({
      tipo_origem: alocacao.receita_id ? 'receita' : 'despesa',
      origem_id: alocacao.receita_id || alocacao.despesa_id || '',
      tipo_rateio: alocacao.tipo_rateio,
      percentual_alocacao: alocacao.percentual_alocacao ?? undefined,
      valor_alocado: alocacao.valor_alocado,
      observacoes: alocacao.observacoes ?? undefined,
    });
    setEditingAlocacao(alocacao);
    setShowForm(true);
  };

  const handleDeleteAlocacao = async (alocacaoId: string) => {
    if (!confirm('Tem certeza que deseja remover esta alocação?')) {
      return;
    }

    try {
      const response = await fetch(`/api/alocacoes/${alocacaoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao remover alocação');
      }

      showToast('success', 'Alocação removida com sucesso.');

      await loadData();
    } catch (error) {
      console.error('Erro ao remover alocação:', error);
      showToast('error', 'Erro', 'Não foi possível remover a alocação.');
    }
  };

  const handleSubmitAlocacao = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações
    if (!formData.origem_id) {
      showToast('error', 'Erro', 'Selecione uma receita ou despesa.');
      return;
    }

    if (formData.tipo_rateio === 'percentual') {
      if (!formData.percentual_alocacao || formData.percentual_alocacao <= 0 || formData.percentual_alocacao > 100) {
        showToast('error', 'Erro', 'O percentual deve ser entre 0 e 100%.');
        return;
      }
    } else {
      if (!formData.valor_alocado || formData.valor_alocado <= 0) {
        showToast('error', 'Erro', 'O valor alocado deve ser maior que zero.');
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        centro_custo_id: centroCusto.id,
        [formData.tipo_origem === 'receita' ? 'receita_id' : 'despesa_id']: formData.origem_id,
        tipo_rateio: formData.tipo_rateio,
        percentual_alocacao: formData.tipo_rateio === 'percentual' ? formData.percentual_alocacao : null,
        valor_alocado: formData.tipo_rateio === 'valor_fixo' ? formData.valor_alocado : null,
        observacoes: formData.observacoes || null,
      };

      const url = editingAlocacao 
        ? `/api/alocacoes/${editingAlocacao.id}`
        : '/api/alocacoes';
      
      const method = editingAlocacao ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar alocação');
      }

      showToast('success', editingAlocacao 
        ? 'Alocação atualizada com sucesso.'
        : 'Alocação criada com sucesso.');

      setShowForm(false);
      setFormData({
        tipo_origem: 'receita',
        origem_id: '',
        tipo_rateio: 'percentual',
      });
      setEditingAlocacao(null);

      await loadData();
    } catch (error) {
      console.error('Erro ao salvar alocação:', error);
      showToast('error', 'Erro', 'Não foi possível salvar a alocação.');
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Alocação e Rateio - {centroCusto.nome}</DialogTitle>
          <DialogDescription>
            Vincule receitas e despesas a este centro de custo. Configure rateios percentuais ou valores fixos.
          </DialogDescription>
        </DialogHeader>

        {showForm ? (
          <form onSubmit={handleSubmitAlocacao} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Rateio</Label>
                <Select
                  value={formData.tipo_rateio}
                  onValueChange={(value) => setFormData({ ...formData, tipo_rateio: value as TipoRateio })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentual">Percentual</SelectItem>
                    <SelectItem value="valor_fixo">Valor Fixo</SelectItem>
                    <SelectItem value="proporcional">Proporcional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.tipo_rateio === 'percentual' && (
                <div className="space-y-2">
                  <Label>Percentual (%)</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.percentual_alocacao || ''}
                    onChange={(e) => setFormData({ ...formData, percentual_alocacao: parseFloat(e.target.value) })}
                    placeholder="Ex: 100"
                  />
                </div>
              )}

              {formData.tipo_rateio === 'valor_fixo' && (
                <div className="space-y-2">
                  <Label>Valor Alocado (R$)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.valor_alocado || ''}
                    onChange={(e) => setFormData({ ...formData, valor_alocado: parseFloat(e.target.value) })}
                    placeholder="Ex: 1500.00"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label>Observações</Label>
              <Input
                value={formData.observacoes || ''}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                placeholder="Observações sobre esta alocação (opcional)"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {
                setShowForm(false);
                setEditingAlocacao(null);
              }}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {editingAlocacao ? 'Atualizar' : 'Adicionar'} Alocação
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'receitas' | 'despesas')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="receitas">
                  Receitas ({alocacoesReceitas.length})
                </TabsTrigger>
                <TabsTrigger value="despesas">
                  Despesas ({alocacoesDespesas.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="receitas" className="space-y-4">
                {/* Resumo de alocações de receitas */}
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Alocado</div>
                    <div className="text-lg font-bold">{formatCurrency(totaisAlocacao.receitasValor)}</div>
                  </div>
                  <div className="flex-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="text-sm text-muted-foreground">Percentual Alocado</div>
                    <div className="text-lg font-bold">{totaisAlocacao.receitasPercentual.toFixed(1)}%</div>
                  </div>
                </div>

                {/* Alocações existentes */}
                {alocacoesReceitas.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Alocações Ativas</h4>
                    <div className="space-y-2">
                      {alocacoesReceitas.map((alocacao) => (
                        <div
                          key={alocacao.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{(alocacao.origem as any)?.descricao || 'Receita não encontrada'}</div>
                            <div className="text-sm text-muted-foreground">
                              {alocacao.tipo_rateio === 'percentual' 
                                ? `${alocacao.percentual_alocacao}%` 
                                : formatCurrency(alocacao.valor_alocado || 0)}
                              {alocacao.observacoes && ` • ${alocacao.observacoes}`}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditAlocacao(alocacao)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteAlocacao(alocacao.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Busca de receitas disponíveis */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Receitas Disponíveis</h4>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar receitas..."
                      value={searchReceita}
                      onChange={(e) => setSearchReceita(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {receitasFiltradas.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        {searchReceita ? 'Nenhuma receita encontrada' : 'Todas as receitas já foram alocadas'}
                      </div>
                    ) : (
                      receitasFiltradas.map((receita) => (
                        <div
                          key={receita.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{receita.descricao}</div>
                            <div className="text-sm text-muted-foreground">
                              {receita.categoria_id || 'Sem categoria'} • {formatCurrency(receita.valor_brl)}
                              {receita.data_vencimento && ` • ${new Date(receita.data_vencimento).toLocaleDateString('pt-BR')}`}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAddAlocacao('receita', receita.id)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Alocar
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="despesas" className="space-y-4">
                {/* Resumo de alocações de despesas */}
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-sm text-muted-foreground">Total Alocado</div>
                    <div className="text-lg font-bold">{formatCurrency(totaisAlocacao.despesasValor)}</div>
                  </div>
                  <div className="flex-1 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div className="text-sm text-muted-foreground">Percentual Alocado</div>
                    <div className="text-lg font-bold">{totaisAlocacao.despesasPercentual.toFixed(1)}%</div>
                  </div>
                </div>

                {/* Alocações existentes */}
                {alocacoesDespesas.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-sm">Alocações Ativas</h4>
                    <div className="space-y-2">
                      {alocacoesDespesas.map((alocacao) => (
                        <div
                          key={alocacao.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{(alocacao.origem as any)?.descricao || 'Despesa não encontrada'}</div>
                            <div className="text-sm text-muted-foreground">
                              {alocacao.tipo_rateio === 'percentual' 
                                ? `${alocacao.percentual_alocacao}%` 
                                : formatCurrency(alocacao.valor_alocado || 0)}
                              {alocacao.observacoes && ` • ${alocacao.observacoes}`}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditAlocacao(alocacao)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteAlocacao(alocacao.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Busca de despesas disponíveis */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Despesas Disponíveis</h4>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar despesas..."
                      value={searchDespesa}
                      onChange={(e) => setSearchDespesa(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  
                  <div className="max-h-[300px] overflow-y-auto space-y-2">
                    {despesasFiltradas.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        {searchDespesa ? 'Nenhuma despesa encontrada' : 'Todas as despesas já foram alocadas'}
                      </div>
                    ) : (
                      despesasFiltradas.map((despesa) => (
                        <div
                          key={despesa.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{despesa.descricao}</div>
                            <div className="text-sm text-muted-foreground">
                              {despesa.categoria_id || 'Sem categoria'} • {formatCurrency(despesa.valor_brl)}
                              {despesa.data_vencimento && ` • ${new Date(despesa.data_vencimento).toLocaleDateString('pt-BR')}`}
                            </div>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAddAlocacao('despesa', despesa.id)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Alocar
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
