import { createClient } from '@/lib/supabase/server';
import { BancosClient } from './bancos-client';
import { redirect } from 'next/navigation';

export default async function BancosPage() {
  const supabase = createClient();

  // TODO: Modo desenvolvimento - usar tenant NORO
  const { data: tenant } = await supabase
    .schema('cp')
    .from('tenants')
    .select('id')
    .eq('slug', 'noro')
    .single();

  if (!tenant) {
    redirect('/dashboard');
  }

  // Buscar contas bancárias
  const { data: contas, error } = await supabase
    .from('fin_contas_bancarias')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('nome');

  // Calcular saldos de cada conta (receitas - despesas)
  const contasComSaldo = await Promise.all(
    (contas || []).map(async (conta) => {
      // Buscar total de receitas pagas
      const { data: receitas } = await supabase
        .from('fin_receitas')
        .select('valor_brl')
        .eq('conta_bancaria_id', conta.id)
        .eq('status', 'pago');

      // Buscar total de despesas pagas
      const { data: despesas } = await supabase
        .from('fin_despesas')
        .select('valor_brl')
        .eq('conta_bancaria_id', conta.id)
        .eq('status', 'pago');

      const totalReceitas = receitas?.reduce((sum, r) => sum + (r.valor_brl || 0), 0) || 0;
      const totalDespesas = despesas?.reduce((sum, d) => sum + (d.valor_brl || 0), 0) || 0;

      return {
        ...conta,
        saldo_calculado: totalReceitas - totalDespesas,
      };
    })
  );

  console.log('🏦 Contas bancárias carregadas:', { 
    total: contasComSaldo?.length, 
    error,
    sample: contasComSaldo?.[0] 
  });

  return (
    <div className="container mx-auto p-6">
      <BancosClient
        contas={contasComSaldo || []}
        tenantId={tenant.id}
      />
    </div>
  );
}
