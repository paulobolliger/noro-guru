"use client";
import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LifeBuoy, Plus, Search, LayoutGrid, List } from 'lucide-react';
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
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [ticketsByStatus, setTicketsByStatus] = useState<Record<string, any[]>>({});

  // Debug
  useEffect(() => {
    console.log('SupportPageClient mounted');
    console.log('Tenants:', tenants);
    console.log('Tickets:', tickets.length);
  }, []);

  useEffect(() => {
    console.log('Modal state changed:', isModalOpen);
  }, [isModalOpen]);

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
    <div className="space-y-6">
      {/* Header */}
      <div className="sticky top-0 z-20">
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 max-w-[1200px] mx-auto px-4 md:px-6 py-4 mb-6 rounded-xl shadow-md"
          style={{ background: 'linear-gradient(135deg, rgba(59, 44, 164, 0.94), rgba(35, 33, 79, 0.92))' }}
        >
          <div className="flex items-center gap-3 flex-shrink-0">
            <LifeBuoy size={28} className="text-[#D4AF37]" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#D4AF37] tracking-tight">Suporte</h1>
              <p className="text-sm text-gray-300 mt-0.5">Gerenciamento de tickets e solicitações</p>
            </div>
          </div>

          {/* Right: Controls */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Search - Expandable */}
            <div className={`transition-all duration-200 ${searchExpanded ? 'w-64' : 'w-auto'}`}>
              {searchExpanded ? (
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") { 
                      setSearchExpanded(false); 
                      setSearchQuery(""); 
                    }
                  }}
                  onBlur={() => !searchQuery && setSearchExpanded(false)}
                  placeholder="Buscar por assunto ou ID..."
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                  autoFocus
                />
              ) : (
                <button
                  onClick={() => setSearchExpanded(true)}
                  className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                  title="Buscar"
                >
                  <Search size={18} />
                </button>
              )}
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-white/20" />

            {/* View Toggle */}
            <div className="flex items-center gap-1 bg-white/20 dark:bg-white/10 rounded-lg p-1">
              <button
                onClick={() => updateView({ view: "list" })}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentView !== "kanban"
                    ? "bg-white dark:bg-slate-800 text-purple-700 dark:text-[#D4AF37] shadow-sm"
                    : "text-white dark:text-white hover:bg-white/30 dark:hover:bg-white/20"
                }`}
              >
                <List size={14} /> <span className="hidden sm:inline">Lista</span>
              </button>
              <button
                onClick={() => updateView({ view: "kanban" })}
                className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === "kanban"
                    ? "bg-white dark:bg-slate-800 text-purple-700 dark:text-[#D4AF37] shadow-sm"
                    : "text-white dark:text-white hover:bg-white/30 dark:hover:bg-white/20"
                }`}
              >
                <LayoutGrid size={14} /> <span className="hidden sm:inline">Kanban</span>
              </button>
            </div>

            {/* Divider */}
            <div className="hidden md:block w-px h-8 bg-white/20" />

            {/* Action Button */}
            <button
              onClick={() => {
                console.log('Button clicked!');
                console.log('canCreate:', canCreate);
                console.log('tenants:', tenants);
                console.log('Current isModalOpen:', isModalOpen);
                setModalOpen(true);
                console.log('After setModalOpen(true)');
              }}
              disabled={!canCreate}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E6C25A] text-[#1a1625] font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title={!canCreate ? 'Nenhum tenant disponível' : 'Criar novo ticket'}
            >
              <Plus size={18} />
              <span className="hidden lg:inline">Novo Ticket</span>
              <span className="lg:hidden">Novo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="bg-white dark:bg-[#1a1625] border-2 border-[#4aede5] rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-105">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Total</div>
          <div className="text-3xl font-bold text-[#4aede5]">{metrics.total}</div>
        </div>
        
        <div className="bg-white dark:bg-[#1a1625] border-2 border-blue-400 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-105">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Abertos</div>
          <div className="text-3xl font-bold text-blue-400">{metrics.open}</div>
        </div>
        
        <div className="bg-white dark:bg-[#1a1625] border-2 border-amber-400 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-105">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Em Progresso</div>
          <div className="text-3xl font-bold text-amber-400">{metrics.inProgress}</div>
        </div>
        
        <div className="bg-white dark:bg-[#1a1625] border-2 border-emerald-400 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-105">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Resolvidos</div>
          <div className="text-3xl font-bold text-emerald-400">{metrics.resolved}</div>
        </div>
        
        <div className="bg-white dark:bg-[#1a1625] border-2 border-red-400 rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-105">
          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">Urgentes</div>
          <div className="text-3xl font-bold text-red-400">{metrics.urgent}</div>
        </div>
      </div>

      {/* Status Filters - Only show in list view */}
      {currentView !== "kanban" && (
        <div className="flex flex-wrap gap-2 max-w-[1200px] mx-auto px-4 md:px-6">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                statusFilter === option.value
                  ? 'bg-[#4aede5] text-[#1a1625] shadow-md'
                  : 'bg-white/5 dark:bg-white/5 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-white/10'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}

      {/* Content - Toggle between Kanban and Table */}
      <div className="max-w-[1200px] mx-auto px-4 md:px-6">
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
          <SupportTicketTable 
            tickets={filteredTickets} 
            isLoading={false}
          />
        )}
      </div>

      {/* Modal */}
      <SupportCreateTicketModal
        isOpen={isModalOpen}
        onClose={() => {
          console.log('Closing modal');
          setModalOpen(false);
        }}
        tenants={tenants}
        defaultTenantId={activeTenantId}
        onCreated={handleTicketCreated}
      />
      
      {/* Debug info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs z-[10000]">
          <div>Modal Open: {isModalOpen ? 'YES' : 'NO'}</div>
          <div>Tenants: {tenants.length}</div>
          <div>Can Create: {canCreate ? 'YES' : 'NO'}</div>
        </div>
      )}
    </div>
  );
}
