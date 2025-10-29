"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar, Legend, AreaChart, Area, Brush, PieChart, Pie, Cell } from "recharts";
import ChartCard from "./ChartCard";
import LegendToggle from "./LegendToggle";
import { useRouter, useSearchParams } from "next/navigation";

type UsagePoint = { day: string; calls: number };
type PlanEntry = { name: string; count: number };

function downloadCSV(rows: any[], filename: string) {
  if (!rows?.length) return;
  const keys = Object.keys(rows[0]);
  const csv = [keys.join(','), ...rows.map(r => keys.map(k => JSON.stringify(r[k] ?? '')).join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', filename);
  document.body.appendChild(link); link.click(); link.remove();
}

async function downloadPNGFromSVG(container: HTMLElement, filename: string) {
  const svg = container.querySelector('svg');
  if (!svg) return;
  const xml = new XMLSerializer().serializeToString(svg);
  const svg64 = btoa(unescape(encodeURIComponent(xml)));
  const image64 = 'data:image/svg+xml;base64,' + svg64;
  const img = new Image();
  await new Promise(res => { img.onload = res as any; img.src = image64; });
  const canvas = document.createElement('canvas');
  canvas.width = svg.clientWidth * 2; canvas.height = svg.clientHeight * 2;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(2,2);
  ctx.fillStyle = '#0B1220'; ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.drawImage(img, 0, 0);
  canvas.toBlob((blob) => {
    if (!blob) return;
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link); link.click(); link.remove();
  });
}

export default function DashboardCharts({
  usage,
  tenantsByPlan,
  createdDaily,
  activeBreakdown,
}: {
  usage: (UsagePoint & { p50_ms?: number; p95_ms?: number; err4xx_rate?: number; err5xx_rate?: number })[];
  tenantsByPlan: Record<string, number>;
  createdDaily?: Array<{ day: string; count: number }>;
  activeBreakdown?: { active: number; inactive: number };
}) {
  const router = useRouter();
  const sp = useSearchParams();

  const defaults = { calls: true, ma: true, p50: true, p95: true, e4: true, e5: true } as const;
  type Keys = keyof typeof defaults;
  const parseSeries = (param: string | null) => {
    if (!param) return { ...defaults } as Record<Keys, boolean>;
    const set = new Set(param.split(',').map((s) => s.trim()).filter(Boolean));
    const obj = {} as Record<Keys, boolean>;
    (Object.keys(defaults) as Keys[]).forEach((k) => (obj[k] = set.has(k)));
    return obj;
  };

  const [enabled, setEnabled] = useState<Record<Keys, boolean>>(() => parseSeries(sp.get('series')));
  const [enabledUsage, setEnabledUsage] = useState<{ calls: boolean; ma: boolean }>(() => {
    const param = sp.get('seriesUsage');
    if (!param) return { calls: true, ma: true };
    const set = new Set(param.split(',').map((s) => s.trim()).filter(Boolean));
    return { calls: set.has('calls'), ma: set.has('ma') };
  });

  useEffect(() => {
    // Sync from URL when changed externally (e.g., via back/forward or other controls)
    setEnabled(parseSeries(sp.get('series')));
    const param = sp.get('seriesUsage');
    if (param) {
      const set = new Set(param.split(',').map((s) => s.trim()).filter(Boolean));
      setEnabledUsage({ calls: set.has('calls'), ma: set.has('ma') });
    } else {
      setEnabledUsage({ calls: true, ma: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sp]);

  const pushSeriesToUrl = (state: Record<Keys, boolean>) => {
    const p = new URLSearchParams(sp.toString());
    const on = (Object.keys(state) as Keys[]).filter((k) => state[k]);
    if (on.length === (Object.keys(defaults) as Keys[]).length) p.delete('series');
    else p.set('series', on.join(','));
    router.push(`/control?${p.toString()}`, { scroll: false });
  };

  const toggle = (k: string) => setEnabled((s) => {
    const next = { ...s, [k]: !s[k as Keys] } as Record<Keys, boolean>;
    pushSeriesToUrl(next);
    return next;
  });

  const pushUsageSeries = (state: { calls: boolean; ma: boolean }) => {
    const p = new URLSearchParams(sp.toString());
    if (state.calls && state.ma) p.delete('seriesUsage');
    else {
      const list = [state.calls && 'calls', state.ma && 'ma'].filter(Boolean).join(',');
      p.set('seriesUsage', list);
    }
    router.push(`/control?${p.toString()}`, { scroll: false });
  };

  const toggleUsage = (k: 'calls' | 'ma') => setEnabledUsage((s) => {
    const next = { ...s, [k]: !s[k] };
    pushUsageSeries(next);
    return next;
  });
  const refUsage = useRef<HTMLDivElement>(null);
  const refPlans = useRef<HTMLDivElement>(null);
  const refCreated = useRef<HTMLDivElement>(null);
  const refActive = useRef<HTMLDivElement>(null);

  const usageWithMA = useMemo(() => {
    const win = 7;
    const arr = usage.map((u) => ({ ...u }));
    arr.forEach((p, idx) => {
      const start = Math.max(0, idx - win + 1);
      const slice = usage.slice(start, idx + 1);
      const avg = slice.reduce((a, b) => a + (b.calls || 0), 0) / slice.length;
      (p as any).ma = Math.round(avg * 100) / 100;
    });
    return arr;
  }, [usage]);

  const planData: PlanEntry[] = useMemo(() => Object.keys(tenantsByPlan || {}).map((k) => ({ name: k, count: tenantsByPlan[k] })), [tenantsByPlan]);

  const apiLatency = useMemo(() => usage.map(u => ({ day: u.day, p50: (u as any).p50_ms, p95: (u as any).p95_ms })), [usage]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div ref={refUsage}>
      <ChartCard title="Chamadas por dia" subtitle="Soma diária + média móvel (7d)" actions={
        <LegendToggle
          series={[
            { key: 'calls', label: 'Chamadas', color: '#5053C4', enabled: !!enabledUsage.calls },
            { key: 'ma', label: 'Média 7d', color: '#8A8CE6', enabled: !!enabledUsage.ma },
          ]}
          onToggle={(k) => toggleUsage(k as 'calls'|'ma')}
        />
      }>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={usageWithMA} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id="fillCalls" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5053C4" stopOpacity={0.35}/>
                <stop offset="100%" stopColor="#5053C4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(d) => String(d).slice(5)} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} width={40} />
            <Tooltip contentStyle={{ background: '#1A1F2E', border: '1px solid rgba(255,255,255,0.08)' }} labelStyle={{ color: '#e5e7eb' }} />
            {enabledUsage.calls && <Area type="monotone" dataKey="calls" stroke="#5053C4" fill="url(#fillCalls)" strokeWidth={2} />}
            {enabledUsage.ma && <Line type="monotone" dataKey="ma" stroke="#8A8CE6" strokeWidth={2} dot={false} />}
            <Brush dataKey="day" height={18} stroke="#5053C4" travellerWidth={10} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>
      <div className="px-4 md:px-6 py-2 flex gap-2">
        <button className="text-xs text-muted hover:text-primary" onClick={() => downloadCSV(usageWithMA, 'chamadas_por_dia.csv')}>Exportar CSV</button>
        <button className="text-xs text-muted hover:text-primary" onClick={() => refUsage.current && downloadPNGFromSVG(refUsage.current, 'chamadas_por_dia.png')}>Exportar PNG</button>
      </div>
      </div>

      <div ref={refPlans}>
      <ChartCard title="Tenants por plano" subtitle="Distribuição atual">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={planData} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} width={40} />
            <Tooltip contentStyle={{ background: '#1A1F2E', border: '1px solid rgba(255,255,255,0.08)' }} labelStyle={{ color: '#e5e7eb' }} />
            <Bar dataKey="count" fill="#342CA4" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <div className="px-4 md:px-6 py-2 flex gap-2">
        <button className="text-xs text-muted hover:text-primary" onClick={() => downloadCSV(planData, 'tenants_por_plano.csv')}>Exportar CSV</button>
        <button className="text-xs text-muted hover:text-primary" onClick={() => refPlans.current && downloadPNGFromSVG(refPlans.current, 'tenants_por_plano.png')}>Exportar PNG</button>
      </div>
      </div>

      {/* Uso de API: latências p50/p95 se disponíveis */}
      <div className="lg:col-span-2" ref={refCreated}>
      <ChartCard
        title="Uso de API"
        subtitle="Chamadas (barras), latência p50/p95 e erro rate 4xx/5xx (linhas)"
        actions={
          <LegendToggle
            series={[
              { key: 'calls', label: 'Chamadas', color: '#5053C4', enabled: !!enabled.calls },
              { key: 'p50', label: 'p50 (ms)', color: '#8A8CE6', enabled: !!enabled.p50 },
              { key: 'p95', label: 'p95 (ms)', color: '#C7C8FF', enabled: !!enabled.p95 },
              { key: 'e4', label: 'Erro 4xx (%)', color: '#E56464', enabled: !!enabled.e4 },
              { key: 'e5', label: 'Erro 5xx (%)', color: '#F59E0B', enabled: !!enabled.e5 },
            ]}
            onToggle={toggle}
          />
        }
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={usage} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(d) => String(d).slice(5)} />
            <YAxis yAxisId="left" tick={{ fill: '#94a3b8', fontSize: 12 }} width={40} />
            <YAxis yAxisId="right" orientation="right" tick={{ fill: '#94a3b8', fontSize: 12 }} width={40} />
            <Tooltip contentStyle={{ background: '#1A1F2E', border: '1px solid rgba(255,255,255,0.08)' }} labelStyle={{ color: '#e5e7eb' }} />
            {enabled.calls && <Bar yAxisId="left" dataKey="calls" fill="#5053C4" radius={[6,6,0,0]} />}
            {enabled.p50 && <Line yAxisId="right" type="monotone" dataKey="p50_ms" stroke="#8A8CE6" dot={false} strokeWidth={2} />}
            {enabled.p95 && <Line yAxisId="right" type="monotone" dataKey="p95_ms" stroke="#C7C8FF" dot={false} strokeWidth={2} />}
            {enabled.e4 && <Line yAxisId="right" type="monotone" dataKey="err4xx_rate" stroke="#E56464" dot={false} strokeWidth={2} />}
            {enabled.e5 && <Line yAxisId="right" type="monotone" dataKey="err5xx_rate" stroke="#F59E0B" dot={false} strokeWidth={2} />}
            <Brush dataKey="day" height={18} stroke="#5053C4" travellerWidth={10} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <div className="px-4 md:px-6 py-2 flex gap-2">
        <button className="text-xs text-muted hover:text-primary" onClick={() => downloadCSV(usage as any[], 'uso_api.csv')}>Exportar CSV</button>
        <button className="text-xs text-muted hover:text-primary" onClick={() => refCreated.current && downloadPNGFromSVG(refCreated.current, 'uso_api_latency.png')}>Exportar PNG</button>
      </div>
      </div>

      {/* Tenants criados por dia + Ativos vs Inativos */}
      <div ref={refCreated}>
      <ChartCard title="Tenants criados por dia" subtitle="Últimos cadastros">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={createdDaily || []} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(d) => String(d).slice(5)} />
            <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} width={40} />
            <Tooltip contentStyle={{ background: '#1A1F2E', border: '1px solid rgba(255,255,255,0.08)' }} labelStyle={{ color: '#e5e7eb' }} />
            <Bar dataKey="count" fill="#5053C4" radius={[6,6,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <div className="px-4 md:px-6 py-2 flex gap-2">
        <button className="text-xs text-muted hover:text-primary" onClick={() => downloadCSV(createdDaily||[], 'tenants_criados_por_dia.csv')}>Exportar CSV</button>
        <button className="text-xs text-muted hover:text-primary" onClick={() => refCreated.current && downloadPNGFromSVG(refCreated.current, 'tenants_criados_por_dia.png')}>Exportar PNG</button>
      </div>
      </div>

      <div ref={refActive}>
      <ChartCard title="Ativos vs Inativos" subtitle="Distribuição atual">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie dataKey="value" data={[
              { name: 'Ativos', value: activeBreakdown?.active || 0, color: '#36C38A' },
              { name: 'Inativos', value: activeBreakdown?.inactive || 0, color: '#E56464' },
            ]} cx="50%" cy="50%" outerRadius={90} label={({name,percent})=>`${name}: ${(percent*100).toFixed(0)}%`}>
              <Cell fill="#36C38A" />
              <Cell fill="#E56464" />
            </Pie>
            <Tooltip contentStyle={{ background: '#1A1F2E', border: '1px solid rgba(255,255,255,0.08)' }} labelStyle={{ color: '#e5e7eb' }} />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>
      <div className="px-4 md:px-6 py-2 flex gap-2">
        <button className="text-xs text-muted hover:text-primary" onClick={() => downloadCSV([{status:'active',value:activeBreakdown?.active||0},{status:'inactive',value:activeBreakdown?.inactive||0}], 'tenants_ativos_vs_inativos.csv')}>Exportar CSV</button>
        <button className="text-xs text-muted hover:text-primary" onClick={() => refActive.current && downloadPNGFromSVG(refActive.current, 'tenants_ativos_vs_inativos.png')}>Exportar PNG</button>
      </div>
      </div>
    </div>
  );
}
