"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import TimeRangePicker from "./TimeRangePicker";
import { Filter, Building2, Package } from "lucide-react";

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
    <div className="bg-[#1a1625] rounded-2xl p-6 border border-[#D4AF37]/10 shadow-lg">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white">
          <Filter className="w-5 h-5 text-[#4aede5]" />
          <span className="font-semibold">Filtros</span>
        </div>
        
        <div className="flex flex-col sm:flex-row flex-1 gap-3 md:justify-end">
          <div className="relative flex-1 md:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Building2 className="w-4 h-4 text-slate-400" />
            </div>
            <select 
              value={tenant} 
              onChange={(e) => setParam('tenant', e.target.value || undefined)} 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 focus:bg-white/10 focus:border-[#4aede5]/50 focus:ring-2 focus:ring-[#4aede5]/20 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="">Todos os tenants</option>
              {tenants.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          
          <div className="relative flex-1 md:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Package className="w-4 h-4 text-slate-400" />
            </div>
            <select 
              value={plan} 
              onChange={(e) => setParam('plan', e.target.value || undefined)} 
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 focus:bg-white/10 focus:border-[#4aede5]/50 focus:ring-2 focus:ring-[#4aede5]/20 transition-all outline-none appearance-none cursor-pointer"
            >
              <option value="">Todos os planos</option>
              {plans.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          
          <TimeRangePicker />
        </div>
      </div>
    </div>
  );
}

