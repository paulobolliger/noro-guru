"use client";
import React from "react";
import { ResponsiveContainer, LineChart, Line } from "recharts";

export default function KpiCard({
  label,
  value,
  delta,
  sparkline = [],
}: {
  label: string;
  value: string | number;
  delta?: { value: number; period?: string } | null;
  sparkline?: Array<{ x: string | number; y: number }>;
}) {
  const deltaText = delta ? `${delta.value > 0 ? "+" : ""}${delta.value.toFixed(1)}%${delta?.period ? ` vs ${delta.period}` : ""}` : null;
  const deltaColor = !delta ? "" : delta.value > 0 ? "text-emerald-400" : delta.value < 0 ? "text-rose-400" : "text-slate-400";
  return (
    <div className="group card-interactive p-4 md:p-5 flex items-center justify-between gap-4">
      <div>
        <div className="text-xs text-muted">{label}</div>
        <div className="mt-1 text-2xl md:text-3xl font-semibold text-primary">{value}</div>
        {deltaText && <div className={`text-[11px] ${deltaColor} mt-1`}>{deltaText}</div>}
      </div>
      {sparkline.length > 0 && (
        <div className="h-12 w-24 md:h-14 md:w-32">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkline}>
              <Line type="monotone" dataKey="y" stroke="#8A8CE6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

