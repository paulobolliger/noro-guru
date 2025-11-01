'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  DollarSign,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  CreditCard,
  TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/toast';
import { DuplicataPagarFormModal } from './duplicata-form-modal';
import { PagarDuplicataModal } from './pagar-duplicata-modal';
import { AplicarCreditoModal } from './aplicar-credito-modal';

interface DuplicatasPagarClientProps {
  duplicatas: any[];
  fornecedores: any[];
  adiantamentos: any[];
  creditos: any[];
  categorias: any[];
  contas: any[];
  tenantId: string;
}

export function DuplicatasPagarClient({ 
  duplicatas, 
  fornecedores,
  adiantamentos,
  creditos,
  categorias, 
  contas, 
  tenantId 
}: DuplicatasPagarClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  
  // Estados de filtros
  const [busca, setBusca] = useState(searchParams.get('busca') || '');
  const [filtroStatus, setFiltroStatus] = useState<string>(searchParams.get('status') || 'todos');
  const [filtroMarca, setFiltroMarca] = useState<string>(searchParams.get('marca') || 'todas');
  const [filtroFornecedor, setFiltroFornecedor] = useState<string>(searchParams.get('fornecedor') || 'todos');
  const [dataInicio, setDataInicio] = useState(searchParams.get('dataInicio') || '');
  const [dataFim, setDataFim] = useState(searchParams.get('dataFim') || '');
  const [vencimentoProximo, setVencimentoProximo] = useState<string>(searchParams.get('vencimentoProximo') || '');
  
  // Estados de modais
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPagarOpen, setIsPagarOpen] = useState(false);
  const [isCreditoOpen, setIsCreditoOpen] = useState(false);
  const [duplicataSelecionada, setDuplicataSelecionada] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Atualizar URL quando os filtros mudarem
  useEffect(() => {
    const params = new URLSearchParams();
    if (busca) params.set('busca', busca);
    if (filtroStatus !== 'todos') params.set('status', filtroStatus);
    if (filtroMarca !== 'todas') params.set('marca', filtroMarca);
    if (filtroFornecedor !== 'todos') params.set('fornecedor', filtroFornecedor);
    if (dataInicio) params.set('dataInicio', dataInicio);
    if (dataFim) params.set('dataFim', dataFim);
    if (vencimentoProximo) params.set('vencimentoProximo', vencimentoProximo);

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [busca, filtroStatus, filtroMarca, filtroFornecedor, dataInicio, dataFim, vencimentoProximo, pathname, router]);

  // Filtrar duplicatas
  const duplicatasFiltradas = useMemo(() => {
    return duplicatas.filter((duplicata) => {
      const matchBusca =
        busca === '' ||
        duplicata.numero_documento?.toLowerCase().includes(busca.toLowerCase()) ||
        duplicata.descricao?.toLowerCase().includes(busca.toLowerCase());
      
      const matchStatus = filtroStatus === 'todos' || duplicata.status === filtroStatus;
      const matchMarca = filtroMarca === 'todas' || duplicata.marca === filtroMarca;
      const matchFornecedor = filtroFornecedor === 'todos' || duplicata.fornecedor_id === filtroFornecedor;
      
      const dataVencimento = new Date(duplicata.data_vencimento);
      const matchDataInicio = !dataInicio || dataVencimento >= new Date(dataInicio);
      const matchDataFim = !dataFim || dataVencimento <= new Date(dataFim);

      // Filtro de vencimento próximo
      let matchVencimentoProximo = true;
      if (vencimentoProximo) {
        const hoje = new Date();
        const diasProximo = parseInt(vencimentoProximo);
        const dataLimite = new Date();
        dataLimite.setDate(hoje.getDate() + diasProximo);
        matchVencimentoProximo = dataVencimento >= hoje && dataVencimento <= dataLimite;
      }

      return matchBusca && matchStatus && matchMarca && matchFornecedor && matchDataInicio && matchDataFim && matchVencimentoProximo;
    });
  }, [duplicatas, busca, filtroStatus, filtroMarca, filtroFornecedor, dataInicio, dataFim, vencimentoProximo]);

  // Calcular totais
  const totais = useMemo(() => {
    return duplicatasFiltradas.reduce(
      (acc, dup) => {
        acc.total += dup.valor_total || 0;
        acc.pago += dup.valor_pago || 0;
        acc.pendente += dup.valor_pendente || 0;
        acc.credito_aplicado += dup.valor_credito_aplicado || 0;
        
        if (dup.status === 'paga') acc.count_pagas++;
        else if (dup.status === 'vencida') acc.count_vencidas++;
        else if (dup.status === 'pendente') acc.count_pendentes++;
        
        return acc;
      },
      { 
        total: 0, 
        pago: 0, 
        pendente: 0,
        credito_aplicado: 0,
        count_pagas: 0,
        count_vencidas: 0,
        count_pendentes: 0
      }
    );
  }, [duplicatasFiltradas]);

  // Limpar filtros
  const limparFiltros = () => {
    setBusca('');
    setFiltroStatus('todos');
    setFiltroMarca('todas');
    setFiltroFornecedor('todos');
    setDataInicio('');
    setDataFim('');
    setVencimentoProximo('');
  };

  // Handlers
  const handleNova = () => {
    setDuplicataSelecionada(null);
    setIsFormOpen(true);
  };

  const handleEditar = (duplicata: any) => {
    setDuplicataSelecionada(duplicata);
    setIsFormOpen(true);
  };

  const handlePagar = (duplicata: any) => {
    setDuplicataSelecionada(duplicata);
    setIsPagarOpen(true);
  };

  const handleAplicarCredito = (duplicata: any) => {
    setDuplicataSelecionada(duplicata);
    setIsCreditoOpen(true);
  };

  const handleDeletar = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar esta duplicata? Adiantamentos e créditos vinculados serão revertidos.')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/duplicatas-pagar/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar duplicata');
      }

      showToast('success', 'Duplicata deletada com sucesso');

      router.refresh();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      showToast('error', 'Erro ao deletar duplicata');
    } finally {
      setLoading(false);
    }
  };

  const handleGerarParcelas = async (duplicata: any) => {
    const numeroParcelas = prompt('Número de parcelas:', '2');
    if (!numeroParcelas) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/duplicatas-pagar/${duplicata.id}/gerar-parcelas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          numero_parcelas: parseInt(numeroParcelas),
          intervalo_dias: 30,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar parcelas');
      }

      showToast('success', 'Parcelas geradas com sucesso');

      router.refresh();
    } catch (error) {
      console.error('Erro ao gerar parcelas:', error);
      showToast('error', 'Erro ao gerar parcelas');
    } finally {
      setLoading(false);
    }
  };

  // Função auxiliar para status badge
  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pendente: { variant: 'warning', icon: Clock },
      'parcialmente_paga': { variant: 'info', icon: DollarSign },
      paga: { variant: 'success', icon: CheckCircle },
      vencida: { variant: 'destructive', icon: AlertCircle },
      cancelada: { variant: 'secondary', icon: X },
    };

    const config = variants[status] || variants.pendente;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  // Formatar moeda
  const formatCurrency = (value: number, moeda: string = 'BRL') => {
    if (moeda !== 'BRL') {
      return `${moeda} ${value.toFixed(2)}`;
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  // Formatar data
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR');
  };

  // Marcas disponíveis
  const marcas = ['Atlantica', 'RateHawk', 'Hurb', 'MaxMilhas'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Duplicatas a Pagar</h1>
          <p className="text-muted-foreground">
            Gerencie suas duplicatas e pagamentos a fornecedores
          </p>
        </div>
        <Button onClick={handleNova} size="lg">
          <Plus className="mr-2 h-4 w-4" />
          Nova Duplicata
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total a Pagar</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totais.total)}</div>
            <p className="text-xs text-muted-foreground">
              {duplicatasFiltradas.length} duplicatas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pago</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totais.pago)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totais.count_pagas} pagas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendente</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {formatCurrency(totais.pendente)}
            </div>
            <p className="text-xs text-muted-foreground">
              {totais.count_pendentes} pendentes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Aplicados</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(totais.credito_aplicado)}
            </div>
            <p className="text-xs text-muted-foreground">
              economia com créditos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Busca */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por documento ou descrição..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Status */}
            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="parcialmente_paga">Parcialmente Paga</SelectItem>
                <SelectItem value="paga">Paga</SelectItem>
                <SelectItem value="vencida">Vencida</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>

            {/* Marca */}
            <Select value={filtroMarca} onValueChange={setFiltroMarca}>
              <SelectTrigger>
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                {marcas.map((marca) => (
                  <SelectItem key={marca} value={marca}>
                    {marca}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Vencimento Próximo */}
            <Select value={vencimentoProximo} onValueChange={setVencimentoProximo}>
              <SelectTrigger>
                <SelectValue placeholder="Vencimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="7">Próximos 7 dias</SelectItem>
                <SelectItem value="15">Próximos 15 dias</SelectItem>
                <SelectItem value="30">Próximos 30 dias</SelectItem>
              </SelectContent>
            </Select>

            {/* Data Início */}
            <Input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              placeholder="Data início"
            />

            {/* Data Fim */}
            <Input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              placeholder="Data fim"
            />
          </div>

          {/* Botão Limpar Filtros */}
          {(busca || filtroStatus !== 'todos' || filtroMarca !== 'todas' || dataInicio || dataFim || vencimentoProximo) && (
            <Button
              variant="outline"
              size="sm"
              onClick={limparFiltros}
              className="w-full"
            >
              <X className="mr-2 h-4 w-4" />
              Limpar Filtros
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Documento</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead className="text-right">Pendente</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Adiantamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {duplicatasFiltradas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-8 text-muted-foreground">
                    Nenhuma duplicata encontrada
                  </TableCell>
                </TableRow>
              ) : (
                duplicatasFiltradas.map((duplicata) => (
                  <TableRow key={duplicata.id}>
                    <TableCell className="font-medium">
                      {duplicata.numero_documento || '-'}
                    </TableCell>
                    <TableCell>{duplicata.fornecedor_nome || '-'}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {duplicata.descricao || '-'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{duplicata.marca}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(duplicata.valor_total, duplicata.moeda)}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(duplicata.valor_pendente, duplicata.moeda)}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span>{formatDate(duplicata.data_vencimento)}</span>
                        {duplicata.dias_atraso > 0 && (
                          <span className="text-xs text-red-600">
                            {duplicata.dias_atraso} dias de atraso
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {duplicata.adiantamento_id ? (
                        <Badge variant="success" className="text-xs">
                          Vinculado
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>{getStatusBadge(duplicata.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {duplicata.status !== 'paga' && duplicata.status !== 'cancelada' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handlePagar(duplicata)}
                              title="Pagar"
                            >
                              <DollarSign className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAplicarCredito(duplicata)}
                              title="Aplicar Crédito"
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditar(duplicata)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!duplicata.parcelas?.length && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGerarParcelas(duplicata)}
                            title="Gerar Parcelas"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeletar(duplicata.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modais */}
      <DuplicataPagarFormModal
        open={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setDuplicataSelecionada(null);
        }}
        duplicata={duplicataSelecionada}
        adiantamentos={adiantamentos}
        categorias={categorias}
        onSuccess={() => {
          setIsFormOpen(false);
          setDuplicataSelecionada(null);
          router.refresh();
        }}
        tenantId={tenantId}
      />

      <PagarDuplicataModal
        open={isPagarOpen}
        onClose={() => {
          setIsPagarOpen(false);
          setDuplicataSelecionada(null);
        }}
        duplicata={duplicataSelecionada}
        contas={contas}
        onSuccess={() => {
          setIsPagarOpen(false);
          setDuplicataSelecionada(null);
          router.refresh();
        }}
      />

      <AplicarCreditoModal
        open={isCreditoOpen}
        onClose={() => {
          setIsCreditoOpen(false);
          setDuplicataSelecionada(null);
        }}
        duplicata={duplicataSelecionada}
        creditos={creditos}
        onSuccess={() => {
          setIsCreditoOpen(false);
          setDuplicataSelecionada(null);
          router.refresh();
        }}
      />
    </div>
  );
}
