import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@noro/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@noro/ui/alert"
import { Progress } from "@noro/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@noro/ui/tabs"
import { useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { getPlanMetrics } from "../actions"
import { Loader2 } from "lucide-react"

interface UsageMetrics {
  activeUsers: number
  storageUsed: number
  apiRequests: number
  featuresUsed: {
    [key: string]: number
  }
  modulesUsed: {
    [key: string]: number
  }
}

interface PlanMetricsProps {
  planId: string
}

export function PlanMetrics({ planId }: PlanMetricsProps) {
  const [metrics, setMetrics] = useState<UsageMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState<"daily" | "weekly" | "monthly">("daily")

  async function loadMetrics() {
    try {
      const data = await getPlanMetrics(planId, period)
      setMetrics(data)
    } catch (error) {
      console.error("Erro ao carregar métricas:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6">
          <Loader2 className="h-6 w-6 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertTitle>Sem dados disponíveis</AlertTitle>
            <AlertDescription>
              Não foi possível carregar as métricas deste plano
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Métricas de Uso</CardTitle>
        <CardDescription>
          Acompanhamento de utilização dos recursos do plano
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="resources">Recursos</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="modules">Módulos</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Usuários Ativos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics.activeUsers}
                  </div>
                  <Progress
                    value={(metrics.activeUsers / 100) * 100}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Armazenamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(metrics.storageUsed / 1024 / 1024 / 1024).toFixed(1)} GB
                  </div>
                  <Progress
                    value={(metrics.storageUsed / 100) * 100}
                    className="mt-2"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Requisições API
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {metrics.apiRequests.toLocaleString()}
                  </div>
                  <Progress
                    value={(metrics.apiRequests / 10000) * 100}
                    className="mt-2"
                  />
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Tendência de Uso</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={[
                    { name: "Jan", value: 400 },
                    { name: "Fev", value: 300 },
                    { name: "Mar", value: 200 },
                    { name: "Abr", value: 278 },
                    { name: "Mai", value: 189 },
                  ]}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar
                      dataKey="value"
                      fill="var(--primary)"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-4">
            <div className="grid gap-4">
              {/* Recursos individuais */}
              <Card>
                <CardHeader>
                  <CardTitle>Uso de Recursos</CardTitle>
                  <CardDescription>
                    Detalhamento do consumo de recursos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm">Armazenamento</span>
                      <span className="text-sm">
                        {(metrics.storageUsed / 1024 / 1024 / 1024).toFixed(1)}/
                        100 GB
                      </span>
                    </div>
                    <Progress value={(metrics.storageUsed / 100) * 100} />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm">API Requests</span>
                      <span className="text-sm">
                        {metrics.apiRequests.toLocaleString()}/10,000
                      </span>
                    </div>
                    <Progress value={(metrics.apiRequests / 10000) * 100} />
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-sm">Usuários Ativos</span>
                      <span className="text-sm">{metrics.activeUsers}/100</span>
                    </div>
                    <Progress value={(metrics.activeUsers / 100) * 100} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Uso de Features</CardTitle>
                <CardDescription>
                  Utilização das funcionalidades disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(metrics.featuresUsed).map(([feature, usage]) => (
                    <div key={feature}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm">{feature}</span>
                        <span className="text-sm">{usage}%</span>
                      </div>
                      <Progress value={usage} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="modules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Uso de Módulos</CardTitle>
                <CardDescription>
                  Utilização dos módulos disponíveis
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(metrics.modulesUsed).map(([module, usage]) => (
                    <div key={module}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm">{module}</span>
                        <span className="text-sm">{usage}%</span>
                      </div>
                      <Progress value={usage} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}