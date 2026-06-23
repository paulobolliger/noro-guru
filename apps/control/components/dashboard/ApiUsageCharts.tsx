'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface ApiUsageChartsProps {
  usage: Array<{
    day: string;
    calls: number | string;
    err4xx_count?: number;
    err5xx_count?: number;
  }>;
  createdDaily: Array<{
    day: string;
    count: number;
  }>;
}

export default function ApiUsageCharts({ usage, createdDaily }: ApiUsageChartsProps) {
  const usageData = (usage || []).map((u) => {
    let rawDate = u.day;
    if (rawDate && rawDate.includes('T')) {
      rawDate = rawDate.split('T')[0];
    }
    const dateObj = new Date(rawDate + 'T12:00:00'); // Prevent UTC offset problems
    return {
      ...u,
      calls: Number(u.calls || 0),
      Erros4xx: Number(u.err4xx_count || 0),
      Erros5xx: Number(u.err5xx_count || 0),
      dayFormatted: isNaN(dateObj.getTime())
        ? String(u.day)
        : dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
    };
  });

  const tenantData = (createdDaily || []).map((t) => {
    let rawDate = t.day;
    if (rawDate && rawDate.includes('T')) {
      rawDate = rawDate.split('T')[0];
    }
    const dateObj = new Date(rawDate + 'T12:00:00'); // Prevent UTC offset problems
    return {
      ...t,
      NovosTenants: Number(t.count || 0),
      dayFormatted: isNaN(dateObj.getTime())
        ? String(t.day)
        : dateObj.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }),
    };
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Volume Diário de Chamadas */}
      <div className="bg-white dark:bg-[#1e1a2f] border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Volume Diário de Chamadas</h3>
        {usageData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
            Sem dados de tráfego de chamadas
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-white/5" />
              <XAxis dataKey="dayFormatted" stroke="#6b7280" style={{ fontSize: '11px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1625',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="calls"
                name="Chamadas de API"
                stroke="#4aede5"
                strokeWidth={3}
                dot={{ fill: '#4aede5', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Taxa de Erro */}
      <div className="bg-white dark:bg-[#1e1a2f] border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tráfego de Erros (HTTP 4xx / 5xx)</h3>
        {usageData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
            Sem logs de erro recentes
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-white/5" />
              <XAxis dataKey="dayFormatted" stroke="#6b7280" style={{ fontSize: '11px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1625',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar dataKey="Erros4xx" name="Erros 4xx" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Erros5xx" name="Erros 5xx" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Crescimento de Tenants */}
      <div className="bg-white dark:bg-[#1e1a2f] border border-gray-200 dark:border-white/10 rounded-xl p-6 shadow-sm lg:col-span-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Novos Tenants Cadastrados</h3>
        {tenantData.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] text-gray-400 text-sm">
            Nenhum tenant cadastrado no período
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tenantData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-white/5" />
              <XAxis dataKey="dayFormatted" stroke="#6b7280" style={{ fontSize: '11px' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '11px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1625',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend />
              <Bar dataKey="NovosTenants" name="Novos Tenants" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
