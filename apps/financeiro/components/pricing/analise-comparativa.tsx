'use client'

import { useState } from 'react'
import { format, subMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge'

interface AnaliseComparativaProps {
  periodoAtual: {
    dataInicial: Date
    dataFinal: Date
    metricas: {
      margemMedia: number
      markupMedio: number
      variacaoCustos: number
      variacaoPrecos: number
      efetividadeRegras: number
      distribuicaoMargens: Array<{
        faixa: string
        quantidade: number
        percentual: number
      }>
      evolucaoMargens: Array<{
        data: string
        margem: number
        markup: number
      }>
    }
  }
  periodoAnterior: {
    dataInicial: Date
    dataFinal: Date
    metricas: {
      margemMedia: number
      markupMedio: number
      variacaoCustos: number
      variacaoPrecos: number
      efetividadeRegras: number
      distribuicaoMargens: Array<{
        faixa: string
        quantidade: number
        percentual: number
      }>
      evolucaoMargens: Array<{
        data: string
        margem: number
        markup: number
      }>
    }
  }
  onPeriodosChange: (periodoAtual: { dataInicial: Date; dataFinal: Date }, periodoAnterior: { dataInicial: Date; dataFinal: Date }) => void
}

export function AnaliseComparativa({
  periodoAtual,
  periodoAnterior,
  onPeriodosChange
}: AnaliseComparativaProps) {
  const [tipoComparacao, setTipoComparacao] = useState<'margens' | 'custos' | 'precos' | 'efetividade'>('margens')
  
  const calcularVariacao = (atual: number, anterior: number) => {
    const variacao = ((atual - anterior) / anterior) * 100
    return {
      valor: variacao.toFixed(2),
      positiva: variacao >= 0
    }
  }

  const formatarData = (data: Date) => {
    return format(data, 'dd/MM/yyyy', { locale: ptBR })
  }

  const selecionarPeriodoPadrao = (meses: number) => {
    const dataFinalAtual = new Date()
    const dataInicialAtual = subMonths(dataFinalAtual, meses)
    const dataFinalAnterior = subMonths(dataInicialAtual, 1)
    const dataInicialAnterior = subMonths(dataFinalAnterior, meses)

    onPeriodosChange(
      { dataInicial: dataInicialAtual, dataFinal: dataFinalAtual },
      { dataInicial: dataInicialAnterior, dataFinal: dataFinalAnterior }
    )
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Select
            value={tipoComparacao}
            onValueChange={(value: 'margens' | 'custos' | 'precos' | 'efetividade') => 
              setTipoComparacao(value)
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o tipo de comparação" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipo de Comparação</SelectLabel>
                <SelectItem value="margens">Margens</SelectItem>
                <SelectItem value="custos">Custos</SelectItem>
                <SelectItem value="precos">Preços</SelectItem>
                <SelectItem value="efetividade">Efetividade de Regras</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => selecionarPeriodoPadrao(1)}
          >
            Último Mês
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => selecionarPeriodoPadrao(3)}
          >
            Último Trimestre
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => selecionarPeriodoPadrao(6)}
          >
            Último Semestre
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !periodoAtual && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {periodoAtual ? (
                  <>{formatarData(periodoAtual.dataInicial)} - {formatarData(periodoAtual.dataFinal)}</>
                ) : (
                  <span>Selecione o período atual</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={periodoAtual.dataInicial}
                selected={{
                  from: periodoAtual.dataInicial,
                  to: periodoAtual.dataFinal,
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    onPeriodosChange(
                      { dataInicial: range.from, dataFinal: range.to },
                      periodoAnterior
                    )
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <span className="text-sm text-muted-foreground">vs</span>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !periodoAnterior && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {periodoAnterior ? (
                  <>{formatarData(periodoAnterior.dataInicial)} - {formatarData(periodoAnterior.dataFinal)}</>
                ) : (
                  <span>Selecione o período anterior</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={periodoAnterior.dataInicial}
                selected={{
                  from: periodoAnterior.dataInicial,
                  to: periodoAnterior.dataFinal,
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    onPeriodosChange(
                      periodoAtual,
                      { dataInicial: range.from, dataFinal: range.to }
                    )
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Indicadores */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Margem Média
            </CardTitle>
            {calcularVariacao(
              periodoAtual.metricas.margemMedia,
              periodoAnterior.metricas.margemMedia
            ).positiva ? (
              <Badge variant="success">+{calcularVariacao(
                periodoAtual.metricas.margemMedia,
                periodoAnterior.metricas.margemMedia
              ).valor}%</Badge>
            ) : (
              <Badge variant="destructive">{calcularVariacao(
                periodoAtual.metricas.margemMedia,
                periodoAnterior.metricas.margemMedia
              ).valor}%</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {periodoAtual.metricas.margemMedia.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Período anterior: {periodoAnterior.metricas.margemMedia.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Markup Médio
            </CardTitle>
            {calcularVariacao(
              periodoAtual.metricas.markupMedio,
              periodoAnterior.metricas.markupMedio
            ).positiva ? (
              <Badge variant="success">+{calcularVariacao(
                periodoAtual.metricas.markupMedio,
                periodoAnterior.metricas.markupMedio
              ).valor}%</Badge>
            ) : (
              <Badge variant="destructive">{calcularVariacao(
                periodoAtual.metricas.markupMedio,
                periodoAnterior.metricas.markupMedio
              ).valor}%</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {periodoAtual.metricas.markupMedio.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Período anterior: {periodoAnterior.metricas.markupMedio.toFixed(2)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Variação de Custos
            </CardTitle>
            {calcularVariacao(
              periodoAtual.metricas.variacaoCustos,
              periodoAnterior.metricas.variacaoCustos
            ).positiva ? (
              <Badge variant="destructive">+{calcularVariacao(
                periodoAtual.metricas.variacaoCustos,
                periodoAnterior.metricas.variacaoCustos
              ).valor}%</Badge>
            ) : (
              <Badge variant="success">{calcularVariacao(
                periodoAtual.metricas.variacaoCustos,
                periodoAnterior.metricas.variacaoCustos
              ).valor}%</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {periodoAtual.metricas.variacaoCustos.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Período anterior: {periodoAnterior.metricas.variacaoCustos.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Efetividade das Regras
            </CardTitle>
            {calcularVariacao(
              periodoAtual.metricas.efetividadeRegras,
              periodoAnterior.metricas.efetividadeRegras
            ).positiva ? (
              <Badge variant="success">+{calcularVariacao(
                periodoAtual.metricas.efetividadeRegras,
                periodoAnterior.metricas.efetividadeRegras
              ).valor}%</Badge>
            ) : (
              <Badge variant="destructive">{calcularVariacao(
                periodoAtual.metricas.efetividadeRegras,
                periodoAnterior.metricas.efetividadeRegras
              ).valor}%</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {periodoAtual.metricas.efetividadeRegras.toFixed(2)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Período anterior: {periodoAnterior.metricas.efetividadeRegras.toFixed(2)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Evolução das Margens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={[
                    ...periodoAnterior.metricas.evolucaoMargens.map(item => ({
                      ...item,
                      periodo: 'Anterior'
                    })),
                    ...periodoAtual.metricas.evolucaoMargens.map(item => ({
                      ...item,
                      periodo: 'Atual'
                    }))
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="data" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="margem"
                    stroke="#8884d8"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    type="monotone"
                    dataKey="markup"
                    stroke="#82ca9d"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição das Margens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    ...periodoAnterior.metricas.distribuicaoMargens.map(item => ({
                      ...item,
                      periodo: 'Anterior'
                    })),
                    ...periodoAtual.metricas.distribuicaoMargens.map(item => ({
                      ...item,
                      periodo: 'Atual'
                    }))
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="faixa" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="percentual" fill="#8884d8" name="Percentual" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}