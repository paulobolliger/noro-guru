import { createClient } from '@/lib/supabase/server';
import { getCurrentTenantId } from '@/lib/tenant-helper';
import { Coins, Mail, CreditCard, ShoppingCart, Plus, AlertTriangle } from 'lucide-react';
import { purchaseCredits } from './actions';
import { redirect } from 'next/navigation';

export default async function CustosPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const tenantId = await getCurrentTenantId(user.id);

  // 1. Fetch AI Balance
  const { data: wallet } = await supabase
    .from('noro_ai_wallets')
    .select('balance_cents')
    .eq('tenant_id', tenantId)
    .maybeSingle();

  const balance = (wallet?.balance_cents || 0) / 100;

  // 2. Fetch Email Limits
  const { data: empresa } = await supabase
    .from('noro_empresa')
    .select('limites')
    .eq('tenant_id', tenantId)
    .single();

  const emailQuota = empresa?.limites?.email_monthly_quota || 0;
  const emailUsed = empresa?.limites?.email_used || 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <span><strong>Pagamento em Desenvolvimento</strong> — A compra de créditos ainda não está integrada a um gateway de pagamento. Os créditos são adicionados diretamente sem cobrança real.</span>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Meus Créditos e Assinatura</h1>
        <p className="text-slate-500">Gerencie seu saldo de IA e cotas de envio de email.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Credits Section */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-purple-50 to-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                <Coins size={24} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Saldo de IA</h2>
                <p className="text-xs text-slate-500">Para geração de roteiros e conteúdo</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">
                R$ {balance.toFixed(2).replace('.', ',')}
              </div>
              <p className="text-xs text-slate-400"> ~ R$ 0,50 / roteiro</p>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Adicionar Créditos</h3>
            <div className="grid grid-cols-3 gap-4">
              {[10, 50, 100].map((amount) => (
                <form key={amount} action={purchaseCredits.bind(null, 'ai', amount, amount)}>
                  <button type="submit" className="w-full flex flex-col items-center justify-center p-4 rounded-xl border border-purple-100 bg-purple-50/50 hover:bg-purple-100 hover:border-purple-200 transition-all group">
                    <span className="text-lg font-bold text-purple-700 group-hover:scale-105 transition-transform">
                      R$ {amount}
                    </span>
                    <span className="text-xs text-purple-400 mt-1 flex items-center gap-1">
                      <Plus size={12} /> Comprar
                    </span>
                  </button>
                </form>
              ))}
            </div>
          </div>
        </div>

        {/* Email Marketing Section */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-white">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Mail size={24} />
              </div>
              <div>
                <h2 className="font-bold text-slate-800">Email Marketing</h2>
                <p className="text-xs text-slate-500">Cota mensal de envios</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {emailQuota}
              </div>
              <p className="text-xs text-slate-400">envios mensais</p>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Usage Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Utilizado este mês</span>
                <span className="font-medium text-slate-800">{emailUsed} / {emailQuota}</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{ width: `${Math.min((emailUsed / (emailQuota || 1)) * 100, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Purchase Options */}
            <div>
              <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider">Aumentar Limite</h3>
              <form action={purchaseCredits.bind(null, 'email', 1000, 5)}>
                <button type="submit" className="w-full flex items-center justify-between p-4 rounded-xl border border-blue-100 bg-blue-50/50 hover:bg-blue-100 hover:border-blue-200 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm text-blue-500">
                      <Plus size={20} />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-blue-700 text-lg">+ 1000 envios</div>
                      <div className="text-xs text-blue-400">Adicionar ao limite mensal</div>
                    </div>
                  </div>
                  <div className="text-xl font-bold text-slate-700 group-hover:text-blue-700">
                    R$ 5,00
                  </div>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
