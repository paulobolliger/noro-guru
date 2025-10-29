"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TimeRangePicker from "./TimeRangePicker";

export default function FilterBar({ tenants, plans }: { tenants: Array<{ id: string; name: string }>; plans: string[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const tenant = sp.get('tenant') || '';
  const plan = sp.get('plan') || '';

  function setParam(k: string, v?: string) {
    const p = new URLSearchParams(sp.toString());
    if (v) p.set(k, v); else p.delete(k);
    router.push(`/control?${p.toString()}`);
  }

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      <div className="flex flex-1 gap-2">
        <select value={tenant} onChange={(e) => setParam('tenant', e.target.value || undefined)} className="rounded-lg border px-3 py-2 bg-white/5 text-primary">
          <option value="">Todos os tenants</option>
          {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <select value={plan} onChange={(e) => setParam('plan', e.target.value || undefined)} className="rounded-lg border px-3 py-2 bg-white/5 text-primary">
          <option value="">Todos os planos</option>
          {plans.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <TimeRangePicker />
    </div>
  );
}

