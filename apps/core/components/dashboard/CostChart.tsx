'use client';

type CostChartProps = {
  dailyData?: Array<Record<string, unknown>>;
  textCostTotal?: number;
  imageCostTotal?: number;
};

export default function CostChart({
  dailyData = [],
  textCostTotal = 0,
  imageCostTotal = 0,
}: CostChartProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">Grafico de custos</h2>
      <p className="text-sm text-gray-600">Placeholder temporario para desbloquear build.</p>
      <div className="mt-2 text-sm text-gray-500">
        <div>Pontos diarios: {dailyData.length}</div>
        <div>Custo texto: {Number(textCostTotal || 0).toFixed(2)}</div>
        <div>Custo imagem: {Number(imageCostTotal || 0).toFixed(2)}</div>
      </div>
    </div>
  );
}
