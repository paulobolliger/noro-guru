"use client";
import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LifeBuoy, Plus, Search, LayoutGrid, List, AlertCircle, CheckCircle, Clock, CheckSquare } from 'lucide-react';
import { SupportTicketTable } from "@/components/support/SupportTicketTable";
import { SupportCreateTicketModal } from "@/components/support/SupportCreateTicketModal";
import SupportKanbanBoard from "./kanban/SupportKanbanBoard";
import { listTicketsByStatus } from "./kanban/actions";

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

type Tenant = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  tickets: Ticket[];
  tenants: Tenant[];
  activeTenantId?: string;
};

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "open", label: "Aberto" },
  { value: "in-progress", label: "Em Progresso" },
  { value: "waiting", label: "Aguardando" },
  { value: "resolved", label: "Resolvido" },
  { value: "closed", label: "Fechado" },
];

export default function SupportPageClient({ tickets, tenants, activeTenantId }: Props) {
  const router = useRouter();
  const sp = useSearchParams();
  const currentView = (sp?.get("view") || "list").toLowerCase();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [ticketsByStatus, setTicketsByStatus] = useState<Record<string, any[]>>({});

  // Load kanban data when view changes
  useEffect(() => {
    if (currentView === "kanban") {
      listTicketsByStatus().then(setTicketsByStatus).catch(console.error);
    }
  }, [currentView]);

  function updateView(params: Record<string, string>) {
    const p = new URLSearchParams(sp?.toString() || "");
    Object.entries(params).forEach(([k, v]) => {
      if (!v) p.delete(k);
      else p.set(k, v);
    });
    router.push(`/support?${p.toString()}`);
  }

  // Calculate metrics
  const metrics = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === 'open').length;
    const inProgress = tickets.filter((t) => t.status === 'in-progress').length;
    const resolved = tickets.filter((t) => t.status === 'resolved').length;
    const urgent = tickets.filter((t) => t.priority === 'urgent').length;

    return { total, open, inProgress, resolved, urgent };
  }, [tickets]);

  // Filter tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      // Status filter
      if (statusFilter && ticket.status !== statusFilter) return false;

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSubject = (ticket.subject || "").toLowerCase().includes(query);
        const matchesId = (ticket.id || "").toLowerCase().includes(query);
        if (!matchesSubject && !matchesId) return false;
      }

      return true;
    });
  }, [tickets, statusFilter, searchQuery]);

  function handleTicketCreated(ticket: any) {
    setModalOpen(false);
    router.refresh(); // Revalidate server data
    router.push(`/support/${ticket.id}`);
  }

  const canCreate = tenants.length > 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-heading flex items-center gap-2">
            <LifeBuoy className="text-primary" size={24} />
            Suporte
          </h2>
          <p className="text-sm text-secondary mt-1">Gerenciamento de tickets e solicitações de clientes.</p>
        </div>
      </div>

      {/* Metrics Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Total</span>
            <List size={18} className="text-primary" />
          </div>
          <div className="text-2xl font-bold text-heading">{metrics.total}</div>
        </div>

        <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Abertos</span>
            <AlertCircle size={18} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-heading">{metrics.open}</div>
        </div>

        <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Em Progresso</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-heading">{metrics.inProgress}</div>
        </div>

        <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Resolvidos</span>
            <CheckCircle size={18} className="text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-heading">{metrics.resolved}</div>
        </div>

        <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Urgentes</span>
            <AlertCircle size={18} className="text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-600">{metrics.urgent}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center bg-surface-card p-4 rounded-xl border border-default shadow-sm">
        {/* Left: Search & View Toggle */}
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-tertiary" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por assunto ou ID..."
              className="w-full pl-10 pr-4 py-2 bg-surface-base border border-default rounded-lg text-heading text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-tertiary"
            />
          </div>

          {/* View Toggle */}
          <div className="flex bg-surface-base rounded-lg p-1 border border-default self-start md:self-auto">
            <button
              onClick={() => updateView({ view: "list" })}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${currentView !== "kanban"
                ? "bg-white text-primary shadow-sm"
                : "text-secondary hover:text-heading"
                }`}
            >
              <List size={16} /> <span className="hidden sm:inline">Lista</span>
            </button>
            <button
              onClick={() => updateView({ view: "kanban" })}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-1.5 ${currentView === "kanban"
                ? "bg-white text-primary shadow-sm"
                : "text-secondary hover:text-heading"
                }`}
            >
              <LayoutGrid size={16} /> <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>
        </div>

        {/* Right: Filters (List Only) & Action */}
        <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
          {currentView !== "kanban" && (
            <div className="flex bg-surface-base rounded-lg p-1 border border-default overflow-x-auto max-w-[calc(100vw-4rem)] md:max-w-none">
              {STATUS_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${statusFilter === option.value
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-secondary hover:text-heading'
                    }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => setModalOpen(true)}
            disabled={!canCreate}
            className="btn-primary px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm whitespace-nowrap w-full md:w-auto"
            title={!canCreate ? 'Nenhum tenant disponível' : 'Criar novo ticket'}
          >
            <Plus size={16} />
            <span>Novo Ticket</span>
          </button>
        </div>
      </div>

      {/* Content - Toggle between Kanban and Table */}
      <div className="min-h-[400px]">
        {currentView === "kanban" ? (
          <SupportKanbanBoard
            columns={[
              { key: 'open', label: 'Aberto', count: ticketsByStatus.open?.length || 0 },
              { key: 'in-progress', label: 'Em Progresso', count: ticketsByStatus['in-progress']?.length || 0 },
              { key: 'waiting', label: 'Aguardando', count: ticketsByStatus.waiting?.length || 0 },
              { key: 'resolved', label: 'Resolvido', count: ticketsByStatus.resolved?.length || 0 },
              { key: 'closed', label: 'Fechado', count: ticketsByStatus.closed?.length || 0 },
            ]}
            ticketsByStatus={ticketsByStatus}
          />
        ) : (
          <div className="bg-surface-card border border-default rounded-xl overflow-hidden shadow-sm">
            <SupportTicketTable
              tickets={filteredTickets}
              isLoading={false}
            />
          </div>
        )}
      </div>

      {/* Modal */}
      <SupportCreateTicketModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        tenants={tenants}
        defaultTenantId={activeTenantId}
        onCreated={handleTicketCreated}
      />
    </div>
  );
}
