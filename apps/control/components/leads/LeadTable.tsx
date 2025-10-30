import React from "react";
import { NBadge, NButton } from "@/components/ui";

export default function LeadTable({ leads }: { leads: any[] }) {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 my-6 md:my-8">
      <div className="overflow-x-auto rounded-xl border border-default surface-card shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent border-b border-default border-white/10">
          <tr>
            <th className="text-left px-4 md:px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted">Cliente/Empresa</th>
            <th className="text-left px-4 md:px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted">Contato</th>
            <th className="text-left px-4 md:px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted">Fonte</th>
            <th className="text-left px-4 md:px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted">Estágio</th>
            <th className="text-left px-4 md:px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted">Valor</th>
            <th className="text-left px-4 md:px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted">Criado</th>
            <th className="p-3"/>
          </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
          {leads.map((l) => (
            <tr key={l.id} className="group hover:bg-white/[0.02] active:opacity-90 transition-colors">
              <td className="px-4 md:px-6 py-3 font-medium text-primary">{l.organization_name}</td>
              <td className="px-4 md:px-6 py-3 text-muted">{l.email || l.phone || '-'}</td>
              <td className="px-4 md:px-6 py-3 text-muted">{l.source || '-'}</td>
              <td className="px-4 md:px-6 py-3">
                <NBadge variant={
                  (l.stage||'').toLowerCase() === 'ganho' ? 'success' :
                  (l.stage||'').toLowerCase() === 'perdido' ? 'error' :
                  (l.stage||'').toLowerCase() === 'negociacao' ? 'warning' : 'info'
                }>
                  {l.stage || '—'}
                </NBadge>
              </td>
              <td className="px-4 md:px-6 py-3 text-primary">{((l.value_cents||0)/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>
              <td className="px-4 md:px-6 py-3 text-muted">{new Date(l.created_at).toLocaleString('pt-BR')}</td>
              <td className="px-4 md:px-6 py-3 text-right">
                {!l.tenant_id && (
                  <form action="/control/leads/convert" method="post">
                    <input type="hidden" name="id" value={l.id} />
                    <NButton className="opacity-0 group-hover:opacity-100" size="sm" variant="tertiary">Converter</NButton>
                  </form>
                )}
              </td>
            </tr>
          ))}
          {!leads.length && (
            <tr>
              <td className="px-6 py-10 text-center text-muted" colSpan={7}>Sem leads</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
