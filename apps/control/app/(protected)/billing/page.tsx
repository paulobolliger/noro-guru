import { createServerSupabaseClient } from "@lib/supabase/server";
import { DollarSign, FileText, Layout, TrendingUp } from "lucide-react";

export default async function BillingPage() {
  const supabase = createServerSupabaseClient();
  const [{ count: plans }, { count: subs }, { count: accounts }] = await Promise.all([
    supabase.schema('cp').from('plans').select('*', { count: 'exact', head: true }),
    supabase.schema('cp').from('subscriptions').select('*', { count: 'exact', head: true }),
    supabase.schema('cp').from('ledger_accounts').select('*', { count: 'exact', head: true }),
  ]);
  const { data: invoices } = await supabase
    .schema('cp')
    .from('invoices')
    .select('tenant_id, amount_cents, currency, status, issued_at, created_at')
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-heading flex items-center gap-2">
          <DollarSign className="text-primary" size={24} />
          Billing & Financeiro
        </h2>
        <p className="text-sm text-secondary mt-1">Visão geral de planos, assinaturas e faturas.</p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-card rounded-xl p-6 border border-default shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <p className="text-sm font-medium text-secondary tracking-wide uppercase">Total Receita</p>
              <h3 className="text-3xl font-bold text-heading mt-1">€ 24.5k</h3>
            </div>
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-full blur-2xl -mr-10 -mb-10"></div>
        </div>

        <div className="bg-surface-card rounded-xl p-6 border border-default shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <p className="text-sm font-medium text-secondary tracking-wide uppercase">Assinaturas Ativas</p>
              <h3 className="text-3xl font-bold text-heading mt-1">{subs ?? 0}</h3>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Layout size={24} />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-transparent rounded-full blur-2xl -mr-10 -mb-10"></div>
        </div>

        <div className="bg-surface-card rounded-xl p-6 border border-default shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <p className="text-sm font-medium text-secondary tracking-wide uppercase">Planos Disponíveis</p>
              <h3 className="text-3xl font-bold text-heading mt-1">{plans ?? 0}</h3>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <FileText size={24} />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl -mr-10 -mb-10"></div>
        </div>
      </div>

      {/* Financeiro Integration */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold text-heading">Gestão Financeira</h3>
            <p className="text-sm text-secondary">Acesse os módulos do sistema financeiro integrado.</p>
          </div>
          <a
            href="http://localhost:3003"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            Acessar Sistema Completo
            <Layout size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <a
            href="http://localhost:3003/fluxo-caixa"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface-card rounded-xl p-5 border border-default shadow-sm hover:shadow-md transition-all cursor-pointer group block"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg group-hover:bg-emerald-200 transition-colors">
                <TrendingUp size={20} />
              </div>
              <span className="font-semibold text-heading">Fluxo de Caixa</span>
            </div>
            <p className="text-xs text-secondary">Visualize entradas e saídas em tempo real.</p>
          </a>

          <a
            href="http://localhost:3003/duplicatas-pagar"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface-card rounded-xl p-5 border border-default shadow-sm hover:shadow-md transition-all cursor-pointer group block"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-amber-100 text-amber-700 rounded-lg group-hover:bg-amber-200 transition-colors">
                <FileText size={20} />
              </div>
              <span className="font-semibold text-heading">Contas a Pagar</span>
            </div>
            <p className="text-xs text-secondary">Gerencie despesas e pagamentos pendentes.</p>
          </a>

          <a
            href="http://localhost:3003/duplicatas-receber"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface-card rounded-xl p-5 border border-default shadow-sm hover:shadow-md transition-all cursor-pointer group block"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 text-blue-700 rounded-lg group-hover:bg-blue-200 transition-colors">
                <DollarSign size={20} />
              </div>
              <span className="font-semibold text-heading">Contas a Receber</span>
            </div>
            <p className="text-xs text-secondary">Monitore recebíveis e faturas em aberto.</p>
          </a>

          <a
            href="http://localhost:3003/categorias"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-surface-card rounded-xl p-5 border border-default shadow-sm hover:shadow-md transition-all cursor-pointer group block"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-100 text-purple-700 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Layout size={20} />
              </div>
              <span className="font-semibold text-heading">Plano de Contas</span>
            </div>
            <p className="text-xs text-secondary">{accounts ?? 0} contas configuradas no sistema.</p>
          </a>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-heading">Últimas Faturas</h3>
        </div>

        <div className="bg-surface-card border border-default rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-surface-base text-secondary font-medium border-b border-default">
                <tr>
                  <th className="px-6 py-4">Tenant ID</th>
                  <th className="px-6 py-4">Valor</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Data Emissão</th>
                  <th className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default">
                {(invoices ?? []).map((inv: any, idx: number) => (
                  <tr key={idx} className="hover:bg-surface-base/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-heading">
                      <span className="font-mono text-xs bg-surface-base px-2 py-1 rounded text-secondary border border-default">
                        {inv.tenant_id?.substring(0, 8)}...
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-heading">
                      {(inv.amount_cents || 0) / 100} <span className="text-xs text-secondary uppercase">{inv.currency}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${inv.status === 'paid'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : inv.status === 'open'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                        {inv.status === 'paid' ? 'Pago' : inv.status === 'open' ? 'Aberto' : inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-secondary">
                      {new Date(inv.issued_at || inv.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:text-primary-dark font-medium text-xs">
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))}
                {!invoices?.length && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-secondary">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText size={32} className="text-tertiary mb-2" />
                        <p className="font-medium">Nenhuma fatura encontrada</p>
                        <p className="text-xs">As faturas geradas aparecerão aqui.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
