'use client'

import { useState, useMemo } from 'react'
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  CreditCard,
  AlertCircle,
  Calendar,
  PieChart,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Link from 'next/link'

interface DuplicataReceber {
  id: string
  valor_total: number
  valor_recebido: number
  valor_pendente: number
  data_vencimento: string
  status: string
  marca: string
  moeda: string
}

interface DuplicataPagar {
  id: string
  valor_total: number
  valor_pago: number
  valor_pendente: number
  valor_credito_aplicado: number
  data_vencimento: string
  status: string
  marca: string
  moeda: string
}

interface Adiantamento {
  id: string
  valor_total: number
  valor_utilizado: number
  marca: string
  status: string
}

interface Credito {
  id: string
  valor_total: number
  valor_utilizado: number
  tipo_credito: string
  status: string
}

interface AgingReceber {
  faixa_vencimento: string
  quantidade: number
  valor_total: number
}

interface AgingPagar {
  faixa_vencimento: string
  quantidade: number
  valor_total: number
}

interface Props {
  duplicatasReceber: DuplicataReceber[]
  duplicatasPagar: DuplicataPagar[]
  adiantamentos: Adiantamento[]
  creditos: Credito[]
  agingReceber: AgingReceber[]
  agingPagar: AgingPagar[]
  tenantId: string
}

