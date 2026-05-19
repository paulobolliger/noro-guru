'use client';

type CostTableProps = {
  items?: Array<Record<string, unknown>>;
  totalCost?: number;
};

export default function CostTable({ items = [], totalCost = 0 }: CostTableProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Tabela de custos</h2>
        <span className="text-sm text-gray-500">Total: {Number(totalCost || 0).toFixed(2)}</span>
      </div>
      <p className="text-sm text-gray-600">
        Placeholder temporario para desbloquear build. Itens carregados: {items.length}
      </p>
    </div>
  );
}
