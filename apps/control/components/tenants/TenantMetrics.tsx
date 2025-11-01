"use client";
import { useEffect, useState } from "react";

type TenantStats = {
  total: number;
  active: number;
  trial: number;
  inactive: number;
};

export default function TenantMetrics() {
  const [stats, setStats] = useState<TenantStats>({
    total: 0,
    active: 0,
    trial: 0,
    inactive: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/tenants/api/stats", { credentials: "same-origin" });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Erro carregando estatísticas de tenants", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[1200px] mx-auto px-4 md:px-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-50 dark:bg-[#1a1625] border-2 border-gray-300 dark:border-gray-700 rounded-xl p-4 shadow-md animate-pulse">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded mb-2 w-20"></div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  const metrics = [
    { label: "Total", value: stats.total, color: "text-[#4aede5]", borderColor: "border-[#4aede5]" },
    { label: "Ativos", value: stats.active, color: "text-green-400", borderColor: "border-green-400" },
    { label: "Trial", value: stats.trial, color: "text-yellow-400", borderColor: "border-yellow-400" },
    { label: "Inativos", value: stats.inactive, color: "text-gray-400", borderColor: "border-gray-400" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[1200px] mx-auto px-4 md:px-6 mb-6">
      {metrics.map((m) => (
        <div
          key={m.label}
          className={`bg-gray-50 dark:bg-[#1a1625] border-2 ${m.borderColor} rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-105`}
        >
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
            {m.label}
          </div>
          <div className={`text-3xl font-bold ${m.color}`}>{m.value}</div>
        </div>
      ))}
    </div>
  );
}
