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
  CreditCard,
} from 'lucide-react'
import { Button } from '@noro/ui'
import { Input } from '@noro/ui'
import { Badge } from '@noro/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@noro/ui'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@noro/ui'
import { useToast } from '@noro/ui'
import CreditoFormModal from './credito-form-modal'
import VerUtilizacoesModal from './ver-utilizacoes-modal'
import AplicarCreditoRapidoModal from './aplicar-credito-rapido-modal'

interface Credito {
  id: string
  fornecedor_id: string
  tipo_credito: 'refund' | 'overpayment' | 'promotional' | 'other'
  descricao: string
  valor_total: number
  valor_utilizado: number
  data_credito: string
  data_validade?: string
  marca: string
  moeda: string
  status: 'disponivel' | 'parcialmente_utilizado' | 'esgotado' | 'expirado'
  motivo?: string
  observacoes?: string
  fornecedor?: {
    nome: string
  }
}

interface Fornecedor {
  id: string
  nome: string
}

interface SaldoCredito {
  fornecedor_id: string
  fornecedor_nome: string
  tipo_credito: string
  total_credito: number
  total_utilizado: number
  saldo_disponivel: number
  quantidade_creditos: number
}

interface DuplicataPagar {
  id: string
  numero_documento: string
  descricao: string
  fornecedor_id: string
  valor_pendente: number
  moeda: string
  marca: string
}

interface Props {
  creditos: Credito[]
  fornecedores: Fornecedor[]
  saldos: SaldoCredito[]
  duplicatasPagar: DuplicataPagar[]
  tenantId: string
}

