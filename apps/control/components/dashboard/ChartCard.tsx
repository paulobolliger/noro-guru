"use client";
import React from "react";

export default function ChartCard({ title, subtitle, actions, children, height = 300 }: { title: string; subtitle?: string; actions?: React.ReactNode; children: React.ReactNode; height?: number }) {
  return (
    <div className="card-interactive">
      <div className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-default border-white/10">
        <div>
          <div className="text-sm font-semibold text-primary">{title}</div>
          {subtitle && <div className="text-xs text-muted">{subtitle}</div>}
        </div>
        <div className="flex items-center gap-2">{actions}</div>
      </div>
      <div className="p-4 md:p-6" style={{ height }}>
        {children}
      </div>
    </div>
  );
}

