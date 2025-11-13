// components/dashboard/CostTable.tsx
'use client';

import { formatCost } from '@/lib/utils/cost-calculator';

interface CostItem {
  slug: string;
  created_at: string;
  prompt_tokens?: number | null;
  completion_tokens?: number | null;
  text_cost?: number | null;
  image_cost?: number | null;
  total_cost?: number | null;
  source?: string | null;
}

interface CostTableProps {
  items: CostItem[];
  totalCost: number;
}

export default function CostTable({ items, totalCost }: CostTableProps) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Header com total */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Detalhamento de Custos</h3>
          <div className="text-right">
            <div className="text-sm opacity-90">Custo Total</div>
            <div className="text-2xl font-bold">
              {formatCost(totalCost)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Slug
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                Data
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                Tokens In
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                Tokens Out
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                Custo Texto
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                Custo Imagem
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">
                Total
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">
                Fonte
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  Nenhum item com custos registrados no período selecionado
                </td>
              </tr>
            ) : (
              items.map((item, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">
                    {item.slug}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(item.created_at).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600">
                    {(item.prompt_tokens || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-600">
                    {(item.completion_tokens || 0).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono text-gray-900">
                    {formatCost(item.text_cost || 0)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-mono text-gray-900">
                    {formatCost(item.image_cost || 0)}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-bold font-mono text-blue-600">
                    {formatCost(item.total_cost || 0)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {item.source === 'ai_generated' ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        IA
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Manual
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
