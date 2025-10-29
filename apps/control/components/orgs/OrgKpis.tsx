"use client";
import React from "react";

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
    <div className="mx-auto max-w-7xl px-6 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {items.map((k) => (
          <div key={k.label} className="group card-interactive p-4 md:p-5">
            <div className="text-xs text-muted">{k.label}</div>
            <div className="mt-1 text-2xl md:text-3xl font-semibold text-primary transition-transform group-hover:translate-y-[-1px]">{k.value}</div>
            {k.hint && <div className="text-[11px] text-primary0 mt-1">{k.hint}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

