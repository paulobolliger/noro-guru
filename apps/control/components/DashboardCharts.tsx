// components/admin/DashboardCharts.tsx
'use client';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DashboardChartsProps {
  receitaMensal: Array<{ mes: string; valor: number }>;
  leadsPorOrigem: Array<{ origem: string; total: number }>;
  conversaoPorMes: Array<{ mes: string; taxa: number }>;
}

export default function DashboardCharts({ receitaMensal, leadsPorOrigem, conversaoPorMes }: DashboardChartsProps) {
  const COLORS = ['#5053c4', '#342ca4', '#232452', '#60a5fa', '#34d399', '#fbbf24'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Gráfico de Receita Mensal */}
      <div className="surface-card rounded-xl p-6 shadow-sm border border-default">
        <h3 className="text-lg font-bold text-primary mb-4">Receita Mensal (€)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={receitaMensal}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="mes" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value: number) => `€${value.toLocaleString()}`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="valor" 
              stroke="#5053c4" 
              strokeWidth={3}
              dot={{ fill: '#5053c4', r: 6 }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Leads por Origem */}
      <div className="surface-card rounded-xl p-6 shadow-sm border border-default">
        <h3 className="text-lg font-bold text-primary mb-4">Leads por Origem</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={leadsPorOrigem}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ origem, percent }) => `${origem}: ${(percent * 100).toFixed(0)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="total"
            >
              {leadsPorOrigem.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de Taxa de Conversão */}
      <div className="surface-card rounded-xl p-6 shadow-sm border border-default lg:col-span-2">
        <h3 className="text-lg font-bold text-primary mb-4">Taxa de Conversão Mensal (%)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={conversaoPorMes}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="mes" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
              formatter={(value: number) => `${value}%`}
            />
            <Legend />
            <Bar dataKey="taxa" fill="#34d399" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}