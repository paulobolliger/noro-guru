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
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useToast } from '@/components/ui/toast';
import { ReceitaFormModal } from './receita-form-modal';
import { ReceitaDetalhesModal } from './receita-detalhes-modal';
import type { FinReceita, FinCategoria } from '@/types/financeiro';

interface ReceitasClientProps {
  receitas: any[];
  categorias: any[];
  contas: any[];
  tenantId: string;
}

export function ReceitasClient({ receitas, categorias, contas, tenantId }: ReceitasClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  
  // Inicializar estados com valores da URL
  const [busca, setBusca] = useState(searchParams.get('busca') || '');
  const [filtroStatus, setFiltroStatus] = useState<string>(searchParams.get('status') || 'todos');
  const [filtroMarca, setFiltroMarca] = useState<string>(searchParams.get('marca') || 'todas');
  const [filtroCategoria, setFiltroCategoria] = useState<string>(searchParams.get('categoria') || 'todas');
  const [dataInicio, setDataInicio] = useState(searchParams.get('dataInicio') || '');
  const [dataFim, setDataFim] = useState(searchParams.get('dataFim') || '');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetalhesOpen, setIsDetalhesOpen] = useState(false);
  const [receitaSelecionada, setReceitaSelecionada] = useState<any>(null);

  // Atualizar URL quando os filtros mudarem
  useEffect(() => {
    const params = new URLSearchParams();
    if (busca) params.set('busca', busca);
    if (filtroStatus !== 'todos') params.set('status', filtroStatus);
    if (filtroMarca !== 'todas') params.set('marca', filtroMarca);
    if (filtroCategoria !== 'todas') params.set('categoria', filtroCategoria);
    if (dataInicio) params.set('dataInicio', dataInicio);
    if (dataFim) params.set('dataFim', dataFim);

    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [busca, filtroStatus, filtroMarca, filtroCategoria, dataInicio, dataFim, pathname, router]);

  // Filtrar receitas
  const receitasFiltradas = useMemo(() => {
    return receitas.filter((receita) => {
      const matchBusca =
        busca === '' ||
        receita.descricao.toLowerCase().includes(busca.toLowerCase());
      const matchStatus =
        filtroStatus === 'todos' || receita.status === filtroStatus;
      const matchMarca =
        filtroMarca === 'todas' || receita.marca === filtroMarca;
      const matchCategoria =
        filtroCategoria === 'todas' || receita.categoria_id === filtroCategoria;
      
      // Filtro de data (vencimento)
      const dataVencimento = new Date(receita.data_vencimento);
      const matchDataInicio = !dataInicio || dataVencimento >= new Date(dataInicio);
      const matchDataFim = !dataFim || dataVencimento <= new Date(dataFim);

      return matchBusca && matchStatus && matchMarca && matchCategoria && matchDataInicio && matchDataFim;
    });
  }, [receitas, busca, filtroStatus, filtroMarca, filtroCategoria, dataInicio, dataFim]);

  // Calcular totais
  const totais = useMemo(() => {
    return receitasFiltradas.reduce(
      (acc, receita) => {
        if (receita.status === 'pago') {
          acc.pago += receita.valor_brl || 0;
        } else if (receita.status === 'pendente') {
          acc.pendente += receita.valor_brl || 0;
        }
        acc.total += receita.valor_brl || 0;
        return acc;
      },
      { pago: 0, pendente: 0, total: 0 }
    );
  }, [receitasFiltradas]);

  const handleNova = () => {
    setReceitaSelecionada(null);
    setIsFormOpen(true);
  };

  const handleEditar = (receita: any) => {
    setReceitaSelecionada(receita);
    setIsFormOpen(true);
  };

  const handleVerDetalhes = (receita: any) => {
    setReceitaSelecionada(receita);
    setIsDetalhesOpen(true);
  };

  const handleLimparFiltros = () => {
    setBusca('');
    setFiltroStatus('todos');
    setFiltroMarca('todas');
    setFiltroCategoria('todas');
    setDataInicio('');
    setDataFim('');
  };

  const temFiltrosAtivos = busca || filtroStatus !== 'todos' || filtroMarca !== 'todas' || 
    filtroCategoria !== 'todas' || dataInicio || dataFim;

  const handleDeletar = async (receita: any) => {
    if (!confirm(`Tem certeza que deseja deletar: ${receita.descricao}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/receitas/${receita.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh();
        showToast('success', 'Receita deletada com sucesso!');
      } else {
        const error = await response.json();
        showToast('error', 'Erro ao deletar', error.error || 'Erro desconhecido');
      }
    } catch (error) {
      console.error('Erro ao deletar receita:', error);
      showToast('error', 'Erro ao deletar receita', 'Verifique o console para mais detalhes');
    }
  };

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pago: { label: 'Pago', className: 'bg-green-100 text-green-800' },
      pendente: { label: 'Pendente', className: 'bg-yellow-100 text-yellow-800' },
      cancelado: { label: 'Cancelado', className: 'bg-red-100 text-red-800' },
      atrasado: { label: 'Atrasado', className: 'bg-orange-100 text-orange-800' },
    };

    const variant = variants[status] || variants.pendente;
    return (
      <Badge className={variant.className} variant="outline">
        {variant.label}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Receitas</h1>
          <p className="text-muted-foreground">
            Gerencie suas receitas e entradas financeiras
          </p>
        </div>
        <Button onClick={handleNova}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Receita
        </Button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground">Total Pago</div>
          <div className="text-2xl font-bold text-green-600">
            {formatarMoeda(totais.pago)}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground">Total Pendente</div>
          <div className="text-2xl font-bold text-yellow-600">
            {formatarMoeda(totais.pendente)}
          </div>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <div className="text-sm text-muted-foreground">Total Geral</div>
          <div className="text-2xl font-bold">{formatarMoeda(totais.total)}</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          {/* Busca */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por descrição..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status */}
          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-full lg:w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="pago">Pago</SelectItem>
              <SelectItem value="pendente">Pendente</SelectItem>
              <SelectItem value="atrasado">Atrasado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          {/* Marca */}
          <Select value={filtroMarca} onValueChange={setFiltroMarca}>
            <SelectTrigger className="w-full lg:w-[160px]">
              <SelectValue placeholder="Marca" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as marcas</SelectItem>
              <SelectItem value="noro">NORO</SelectItem>
              <SelectItem value="nomade">Nomade</SelectItem>
              <SelectItem value="safetrip">SafeTrip</SelectItem>
              <SelectItem value="vistos">Vistos</SelectItem>
            </SelectContent>
          </Select>

          {/* Categoria */}
          <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas categorias</SelectItem>
              {categorias.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.icone} {cat.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Segunda linha: DateRange e ações */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <DateRangePicker
            dateFrom={dataInicio}
            dateTo={dataFim}
            onDateFromChange={setDataInicio}
            onDateToChange={setDataFim}
          />

          <div className="flex gap-2">
            {temFiltrosAtivos && (
              <Button variant="outline" onClick={handleLimparFiltros}>
                <X className="mr-2 h-4 w-4" />
                Limpar Filtros
              </Button>
            )}
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {/* Tabela de Receitas */}
      <div className="rounded-lg border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-4 text-left text-sm font-medium">Descrição</th>
                <th className="p-4 text-left text-sm font-medium">Marca</th>
                <th className="p-4 text-left text-sm font-medium">Categoria</th>
                <th className="p-4 text-left text-sm font-medium">Valor</th>
                <th className="p-4 text-left text-sm font-medium">Vencimento</th>
                <th className="p-4 text-left text-sm font-medium">Status</th>
                <th className="p-4 text-left text-sm font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {receitasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-muted-foreground">
                    Nenhuma receita encontrada
                  </td>
                </tr>
              ) : (
                receitasFiltradas.map((receita) => (
                  <tr key={receita.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="font-medium">{receita.descricao}</div>
                      {receita.recorrente && (
                        <div className="text-xs text-muted-foreground">
                          🔄 Recorrente
                        </div>
                      )}
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{receita.marca}</Badge>
                    </td>
                    <td className="p-4">
                      {receita.categoria && (
                        <div className="flex items-center gap-2">
                          <span>{receita.categoria.icone}</span>
                          <span className="text-sm">{receita.categoria.nome}</span>
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-medium">
                      {formatarMoeda(receita.valor_brl || 0)}
                    </td>
                    <td className="p-4 text-sm">
                      {formatarData(receita.data_vencimento)}
                    </td>
                    <td className="p-4">{getStatusBadge(receita.status)}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleVerDetalhes(receita)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditar(receita)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletar(receita)}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rodapé com contagem */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div>
          Mostrando <strong>{receitasFiltradas.length}</strong> de{' '}
          <strong>{receitas.length}</strong> receitas
        </div>
        {/* Paginação futura aqui */}
      </div>

      {/* Modals */}
      <ReceitaFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setReceitaSelecionada(null);
        }}
        receita={receitaSelecionada}
        categorias={categorias}
        contas={contas}
        tenantId={tenantId}
      />

      <ReceitaDetalhesModal
        isOpen={isDetalhesOpen}
        onClose={() => {
          setIsDetalhesOpen(false);
          setReceitaSelecionada(null);
        }}
        receita={receitaSelecionada}
      />
    </div>
  );
}
