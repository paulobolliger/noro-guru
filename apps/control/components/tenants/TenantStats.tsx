"use client";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui";
import { Users, FileText, DollarSign, ShoppingCart, Database, ExternalLink } from "lucide-react";

interface TenantStatsProps {
  tenantId: string;
  tenantSlug: string;
}

type Metrics = {
  total_users: number;
  total_clients: number;
  total_orders: number;
  total_quotes: number;
  total_revenue: number;
  schema_provisioned: boolean;
};

export default function TenantStats({ tenantId, tenantSlug }: TenantStatsProps) {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, [tenantId]);

  async function loadMetrics() {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/tenants/${tenantId}/metrics`);
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error("Erro ao carregar métricas:", err);
    } finally {
      setLoading(false);
    }
  }

  const stats = [
    {
      label: "Usuários",
      value: metrics?.total_users || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
      borderColor: "border-blue-200 dark:border-blue-800",
    },
    {
      label: "Clientes",
      value: metrics?.total_clients || 0,
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
      borderColor: "border-green-200 dark:border-green-800",
    },
    {
      label: "Pedidos",
      value: metrics?.total_orders || 0,
      icon: ShoppingCart,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
      borderColor: "border-purple-200 dark:border-purple-800",
    },
    {
      label: "Orçamentos",
      value: metrics?.total_quotes || 0,
      icon: FileText,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
      borderColor: "border-yellow-200 dark:border-yellow-800",
    },
    {
      label: "Receita Total",
      value: metrics?.total_revenue
        ? `R$ ${metrics.total_revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
        : "R$ 0,00",
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50 dark:bg-emerald-900/20",
      borderColor: "border-emerald-200 dark:border-emerald-800",
    },
    {
      label: "Schema",
      value: metrics?.schema_provisioned ? "Provisionado" : "Não Provisionado",
      icon: Database,
      color: metrics?.schema_provisioned ? "text-green-600" : "text-orange-600",
      bgColor: metrics?.schema_provisioned
        ? "bg-green-50 dark:bg-green-900/20"
        : "bg-orange-50 dark:bg-orange-900/20",
      borderColor: metrics?.schema_provisioned
        ? "border-green-200 dark:border-green-800"
        : "border-orange-200 dark:border-orange-800",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Link de Acesso Direto */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Acesso ao Tenant
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                URL de acesso para este tenant
              </p>
            </div>
            <a
              href={`https://${tenantSlug}.noro.guru`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-[#4aede5] hover:bg-[#3ddcd1] text-white rounded-lg font-medium transition-colors"
            >
              <span>{tenantSlug}.noro.guru</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        ) : (
          stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardContent className={`p-4 border-2 ${stat.borderColor}`}>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <Icon size={24} className={stat.color} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
