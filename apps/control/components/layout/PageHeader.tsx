"use client";
import React from "react";

export default function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-primary">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400/80 mt-1">{subtitle}</p>}
        </div>
        {actions}
      </div>
    </div>
  );
}
