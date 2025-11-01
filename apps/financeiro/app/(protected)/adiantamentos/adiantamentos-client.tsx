'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import AdiantamentoFormModal from './adiantamento-form-modal'
import VerUtilizacoesModal from './ver-utilizacoes-modal'

interface Adiantamento {
  id: string
  fornecedor_id: string
  descricao: string
  valor_total: number
  valor_utilizado: number
  data_adiantamento: string
  marca: string
  moeda: string
  status: 'disponivel' | 'parcialmente_utilizado' | 'esgotado'
  observacoes?: string
  fornecedor?: {
    nome: string
  }
}

interface Fornecedor {
  id: string
  nome: string
}

interface SaldoAdiantamento {
  fornecedor_id: string
  fornecedor_nome: string
  marca: string
  total_adiantado: number
  total_utilizado: number
  saldo_disponivel: number
  quantidade_adiantamentos: number
}

interface Props {
  adiantamentos: Adiantamento[]
  fornecedores: Fornecedor[]
  saldos: SaldoAdiantamento[]
  tenantId: string
}

export default function AdiantamentosClient({
  adiantamentos: initialAdiantamentos,
  fornecedores,
  saldos,
  tenantId,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { showToast } = useToast()

  // Estados de filtros
  const [busca, setBusca] = useState(searchParams.get('busca') || '')
  const [filtroStatus, setFiltroStatus] = useState(searchParams.get('status') || 'todos')
  const [filtroMarca, setFiltroMarca] = useState(searchParams.get('marca') || 'todas')
  const [filtroFornecedor, setFiltroFornecedor] = useState(searchParams.get('fornecedor') || 'todos')
  const [dataInicio, setDataInicio] = useState(searchParams.get('data_inicio') || '')
  const [dataFim, setDataFim] = useState(searchParams.get('data_fim') || '')

  // Estados de modais
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isUtilizacoesOpen, setIsUtilizacoesOpen] = useState(false)
  const [adiantamentoSelecionado, setAdiantamentoSelecionado] = useState<Adiantamento | null>(null)

  // Estados de dados
  const [adiantamentos, setAdiantamentos] = useState(initialAdiantamentos)
  const [loading, setLoading] = useState(false)

  // Sincronizar filtros com URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (busca) params.set('busca', busca)
    if (filtroStatus !== 'todos') params.set('status', filtroStatus)
    if (filtroMarca !== 'todas') params.set('marca', filtroMarca)
    if (filtroFornecedor !== 'todos') params.set('fornecedor', filtroFornecedor)
    if (dataInicio) params.set('data_inicio', dataInicio)
    if (dataFim) params.set('data_fim', dataFim)

    router.replace(`?${params.toString()}`, { scroll: false })
  }, [busca, filtroStatus, filtroMarca, filtroFornecedor, dataInicio, dataFim, router])

  // Filtrar adiantamentos
  const adiantamentosFiltrados = useMemo(() => {
    return adiantamentos.filter((adiantamento) => {
      // Filtro de busca
      if (busca) {
        const buscaLower = busca.toLowerCase()
        const matchBusca =
          adiantamento.descricao?.toLowerCase().includes(buscaLower) ||
          adiantamento.fornecedor?.nome?.toLowerCase().includes(buscaLower) ||
          adiantamento.marca?.toLowerCase().includes(buscaLower)
        if (!matchBusca) return false
      }

      // Filtro de status
      if (filtroStatus !== 'todos' && adiantamento.status !== filtroStatus) {
        return false
      }

      // Filtro de marca
      if (filtroMarca !== 'todas' && adiantamento.marca !== filtroMarca) {
        return false
      }

      // Filtro de fornecedor
      if (filtroFornecedor !== 'todos' && adiantamento.fornecedor_id !== filtroFornecedor) {
        return false
      }

      // Filtro de data
      if (dataInicio || dataFim) {
        const dataAdiantamento = new Date(adiantamento.data_adiantamento)
        if (dataInicio && dataAdiantamento < new Date(dataInicio)) return false
        if (dataFim && dataAdiantamento > new Date(dataFim)) return false
      }

      return true
    })
  }, [adiantamentos, busca, filtroStatus, filtroMarca, filtroFornecedor, dataInicio, dataFim])

  // Calcular totais
  const totais = useMemo(() => {
    return adiantamentosFiltrados.reduce(
      (acc, adiantamento) => {
        const saldoDisponivel = adiantamento.valor_total - adiantamento.valor_utilizado
        return {
          total: acc.total + adiantamento.valor_total,
          utilizado: acc.utilizado + adiantamento.valor_utilizado,
          disponivel: acc.disponivel + saldoDisponivel,
        }
      },
      { total: 0, utilizado: 0, disponivel: 0 }
    )
  }, [adiantamentosFiltrados])

  // Função para formatar moeda
  const formatCurrency = (value: number, moeda: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: moeda,
    }).format(value)
  }

  // Função para obter badge de status
  const getStatusBadge = (status: string) => {
    const badges = {
      disponivel: { variant: 'success' as const, label: 'Disponível' },
      parcialmente_utilizado: { variant: 'warning' as const, label: 'Parcialmente Utilizado' },
      esgotado: { variant: 'destructive' as const, label: 'Esgotado' },
    }
    return badges[status as keyof typeof badges] || { variant: 'secondary' as const, label: status }
  }

  // Função para recarregar adiantamentos
  const recarregarAdiantamentos = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/adiantamentos?tenant_id=${tenantId}`)
      if (res.ok) {
        const data = await res.json()
        setAdiantamentos(data)
      }
    } catch (error) {
      console.error('Erro ao recarregar adiantamentos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Função para deletar adiantamento
  const handleDeletar = async (id: string) => {
    const adiantamento = adiantamentos.find((a) => a.id === id)
    if (!adiantamento) return

    if (adiantamento.valor_utilizado > 0) {
      showToast('error', 'Não é possível deletar', 'Este adiantamento já foi utilizado em duplicatas.')
      return
    }

    if (!confirm('Tem certeza que deseja deletar este adiantamento?')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/adiantamentos/${id}?tenant_id=${tenantId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        showToast('success', 'Adiantamento deletado com sucesso!')
        await recarregarAdiantamentos()
      } else {
        const error = await res.json()
        showToast('error', 'Erro ao deletar adiantamento', error.error || 'Tente novamente.')
      }
    } catch (error) {
      console.error('Erro ao deletar adiantamento:', error)
      showToast('error', 'Erro ao deletar adiantamento')
    } finally {
      setLoading(false)
    }
  }

  // Função para abrir modal de edição
  const handleEditar = (adiantamento: Adiantamento) => {
    setAdiantamentoSelecionado(adiantamento)
    setIsFormOpen(true)
  }

  // Função para abrir modal de utilizações
  const handleVerUtilizacoes = (adiantamento: Adiantamento) => {
    setAdiantamentoSelecionado(adiantamento)
    setIsUtilizacoesOpen(true)
  }

  // Função para abrir modal de criação
  const handleNovo = () => {
    setAdiantamentoSelecionado(null)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Adiantamentos</h1>
          <p className="text-muted-foreground">
            Gerencie adiantamentos feitos a fornecedores
          </p>
        </div>
        <Button onClick={handleNovo}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Adiantamento
        </Button>
      </div>

      {/* Cards de Saldos */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Adiantado</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totais.total)}</div>
            <p className="text-xs text-muted-foreground">
              {adiantamentosFiltrados.length} adiantamento(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilizado</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(totais.utilizado)}
            </div>
            <p className="text-xs text-muted-foreground">
              Já vinculado a duplicatas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
            <DollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totais.disponivel)}
            </div>
            <p className="text-xs text-muted-foreground">
              Disponível para uso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-6">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar..."
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Status</SelectItem>
                <SelectItem value="disponivel">Disponível</SelectItem>
                <SelectItem value="parcialmente_utilizado">Parcialmente Utilizado</SelectItem>
                <SelectItem value="esgotado">Esgotado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroMarca} onValueChange={setFiltroMarca}>
              <SelectTrigger>
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as Marcas</SelectItem>
                <SelectItem value="Atlantica">Atlantica</SelectItem>
                <SelectItem value="RateHawk">RateHawk</SelectItem>
                <SelectItem value="Hurb">Hurb</SelectItem>
                <SelectItem value="MaxMilhas">MaxMilhas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroFornecedor} onValueChange={setFiltroFornecedor}>
              <SelectTrigger>
                <SelectValue placeholder="Fornecedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Fornecedores</SelectItem>
                {fornecedores.map((fornecedor) => (
                  <SelectItem key={fornecedor.id} value={fornecedor.id}>
                    {fornecedor.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="md:col-span-1">
              <Input
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                placeholder="Data início"
              />
            </div>

            <div className="md:col-span-1">
              <Input
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                placeholder="Data fim"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Adiantamentos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : adiantamentosFiltrados.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              Nenhum adiantamento encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium">Fornecedor</th>
                    <th className="pb-3 text-left font-medium">Descrição</th>
                    <th className="pb-3 text-left font-medium">Marca</th>
                    <th className="pb-3 text-right font-medium">Valor Total</th>
                    <th className="pb-3 text-right font-medium">Utilizado</th>
                    <th className="pb-3 text-right font-medium">Saldo Disponível</th>
                    <th className="pb-3 text-left font-medium">Data</th>
                    <th className="pb-3 text-left font-medium">Status</th>
                    <th className="pb-3 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {adiantamentosFiltrados.map((adiantamento) => {
                    const saldoDisponivel = adiantamento.valor_total - adiantamento.valor_utilizado
                    const statusBadge = getStatusBadge(adiantamento.status)

                    return (
                      <tr key={adiantamento.id} className="border-b">
                        <td className="py-3">{adiantamento.fornecedor?.nome || '-'}</td>
                        <td className="py-3">{adiantamento.descricao}</td>
                        <td className="py-3">
                          <Badge variant="secondary">{adiantamento.marca}</Badge>
                        </td>
                        <td className="py-3 text-right">
                          {formatCurrency(adiantamento.valor_total, adiantamento.moeda)}
                        </td>
                        <td className="py-3 text-right text-orange-600">
                          {formatCurrency(adiantamento.valor_utilizado, adiantamento.moeda)}
                        </td>
                        <td className="py-3 text-right font-semibold text-green-600">
                          {formatCurrency(saldoDisponivel, adiantamento.moeda)}
                        </td>
                        <td className="py-3">
                          {new Date(adiantamento.data_adiantamento).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3">
                          <Badge variant={statusBadge.variant}>{statusBadge.label}</Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerUtilizacoes(adiantamento)}
                              title="Ver utilizações"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditar(adiantamento)}
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletar(adiantamento.id)}
                              disabled={adiantamento.valor_utilizado > 0}
                              title={
                                adiantamento.valor_utilizado > 0
                                  ? 'Não é possível deletar adiantamento já utilizado'
                                  : 'Deletar'
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modais */}
      <AdiantamentoFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setAdiantamentoSelecionado(null)
        }}
        adiantamento={adiantamentoSelecionado}
        fornecedores={fornecedores}
        tenantId={tenantId}
        onSuccess={recarregarAdiantamentos}
      />

      <VerUtilizacoesModal
        isOpen={isUtilizacoesOpen}
        onClose={() => {
          setIsUtilizacoesOpen(false)
          setAdiantamentoSelecionado(null)
        }}
        adiantamento={adiantamentoSelecionado}
        tenantId={tenantId}
      />
    </div>
  )
}
