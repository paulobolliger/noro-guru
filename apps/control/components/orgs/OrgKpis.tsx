"use client";
import React from "react";

type Kpi = { label: string; value: string | number; hint?: string; color: string; borderColor: string };

export default function OrgKpis({ totals }: { totals: { total: number; ativos: number; planos: Record<string, number> } }) {
  const planosText = Object.entries(totals.planos)
    .map(([k, v]) => `${k}: ${v}`)
    .join(" · ");

  const items: Kpi[] = [
    { label: "Clientes/Empresas", value: totals.total, color: "text-[#4aede5]", borderColor: "border-[#4aede5]" },
    { label: "Ativos", value: totals.ativos, color: "text-green-400", borderColor: "border-green-400" },
    { label: "Planos", value: planosText || "—", color: "text-blue-400", borderColor: "border-blue-400" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 my-6 md:my-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {items.map((k) => (
          <div
            key={k.label}
            className={`bg-gray-50 dark:bg-[#1a1625] border-2 ${k.borderColor} rounded-xl p-4 md:p-5 shadow-md hover:shadow-lg transition-all hover:scale-105`}
          >
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
              {k.label}
            </div>
            <div className={`text-3xl md:text-4xl font-bold ${k.color}`}>{k.value}</div>
            {k.hint && <div className="text-[11px] text-gray-500 mt-1">{k.hint}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

