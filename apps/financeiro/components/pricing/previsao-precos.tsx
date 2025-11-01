'use client'

import { useState } from 'react'
import { format, addMonths } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { 
  LineChart, 
  Line,
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from '@/components/ui/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from '@/lib/utils'

interface PrevisaoPrecosProps {
  tendenciasGerais: {
    custos: { tendencia: number; media: number; desvio: number }
    precos: { tendencia: number; media: number; desvio: number }
    markup: { tendencia: number; media: number; desvio: number }
    margem: { tendencia: number; media: number; desvio: number }
  }
  previsoes: Array<{
    periodo: string
    custo: number
    preco: number
    markup: number
    margem: number
  }>
  tendenciasCategorias: Array<{
    categoria: string
    tendencia_preco: number
    tendencia_markup: number
    tendencia_margem: number
    preco_medio: number
    markup_medio: number
    margem_media: number
  }>
  sazonalidade: Array<{
    mes: number
    indice_preco: number
    indice_markup: number
  }>
  metricasConfianca: {
    periodo_analise: {
      inicio: string
      fim: string
    }
    total_registros: number
    categorias_analisadas: number
  }
  onPeriodoChange: (inicio: Date, fim: Date, periodos: number) => void
}

export function PrevisaoPrecos({
  tendenciasGerais,
  previsoes,
  tendenciasCategorias,
  sazonalidade,
  metricasConfianca,
  onPeriodoChange
}: PrevisaoPrecosProps) {
  const [tipoVisualizacao, setTipoVisualizacao] = useState<'precos' | 'margens' | 'markup'>('precos')
  const [periodosPrevisao, setPeriodosPrevisao] = useState(12)

  const formatarNumero = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(valor)
  }

  const calcularVariacao = (valor: number) => {
    return {
      valor: valor * 100,
      positiva: valor >= 0
    }
  }

  const getMesNome = (mes: number) => {
    return format(new Date(2025, mes - 1, 1), 'MMMM', { locale: ptBR })
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Select
            value={tipoVisualizacao}
            onValueChange={(value: 'precos' | 'margens' | 'markup') => 
              setTipoVisualizacao(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Tipo de visualização" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipo de Visualização</SelectLabel>
                <SelectItem value="precos">Preços</SelectItem>
                <SelectItem value="margens">Margens</SelectItem>
                <SelectItem value="markup">Markup</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <Select
            value={periodosPrevisao.toString()}
            onValueChange={(value) => {
              const periodos = parseInt(value)
              setPeriodosPrevisao(periodos)
              onPeriodoChange(
                new Date(metricasConfianca.periodo_analise.inicio),
                new Date(metricasConfianca.periodo_analise.fim),
                periodos
              )
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Períodos de previsão" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Períodos de Previsão</SelectLabel>
                <SelectItem value="3">3 meses</SelectItem>
                <SelectItem value="6">6 meses</SelectItem>
                <SelectItem value="12">12 meses</SelectItem>
                <SelectItem value="24">24 meses</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Resumo das Tendências */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tendência de Custos
            </CardTitle>
            {calcularVariacao(tendenciasGerais.custos.tendencia).positiva ? (
              <Badge variant="destructive">+{formatarNumero(calcularVariacao(
                tendenciasGerais.custos.tendencia
              ).valor)}%</Badge>
            ) : (
              <Badge variant="success">{formatarNumero(calcularVariacao(
                tendenciasGerais.custos.tendencia
              ).valor)}%</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatarNumero(tendenciasGerais.custos.media)}
            </div>
            <p className="text-xs text-muted-foreground">
              Desvio: {formatarNumero(tendenciasGerais.custos.desvio)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tendência de Preços
            </CardTitle>
            {calcularVariacao(tendenciasGerais.precos.tendencia).positiva ? (
              <Badge variant="success">+{formatarNumero(calcularVariacao(
                tendenciasGerais.precos.tendencia
              ).valor)}%</Badge>
            ) : (
              <Badge variant="destructive">{formatarNumero(calcularVariacao(
                tendenciasGerais.precos.tendencia
              ).valor)}%</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatarNumero(tendenciasGerais.precos.media)}
            </div>
            <p className="text-xs text-muted-foreground">
              Desvio: {formatarNumero(tendenciasGerais.precos.desvio)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tendência de Markup
            </CardTitle>
            {calcularVariacao(tendenciasGerais.markup.tendencia).positiva ? (
              <Badge variant="success">+{formatarNumero(calcularVariacao(
                tendenciasGerais.markup.tendencia
              ).valor)}%</Badge>
            ) : (
              <Badge variant="destructive">{formatarNumero(calcularVariacao(
                tendenciasGerais.markup.tendencia
              ).valor)}%</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatarNumero(tendenciasGerais.markup.media)}
            </div>
            <p className="text-xs text-muted-foreground">
              Desvio: {formatarNumero(tendenciasGerais.markup.desvio)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Tendência de Margem
            </CardTitle>
            {calcularVariacao(tendenciasGerais.margem.tendencia).positiva ? (
              <Badge variant="success">+{formatarNumero(calcularVariacao(
                tendenciasGerais.margem.tendencia
              ).valor)}%</Badge>
            ) : (
              <Badge variant="destructive">{formatarNumero(calcularVariacao(
                tendenciasGerais.margem.tendencia
              ).valor)}%</Badge>
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatarNumero(tendenciasGerais.margem.media)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Desvio: {formatarNumero(tendenciasGerais.margem.desvio)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos e Tabelas */}
      <Tabs defaultValue="previsoes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="previsoes">Previsões</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="sazonalidade">Sazonalidade</TabsTrigger>
        </TabsList>

        <TabsContent value="previsoes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Projeção de {tipoVisualizacao === 'precos' ? 'Preços' : tipoVisualizacao === 'margens' ? 'Margens' : 'Markup'}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={previsoes}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="periodo" 
                      tickFormatter={(value) => format(new Date(value), 'MMM/yy', { locale: ptBR })}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => formatarNumero(value)}
                      labelFormatter={(value) => format(new Date(value), 'dd/MM/yyyy', { locale: ptBR })}
                    />
                    <Legend />
                    {tipoVisualizacao === 'precos' && (
                      <>
                        <Area
                          type="monotone"
                          dataKey="preco"
                          stroke="#8884d8"
                          fill="#8884d8"
                          fillOpacity={0.3}
                          name="Preço"
                        />
                        <Area
                          type="monotone"
                          dataKey="custo"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          fillOpacity={0.3}
                          name="Custo"
                        />
                      </>
                    )}
                    {tipoVisualizacao === 'margens' && (
                      <Area
                        type="monotone"
                        dataKey="margem"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                        name="Margem"
                      />
                    )}
                    {tipoVisualizacao === 'markup' && (
                      <Area
                        type="monotone"
                        dataKey="markup"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        fillOpacity={0.3}
                        name="Markup"
                      />
                    )}
                    <ReferenceLine
                      y={tipoVisualizacao === 'precos' 
                        ? tendenciasGerais.precos.media
                        : tipoVisualizacao === 'margens'
                        ? tendenciasGerais.margem.media
                        : tendenciasGerais.markup.media}
                      label="Média"
                      stroke="#ff7300"
                      strokeDasharray="3 3"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tabela de Previsões</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Período</TableHead>
                      <TableHead className="text-right">Custo</TableHead>
                      <TableHead className="text-right">Preço</TableHead>
                      <TableHead className="text-right">Markup</TableHead>
                      <TableHead className="text-right">Margem</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previsoes.map((previsao) => (
                      <TableRow key={previsao.periodo}>
                        <TableCell>
                          {format(new Date(previsao.periodo), 'MMM/yyyy', { locale: ptBR })}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatarNumero(previsao.custo)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatarNumero(previsao.preco)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatarNumero(previsao.markup)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatarNumero(previsao.margem)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categorias">
          <Card>
            <CardHeader>
              <CardTitle>Tendências por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Categoria</TableHead>
                      <TableHead className="text-right">Preço Médio</TableHead>
                      <TableHead className="text-right">Markup Médio</TableHead>
                      <TableHead className="text-right">Margem Média</TableHead>
                      <TableHead className="text-right">Tendência</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tendenciasCategorias.map((categoria) => (
                      <TableRow key={categoria.categoria}>
                        <TableCell>{categoria.categoria}</TableCell>
                        <TableCell className="text-right">
                          {formatarNumero(categoria.preco_medio)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatarNumero(categoria.markup_medio)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatarNumero(categoria.margem_media)}%
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant={calcularVariacao(categoria.tendencia_margem).positiva ? 'success' : 'destructive'}
                          >
                            {formatarNumero(calcularVariacao(categoria.tendencia_margem).valor)}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sazonalidade">
          <Card>
            <CardHeader>
              <CardTitle>Padrões Sazonais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={sazonalidade}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="mes" 
                      tickFormatter={getMesNome}
                    />
                    <YAxis />
                    <Tooltip
                      formatter={(value: number) => formatarNumero(value)}
                      labelFormatter={getMesNome}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="indice_preco"
                      name="Índice de Preço"
                      stroke="#8884d8"
                      activeDot={{ r: 8 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="indice_markup"
                      name="Índice de Markup"
                      stroke="#82ca9d"
                      activeDot={{ r: 8 }}
                    />
                    <ReferenceLine y={1} stroke="#ff7300" label="Base" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mês</TableHead>
                      <TableHead className="text-right">Índice de Preço</TableHead>
                      <TableHead className="text-right">Índice de Markup</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sazonalidade.map((mes) => (
                      <TableRow key={mes.mes}>
                        <TableCell>{getMesNome(mes.mes)}</TableCell>
                        <TableCell className="text-right">
                          {formatarNumero(mes.indice_preco)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatarNumero(mes.indice_markup)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Métricas de Confiança */}
      <Card>
        <CardHeader>
          <CardTitle>Métricas de Confiança</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium">Período Analisado</p>
              <p className="text-2xl font-bold">
                {format(new Date(metricasConfianca.periodo_analise.inicio), 'dd/MM/yyyy')} - {format(new Date(metricasConfianca.periodo_analise.fim), 'dd/MM/yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Total de Registros</p>
              <p className="text-2xl font-bold">
                {metricasConfianca.total_registros.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Categorias Analisadas</p>
              <p className="text-2xl font-bold">
                {metricasConfianca.categorias_analisadas}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}