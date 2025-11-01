import React from "react";
import { NBadge, NButton } from "@/components/ui";

export default function LeadTable({ leads }: { leads: any[] }) {
  return (
    <div className="mx-auto max-w-7xl px-6 md:px-8 my-6 md:my-8">
      <div className="overflow-x-auto rounded-xl border-2 border-[#D4AF37] dark:border-[#4aede5] shadow-lg">
        <table className="min-w-full text-sm bg-white dark:bg-[#1a1625]">
          <thead className="bg-gradient-to-b from-gray-100 dark:from-indigo-500/10 via-gray-50 dark:via-purple-500/5 to-transparent border-b-2 border-[#D4AF37] dark:border-[#4aede5]">
          <tr>
            <th className="text-left px-4 md:px-6 py-3 text-xs font-bold uppercase tracking-wide text-[#D4AF37]">Cliente/Empresa</th>
            <th className="text-left px-4 md:px-6 py-3 text-xs font-bold uppercase tracking-wide text-[#D4AF37]">Contato</th>
            <th className="text-left px-4 md:px-6 py-3 text-xs font-bold uppercase tracking-wide text-[#D4AF37]">Fonte</th>
            <th className="text-left px-4 md:px-6 py-3 text-xs font-bold uppercase tracking-wide text-[#D4AF37]">Estágio</th>
            <th className="text-left px-4 md:px-6 py-3 text-xs font-bold uppercase tracking-wide text-[#D4AF37]">Valor</th>
            <th className="text-left px-4 md:px-6 py-3 text-xs font-bold uppercase tracking-wide text-[#D4AF37]">Criado</th>
            <th className="p-3"/>
          </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/10">
          {leads.map((l) => (
            <tr key={l.id} className="group hover:bg-gray-50 dark:hover:bg-white/[0.02] active:opacity-90 transition-colors">
              <td className="px-4 md:px-6 py-3 font-medium text-gray-900 dark:text-white">{l.organization_name}</td>
              <td className="px-4 md:px-6 py-3 text-gray-700 dark:text-gray-300">{l.email || l.phone || '-'}</td>
              <td className="px-4 md:px-6 py-3 text-gray-700 dark:text-gray-300">{l.source || '-'}</td>
              <td className="px-4 md:px-6 py-3">
                <NBadge variant={
                  (l.stage||'').toLowerCase() === 'ganho' ? 'success' :
                  (l.stage||'').toLowerCase() === 'perdido' ? 'error' :
                  (l.stage||'').toLowerCase() === 'negociacao' ? 'warning' : 'info'
                }>
                  {l.stage || '—'}
                </NBadge>
              </td>
              <td className="px-4 md:px-6 py-3 font-semibold text-gray-900 dark:text-white">{((l.value_cents||0)/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'})}</td>
              <td className="px-4 md:px-6 py-3 text-gray-700 dark:text-gray-300">{new Date(l.created_at).toLocaleString('pt-BR')}</td>
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
              <td className="px-6 py-10 text-center text-gray-600 dark:text-gray-400" colSpan={7}>Sem leads</td>
            </tr>
          )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
