"use client";
import React from "react";

export default function LegendToggle({ series, onToggle }: { series: { key: string; label: string; color: string; enabled: boolean }[]; onToggle: (key: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {series.map((s) => (
        <button
          key={s.key}
          onClick={() => onToggle(s.key)}
          className={`px-2.5 py-1 rounded-md text-xs font-medium border ${s.enabled ? 'bg-white/10 border-white/20 text-primary' : 'bg-transparent border-white/10 text-muted'}`}
          style={{ boxShadow: `inset 0 0 0 1px ${s.enabled ? s.color : 'transparent'}` }}
        >
          <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: s.color }} />{s.label}
        </button>
      ))}
    </div>
  );
}

