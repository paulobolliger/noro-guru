// components/admin/LeadsRecentes.tsx
import Link from 'next/link';
import { Lead } from "@noro-types/admin";

interface LeadsRecentesProps {
  leads: Lead[];
}

export default function LeadsRecentes({ leads }: LeadsRecentesProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {\n    novo: 'border border-default bg-[var(--color-surface-alt)] text-primary',\n    contato_inicial: 'border border-default bg-[var(--color-surface-alt)] text-secondary',\n    qualificado: 'border border-default bg-[rgba(29,211,192,0.18)] text-success',\n    proposta_enviada: 'border border-default bg-[var(--color-surface-alt)] text-accent',\n    negociacao: 'border border-default bg-[var(--color-surface-alt)] text-primary',\n    ganho: 'border border-default bg-[rgba(29,211,192,0.22)] text-success',\n    perdido: 'border border-default bg-[rgba(239,68,68,0.18)] text-rose-400',\n  };
    return colors[status] || 'border border-default bg-[var(--color-surface-alt)] text-secondary';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      novo: 'Novo',
      contato_inicial: 'Contato',
      qualificado: 'Qualificado',
      proposta_enviada: 'Proposta Enviada',
      negociacao: 'Negociação',
      ganho: 'Ganho',
      perdido: 'Perdido',
    };
    return labels[status] || status;
  };

  return (
    <div className="surface-card rounded-xl p-6 shadow-sm border border-default">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-primary">Leads Recentes</h2>
        <Link href="/admin/leads" className="text-link text-sm font-semibold">
          Ver todos →
        </Link>
      </div>
      <div className="space-y-3">
        {leads.length === 0 ? (
          <p className="text-muted text-center py-8">Nenhum lead ainda</p>
        ) : (
          leads.map((lead) => (
            <Link
              key={lead.id}
              href={`/admin/leads/${lead.id}`}
              className="flex items-center justify-between rounded-lg border border-transparent bg-[var(--color-surface-alt)] p-3 transition-colors cursor-pointer hover:border-[rgba(29,211,192,0.25)] hover:bg-[rgba(29,211,192,0.08)]"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {lead.nome[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-primary">{lead.nome}</p>
                  <p className="text-sm text-muted">{lead.origem || 'Origem desconhecida'}</p>
                </div>
              </div>
              <div className="text-right">
                {lead.valor_estimado && (
                  <p className="font-semibold text-primary">
                    R$ {lead.valor_estimado.toLocaleString('pt-BR')}
                  </p>
                )}
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(lead.status)}`}>
                  {getStatusLabel(lead.status)}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}



