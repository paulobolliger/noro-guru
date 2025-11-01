// app/(protected)/control/DashboardHero.tsx
"use client";
import { 
  Activity, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Clock,
  Zap
} from "lucide-react";
import { useMemo } from "react";

interface DashboardHeroProps {
  tenants: number;
  apiKeys: number;
  totalCalls: number;
  usage: Array<{ day: string; calls: number; p50_ms?: number; p95_ms?: number; err4xx_rate?: number; err5xx_rate?: number }>;
}

export function DashboardHero({ tenants, apiKeys, totalCalls, usage }: DashboardHeroProps) {
  const healthMetrics = useMemo(() => {
    if (!usage || usage.length === 0) {
      return {
        avgLatency: 0,
        errorRate: 0,
        uptime: 100,
        status: 'operational',
        statusColor: 'text-emerald-500',
        statusBg: 'bg-emerald-500/10',
      };
    }

    const recentData = usage.slice(-7); // últimos 7 dias
    const avgP95 = recentData.reduce((sum, d) => sum + (d.p95_ms || 0), 0) / recentData.length;
    const totalErrors = recentData.reduce((sum, d) => sum + (d.err4xx_rate || 0) + (d.err5xx_rate || 0), 0);
    const avgErrorRate = totalErrors / recentData.length;
    const uptime = Math.max(95, 100 - avgErrorRate);

    let status = 'operational';
    let statusColor = 'text-emerald-500';
    let statusBg = 'bg-emerald-500/10';

    if (avgP95 > 1000 || avgErrorRate > 5) {
      status = 'degraded';
      statusColor = 'text-amber-500';
      statusBg = 'bg-amber-500/10';
    }
    if (avgErrorRate > 10) {
      status = 'outage';
      statusColor = 'text-rose-500';
      statusBg = 'bg-rose-500/10';
    }

    return {
      avgLatency: Math.round(avgP95),
      errorRate: avgErrorRate,
      uptime: Math.round(uptime * 100) / 100,
      status,
      statusColor,
      statusBg,
    };
  }, [usage]);

  const growthMetrics = useMemo(() => {
    if (usage.length < 14) return { callsGrowth: 0, trend: 'stable' };
    
    const lastWeek = usage.slice(-7).reduce((sum, d) => sum + d.calls, 0);
    const prevWeek = usage.slice(-14, -7).reduce((sum, d) => sum + d.calls, 0);
    const growth = prevWeek > 0 ? ((lastWeek - prevWeek) / prevWeek) * 100 : 0;
    
    return {
      callsGrowth: Math.round(growth * 10) / 10,
      trend: growth > 5 ? 'up' : growth < -5 ? 'down' : 'stable',
    };
  }, [usage]);

  const StatusIcon = healthMetrics.status === 'operational' ? CheckCircle2 : AlertCircle;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Health Status - Destaque Principal */}
      <div className="lg:col-span-2 bg-gradient-to-br from-[#1a1625] via-[#1a1625] to-[#2a2635] rounded-2xl p-8 border border-[#D4AF37]/20 shadow-2xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <StatusIcon className={`w-6 h-6 ${healthMetrics.statusColor}`} />
              <h2 className="text-2xl font-bold text-white">System Health</h2>
            </div>
            <p className="text-description">Monitoramento em tempo real do Control Plane</p>
          </div>
          <div className={`px-4 py-2 rounded-full ${healthMetrics.statusBg} ${healthMetrics.statusColor} font-semibold text-sm uppercase tracking-wide`}>
            {healthMetrics.status}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-description text-sm">
              <Clock className="w-4 h-4" />
              <span>Uptime</span>
            </div>
            <div className="text-3xl font-bold text-[#4aede5]">{healthMetrics.uptime}%</div>
            <div className="text-xs text-description">Últimos 7 dias</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-description text-sm">
              <Zap className="w-4 h-4" />
              <span>Latência p95</span>
            </div>
            <div className="text-3xl font-bold text-[#4aede5]">{healthMetrics.avgLatency}<span className="text-lg text-description">ms</span></div>
            <div className="text-xs text-description">Média 7 dias</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-description text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Error Rate</span>
            </div>
            <div className="text-3xl font-bold text-[#4aede5]">{healthMetrics.errorRate.toFixed(2)}%</div>
            <div className="text-xs text-description">4xx + 5xx</div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-description text-sm">
              <Activity className="w-4 h-4" />
              <span>API Calls</span>
            </div>
            <div className="text-3xl font-bold text-[#4aede5]">{totalCalls.toLocaleString('pt-BR')}</div>
            <div className={`text-xs flex items-center gap-1 ${growthMetrics.callsGrowth > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              <TrendingUp className={`w-3 h-3 ${growthMetrics.callsGrowth < 0 ? 'rotate-180' : ''}`} />
              {growthMetrics.callsGrowth > 0 ? '+' : ''}{growthMetrics.callsGrowth}% vs semana anterior
            </div>
          </div>
        </div>

        {/* Health Bar */}
        <div className="mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center justify-between text-xs text-description mb-2">
            <span>System Performance</span>
            <span>{Math.round(100 - healthMetrics.errorRate - (healthMetrics.avgLatency / 10))}% optimal</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#4aede5] to-[#0FA89A] rounded-full transition-all duration-1000"
              style={{ width: `${Math.min(100, 100 - healthMetrics.errorRate - (healthMetrics.avgLatency / 20))}%` }}
            />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-6">
        {/* Tenants Card */}
        <div className="bg-gradient-to-br from-[#D4AF37]/10 to-[#D4AF37]/5 rounded-xl p-6 border border-[#D4AF37]/20 hover:border-[#D4AF37]/40 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6 text-[#D4AF37]" />
            </div>
            <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div className="text-4xl font-bold text-white mb-1">{tenants}</div>
          <div className="text-sm text-description">Tenants Ativos</div>
        </div>

        {/* API Keys Card */}
        <div className="bg-gradient-to-br from-[#4aede5]/10 to-[#4aede5]/5 rounded-xl p-6 border border-[#4aede5]/20 hover:border-[#4aede5]/40 transition-all group">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-[#4aede5]/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-[#4aede5]" />
            </div>
            <CheckCircle2 className="w-5 h-5 text-[#4aede5]" />
          </div>
          <div className="text-4xl font-bold text-white mb-1">{apiKeys}</div>
          <div className="text-sm text-description">API Keys Ativas</div>
        </div>
      </div>
    </div>
  );
}
