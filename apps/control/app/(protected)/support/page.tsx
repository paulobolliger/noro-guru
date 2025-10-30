"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeader from "@/components/layout/SectionHeader";
import { NInput, NSelect, NButton } from "@/components/ui";
import { useTickets } from "@/hooks/useTickets";
import { useSupportMeta } from "@/hooks/useSupportMeta";
import { SupportTicketTable } from "@/components/support/SupportTicketTable";
import { SupportCreateTicketModal } from "@/components/support/SupportCreateTicketModal";

const STATUS_OPTIONS = [
  { value: "", label: "Todos" },
  { value: "open", label: "Aberto" },
  { value: "pending", label: "Pendente" },
  { value: "waiting", label: "Aguardando" },
  { value: "resolved", label: "Resolvido" },
  { value: "closed", label: "Fechado" },
];

const PRIORITY_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "low", label: "Baixa" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
];

export default function SupportInboxPage() {
  const router = useRouter();
  const { tickets, refresh, isLoading } = useTickets();
  const { tenants, activeTenantId, refresh: refreshMeta } = useSupportMeta();
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [search, setSearch] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const canCreate = tenants.length > 0;

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket: any) => {
      if (status && (ticket.status || "").toLowerCase() !== status) return false;
      if (priority && (ticket.priority || "").toLowerCase() !== priority) return false;
      if (search) {
        const query = search.toLowerCase();
        const matchesSubject = (ticket.subject || "").toLowerCase().includes(query);
        const matchesId = (ticket.id || "").toLowerCase().includes(query);
        if (!matchesSubject && !matchesId) return false;
      }
      return true;
    });
  }, [tickets, status, priority, search]);

  function handleTicketCreated(ticket: any) {
    refresh();
    refreshMeta();
    setModalOpen(false);
    router.push(`/support/${ticket.id}`);
  }

  return (
    <div className="container-app py-8 space-y-6">
      <PageContainer>
        <SectionHeader title="Suporte" subtitle="Inbox de tickets do Control." />
      </PageContainer>

      <PageContainer className="space-y-4">
        <div className="surface-card rounded-xl border border-default p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="md:w-64">
              <NInput
                placeholder="Buscar por assunto ou ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <NSelect value={status} onChange={(e) => setStatus(e.target.value)}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </NSelect>
              <NSelect value={priority} onChange={(e) => setPriority(e.target.value)}>
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </NSelect>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <NButton variant="secondary" onClick={() => { setStatus(""); setPriority(""); setSearch(""); }}>Limpar</NButton>
            <NButton variant="primary" onClick={() => setModalOpen(true)} disabled={!canCreate}>Novo ticket</NButton>
          </div>
        </div>

        <SupportTicketTable tickets={filteredTickets} isLoading={isLoading} onNewTicket={() => setModalOpen(true)} canCreate={canCreate} />
        {!canCreate && (
          <div className="text-sm text-muted">
            Não há tenants associados para criar novos tickets. Peça a um administrador para conceder acesso.
          </div>
        )}
      </PageContainer>

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
