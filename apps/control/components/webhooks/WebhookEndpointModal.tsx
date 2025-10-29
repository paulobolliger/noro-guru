"use client";
import React, { useState, useTransition } from "react";
import { X, Loader2 } from "lucide-react";
import Portal from "@/components/ui/portal";

export default function WebhookEndpointModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      try {
        const res = await fetch('/webhooks/endpoints/create', { method: 'POST', body: fd });
        if (!res.ok) throw new Error('Falha ao criar webhook');
        onClose();
        window.location.reload();
      } catch (err: any) {
        setError(err?.message || 'Erro inesperado');
      }
    });
  }

  return (
    <Portal>
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="surface-card w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-primary"><X size={20} /></button>
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-primary">Novo Webhook</h2>
          <p className="text-sm text-muted">Informe a URL de destino e o code do evento.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-muted">Code</label>
            <input name="code" required placeholder="ex: visa.created" className="mt-1 w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
          </div>
          <div>
            <label className="text-sm text-muted">URL</label>
            <input name="url" required placeholder="https://example.com/webhooks/noro" className="mt-1 w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
          </div>
          <div>
            <label className="text-sm text-muted">Secret (opcional)</label>
            <input name="secret" placeholder="gerado externamente" className="mt-1 w-full rounded-lg px-3 py-2 bg-white/5 border border-white/10 text-primary placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
          </div>
          <label className="flex items-center gap-2 text-sm text-primary">
            <input type="checkbox" name="is_active" defaultChecked /> Ativo
          </label>
          {error && <div className="text-sm text-rose-400">{error}</div>}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-muted hover:bg-white/5">Cancelar</button>
            <button type="submit" disabled={isPending} className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-60">
              {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : null} Criar
            </button>
          </div>
        </form>
      </div>
    </div>
    </Portal>
  );
}

