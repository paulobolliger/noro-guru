import { createServerSupabaseClient } from "@lib/supabase/server";

export default async function FinanceiroPage() {
  const supabase = createServerSupabaseClient();
  const { data: accounts } = await supabase.schema('cp').from('ledger_accounts').select('*').order('code');
  const { data: entries } = await supabase.schema('cp').from('ledger_entries').select('account_id, tenant_id, amount_cents, memo, occurred_at').order('occurred_at', { ascending: false }).limit(50);
  return (
    <div className="container-app py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-primary">Financeiro</h1>
        <p className="text-muted">Lançamentos contábeis gerados a partir do Billing e ajustes operacionais.</p>
      </div>
      <div className="rounded-xl surface-card border border-default shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
        <div className="p-3 font-medium border-b border-default bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent">Plano de Contas</div>
        <table className="min-w-full text-sm">
          <thead className="bg-transparent"><tr><th className="text-left p-2 text-xs font-medium uppercase tracking-wide text-muted">Código</th><th className="text-left p-2 text-xs font-medium uppercase tracking-wide text-muted">Conta</th><th className="text-left p-2 text-xs font-medium uppercase tracking-wide text-muted">Tipo</th></tr></thead>
          <tbody>
            {(accounts ?? []).map((a: any) => (
              <tr key={a.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors"><td className="p-2 text-primary">{a.code}</td><td className="p-2 text-primary">{a.name}</td><td className="p-2 text-primary">{a.type}</td></tr>
            ))}
            {!accounts?.length && <tr><td className="p-3 text-muted" colSpan={3}>Sem contas</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl surface-card border border-default shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
        <div className="p-3 font-medium border-b border-default bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent">Lançamentos Recentes</div>
        <table className="min-w-full text-sm">
          <thead className="bg-transparent"><tr><th className="text-left p-2 text-xs font-medium uppercase tracking-wide text-muted">Conta</th><th className="text-left p-2 text-xs font-medium uppercase tracking-wide text-muted">Tenant</th><th className="text-left p-2 text-xs font-medium uppercase tracking-wide text-muted">Valor</th><th className="text-left p-2 text-xs font-medium uppercase tracking-wide text-muted">Quando</th><th className="text-left p-2 text-xs font-medium uppercase tracking-wide text-muted">Memo</th></tr></thead>
          <tbody>
            {(entries ?? []).map((e: any, idx: number) => (
              <tr key={idx} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors"><td className="p-2 text-primary">{e.account_id}</td><td className="p-2 text-primary">{e.tenant_id||'-'}</td><td className="p-2 text-primary">{(e.amount_cents||0)/100}</td><td className="p-2 text-primary">{e.occurred_at}</td><td className="p-2 text-primary">{e.memo||'-'}</td></tr>
            ))}
            {!entries?.length && <tr><td className="p-3 text-muted" colSpan={5}>Sem lançamentos</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
