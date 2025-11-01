"use client";
import React, { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, Tooltip } from "recharts";
import NCard from "../ui/NCard";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function KpiCard({
  label,
  value,
  delta,
  sparkline = [],
  icon: Icon,
  loading = false,
}: {
  label: string;
  value: string | number;
  delta?: { value: number; period?: string } | null;
  sparkline?: Array<{ x: string | number; y: number }>;
  icon?: any;
  loading?: boolean;
}) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseInt(String(value).replace(/\D/g, '')) || 0;

  // Anima o contador de números
  useEffect(() => {
    if (loading || typeof value !== 'number') return;
    
    let start = 0;
    const duration = 1000;
    const increment = numericValue / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= numericValue) {
        setAnimatedValue(numericValue);
        clearInterval(timer);
      } else {
        setAnimatedValue(Math.floor(start));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [numericValue, loading, value]);

  const deltaText = delta ? `${delta.value > 0 ? "+" : ""}${delta.value.toFixed(1)}%${delta?.period ? ` vs ${delta.period}` : ""}` : null;
  const deltaColor = !delta ? "" : delta.value > 0 ? "text-emerald-500 dark:text-emerald-400" : delta.value < 0 ? "text-rose-500 dark:text-rose-400" : "text-slate-600 dark:text-slate-400";
  
  const TrendIcon = delta && delta.value > 0 ? TrendingUp : delta && delta.value < 0 ? TrendingDown : Minus;

  if (loading) {
    return (
      <NCard className="noro-card p-4 md:p-5 animate-pulse">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="h-3 w-20 bg-slate-300/20 rounded mb-3" />
            <div className="h-8 w-32 bg-slate-300/20 rounded mb-2" />
            <div className="h-2 w-24 bg-slate-300/20 rounded" />
          </div>
          <div className="h-14 w-32 bg-slate-300/20 rounded" />
        </div>
      </NCard>
    );
  }

  return (
    <NCard className="noro-card p-4 md:p-5 group hover:scale-[1.02] transition-transform" >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {Icon && (
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <Icon className="w-4 h-4 text-[#0FA89A] dark:text-[#1DD3C0]" />
              </div>
            )}
            <div className="text-xs font-medium text-muted uppercase tracking-wider">{label}</div>
          </div>
          <div className="mt-1 text-3xl md:text-4xl font-bold kpi-value tabular-nums text-[#0FA89A] dark:text-[#1DD3C0]">
            {typeof value === 'number' ? animatedValue.toLocaleString('pt-BR') : value}
          </div>
          {deltaText && (
            <div className={`flex items-center gap-1 text-[11px] font-medium ${deltaColor} mt-2`}>
              <TrendIcon className="w-3 h-3" />
              {deltaText}
            </div>
          )}
        </div>
        {sparkline.length > 0 && (
          <div className="h-12 w-24 md:h-16 md:w-32 opacity-75 group-hover:opacity-100 transition-opacity">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkline}>
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-surface border border-default rounded px-2 py-1 text-xs">
                          <span className="text-accent font-semibold">{payload[0].value}</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="y" 
                  stroke="var(--color-accent)" 
                  strokeWidth={2.5} 
                  dot={false}
                  animationDuration={800}
                  animationEasing="ease-out"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </NCard>
  );
}

