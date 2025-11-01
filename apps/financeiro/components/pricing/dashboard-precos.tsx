'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { formatCurrency, formatPercent } from '@/lib/utils'

interface MargemData {
  data: string
  margem_media: number
  markup_medio: number
  margem_minima: number
  margem_maxima: number
}

interface DistribuicaoRegras {
  tipo: string
  quantidade: number
  valor_total: number
}

interface MetricasGerais {
  total_produtos: number
  margem_media_global: number
  markup_medio_global: number
  regras_ativas: number
}

interface DashboardPrecosProps {
  margens: MargemData[]
  distribuicaoRegras: DistribuicaoRegras[]
  metricas: MetricasGerais
}

export function DashboardPrecos({ margens, distribuicaoRegras, metricas }: DashboardPrecosProps) {
  return (
    <div className="space-y-6">
      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Produtos com Precificação
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricas.total_produtos.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Margem Média Global
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercent(metricas.margem_media_global)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Markup Médio Global
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercent(metricas.markup_medio_global)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Regras de Preço Ativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metricas.regras_ativas}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de Margens */}
      <Card>
        <CardHeader>
          <CardTitle>Evolução de Margens</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={margens}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="data" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip 
                  formatter={(value: number) => `${value.toFixed(2)}%`}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="margem_media" 
                  name="Margem Média"
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="markup_medio" 
                  name="Markup Médio"
                  stroke="#82ca9d" 
                />
                <Line 
                  type="monotone" 
                  dataKey="margem_minima" 
                  name="Margem Mínima"
                  stroke="#ff7300" 
                  strokeDasharray="3 3"
                />
                <Line 
                  type="monotone" 
                  dataKey="margem_maxima" 
                  name="Margem Máxima"
                  stroke="#ff0000" 
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Distribuição de Regras */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Regras por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {distribuicaoRegras.map((regra) => (
                <div 
                  key={regra.tipo}
                  className="flex items-center justify-between p-2 border-b"
                >
                  <div>
                    <div className="font-medium">{regra.tipo}</div>
                    <div className="text-sm text-muted-foreground">
                      {regra.quantidade} regras
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {formatCurrency(regra.valor_total)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Valor Total
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas e Recomendações</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {metricas.margem_media_global < 15 && (
                <div className="p-3 rounded-md bg-yellow-50 border border-yellow-200">
                  <div className="font-medium text-yellow-800">
                    Margem Média Baixa
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    A margem média está abaixo de 15%. Considere revisar suas regras de markup.
                  </p>
                </div>
              )}

              {margens.length > 1 && 
               margens[margens.length - 1].margem_media < margens[margens.length - 2].margem_media && (
                <div className="p-3 rounded-md bg-orange-50 border border-orange-200">
                  <div className="font-medium text-orange-800">
                    Queda na Margem
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Houve uma redução na margem média em relação ao período anterior.
                  </p>
                </div>
              )}

              {distribuicaoRegras.some(r => r.quantidade === 0) && (
                <div className="p-3 rounded-md bg-blue-50 border border-blue-200">
                  <div className="font-medium text-blue-800">
                    Tipos de Regra Não Utilizados
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    Existem tipos de regra sem nenhum uso. Considere explorar estas opções.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}