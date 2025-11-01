"use client";
import Link from "next/link";
import { CheckCircle2, Clock, AlertCircle, XCircle, FileText } from "lucide-react";

type Ticket = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  source?: string;
  tenant_id: string;
  updated_at: string;
  created_at: string;
};

type Props = {
  tickets: Ticket[];
  isLoading?: boolean;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  open: { label: "Aberto", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800", icon: FileText },
  "in-progress": { label: "Em Progresso", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800", icon: Clock },
  waiting: { label: "Aguardando", color: "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-800", icon: Clock },
  resolved: { label: "Resolvido", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800", icon: CheckCircle2 },
  closed: { label: "Fechado", color: "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-800", icon: XCircle },
};

const PRIORITY_CONFIG: Record<string, { label: string; color: string }> = {
  low: { label: "Baixa", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800" },
  normal: { label: "Normal", color: "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-800" },
  high: { label: "Alta", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-400 border-amber-200 dark:border-amber-800" },
  urgent: { label: "Urgente", color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 border-red-200 dark:border-red-800" },
};

const SOURCE_LABELS: Record<string, string> = {
  manual: "Manual",
  website: "Website",
  tenant_dashboard: "Painel Tenant",
  api: "API",
  email: "Email",
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('pt-BR', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

export function SupportTicketTable({ tickets, isLoading }: Props) {
  return (
    <div className="bg-white dark:bg-[#1a1625] rounded-xl border-2 border-[#D4AF37] dark:border-[#4aede5] shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="border-b-2 border-[#D4AF37] dark:border-[#4aede5] bg-gray-50 dark:bg-[#0f0d1a]">
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Assunto</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Prioridade</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Origem</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Atualizado</th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#4aede5]"></div>
                    <span>Carregando tickets...</span>
                  </div>
                </td>
              </tr>
            )}
            {!isLoading && tickets.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                  Nenhum ticket encontrado.
                </td>
              </tr>
            )}
            {!isLoading && tickets.map((ticket) => {
              const statusConfig = STATUS_CONFIG[ticket.status?.toLowerCase()] || STATUS_CONFIG.open;
              const priorityConfig = PRIORITY_CONFIG[ticket.priority?.toLowerCase()] || PRIORITY_CONFIG.normal;
              const StatusIcon = statusConfig.icon;

              return (
                <tr key={ticket.id} className="hover:bg-gray-50 dark:hover:bg-[#231f30] transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900 dark:text-gray-100">{ticket.subject || "(sem assunto)"}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-500 font-mono">#{ticket.id.slice(0, 8)}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${statusConfig.color}`}>
                      <StatusIcon size={14} />
                      {statusConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${priorityConfig.color}`}>
                      {priorityConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                    {SOURCE_LABELS[ticket.source || 'manual'] || ticket.source || 'Manual'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                    {formatDate(ticket.updated_at || ticket.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link 
                      href={`/support/${ticket.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium bg-[#4aede5] hover:bg-[#3dcdd5] text-[#1a1625] transition-all hover:scale-105 shadow-sm"
                    >
                      Abrir
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
