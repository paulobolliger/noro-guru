'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { 
  AreaChart, 
  BarChart, 
  DonutChart 
} from '@/components/ui/charts';
import { getStripeMetrics } from './actions';
import { formatCurrency } from '@/lib/utils';

interface StripeMetrics {
  revenue: {
    mrr: number;
    arr: number;
    totalRevenue: number;
    revenueByDay: { date: string; amount: number }[];
    revenueByPlan: { plan: string; amount: number }[];
  };
  subscriptions: {
    total: number;
    active: number;
    trialing: number;
    canceled: number;
    churnRate: number;
    subscriptionsByDay: { date: string; count: number }[];
    subscriptionsByPlan: { plan: string; count: number }[];
  };
  customers: {
    total: number;
    new: number;
    customersByDay: { date: string; count: number }[];
  };
}

export default function StripeMetricsPage() {
  const [metrics, setMetrics] = useState<StripeMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<[Date, Date]>([
    new Date(new Date().setDate(new Date().getDate() - 30)),
    new Date()
  ]);
  const [currency, setCurrency] = useState<'brl' | 'usd'>('brl');

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setIsLoading(true);
        const data = await getStripeMetrics({
          startDate: dateRange[0].toISOString(),
          endDate: dateRange[1].toISOString(),
          currency
        });
        setMetrics(data);
      } catch (error) {
        console.error('Erro ao carregar métricas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadMetrics();
  }, [dateRange, currency]);

  if (!metrics) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">
              {isLoading ? 'Carregando métricas...' : 'Nenhum dado disponível'}
            </h2>
            {!isLoading && (
              <p className="text-muted-foreground">
                Configure o Stripe e processe algumas transações para ver as métricas.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Métricas do Stripe</h1>
        <p className="text-muted-foreground">
          Análise de receita, assinaturas e clientes
        </p>
      </div>

      <div className="flex items-center justify-between mb-6">
        <DateRangePicker
          value={dateRange}
          onChange={setDateRange}
        />
        <Select value={currency} onValueChange={(value) => setCurrency(value as 'brl' | 'usd')}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="brl">BRL</SelectItem>
            <SelectItem value="usd">USD</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>MRR</CardTitle>
            <CardDescription>Receita mensal recorrente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.revenue.mrr, currency)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ARR</CardTitle>
            <CardDescription>Receita anual recorrente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(metrics.revenue.arr, currency)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Churn Rate</CardTitle>
            <CardDescription>Taxa de cancelamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.subscriptions.churnRate * 100).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="subscriptions">Assinaturas</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Receita por dia</CardTitle>
              </CardHeader>
              <CardContent>
                <AreaChart
                  data={metrics.revenue.revenueByDay}
                  xField="date"
                  yField="amount"
                  category="Receita"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Receita por plano</CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={metrics.revenue.revenueByPlan}
                  category="plan"
                  value="amount"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="subscriptions">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Assinaturas por dia</CardTitle>
              </CardHeader>
              <CardContent>
                <AreaChart
                  data={metrics.subscriptions.subscriptionsByDay}
                  xField="date"
                  yField="count"
                  category="Assinaturas"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Assinaturas por plano</CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={metrics.subscriptions.subscriptionsByPlan}
                  category="plan"
                  value="count"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customers">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Novos clientes por dia</CardTitle>
              </CardHeader>
              <CardContent>
                <AreaChart
                  data={metrics.customers.customersByDay}
                  xField="date"
                  yField="count"
                  category="Clientes"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status das assinaturas</CardTitle>
              </CardHeader>
              <CardContent>
                <DonutChart
                  data={[
                    { status: 'Ativas', count: metrics.subscriptions.active },
                    { status: 'Trial', count: metrics.subscriptions.trialing },
                    { status: 'Canceladas', count: metrics.subscriptions.canceled }
                  ]}
                  category="status"
                  value="count"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}