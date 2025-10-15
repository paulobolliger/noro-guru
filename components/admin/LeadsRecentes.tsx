// components/admin/LeadsRecentes.tsx
import Link from 'next/link';
import { Lead } from '@/types/admin';

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
    return colors[status] || 'bg-gray-100 text-gray-700';
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
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Leads Recentes</h2>
        <Link href="/admin/leads" className="text-blue-600 text-sm font-semibold hover:text-blue-700">
          Ver todos →
        </Link>
      </div>
      <div className="space-y-3">
        {leads.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Nenhum lead ainda</p>
        ) : (
          leads.map((lead) => (
            <Link
              key={lead.id}
              href={`/admin/leads/${lead.id}`}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                  {lead.nome[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{lead.nome}</p>
                  <p className="text-sm text-gray-500">{lead.origem || 'Origem desconhecida'}</p>
                </div>
              </div>
              <div className="text-right">
                {lead.valor_estimado && (
                  <p className="font-semibold text-gray-900">
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