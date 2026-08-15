import { createDatabaseClient } from "@noro/db";
import FinanceiroTablesClient from './FinanceiroTablesClient';
import SectionHeader from '@/components/layout/SectionHeader';
import { DollarSign } from 'lucide-react';

export default async function FinanceiroPage() {
  const { client, close } = createDatabaseClient();
  let accounts: any[] = [];
  let entries: any[] = [];

  try {
    const [accountsRows, entriesRows] = await Promise.all([
      client`SELECT * FROM platform.ledger_accounts ORDER BY code`,
      client`
        SELECT account_id, tenant_id, amount_cents, memo, occurred_at 
        FROM platform.ledger_entries 
        ORDER BY occurred_at DESC 
        LIMIT 50
      `
    ]);
    accounts = accountsRows || [];
    entries = entriesRows || [];
  } catch (error) {
    console.error("Error loading financeiro data:", error);
  } finally {
    await close();
  }
  
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

      <div className="flex justify-end max-w-[1200px] mx-auto px-4 md:px-6">
        <a
          href="/financeiro/precificacao"
          className="bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-cyan-500/30 px-5 py-2.5 rounded-xl text-sm font-bold flex items-center space-x-2 transition-all hover:scale-105 shadow-lg"
        >
          <DollarSign className="h-4 w-4" />
          <span>⚙️ Composição de Preços & Câmbio PTAX</span>
        </a>
      </div>
      
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
