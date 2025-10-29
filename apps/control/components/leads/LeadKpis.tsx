"use client";
import React from "react";

type Kpi = { label: string; value: string | number; hint?: string };

export default function LeadKpis({ totals }: { totals: { total: number; valorTotal: number; abertos: number; ganhos: number } }) {
  const items: Kpi[] = [
    { label: "Leads", value: totals.total },
    { label: "Valor (R$)", value: (totals.valorTotal / 100).toLocaleString("pt-BR") },
    { label: "Abertos", value: totals.abertos },
    { label: "Ganhos", value: totals.ganhos },
  ];
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {items.map((k) => (
          <div
            key={k.label}
            className="group card-interactive p-4 md:p-5"
          >
            <div className="text-xs text-muted">{k.label}</div>
            <div className="mt-1 text-2xl md:text-3xl font-semibold text-primary transition-transform group-hover:translate-y-[-1px]">{k.value}</div>
            {k.hint && <div className="text-[11px] text-primary0 mt-1">{k.hint}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
