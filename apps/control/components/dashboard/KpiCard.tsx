"use client";
import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  loading = false,
}: {
  label: string;
  value: string | number;
  delta?: { value: number; period?: string } | null;
  icon?: any;
  loading?: boolean;
  sparkline?: Array<{ x: string | number; y: number }>;
}) {
  const deltaText = delta ? `${delta.value > 0 ? "+" : ""}${delta.value.toFixed(1)}%${delta?.period ? ` vs ${delta.period}` : ""}` : null;
  const deltaColor = !delta ? "" : delta.value > 0 ? "text-green-600" : delta.value < 0 ? "text-red-600" : "text-gray-600";

  const TrendIcon = delta && delta.value > 0 ? TrendingUp : delta && delta.value < 0 ? TrendingDown : Minus;

  if (loading) {
    return (
      <div className="surface-card rounded-lg p-6 animate-pulse">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="h-3 w-20 bg-gray-200 rounded mb-3" />
            <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-2 w-24 bg-gray-200 rounded" />
          </div>
          {Icon && (
            <div className="w-12 h-12 rounded-lg bg-gray-100" />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="surface-card rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-2">
            {label}
          </div>
          <div className="text-3xl font-bold text-gray-900 mb-2">
            {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
          </div>
          {deltaText && (
            <div className={`flex items-center gap-1 text-sm font-medium ${deltaColor}`}>
              <TrendIcon className="w-4 h-4" />
              {deltaText}
            </div>
          )}
        </div>
        {Icon && (
          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}
