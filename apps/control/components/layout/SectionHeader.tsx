"use client";
import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  sticky?: boolean;
}

export default function SectionHeader({ title, subtitle, right, sticky = false }: SectionHeaderProps) {
  const innerClasses = `rounded-xl shadow-md p-6 md:p-8 mb-6`;

  return (
    <div className={sticky ? "sticky top-0 z-30" : ""}>
      <div
        className={innerClasses + (sticky ? " supports-[backdrop-filter]:bg-black/20 backdrop-blur" : "")}
        style={{ background: 'linear-gradient(135deg, rgba(59, 44, 164, 0.94), rgba(35, 33, 79, 0.92))' }}
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#D4AF37] tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-white">{subtitle}</p>}
          </div>
          {right}
        </div>
      </div>
    </div>
  );
}
