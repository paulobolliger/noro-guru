'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
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
  TrendingUp, 
  TrendingDown, 
  AlertCircle,
  Calendar,
  DollarSign,
  Target,
  Briefcase,
  Users,
  MapPin,
  PackageOpen
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import Link from 'next/link';
import { CentroCustoFormModal } from './centro-custo-form-modal';
import type { FinCentroCusto, TipoCentroCusto, StatusCentroCusto } from '@/types/financeiro';

interface CentrosCustoClientProps {
  centrosCusto: any[];
  tenantId: string;
}

export function CentrosCustoClient({ centrosCusto, tenantId }: CentrosCustoClientProps) {
  const router = useRouter();
  const { showToast } = useToast();
  
  const [busca, setBusca] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');
  const [filtroMarca, setFiltroMarca] = useState<string>('todas');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [centroCustoSelecionado, setCentroCustoSelecionado] = useState<any>(null);

  // Filtrar centros de custo
  const centrosFiltrados = useMemo(() => {
    return centrosCusto.filter((cc) => {
      const matchBusca =
        busca === '' ||
        cc.nome.toLowerCase().includes(busca.toLowerCase()) ||
        cc.codigo.toLowerCase().includes(busca.toLowerCase());
      const matchTipo = filtroTipo === 'todos' || cc.tipo === filtroTipo;
      const matchStatus = filtroStatus === 'todos' || cc.status === filtroStatus;
      const matchMarca = filtroMarca === 'todas' || cc.marca === filtroMarca;

      return matchBusca && matchTipo && matchStatus && matchMarca;
    });
  }, [centrosCusto, busca, filtroTipo, filtroStatus, filtroMarca]);

  // Estatísticas gerais
  const stats = useMemo(() => {
    const ativos = centrosCusto.filter(cc => cc.status === 'ativo');
    const totalReceitas = centrosCusto.reduce((sum, cc) => sum + (cc.rentabilidade.receitas_total || 0), 0);
    const totalDespesas = centrosCusto.reduce((sum, cc) => sum + (cc.rentabilidade.despesas_total || 0), 0);
    const margemMedia = centrosCusto.length > 0
      ? centrosCusto.reduce((sum, cc) => sum + (cc.rentabilidade.margem_percentual || 0), 0) / centrosCusto.length
      : 0;

    return {
      total: centrosCusto.length,
      ativos: ativos.length,
      totalReceitas,
      totalDespesas,
      margemGeral: totalReceitas > 0 ? ((totalReceitas - totalDespesas) / totalReceitas) * 100 : 0,
      margemMedia,
    };
  }, [centrosCusto]);

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = (status: StatusCentroCusto) => {
    const variants: Record<StatusCentroCusto, any> = {
      planejamento: { label: 'Planejamento', className: 'bg-blue-100 text-blue-800' },
      ativo: { label: 'Ativo', className: 'bg-green-100 text-green-800' },
      concluido: { label: 'Concluído', className: 'bg-gray-100 text-gray-800' },
      cancelado: { label: 'Cancelado', className: 'bg-red-100 text-red-800' },
    };

    const variant = variants[status];
    return (
      <Badge className={variant.className} variant="outline">
        {variant.label}
      </Badge>
    );
  };

  const getTipoIcon = (tipo: TipoCentroCusto) => {
    const icons: Record<TipoCentroCusto, any> = {
      viagem: <MapPin className="h-5 w-5" />,
      grupo: <Users className="h-5 w-5" />,
      cliente: <Briefcase className="h-5 w-5" />,
      projeto: <PackageOpen className="h-5 w-5" />,
      evento: <Calendar className="h-5 w-5" />,
      outros: <Target className="h-5 w-5" />,
    };
    return icons[tipo] || icons.outros;
  };

  const getMargemColor = (margem: number) => {
    if (margem >= 15) return 'text-green-600';
    if (margem >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getMargemBg = (margem: number) => {
    if (margem >= 15) return 'bg-green-50 border-green-200';
    if (margem >= 10) return 'bg-yellow-50 border-yellow-200';
    return 'bg-red-50 border-red-200';
  };

  const handleNovo = () => {
    setCentroCustoSelecionado(null);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total de Projetos</p>
              <p className="text-2xl font-bold">{stats.total}</p>
              <p className="text-xs text-muted-foreground mt-1">{stats.ativos} ativos</p>
            </div>
            <Target className="h-10 w-10 text-blue-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Receitas Totais</p>
              <p className="text-2xl font-bold text-green-600">
                {formatarMoeda(stats.totalReceitas)}
              </p>
            </div>
            <TrendingUp className="h-10 w-10 text-green-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Despesas Totais</p>
              <p className="text-2xl font-bold text-red-600">
                {formatarMoeda(stats.totalDespesas)}
              </p>
            </div>
            <TrendingDown className="h-10 w-10 text-red-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Margem Geral</p>
              <p className={`text-2xl font-bold ${getMargemColor(stats.margemGeral)}`}>
                {stats.margemGeral.toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Média: {stats.margemMedia.toFixed(1)}%
              </p>
            </div>
            <DollarSign className="h-10 w-10 text-purple-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="flex items-center gap-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome ou código..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="max-w-sm"
          />
          
          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              <SelectItem value="viagem">Viagem</SelectItem>
              <SelectItem value="grupo">Grupo</SelectItem>
              <SelectItem value="cliente">Cliente</SelectItem>
              <SelectItem value="projeto">Projeto</SelectItem>
              <SelectItem value="evento">Evento</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroStatus} onValueChange={setFiltroStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os status</SelectItem>
              <SelectItem value="planejamento">Planejamento</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="concluido">Concluído</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filtroMarca} onValueChange={setFiltroMarca}>
            <SelectTrigger className="w-[180px]">
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

          <div className="flex-1" />
          <Button onClick={handleNovo}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Modal de Formulário */}
      <CentroCustoFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        centroCusto={centroCustoSelecionado}
        tenantId={tenantId}
      />

      {/* Grid de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {centrosFiltrados.map((cc) => (
          <Link 
            key={cc.id} 
            href={`/centros-custo/${cc.id}`}
            className={`block bg-white rounded-lg shadow border-2 hover:shadow-lg transition-shadow ${getMargemBg(cc.rentabilidade.margem_percentual)}`}
          >
            <div className="p-6 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white rounded-lg border">
                    {getTipoIcon(cc.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{cc.nome}</h3>
                    <p className="text-sm text-muted-foreground">{cc.codigo}</p>
                  </div>
                </div>
                {getStatusBadge(cc.status)}
              </div>

              {/* Datas */}
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{formatarData(cc.data_inicio)}</span>
                {cc.data_fim && (
                  <>
                    <span>→</span>
                    <span>{formatarData(cc.data_fim)}</span>
                  </>
                )}
              </div>

              {/* Margem Destaque */}
              <div className="text-center py-4 bg-white rounded-lg border">
                <p className="text-sm text-muted-foreground mb-1">Margem Líquida</p>
                <p className={`text-3xl font-bold ${getMargemColor(cc.rentabilidade.margem_percentual)}`}>
                  {cc.rentabilidade.margem_percentual.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Meta: {cc.meta_margem_percentual}%
                </p>
              </div>

              {/* Financeiro */}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Receitas</p>
                  <p className="font-semibold text-green-600">
                    {formatarMoeda(cc.rentabilidade.receitas_total)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Despesas</p>
                  <p className="font-semibold text-red-600">
                    {formatarMoeda(cc.rentabilidade.despesas_total)}
                  </p>
                </div>
              </div>

              {/* Orçamento */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Orçamento</span>
                  <span className="font-medium">
                    {cc.rentabilidade.percentual_orcamento_utilizado.toFixed(0)}% utilizado
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      cc.rentabilidade.percentual_orcamento_utilizado > 100
                        ? 'bg-red-500'
                        : cc.rentabilidade.percentual_orcamento_utilizado > 80
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(cc.rentabilidade.percentual_orcamento_utilizado, 100)}%` }}
                  />
                </div>
              </div>

              {/* Alertas */}
              {(cc.rentabilidade.margem_percentual < cc.meta_margem_percentual || 
                cc.rentabilidade.percentual_orcamento_utilizado > 90) && (
                <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-xs text-yellow-800">
                    {cc.rentabilidade.margem_percentual < cc.meta_margem_percentual && (
                      <p>Margem abaixo da meta</p>
                    )}
                    {cc.rentabilidade.percentual_orcamento_utilizado > 90 && (
                      <p>Orçamento quase esgotado</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {centrosFiltrados.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">Nenhum centro de custo encontrado</p>
        </div>
      )}
    </div>
  );
}
