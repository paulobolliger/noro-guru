"use client";
import React, { useState, useTransition } from "react";
import Portal from "@/components/ui/portal";
import { X, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LeadCreateModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const data = new FormData(form);
    startTransition(async () => {
      try {
        const res = await fetch("/control/leads/create", {
          method: "POST",
          body: data,
        });
        if (!res.ok) throw new Error("Falha ao criar lead");
        onClose();
        router.refresh();
      } catch (err: any) {
        setError(err?.message || "Erro inesperado");
      }
    });
  }

  return (
    <Portal>
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="surface-card w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-primary">
          <X size={20} />
        </button>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-primary">Novo Lead</h2>
          <p className="text-sm text-muted">Cadastre rapidamente um novo lead.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted">Cliente/Empresa</label>
            <input name="organization_name" required className="mt-1 w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-400/40" placeholder="Ex: Acme SA" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted">Email</label>
              <input name="email" type="email" className="mt-1 w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-400/40" placeholder="email@empresa.com" />
            </div>
            <div>
              <label className="text-sm text-muted">Telefone</label>
              <input name="phone" className="mt-1 w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-400/40" placeholder="(11) 99999‑0000" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="text-sm text-muted">Fonte</label>
              <input name="source" className="mt-1 w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-400/40" placeholder="Ex: Site, Indicação" />
            </div>
            <div>
              <label className="text-sm text-muted">Valor (R$)</label>
              <input name="value" type="number" step="0.01" className="mt-1 w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-400/40" placeholder="0,00" />
            </div>
          </div>
          {error && <div className="text-sm text-rose-400">{error}</div>}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-muted hover:bg-white/5">Cancelar</button>
            <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-60">
              {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus className="h-4 w-4" />} Criar Lead
            </button>
          </div>
        </form>
      </div>
    </div>
    </Portal>
  );
}
