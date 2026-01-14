'use client';

import KpiCard from '../dashboard/KpiCard';

interface LeadKpisProps {
  totals: {
    total: number;
    valorTotal: number;
    abertos: number;
    ganhos: number;
  };
}

export default function LeadKpis({ totals }: LeadKpisProps) {
  const valorFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(totals.valorTotal / 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <KpiCard
        label="Total de Leads"
        value={totals.total}
      />
      <KpiCard
        label="Leads Abertos"
        value={totals.abertos}
        delta={{ value: 8.5, period: "vs mês anterior" }}
      />
      <KpiCard
        label="Leads Ganhos"
        value={totals.ganhos}
        delta={{ value: 15.2, period: "vs mês anterior" }}
      />
      <KpiCard
        label="Valor Total"
        value={valorFormatado}
        delta={{ value: 22.3, period: "vs mês anterior" }}
      />
    </div>
  );
}