export default function DashboardClient({
  duplicatasReceber,
  duplicatasPagar,
  adiantamentos,
  creditos,
  agingReceber,
  agingPagar,
}: Props) {
  const [filtroMarca, setFiltroMarca] = useState('todas')
  const [periodo, setPeriodo] = useState('30') // dias

  // Filtrar dados por marca
  const dadosFiltrados = useMemo(() => {
    const receber = filtroMarca === 'todas' 
      ? duplicatasReceber 
      : duplicatasReceber.filter(d => d.marca === filtroMarca)
    
    const pagar = filtroMarca === 'todas'
      ? duplicatasPagar
      : duplicatasPagar.filter(d => d.marca === filtroMarca)

    return { receber, pagar }
  }, [duplicatasReceber, duplicatasPagar, filtroMarca])

  // Calcular totais de Receber
  const totaisReceber = useMemo(() => {
    return dadosFiltrados.receber.reduce(
      (acc, dup) => ({
        total: acc.total + dup.valor_total,
        recebido: acc.recebido + dup.valor_recebido,
        pendente: acc.pendente + dup.valor_pendente,
        vencidas: acc.vencidas + (
          new Date(dup.data_vencimento) < new Date() && dup.status !== 'recebida'
            ? dup.valor_pendente
            : 0
        ),
        quantidadeVencidas: acc.quantidadeVencidas + (
          new Date(dup.data_vencimento) < new Date() && dup.status !== 'recebida'
            ? 1
            : 0
        ),
      }),
      { total: 0, recebido: 0, pendente: 0, vencidas: 0, quantidadeVencidas: 0 }
    )
  }, [dadosFiltrados.receber])

  // Calcular totais de Pagar
  const totaisPagar = useMemo(() => {
    return dadosFiltrados.pagar.reduce(
      (acc, dup) => ({
        total: acc.total + dup.valor_total,
        pago: acc.pago + dup.valor_pago,
        pendente: acc.pendente + dup.valor_pendente,
        creditosAplicados: acc.creditosAplicados + dup.valor_credito_aplicado,
        vencidas: acc.vencidas + (
          new Date(dup.data_vencimento) < new Date() && dup.status !== 'paga'
            ? dup.valor_pendente
            : 0
        ),
        quantidadeVencidas: acc.quantidadeVencidas + (
          new Date(dup.data_vencimento) < new Date() && dup.status !== 'paga'
            ? 1
            : 0
        ),
      }),
      { total: 0, pago: 0, pendente: 0, creditosAplicados: 0, vencidas: 0, quantidadeVencidas: 0 }
    )
  }, [dadosFiltrados.pagar])

  // Calcular saldos de Adiantamentos
  const saldoAdiantamentos = useMemo(() => {
    return adiantamentos.reduce(
      (acc, adiant) => ({
        total: acc.total + adiant.valor_total,
        utilizado: acc.utilizado + adiant.valor_utilizado,
        disponivel: acc.disponivel + (adiant.valor_total - adiant.valor_utilizado),
      }),
      { total: 0, utilizado: 0, disponivel: 0 }
    )
  }, [adiantamentos])

  // Calcular saldos de Créditos
  const saldoCreditos = useMemo(() => {
    return creditos.reduce(
      (acc, cred) => ({
        total: acc.total + cred.valor_total,
        utilizado: acc.utilizado + cred.valor_utilizado,
        disponivel: acc.disponivel + (cred.valor_total - cred.valor_utilizado),
      }),
      { total: 0, utilizado: 0, disponivel: 0 }
    )
  }, [creditos])

  // Calcular fluxo de caixa (saldo líquido)
  const fluxoCaixa = totaisReceber.pendente - totaisPagar.pendente

  // Calcular duplicatas vencendo nos próximos X dias
  const duplicatasVencendo = useMemo(() => {
    const hoje = new Date()
    const dataLimite = new Date()
    dataLimite.setDate(dataLimite.getDate() + parseInt(periodo))

    const receberVencendo = dadosFiltrados.receber.filter((dup) => {
      const dataVenc = new Date(dup.data_vencimento)
      return dataVenc >= hoje && dataVenc <= dataLimite && dup.status !== 'recebida'
    })

    const pagarVencendo = dadosFiltrados.pagar.filter((dup) => {
      const dataVenc = new Date(dup.data_vencimento)
      return dataVenc >= hoje && dataVenc <= dataLimite && dup.status !== 'paga'
    })

    return {
      receber: {
        quantidade: receberVencendo.length,
        valor: receberVencendo.reduce((acc, d) => acc + d.valor_pendente, 0),
      },
      pagar: {
        quantidade: pagarVencendo.length,
        valor: pagarVencendo.reduce((acc, d) => acc + d.valor_pendente, 0),
      },
    }
  }, [dadosFiltrados, periodo])

  // Distribuição por status (Receber)
  const distribuicaoStatusReceber = useMemo(() => {
    const dist = dadosFiltrados.receber.reduce((acc: Record<string, number>, dup) => {
      acc[dup.status] = (acc[dup.status] || 0) + 1
      return acc
    }, {})
    return Object.entries(dist).map(([status, count]) => ({ status, count }))
  }, [dadosFiltrados.receber])

  // Distribuição por status (Pagar)
  const distribuicaoStatusPagar = useMemo(() => {
    const dist = dadosFiltrados.pagar.reduce((acc: Record<string, number>, dup) => {
      acc[dup.status] = (acc[dup.status] || 0) + 1
      return acc
    }, {})
    return Object.entries(dist).map(([status, count]) => ({ status, count }))
  }, [dadosFiltrados.pagar])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pendente: 'Pendente',
      parcialmente_recebida: 'Parcialmente Recebida',
      parcialmente_paga: 'Parcialmente Paga',
      recebida: 'Recebida',
      paga: 'Paga',
      vencida: 'Vencida',
      cancelada: 'Cancelada',
    }
    return labels[status] || status
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
          <p className="text-muted-foreground">Visão geral consolidada do sistema</p>
        </div>
        <div className="flex gap-2">
          <Select value={filtroMarca} onValueChange={setFiltroMarca}>
            <SelectTrigger className="w-[180px]">
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

          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Próximos 7 dias</SelectItem>
              <SelectItem value="15">Próximos 15 dias</SelectItem>
              <SelectItem value="30">Próximos 30 dias</SelectItem>
              <SelectItem value="60">Próximos 60 dias</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards Principais - Fluxo de Caixa */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total a Receber</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totaisReceber.pendente)}
            </div>
            <p className="text-xs text-muted-foreground">
              {dadosFiltrados.receber.filter(d => d.status !== 'recebida').length} duplicata(s) pendente(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total a Pagar</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totaisPagar.pendente)}
            </div>
            <p className="text-xs text-muted-foreground">
              {dadosFiltrados.pagar.filter(d => d.status !== 'paga').length} duplicata(s) pendente(s)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fluxo de Caixa</CardTitle>
            {fluxoCaixa >= 0 ? (
              <ArrowUpRight className="h-4 w-4 text-green-500" />
            ) : (
              <ArrowDownRight className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${fluxoCaixa >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(Math.abs(fluxoCaixa))}
            </div>
            <p className="text-xs text-muted-foreground">
              {fluxoCaixa >= 0 ? 'Saldo positivo' : 'Saldo negativo'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duplicatas Vencidas</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {totaisReceber.quantidadeVencidas + totaisPagar.quantidadeVencidas}
            </div>
            <p className="text-xs text-muted-foreground">
              {formatCurrency(totaisReceber.vencidas + totaisPagar.vencidas)} em atraso
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards Secundários - Adiantamentos e Créditos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Adiantamentos
            </CardTitle>
            <CardDescription>Saldo de adiantamentos a fornecedores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Adiantado:</span>
                <span className="font-medium">{formatCurrency(saldoAdiantamentos.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Utilizado:</span>
                <span className="font-medium text-orange-600">
                  {formatCurrency(saldoAdiantamentos.utilizado)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">Saldo Disponível:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(saldoAdiantamentos.disponivel)}
                </span>
              </div>
              <Link href="/financeiro/adiantamentos">
                <Button variant="outline" className="w-full mt-2">
                  Ver Adiantamentos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Créditos
            </CardTitle>
            <CardDescription>Créditos disponíveis de fornecedores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total em Créditos:</span>
                <span className="font-medium">{formatCurrency(saldoCreditos.total)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Utilizado:</span>
                <span className="font-medium text-orange-600">
                  {formatCurrency(saldoCreditos.utilizado)}
                </span>
              </div>
              <div className="flex justify-between border-t pt-2">
                <span className="text-sm font-medium">Saldo Disponível:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(saldoCreditos.disponivel)}
                </span>
              </div>
              <Link href="/financeiro/creditos">
                <Button variant="outline" className="w-full mt-2">
                  Ver Créditos
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Duplicatas Vencendo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Duplicatas Vencendo nos Próximos {periodo} Dias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold text-green-600">A Receber</h3>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Quantidade:</span>
                <Badge variant="secondary">{duplicatasVencendo.receber.quantidade}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor Total:</span>
                <span className="font-bold text-green-600">
                  {formatCurrency(duplicatasVencendo.receber.valor)}
                </span>
              </div>
              <Link href="/financeiro/duplicatas-receber">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Ver Duplicatas a Receber
                </Button>
              </Link>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-red-600">A Pagar</h3>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Quantidade:</span>
                <Badge variant="destructive">{duplicatasVencendo.pagar.quantidade}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Valor Total:</span>
                <span className="font-bold text-red-600">
                  {formatCurrency(duplicatasVencendo.pagar.valor)}
                </span>
              </div>
              <Link href="/financeiro/duplicatas-pagar">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  Ver Duplicatas a Pagar
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribuição por Status */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Distribuição - Duplicatas a Receber
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {distribuicaoStatusReceber.map(({ status, count }) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm">{getStatusLabel(status)}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
              {distribuicaoStatusReceber.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma duplicata a receber
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Distribuição - Duplicatas a Pagar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {distribuicaoStatusPagar.map(({ status, count }) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="text-sm">{getStatusLabel(status)}</span>
                  <Badge variant="secondary">{count}</Badge>
                </div>
              ))}
              {distribuicaoStatusPagar.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhuma duplicata a pagar
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo Geral */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo Geral do Período</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1">
              <h4 className="font-semibold text-green-600">Receitas</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Faturado:</span>
                  <span>{formatCurrency(totaisReceber.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Já Recebido:</span>
                  <span className="font-medium">{formatCurrency(totaisReceber.recebido)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pendente:</span>
                  <span className="font-medium">{formatCurrency(totaisReceber.pendente)}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold text-red-600">Despesas</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Devido:</span>
                  <span>{formatCurrency(totaisPagar.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Já Pago:</span>
                  <span className="font-medium">{formatCurrency(totaisPagar.pago)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pendente:</span>
                  <span className="font-medium">{formatCurrency(totaisPagar.pendente)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Créditos Aplicados:</span>
                  <span className="font-medium text-blue-600">
                    {formatCurrency(totaisPagar.creditosAplicados)}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold">Resultado</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Lucro Bruto:</span>
                  <span className={totaisReceber.recebido - totaisPagar.pago >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {formatCurrency(totaisReceber.recebido - totaisPagar.pago)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Margem:</span>
                  <span className="font-medium">
                    {totaisReceber.total > 0
                      ? `${(((totaisReceber.recebido - totaisPagar.pago) / totaisReceber.total) * 100).toFixed(1)}%`
                      : '0%'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
