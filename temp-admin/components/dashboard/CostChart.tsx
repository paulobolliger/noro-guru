// components/dashboard/CostChart.tsx
'use client';

import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCost } from '@/lib/utils/cost-calculator';

interface DailyData {
  date: string;
  count: number;
  text_cost: number;
  image_cost: number;
  total_cost: number;
}

interface CostChartProps {
  dailyData: DailyData[];
  textCostTotal: number;
  imageCostTotal: number;
}

export default function CostChart({ dailyData, textCostTotal, imageCostTotal }: CostChartProps) {
  // Dados para o gráfico de pizza
  const pieData = [
    { name: 'Texto (GPT-4o-mini)', value: textCostTotal, color: '#3b82f6' },
    { name: 'Imagens (DALL-E 3 + outros)', value: imageCostTotal, color: '#a855f7' },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Custo') ? formatCost(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Gráfico de Linha - Evolução de Custos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-bold mb-4">Evolução Diária de Custos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="total_cost"
              stroke="#3b82f6"
              strokeWidth={2}
              name="Custo Total"
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="text_cost"
              stroke="#10b981"
              strokeWidth={2}
              name="Custo Texto"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="image_cost"
              stroke="#a855f7"
              strokeWidth={2}
              name="Custo Imagem"
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Barras - Quantidade Diária */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Quantidade Diária de Itens</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#3b82f6" name="Itens Gerados" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza - Distribuição de Custos */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4">Distribuição de Custos</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => formatCost(value)}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc', borderRadius: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legenda customizada */}
          <div className="mt-4 space-y-2">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-700">{entry.name}</span>
                </div>
                <span className="font-mono font-semibold text-gray-900">
                  {formatCost(entry.value)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
