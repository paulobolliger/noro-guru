"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NButton, NSelect, NTextarea, NBadge } from "@/components/ui";
import PageContainer from "@/components/layout/PageContainer";
import { useTicket } from "@/hooks/useTicket";
import { useTicketMessages } from "@/hooks/useTicketMessages";
import { useSupportMeta } from "@/hooks/useSupportMeta";
import { useToast } from "@/components/ui/use-toast";

const STATUS_OPTIONS = [
  { value: "open", label: "Aberto" },
  { value: "pending", label: "Pendente" },
  { value: "waiting", label: "Aguardando" },
  { value: "resolved", label: "Resolvido" },
  { value: "closed", label: "Fechado" },
];

const PRIORITY_OPTIONS = [
  { value: "low", label: "Baixa" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
];

const STATUS_BADGE: Record<string, "default" | "success" | "warning" | "error" | "info"> = {
  open: "info",
  pending: "warning",
  waiting: "warning",
  resolved: "success",
  closed: "success",
};

function formatDate(value?: string) {
  if (!value) return "--";
  return new Date(value).toLocaleString();
}

export default function SupportTicketPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const { ticket, isLoading, refresh } = useTicket(params.id);
  const { messages, isLoading: loadingMessages, refresh: refreshMessages } = useTicketMessages(params.id);
  const { tenants } = useSupportMeta();

  const [status, setStatus] = useState("open");
  const [priority, setPriority] = useState("normal");
  const [messageBody, setMessageBody] = useState("");
  const [internal, setInternal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [submittingMessage, setSubmittingMessage] = useState(false);

  useEffect(() => {
    if (ticket) {
      setStatus((ticket.status || "open").toLowerCase());
      setPriority((ticket.priority || "normal").toLowerCase());
    }
  }, [ticket]);

  const tenantName = useMemo(() => {
    if (!ticket) return "";
    const tenant = tenants.find((t) => t.id === ticket.tenant_id);
    return tenant ? `${tenant.name} (${tenant.slug})` : ticket.tenant_id;
  }, [ticket, tenants]);

  async function updateTicket(fields: Record<string, string>) {
    if (!ticket) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/support/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fields),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Falha ao atualizar ticket");
      }
      await refresh();
      toast({ description: "Ticket atualizado." });
    } catch (err: any) {
      toast({ description: err?.message || "Erro ao atualizar", variant: "destructive" });
    } finally {
      setUpdating(false);
    }
  }

  async function handleStatusChange(value: string) {
    setStatus(value);
    await updateTicket({ status: value });
  }

  async function handlePriorityChange(value: string) {
    setPriority(value);
    await updateTicket({ priority: value });
  }

  async function handleSendMessage() {
    if (!ticket || !messageBody.trim()) return;
    setSubmittingMessage(true);
    try {
      const res = await fetch(`/api/support/tickets/${ticket.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: messageBody, internal, tenant_id: ticket.tenant_id }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Falha ao enviar mensagem");
      }
      setMessageBody("");
      setInternal(false);
      await Promise.all([refreshMessages(), refresh()]);
      toast({ description: "Mensagem enviada." });
    } catch (err: any) {
      toast({ description: err?.message || "Erro ao enviar mensagem", variant: "destructive" });
    } finally {
      setSubmittingMessage(false);
    }
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="surface-card border border-default rounded-xl p-6 text-muted">Carregando ticket...</div>
      </PageContainer>
    );
  }

  if (!ticket) {
    return (
      <PageContainer>
        <div className="surface-card border border-default rounded-xl p-6 text-muted">Ticket não encontrado.</div>
      </PageContainer>
    );
  }

  return (
    <div className="container-app py-6 space-y-6">
      <PageContainer>
        <div className="flex items-center justify-between mb-4">
          <div>
            <Link href="/support" className="text-sm text-indigo-300 hover:underline">← Voltar para inbox</Link>
            <h1 className="text-2xl font-semibold text-primary mt-2">{ticket.subject || "Ticket"}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted">
              <span>Status: <NBadge variant={STATUS_BADGE[status] || "default"}>{status}</NBadge></span>
              <span>Prioridade: <strong>{priority}</strong></span>
              <span>Tenant: <strong>{tenantName}</strong></span>
            </div>
          </div>
          <NButton variant="secondary" onClick={() => router.refresh()}>Recarregar</NButton>
        </div>

        <div className="surface-card border border-default rounded-xl p-4 md:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted">Status</label>
              <NSelect value={status} onChange={(e) => handleStatusChange(e.target.value)} disabled={updating}>
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </NSelect>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted">Prioridade</label>
              <NSelect value={priority} onChange={(e) => handlePriorityChange(e.target.value)} disabled={updating}>
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </NSelect>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted">
            <div>
              <span className="block">Criado em: <strong>{formatDate(ticket.created_at)}</strong></span>
              <span className="block">Atualizado em: <strong>{formatDate(ticket.updated_at)}</strong></span>
            </div>
            <div>
              <span className="block">Ticket ID: <strong>{ticket.id}</strong></span>
              <span className="block">Requester: <strong>{ticket.requester_email || "--"}</strong></span>
            </div>
          </div>
        </div>
      </PageContainer>

      <PageContainer className="space-y-4">
        <div className="surface-card border border-default rounded-xl p-4 md:p-6">
          <h2 className="text-lg font-semibold text-primary mb-4">Mensagens</h2>
          {loadingMessages ? (
            <div className="text-sm text-muted">Carregando mensagens...</div>
          ) : (
            <div className="space-y-4">
              {messages.length === 0 && <div className="text-sm text-muted">Nenhuma mensagem registrada.</div>}
              {messages.map((msg: any) => (
                <div key={msg.id} className="border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between text-xs text-muted mb-2">
                    <span>{formatDate(msg.created_at)}</span>
                    <span>{msg.internal ? "Interna" : "Cliente"}</span>
                  </div>
                  <div className="text-sm text-primary whitespace-pre-wrap">{msg.body}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="surface-card border border-default rounded-xl p-4 md:p-6 space-y-4">
          <h3 className="text-md font-semibold text-primary">Adicionar mensagem</h3>
          <NTextarea
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            placeholder="Digite a resposta para o cliente"
            className="min-h-[140px]"
          />
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={internal} onChange={(e) => setInternal(e.target.checked)} />
            Marcar como interna
          </label>
          <div className="flex items-center justify-end">
            <NButton variant="primary" onClick={handleSendMessage} disabled={submittingMessage || !messageBody.trim()}>
              {submittingMessage ? "Enviando..." : "Enviar mensagem"}
            </NButton>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
