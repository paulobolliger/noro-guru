"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TimeRangePicker() {
  const router = useRouter();
  const sp = useSearchParams();
  const current = Number(sp.get('range') || 30);
  const set = (d: number) => {
    const p = new URLSearchParams(sp.toString());
    if (d) p.set('range', String(d)); else p.delete('range');
    router.push(`/control?${p.toString()}`);
  };
  const Opt = ({ v, label }: { v: number; label: string }) => (
    <button onClick={() => set(v)} className={`px-2.5 py-1.5 rounded-md text-xs font-semibold transition ${current===v? 'bg-white/10 text-primary ring-1 ring-white/10' : 'text-muted hover:bg-white/5'}`}>{label}</button>
  );
  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1">
      <Opt v={7} label="7d" />
      <Opt v={30} label="30d" />
      <Opt v={90} label="90d" />
    </div>
  );
}

