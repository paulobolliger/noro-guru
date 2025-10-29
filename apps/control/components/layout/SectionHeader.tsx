"use client";
import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  sticky?: boolean;
}

export default function SectionHeader({ title, subtitle, right, sticky = false }: SectionHeaderProps) {
  return (
    <div className={sticky ? "sticky top-0 z-30 border-b border-default border-white/10 bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent backdrop-blur supports-[backdrop-filter]:bg-black/20" : ""}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between py-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold text-primary tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-slate-400/80">{subtitle}</p>}
        </div>
        {right}
      </div>
    </div>
  );
}
