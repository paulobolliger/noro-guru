"use client";
import Link from "next/link";
import { NButton, NBadge } from "@/components/ui";

type Ticket = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  tenant_id: string;
  updated_at: string;
  created_at: string;
};

type Props = {
  tickets: Ticket[];
  onNewTicket(): void;
  isLoading?: boolean;
  canCreate?: boolean;
};

const STATUS_VARIANT: Record<string, "default" | "success" | "warning" | "error" | "info"> = {
  open: "info",
  pending: "warning",
  waiting: "warning",
  waiting_customer: "warning",
  in_progress: "info",
  resolved: "success",
  closed: "success",
};

const PRIORITY_VARIANT: Record<string, "default" | "success" | "warning" | "error" | "info"> = {
  low: "info",
  normal: "default",
  high: "warning",
  urgent: "error",
};

function formatDate(value: string) {
  return new Date(value).toLocaleString();
}

export function SupportTicketTable({ tickets, onNewTicket, isLoading, canCreate = true }: Props) {
  return (
    <div className="surface-card rounded-xl border border-default shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-default">
        <div>
          <h2 className="text-lg font-semibold text-primary">Tickets</h2>
          <p className="text-sm text-muted">Gerencie solicitações de suporte ativas.</p>
        </div>
        <NButton variant="primary" size="sm" onClick={onNewTicket} disabled={!canCreate}>Novo ticket</NButton>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 border-b border-default">
            <tr>
              <th className="text-left px-4 py-2 text-muted">Assunto</th>
              <th className="text-left px-4 py-2 text-muted">Status</th>
              <th className="text-left px-4 py-2 text-muted">Prioridade</th>
              <th className="text-left px-4 py-2 text-muted">Atualizado</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">Carregando...</td>
              </tr>
            )}
            {!isLoading && tickets.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted">Nenhum ticket encontrado.</td>
              </tr>
            )}
            {tickets.map((ticket) => {
              const statusVariant = STATUS_VARIANT[ticket.status?.toLowerCase()] || "default";
              const priorityVariant = PRIORITY_VARIANT[ticket.priority?.toLowerCase()] || "default";
              return (
                <tr key={ticket.id} className="border-t border-white/10 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-primary">{ticket.subject || "(sem assunto)"}</div>
                    <div className="text-xs text-muted">#{ticket.id}</div>
                  </td>
                  <td className="px-4 py-3"><NBadge variant={statusVariant}>{ticket.status || "open"}</NBadge></td>
                  <td className="px-4 py-3"><NBadge variant={priorityVariant}>{ticket.priority || "normal"}</NBadge></td>
                  <td className="px-4 py-3 text-muted">{formatDate(ticket.updated_at || ticket.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link className="text-indigo-300 hover:underline" href={`/support/${ticket.id}`}>Abrir</Link>
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
