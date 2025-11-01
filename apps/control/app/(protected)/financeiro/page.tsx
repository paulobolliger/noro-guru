import { createServerSupabaseClient } from "@noro/lib/supabase/server";
import FinanceiroTablesClient from './FinanceiroTablesClient';
import SectionHeader from '@/components/layout/SectionHeader';
import { DollarSign } from 'lucide-react';

export default async function FinanceiroPage() {
  const supabase = createServerSupabaseClient();
  const { data: accounts } = await supabase.schema('cp').from('ledger_accounts').select('*').order('code');
  const { data: entries } = await supabase.schema('cp').from('ledger_entries').select('account_id, tenant_id, amount_cents, memo, occurred_at').order('occurred_at', { ascending: false }).limit(50);
  
  // Calculate metrics
  const totalEntries = entries?.length || 0;
  const totalCredits = entries?.filter(e => (e.amount_cents || 0) > 0).reduce((sum, e) => sum + (e.amount_cents || 0), 0) || 0;
  const totalDebits = entries?.filter(e => (e.amount_cents || 0) < 0).reduce((sum, e) => sum + Math.abs(e.amount_cents || 0), 0) || 0;
  const balance = totalCredits - totalDebits;

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
  };

  const metrics = [
    { label: "Saldo", value: formatCurrency(balance), color: balance >= 0 ? "text-green-400" : "text-red-400", borderColor: balance >= 0 ? "border-green-400" : "border-red-400" },
    { label: "Créditos", value: formatCurrency(totalCredits), color: "text-emerald-400", borderColor: "border-emerald-400" },
    { label: "Débitos", value: formatCurrency(totalDebits), color: "text-orange-400", borderColor: "border-orange-400" },
    { label: "Lançamentos", value: totalEntries, color: "text-[#4aede5]", borderColor: "border-[#4aede5]" },
  ];

  return (
    <div className="container-app py-8 space-y-6">
      <SectionHeader 
        title="Financeiro" 
        subtitle="Lançamentos contábeis gerados a partir do Billing e ajustes operacionais."
        icon={<DollarSign size={28} />}
      />
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-[1200px] mx-auto px-4 md:px-6">
        {metrics.map((m) => (
          <div
            key={m.label}
            className={`bg-gray-50 dark:bg-[#1a1625] border-2 ${m.borderColor} rounded-xl p-4 shadow-md hover:shadow-lg transition-all hover:scale-105`}
          >
            <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
              {m.label}
            </div>
            <div className={`text-2xl md:text-3xl font-bold ${m.color}`}>{m.value}</div>
          </div>
        ))}
      </div>

      <FinanceiroTablesClient accounts={accounts || []} entries={entries || []} />
    </div>
  );
}
