"use client";
import { useState } from "react";
import { NButton, NInput, NSelect } from "@/components/ui";

type TenantOption = {
  id: string;
  name: string;
  slug: string;
};

type Props = {
  isOpen: boolean;
  onClose(): void;
  tenants: TenantOption[];
  defaultTenantId: string | null;
  onCreated(ticket: any): void;
};

const PRIORITIES = [
  { value: "low", label: "Baixa" },
  { value: "normal", label: "Normal" },
  { value: "high", label: "Alta" },
  { value: "urgent", label: "Urgente" },
];

export function SupportCreateTicketModal({ isOpen, onClose, tenants, defaultTenantId, onCreated }: Props) {
  const [subject, setSubject] = useState("");
  const [summary, setSummary] = useState("");
  const [tenantId, setTenantId] = useState(defaultTenantId || tenants[0]?.id || "");
  const [priority, setPriority] = useState("normal");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const canSubmit = subject.trim().length > 0 && tenantId;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, summary, tenant_id: tenantId, priority }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => ({}));
        throw new Error(payload.error || "Falha ao criar ticket");
      }
      const data = await res.json();
      onCreated(data.ticket);
      setSubject("");
      setSummary("");
      setTenantId(defaultTenantId || tenants[0]?.id || "");
      setPriority("normal");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Erro inesperado");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="surface-card w-full max-w-lg p-6 rounded-xl border border-default shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-primary">Novo ticket</h2>
            <p className="text-sm text-muted">Descreva o problema do cliente.</p>
          </div>
          <NButton size="sm" onClick={onClose}>Fechar</NButton>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm text-muted">Assunto</label>
            <NInput value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Resumo curto" required />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted">Descrição</label>
            <textarea
              className="w-full min-h-[120px] px-4 py-2 rounded-lg border border-default bg-white/5 text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Inclua detalhes do problema"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm text-muted">Tenant</label>
              <NSelect value={tenantId} onChange={(e) => setTenantId(e.target.value)}>
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                ))}
              </NSelect>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted">Prioridade</label>
              <NSelect value={priority} onChange={(e) => setPriority(e.target.value)}>
                {PRIORITIES.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </NSelect>
            </div>
          </div>
          {error && <div className="text-sm text-[var(--error)]">{error}</div>}
          <div className="flex items-center justify-end gap-2 pt-2">
            <NButton size="sm" variant="tertiary" onClick={onClose} type="button">Cancelar</NButton>
            <NButton variant="primary" size="sm" type="submit" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Criando..." : "Criar ticket"}
            </NButton>
          </div>
        </form>
      </div>
    </div>
  );
}

