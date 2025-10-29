// components/admin/LeadsRecentes.tsx
import Link from 'next/link';
import { Lead } from "@noro-types/admin";

interface LeadsRecentesProps {
  leads: Lead[];
}

export default function LeadsRecentes({ leads }: LeadsRecentesProps) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      novo: 'bg-blue-100 text-blue-700',
      contato_inicial: 'bg-yellow-100 text-yellow-700',
      qualificado: 'bg-green-100 text-green-700',
      proposta_enviada: 'bg-purple-100 text-purple-700',
      negociacao: 'bg-orange-100 text-orange-700',
      ganho: 'bg-green-500 text-white',
      perdido: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-white/10 text-primary';
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
        <Link href="/admin/leads" className="text-blue-400 text-sm font-semibold hover:text-blue-300">
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
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
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