export default function CreditosClient({
  creditos: initialCreditos,
  fornecedores,
  saldos,
  duplicatasPagar,
  tenantId,
}: Props) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Estados de filtros
  const [busca, setBusca] = useState(searchParams?.get('busca') || '')
  const [filtroStatus, setFiltroStatus] = useState(searchParams?.get('status') || 'todos')
  const [filtroTipo, setFiltroTipo] = useState(searchParams?.get('tipo') || 'todos')
  const [filtroMarca, setFiltroMarca] = useState(searchParams?.get('marca') || 'todas')
  const [filtroFornecedor, setFiltroFornecedor] = useState(searchParams?.get('fornecedor') || 'todos')
  const [dataInicio, setDataInicio] = useState(searchParams?.get('data_inicio') || '')
  const [dataFim, setDataFim] = useState(searchParams?.get('data_fim') || '')

  // Estados de modais
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isUtilizacoesOpen, setIsUtilizacoesOpen] = useState(false)
  const [isAplicarOpen, setIsAplicarOpen] = useState(false)
  const [creditoSelecionado, setCreditoSelecionado] = useState<Credito | null>(null)

  // Estados de dados
  const [creditos, setCreditos] = useState(initialCreditos)
  const [loading, setLoading] = useState(false)

  // Sincronizar filtros com URL
  useEffect(() => {
    const params = new URLSearchParams()
    if (busca) params.set('busca', busca)
    if (filtroStatus !== 'todos') params.set('status', filtroStatus)
    if (filtroTipo !== 'todos') params.set('tipo', filtroTipo)
    if (filtroMarca !== 'todas') params.set('marca', filtroMarca)
    if (filtroFornecedor !== 'todos') params.set('fornecedor', filtroFornecedor)
    if (dataInicio) params.set('data_inicio', dataInicio)
    if (dataFim) params.set('data_fim', dataFim)

    router.replace(`?${params.toString()}`, { scroll: false })
  }, [busca, filtroStatus, filtroTipo, filtroMarca, filtroFornecedor, dataInicio, dataFim, router])

  // Filtrar créditos
  const creditosFiltrados = useMemo(() => {
    return creditos.filter((credito) => {
      // Filtro de busca
      if (busca) {
        const buscaLower = busca.toLowerCase()
        const matchBusca =
          credito.descricao?.toLowerCase().includes(buscaLower) ||
          credito.fornecedor?.nome?.toLowerCase().includes(buscaLower) ||
          credito.motivo?.toLowerCase().includes(buscaLower)
        if (!matchBusca) return false
      }

      // Filtro de status
      if (filtroStatus !== 'todos' && credito.status !== filtroStatus) {
        return false
      }

      // Filtro de tipo
      if (filtroTipo !== 'todos' && credito.tipo_credito !== filtroTipo) {
        return false
      }

      // Filtro de marca
      if (filtroMarca !== 'todas' && credito.marca !== filtroMarca) {
        return false
      }

      // Filtro de fornecedor
      if (filtroFornecedor !== 'todos' && credito.fornecedor_id !== filtroFornecedor) {
        return false
      }

      // Filtro de data
      if (dataInicio || dataFim) {
        const dataCredito = new Date(credito.data_credito)
        if (dataInicio && dataCredito < new Date(dataInicio)) return false
        if (dataFim && dataCredito > new Date(dataFim)) return false
      }

      return true
    })
  }, [creditos, busca, filtroStatus, filtroTipo, filtroMarca, filtroFornecedor, dataInicio, dataFim])

  // Calcular totais
  const totais = useMemo(() => {
    return creditosFiltrados.reduce(
      (acc, credito) => {
        const saldoDisponivel = credito.valor_total - credito.valor_utilizado
        return {
          total: acc.total + credito.valor_total,
          utilizado: acc.utilizado + credito.valor_utilizado,
          disponivel: acc.disponivel + saldoDisponivel,
        }
      },
      { total: 0, utilizado: 0, disponivel: 0 }
    )
  }, [creditosFiltrados])

  // Função para formatar moeda
  const formatCurrency = (value: number, moeda: string = 'BRL') => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: moeda,
    }).format(value)
  }

  // Função para obter badge de tipo de crédito
  const getTipoCreditoBadge = (tipo: string) => {
    const badges = {
      refund: { variant: 'outline' as const, label: 'Reembolso', className: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200' },
      overpayment: { variant: 'outline' as const, label: 'Pagamento Excedente', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200' },
      promotional: { variant: 'outline' as const, label: 'Promocional', className: 'bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200' },
      other: { variant: 'secondary' as const, label: 'Outro', className: '' },
    }
    return badges[tipo as keyof typeof badges] || { variant: 'secondary' as const, label: tipo, className: '' }
  }

  // Função para obter badge de status
  const getStatusBadge = (status: string) => {
    const badges = {
      disponivel: { variant: 'outline' as const, label: 'Disponível', className: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200' },
      parcialmente_utilizado: { variant: 'outline' as const, label: 'Parcialmente Utilizado', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200' },
      esgotado: { variant: 'destructive' as const, label: 'Esgotado', className: '' },
      expirado: { variant: 'secondary' as const, label: 'Expirado', className: '' },
    }
    return badges[status as keyof typeof badges] || { variant: 'secondary' as const, label: status, className: '' }
  }

  // Função para recarregar créditos
  const recarregarCreditos = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/creditos?tenant_id=${tenantId}`)
      if (res.ok) {
        const data = await res.json()
        setCreditos(data)
      }
    } catch (error) {
      console.error('Erro ao recarregar créditos:', error)
    } finally {
      setLoading(false)
    }
  }

  // Função para deletar crédito
  const handleDeletar = async (id: string) => {
    const credito = creditos.find((c) => c.id === id)
    if (!credito) return

    if (credito.valor_utilizado > 0) {
      toast({
        title: 'Não é possível deletar',
        description: 'Este crédito já foi utilizado em duplicatas.',
        variant: 'destructive',
      })
      return
    }

    if (!confirm('Tem certeza que deseja deletar este crédito?')) {
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/creditos/${id}?tenant_id=${tenantId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        toast({
          title: 'Sucesso',
          description: 'Crédito deletado com sucesso!',
          variant: 'success',
        })
      } else {
        const error = await res.json()
        toast({
          title: 'Erro ao deletar crédito',
          description: error.error || 'Tente novamente.',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Erro ao deletar crédito:', error)
      toast({
        title: 'Erro ao deletar crédito',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para abrir modal de edição
  const handleEditar = (credito: Credito) => {
    setCreditoSelecionado(credito)
    setIsFormOpen(true)
  }

  // Função para abrir modal de utilizações
  const handleVerUtilizacoes = (credito: Credito) => {
    setCreditoSelecionado(credito)
    setIsUtilizacoesOpen(true)
  }

  // Função para abrir modal de aplicar crédito
  const handleAplicar = (credito: Credito) => {
    const saldoDisponivel = credito.valor_total - credito.valor_utilizado
    if (saldoDisponivel <= 0) {
      toast({
        title: 'Crédito sem saldo disponível',
        variant: 'destructive',
      })
      return
    }
    setCreditoSelecionado(credito)
    setIsAplicarOpen(true)
  }

  // Função para abrir modal de criação
  const handleNovo = () => {
    setCreditoSelecionado(null)
    setIsFormOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Créditos de Fornecedores</h1>
          <p className="text-muted-foreground">
            Gerencie reembolsos, pagamentos excedentes e créditos promocionais
          </p>
        </div>
        <Button onClick={handleNovo}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Crédito
        </Button>
      </div>

      {/* Cards de Saldos */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Créditos</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totais.total)}</div>
            <p className="text-xs text-muted-foreground">
              {creditosFiltrados.length} crédito(s)
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
              Já aplicado em duplicatas
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
              Disponível para aplicar
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
          <div className="grid gap-4 md:grid-cols-7">
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
                <SelectItem value="expirado">Expirado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                <SelectItem value="refund">Reembolso</SelectItem>
                <SelectItem value="overpayment">Pagamento Excedente</SelectItem>
                <SelectItem value="promotional">Promocional</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
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

            <Input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              placeholder="Data início"
            />

            <Input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              placeholder="Data fim"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Créditos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : creditosFiltrados.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              Nenhum crédito encontrado
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-3 text-left font-medium">Fornecedor</th>
                    <th className="pb-3 text-left font-medium">Tipo</th>
                    <th className="pb-3 text-left font-medium">Descrição</th>
                    <th className="pb-3 text-left font-medium">Marca</th>
                    <th className="pb-3 text-right font-medium">Valor Total</th>
                    <th className="pb-3 text-right font-medium">Utilizado</th>
                    <th className="pb-3 text-right font-medium">Saldo Disponível</th>
                    <th className="pb-3 text-left font-medium">Data</th>
                    <th className="pb-3 text-left font-medium">Validade</th>
                    <th className="pb-3 text-left font-medium">Status</th>
                    <th className="pb-3 text-right font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {creditosFiltrados.map((credito) => {
                    const saldoDisponivel = credito.valor_total - credito.valor_utilizado
                    const tipoBadge = getTipoCreditoBadge(credito.tipo_credito)
                    const statusBadge = getStatusBadge(credito.status)
                    const isExpirado = credito.data_validade && new Date(credito.data_validade) < new Date()

                    return (
                      <tr key={credito.id} className="border-b">
                        <td className="py-3">{credito.fornecedor?.nome || '-'}</td>
                        <td className="py-3">
                          <Badge variant={tipoBadge.variant} className={tipoBadge.className}>{tipoBadge.label}</Badge>
                        </td>
                        <td className="py-3">{credito.descricao}</td>
                        <td className="py-3">
                          <Badge variant="secondary">{credito.marca}</Badge>
                        </td>
                        <td className="py-3 text-right">
                          {formatCurrency(credito.valor_total, credito.moeda)}
                        </td>
                        <td className="py-3 text-right text-orange-600">
                          {formatCurrency(credito.valor_utilizado, credito.moeda)}
                        </td>
                        <td className="py-3 text-right font-semibold text-green-600">
                          {formatCurrency(saldoDisponivel, credito.moeda)}
                        </td>
                        <td className="py-3">
                          {new Date(credito.data_credito).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-3">
                          {credito.data_validade ? (
                            <span className={isExpirado ? 'text-red-600 font-medium' : ''}>
                              {new Date(credito.data_validade).toLocaleDateString('pt-BR')}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        <td className="py-3">
                          <Badge variant={statusBadge.variant} className={statusBadge.className}>{statusBadge.label}</Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAplicar(credito)}
                              disabled={!!(saldoDisponivel <= 0 || isExpirado)}
                              title="Aplicar a duplicata"
                            >
                              <CreditCard className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleVerUtilizacoes(credito)}
                              title="Ver utilizações"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditar(credito)}
                              title="Editar"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeletar(credito.id)}
                              disabled={credito.valor_utilizado > 0}
                              title={
                                credito.valor_utilizado > 0
                                  ? 'Não é possível deletar crédito já utilizado'
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
      <CreditoFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setCreditoSelecionado(null)
        }}
        credito={creditoSelecionado}
        fornecedores={fornecedores}
        tenantId={tenantId}
        onSuccess={recarregarCreditos}
      />

      <VerUtilizacoesModal
        isOpen={isUtilizacoesOpen}
        onClose={() => {
          setIsUtilizacoesOpen(false)
          setCreditoSelecionado(null)
        }}
        credito={creditoSelecionado}
        tenantId={tenantId}
      />

      <AplicarCreditoRapidoModal
        isOpen={isAplicarOpen}
        onClose={() => {
          setIsAplicarOpen(false)
          setCreditoSelecionado(null)
        }}
        credito={creditoSelecionado}
        duplicatasPagar={duplicatasPagar}
        tenantId={tenantId}
        onSuccess={recarregarCreditos}
      />
    </div>
  )
}
