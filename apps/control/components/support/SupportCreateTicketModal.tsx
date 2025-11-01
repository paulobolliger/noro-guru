"use client";
import { useState } from "react";
import { X } from "lucide-react";

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

const SOURCES = [
  { value: "manual", label: "Manual" },
  { value: "website", label: "Website" },
  { value: "tenant_dashboard", label: "Painel do Tenant" },
  { value: "api", label: "API" },
  { value: "email", label: "Email" },
];

export function SupportCreateTicketModal({ isOpen, onClose, tenants, defaultTenantId, onCreated }: Props) {
  const [subject, setSubject] = useState("");
  const [summary, setSummary] = useState("");
  const [tenantId, setTenantId] = useState(defaultTenantId || tenants[0]?.id || "");
  const [priority, setPriority] = useState("normal");
  const [source, setSource] = useState("manual");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('Modal render - isOpen:', isOpen, 'tenants:', tenants.length);

  if (!isOpen) return null;

  const canSubmit = subject.trim().length > 0 && tenantId;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;
    setIsSubmitting(true);
    setError(null);
    try {
      console.log('Creating ticket with data:', { subject, summary, tenant_id: tenantId, priority, source });
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, summary, tenant_id: tenantId, priority, source }),
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
      setSource("manual");
      onClose();
    } catch (err: any) {
      setError(err?.message || "Erro inesperado");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-[#1a1625] w-full max-w-2xl rounded-xl border-2 border-[#D4AF37] dark:border-[#4aede5] shadow-2xl overflow-hidden" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#D4AF37] dark:border-[#4aede5] bg-gradient-to-r from-purple-900/20 to-indigo-900/20">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-[#D4AF37]">Novo Ticket de Suporte</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">Preencha as informações do ticket</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            type="button"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form className="p-6 space-y-5" onSubmit={handleSubmit}>
          {/* Assunto */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Assunto <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Ex: Problema no login do sistema"
              required
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0f0d1a] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4aede5] focus:border-transparent"
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Descrição
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Descreva o problema em detalhes..."
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0f0d1a] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4aede5] focus:border-transparent resize-none"
            />
          </div>

          {/* Grid 2 colunas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tenant */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Tenant <span className="text-red-500">*</span>
              </label>
              <select
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                required
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0f0d1a] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4aede5] focus:border-transparent"
              >
                {tenants.map((tenant) => (
                  <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                ))}
              </select>
            </div>

            {/* Prioridade */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0f0d1a] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4aede5] focus:border-transparent"
              >
                {PRIORITIES.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Origem */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Origem do Ticket
            </label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0f0d1a] text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-[#4aede5] focus:border-transparent"
            >
              {SOURCES.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Indique de onde veio esta solicitação
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!canSubmit || isSubmitting}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#E6C25A] text-[#1a1625] font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? "Criando..." : "Criar Ticket"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

