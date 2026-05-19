// app/admin/(protected)/custos/all/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Loader2, Sparkles, DollarSign, FileText, TrendingUp, Wallet, Plus, CreditCard, Image as LucideImage } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { COST_PERIODS } from '@/lib/constants';
import { formatCost } from '@/lib/utils/cost-calculator';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const TYPE_LABELS = {
  site_roteiro: 'Roteiros do Site',
  admin_proposta: 'Propostas Admin',
  bulk_roteiro: 'Bulk Roteiros',
  bulk_artigo: 'Bulk Artigos',
};

const TYPE_COLORS = {
  site_roteiro: '#3b82f6',
  admin_proposta: '#10b981',
  bulk_roteiro: '#a855f7',
  bulk_artigo: '#f59e0b',
  other: '#9ca3af'
};

export default function CustosAllPage() {
  const [period, setPeriod] = useState<keyof typeof COST_PERIODS>('30d');
  const [data, setData] = useState<any>(null);
  const [wallet, setWallet] = useState<any>({ balance_cents: 0, transactions: [] });
  const [loading, setLoading] = useState(true);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState('50');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, [period]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [costsRes, walletRes] = await Promise.all([
        fetch(`/api/admin/costs/all?period=${period}`),
        fetch(`/api/admin/costs/wallet`)
      ]);

      const costsData = await costsRes.json();
      const walletData = await walletRes.json();

      setData(costsData);
      if (walletData.balance_cents !== undefined) {
        setWallet(walletData);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados de custos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    try {
      const amount = parseInt(purchaseAmount) * 100; // Convert to cents
      const response = await fetch('/api/admin/costs/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount_cents: amount,
          description: `Compra de R$ ${purchaseAmount} em créditos`
        })
      });

      if (response.ok) {
        toast({ title: "Sucesso!", description: "Créditos adicionados com sucesso.", variant: "success" });
        setPurchaseOpen(false);
        fetchData(); // Refresh data
      } else {
        throw new Error('Falha na compra');
      }
    } catch (error) {
      toast({ title: "Erro", description: "Não foi possível completar a compra.", variant: "destructive" });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  const pieData = data?.byType ? Object.entries(data.byType).map(([type, info]: [string, any]) => ({
    name: TYPE_LABELS[type as keyof typeof TYPE_LABELS] || type,
    value: info.total_cost,
    count: info.count,
    color: TYPE_COLORS[type as keyof typeof TYPE_COLORS] || '#gray',
  })) : [];

  return (
    <div className="p-6 space-y-8">
      {/* Wallet Section */}
      <Card className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-none shadow-xl">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-300">
                <Wallet size={20} />
                <span className="font-medium">Saldo Disponível</span>
              </div>
              <div className="text-5xl font-bold tracking-tight">
                {formatCost(wallet.balance_cents / 100)}
              </div>
              <p className="text-sm text-gray-400">
                Use seus créditos para gerar roteiros e artigos.
              </p>
            </div>

            <Dialog open={purchaseOpen} onOpenChange={setPurchaseOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white font-bold px-8 shadow-lg hover:shadow-green-500/20 transition-all">
                  <Plus className="mr-2 h-5 w-5" />
                  Comprar Créditos
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Créditos</DialogTitle>
                  <DialogDescription>
                    Simulação de compra. O valor será adicionado imediatamente ao seu saldo.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Valor (R$)</Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">R$</span>
                      <Input
                        type="number"
                        value={purchaseAmount}
                        onChange={(e) => setPurchaseAmount(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800 flex gap-2">
                    <CreditCard size={16} className="mt-0.5" />
                    <p>Em produção, o pagamento será processado via e.Rede (PIX, Crédito ou Débito).</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setPurchaseOpen(false)}>Cancelar</Button>
                  <Button onClick={handlePurchase} className="bg-green-600 hover:bg-green-700">Confirmar Pagamento</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Header Analytics */}
      <div className="flex items-center justify-between mt-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="text-purple-600" size={28} />
            Análise de Custos
          </h2>
          <p className="text-gray-600">
            Visão geral do consumo nos últimos {COST_PERIODS[period as keyof typeof COST_PERIODS]?.label || '30 dias'}
          </p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value as keyof typeof COST_PERIODS)}
          className="px-4 py-2 border rounded-lg bg-white shadow-sm"
        >
          {Object.entries(COST_PERIODS).map(([key, value]) => (
            <option key={key} value={key}>
              {value.label}
            </option>
          ))}
        </select>
      </div>

      {/* Cards de Resumo */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <DollarSign className="h-8 w-8 text-purple-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{formatCost(data.metrics.totalCost)}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Gasto Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <FileText className="h-8 w-8 text-blue-600 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{data.metrics.totalItems}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Itens Gerados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Sparkles className="h-8 w-8 text-amber-500 mb-2" />
              <div className="text-2xl font-bold text-gray-900">{formatCost(data.metrics.avgCostPerItem)}</div>
              <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Custo Médio</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-3">
                {/* Bloco Texto */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={12} className="text-purple-600" />
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Texto</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 leading-none">
                    {formatCost(data.metrics.totalTextCost)}
                  </div>
                </div>

                {/* Bloco Imagem */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <LucideImage size={12} className="text-blue-600" />
                    <span className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Imagem</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 leading-none">
                    {formatCost(data.metrics.totalImageCost)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gráficos */}
      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-4">
            <CardHeader>
              <CardTitle>Evolução de Custos</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.dailyChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { day: '2-digit', month: '2-digit' })} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(val) => `R$${val}`} />
                <RechartsTooltip formatter={(value: number) => formatCost(value)} />
                <Legend />
                <Line type="monotone" dataKey="total_cost" stroke="#8b5cf6" strokeWidth={3} dot={false} activeDot={{ r: 6 }} name="Custo" />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <Card className="p-4">
            <CardHeader>
              <CardTitle>Custos por Tipo</CardTitle>
            </CardHeader>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: number) => formatCost(value)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
}
