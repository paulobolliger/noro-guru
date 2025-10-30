"use client";
import React from "react";
import NCard from "../ui/NCard";

type Kpi = { label: string; value: string | number; hint?: string };

export default function OrgKpis({ totals }: { totals: { total: number; ativos: number; planos: Record<string, number> } }) {
  const planosText = Object.entries(totals.planos)
    .map(([k, v]) => `${k}: ${v}`)
    .join("  ·  ");

  const items: Kpi[] = [
    { label: "Clientes/Empresas", value: totals.total },
    { label: "Ativos", value: totals.ativos },
    { label: "Planos", value: planosText || "—" },
  ];
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 my-6 md:my-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {items.map((k) => (
          <NCard key={k.label} className="noro-card p-4 md:p-5">
            <div>
              <div className="text-xs text-gray-600 dark:text-gray-400">{k.label}</div>
              <div className="mt-1 text-3xl md:text-4xl font-semibold kpi-value">{k.value}</div>
              {k.hint && <div className="text-[11px] text-gray-500 mt-1">{k.hint}</div>}
            </div>
          </NCard>
        ))}
      </div>
    </div>
  );
}

