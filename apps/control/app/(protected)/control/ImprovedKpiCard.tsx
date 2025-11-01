// app/(protected)/control/ImprovedKpiCard.tsx
"use client";
import { useState, useEffect } from "react";
import { ResponsiveContainer, LineChart, Line, Tooltip, AreaChart, Area } from "recharts";
import { 
  TrendingUp as TrendingUpIcon, 
  TrendingDown, 
  Minus, 
  Users,
  Key,
  TrendingUp,
  Zap,
  Activity,
  Globe,
  DollarSign,
  Clock
} from "lucide-react";

// Icon mapping
const iconMap: Record<string, React.ComponentType<any>> = {
  Users,
  Key,
  TrendingUp,
  Zap,
  Activity,
  Globe,
  DollarSign,
  Clock,
};

interface ImprovedKpiCardProps {
  label: string;
  value: string | number;
  delta?: { value: number; period?: string } | null;
  sparkline?: Array<{ x: string | number; y: number }>;
  icon?: string;
  loading?: boolean;
  color?: 'primary' | 'accent' | 'gold' | 'emerald' | 'rose';
  format?: 'number' | 'currency' | 'percentage';
}

const colorSchemes = {
  primary: {
    gradient: 'from-[#4aede5]/10 to-[#4aede5]/5',
    border: 'border-[#4aede5]/20',
    hoverBorder: 'hover:border-[#4aede5]/40',
    iconBg: 'bg-[#4aede5]/20',
    iconColor: 'text-[#4aede5]',
    lineColor: '#4aede5',
    textColor: 'text-[#4aede5]',
  },
  accent: {
    gradient: 'from-[#0FA89A]/10 to-[#0FA89A]/5',
    border: 'border-[#0FA89A]/20',
    hoverBorder: 'hover:border-[#0FA89A]/40',
    iconBg: 'bg-[#0FA89A]/20',
    iconColor: 'text-[#0FA89A]',
    lineColor: '#0FA89A',
    textColor: 'text-[#0FA89A]',
  },
  gold: {
    gradient: 'from-[#D4AF37]/10 to-[#D4AF37]/5',
    border: 'border-[#D4AF37]/20',
    hoverBorder: 'hover:border-[#D4AF37]/40',
    iconBg: 'bg-[#D4AF37]/20',
    iconColor: 'text-[#D4AF37]',
    lineColor: '#D4AF37',
    textColor: 'text-[#D4AF37]',
  },
  emerald: {
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    border: 'border-emerald-500/20',
    hoverBorder: 'hover:border-emerald-500/40',
    iconBg: 'bg-emerald-500/20',
    iconColor: 'text-emerald-500',
    lineColor: '#10b981',
    textColor: 'text-emerald-500',
  },
  rose: {
    gradient: 'from-rose-500/10 to-rose-500/5',
    border: 'border-rose-500/20',
    hoverBorder: 'hover:border-rose-500/40',
    iconBg: 'bg-rose-500/20',
    iconColor: 'text-rose-500',
    lineColor: '#f43f5e',
    textColor: 'text-rose-500',
  },
};

export function ImprovedKpiCard({
  label,
  value,
  delta,
  sparkline = [],
  icon,
  loading = false,
  color = 'primary',
  format = 'number',
}: ImprovedKpiCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const numericValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^\d.-]/g, '')) || 0;
  const colorScheme = colorSchemes[color];
  
  // Map icon string to component
  const Icon = icon ? iconMap[icon] : null;

  // Anima o contador de números
  useEffect(() => {
    if (loading || typeof value !== 'number') return;
    
    let start = 0;
    const duration = 1200;
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

  const formatValue = (val: number) => {
    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
      case 'percentage':
        return `${val.toFixed(1)}%`;
      default:
        return val.toLocaleString('pt-BR');
    }
  };

  const deltaColor = !delta ? "" : 
    delta.value > 0 ? "text-emerald-400" : 
    delta.value < 0 ? "text-rose-400" : 
    "text-slate-500";
  
  const TrendIcon = delta && delta.value > 0 ? TrendingUpIcon : 
                    delta && delta.value < 0 ? TrendingDown : 
                    Minus;

  if (loading) {
    return (
      <div className={`bg-gradient-to-br ${colorScheme.gradient} rounded-xl p-6 border ${colorScheme.border} animate-pulse`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="h-3 w-20 bg-white/10 rounded mb-3" />
            <div className="h-8 w-32 bg-white/10 rounded mb-2" />
            <div className="h-2 w-24 bg-white/10 rounded" />
          </div>
          <div className="h-14 w-32 bg-white/10 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className={`group bg-gradient-to-br ${colorScheme.gradient} rounded-xl p-6 border ${colorScheme.border} ${colorScheme.hoverBorder} transition-all hover:scale-[1.02] relative overflow-hidden`}>
      {/* Efeito de brilho no hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      
      <div className="relative">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className={`w-10 h-10 rounded-lg ${colorScheme.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <Icon className={`w-5 h-5 ${colorScheme.iconColor}`} />
              </div>
            )}
            <div className="text-xs font-medium text-label uppercase tracking-wider">{label}</div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <div className="flex-1">
            <div className={`text-3xl md:text-4xl font-bold ${colorScheme.textColor} tabular-nums mb-2`}>
              {typeof value === 'number' ? formatValue(animatedValue) : value}
            </div>
            {delta && (
              <div className={`flex items-center gap-1 text-xs font-medium ${deltaColor}`}>
                <TrendIcon className="w-3 h-3" />
                {delta.value > 0 ? '+' : ''}{delta.value.toFixed(1)}%
                {delta.period && <span className="text-description ml-1">vs {delta.period}</span>}
              </div>
            )}
          </div>

          {sparkline.length > 0 && (
            <div className="h-12 w-24 md:h-14 md:w-32 opacity-60 group-hover:opacity-100 transition-opacity">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparkline}>
                  <defs>
                    <linearGradient id={`fill-${color}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={colorScheme.lineColor} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={colorScheme.lineColor} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#1a1625] border border-white/20 rounded px-2 py-1 text-xs">
                            <span className={colorScheme.iconColor}>{payload[0].value}</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="y" 
                    stroke={colorScheme.lineColor}
                    fill={`url(#fill-${color})`}
                    strokeWidth={2} 
                    dot={false}
                    animationDuration={1000}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
