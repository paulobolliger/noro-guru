import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { AlertsBanner } from './alerts-banner';
import type { FinKPIs } from '@/types/financeiro';

export const metadata = {
  title: 'Dashboard Financeiro | NORO',
  description: 'Visão geral das métricas financeiras do NORO',
};

async function calcularKPIs(tenantId: string): Promise<FinKPIs> {
  const supabase = createClient();
  const hoje = new Date();
  const inicioMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString();
  const fimMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).toISOString();
  const inicioAno = new Date(hoje.getFullYear(), 0, 1).toISOString();

  console.log('🔍 DEBUG calcularKPIs:', {
    tenantId,
    inicioMes,
    fimMes,
    inicioAno
  });

  // Receitas do mês
  const { data: receitasMes, error: errorReceitas } = await supabase
    .from('fin_receitas')
    .select('valor_brl, status, tipo_receita, recorrente')
    .eq('tenant_id', tenantId)
    .gte('data_competencia', inicioMes)
    .lte('data_competencia', fimMes);

  console.log('📊 Receitas Mês:', { count: receitasMes?.length, error: errorReceitas, sample: receitasMes?.[0] });

  // Despesas do mês
  const { data: despesasMes, error: errorDespesas } = await supabase
    .from('fin_despesas')
    .select('valor_brl, status')
    .eq('tenant_id', tenantId)
    .gte('data_competencia', inicioMes)
    .lte('data_competencia', fimMes);

  console.log('💸 Despesas Mês:', { count: despesasMes?.length, error: errorDespesas, sample: despesasMes?.[0] });

  // Receitas do ano
  const { data: receitasAno } = await supabase
    .from('fin_receitas')
    .select('valor_brl, status')
    .eq('tenant_id', tenantId)
    .gte('data_competencia', inicioAno);

  // Despesas do ano
  const { data: despesasAno } = await supabase
    .from('fin_despesas')
    .select('valor_brl, status')
    .eq('tenant_id', tenantId)
    .gte('data_competencia', inicioAno);

  // Contas bancárias
  const { data: contas } = await supabase
    .from('fin_contas_bancarias')
    .select('saldo_atual, moeda')
    .eq('tenant_id', tenantId)
    .eq('ativo', true);

  // Contas a receber
  const { data: contasReceber } = await supabase
    .from('fin_receitas')
    .select('valor_brl, data_vencimento')
    .eq('tenant_id', tenantId)
    .eq('status', 'pendente');

  // Contas a pagar
  const { data: contasPagar } = await supabase
    .from('fin_despesas')
    .select('valor_brl, data_vencimento')
    .eq('tenant_id', tenantId)
    .eq('status', 'pendente');

  // Calcular MRR (Monthly Recurring Revenue)
  const mrr = receitasMes
    ?.filter((r) => r.recorrente && r.status === 'pago')
    .reduce((acc, r) => acc + (r.valor_brl || 0), 0) || 0;

  // Calcular ARR (Annual Recurring Revenue)
  const arr = mrr * 12;

  // Receita total do mês
  const receita_total_mes = receitasMes
    ?.filter((r) => r.status === 'pago')
    .reduce((acc, r) => acc + (r.valor_brl || 0), 0) || 0;

  // Despesa total do mês
  const despesa_total_mes = despesasMes
    ?.filter((d) => d.status === 'pago')
    .reduce((acc, d) => acc + (d.valor_brl || 0), 0) || 0;

  // Receita total do ano
  const receita_total_ano = receitasAno
    ?.filter((r) => r.status === 'pago')
    .reduce((acc, r) => acc + (r.valor_brl || 0), 0) || 0;

  // Despesa total do ano
  const despesa_total_ano = despesasAno
    ?.filter((d) => d.status === 'pago')
    .reduce((acc, d) => acc + (d.valor_brl || 0), 0) || 0;

  // Lucro líquido
  const lucro_liquido_mes = receita_total_mes - despesa_total_mes;
  const lucro_liquido_ano = receita_total_ano - despesa_total_ano;

  // Margem de lucro (%)
  const margem_lucro = receita_total_mes > 0 ? (lucro_liquido_mes / receita_total_mes) * 100 : 0;

  // Saldo atual (soma de todas as contas)
  const saldo_atual = contas?.reduce((acc, c) => acc + (c.saldo_atual || 0), 0) || 0;

  // Contas a receber
  const totalContasReceber = contasReceber?.reduce((acc, c) => acc + (c.valor_brl || 0), 0) || 0;
  const contasAtrasadasReceber = contasReceber?.filter((c) => new Date(c.data_vencimento) < hoje).length || 0;

  // Contas a pagar
  const totalContasPagar = contasPagar?.reduce((acc, c) => acc + (c.valor_brl || 0), 0) || 0;
  const contasAtrasadasPagar = contasPagar?.filter((c) => new Date(c.data_vencimento) < hoje).length || 0;

  // Ticket médio
  const totalClientes = receitasMes?.filter((r) => r.status === 'pago').length || 1;
  const ticket_medio = receita_total_mes / totalClientes;

  // Projeções (simplificado - baseado na média mensal)
  const projecao_30_dias = saldo_atual + totalContasReceber - totalContasPagar;
  const projecao_60_dias = projecao_30_dias + (receita_total_mes - despesa_total_mes);
  const projecao_90_dias = projecao_60_dias + (receita_total_mes - despesa_total_mes);

  return {
    mrr,
    arr,
    receita_total_mes,
    receita_total_ano,
    ticket_medio,
    despesa_total_mes,
    despesa_total_ano,
    custo_aquisicao_cliente: 0, // TODO: implementar lógica real
    margem_lucro,
    lucro_liquido_mes,
    lucro_liquido_ano,
    ebitda: 0, // TODO: implementar lógica real
    saldo_atual,
    projecao_30_dias,
    projecao_60_dias,
    projecao_90_dias,
    ltv: 0, // TODO: implementar lógica real
    churn_rate: 0, // TODO: implementar lógica real
    contas_receber: totalContasReceber,
    contas_pagar: totalContasPagar,
    contas_atrasadas_receber: contasAtrasadasReceber,
    contas_atrasadas_pagar: contasAtrasadasPagar,
  };
}

async function obterDadosGraficos(tenantId: string) {
  const supabase = createClient();
  const hoje = new Date();
  const ultimos6Meses = new Date(hoje.getFullYear(), hoje.getMonth() - 5, 1);

  // Receitas e despesas dos últimos 6 meses
  const { data: receitas } = await supabase
    .from('fin_receitas')
    .select('valor_brl, data_competencia, marca')
    .eq('tenant_id', tenantId)
    .eq('status', 'pago')
    .gte('data_competencia', ultimos6Meses.toISOString())
    .order('data_competencia', { ascending: true });

  const { data: despesas } = await supabase
    .from('fin_despesas')
    .select('valor_brl, data_competencia, marca')
    .eq('tenant_id', tenantId)
    .eq('status', 'pago')
    .gte('data_competencia', ultimos6Meses.toISOString())
    .order('data_competencia', { ascending: true });

  // Agrupar por mês
  const mesesMap = new Map<string, { receitas: number; despesas: number }>();

  receitas?.forEach((r) => {
    const mes = new Date(r.data_competencia).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    if (!mesesMap.has(mes)) {
      mesesMap.set(mes, { receitas: 0, despesas: 0 });
    }
    mesesMap.get(mes)!.receitas += r.valor_brl || 0;
  });

  despesas?.forEach((d) => {
    const mes = new Date(d.data_competencia).toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' });
    if (!mesesMap.has(mes)) {
      mesesMap.set(mes, { receitas: 0, despesas: 0 });
    }
    mesesMap.get(mes)!.despesas += d.valor_brl || 0;
  });

  const labels = Array.from(mesesMap.keys());
  const receitasData = Array.from(mesesMap.values()).map((v) => v.receitas);
  const despesasData = Array.from(mesesMap.values()).map((v) => v.despesas);

  // Receitas por marca
  const receitasPorMarca = new Map<string, number>();
  receitas?.forEach((r) => {
    const marca = r.marca || 'outros';
    receitasPorMarca.set(marca, (receitasPorMarca.get(marca) || 0) + (r.valor_brl || 0));
  });

  return {
    receitasVsDespesas: {
      labels,
      receitas: receitasData,
      despesas: despesasData,
    },
    receitasPorMarca: Array.from(receitasPorMarca.entries()).map(([marca, valor]) => ({
      marca,
      valor,
    })),
  };
}

export default async function DashboardPage() {
  const supabase = createClient();

  // TODO: MODO DESENVOLVIMENTO - Usar tenant NORO hardcoded
  // Descomentar quando integrar autenticação
  
  // const { data: { user } } = await supabase.auth.getUser();
  // if (!user) {
  //   redirect('/login');
  // }
  // const { data: cpUser } = await supabase
  //   .from('control_plane_users')
  //   .select('tenant_id')
  //   .eq('auth_id', user.id)
  //   .single();
  // if (!cpUser?.tenant_id) {
  //   redirect('/login');
  // }

  // DESENVOLVIMENTO: Usar tenant NORO diretamente
  // Tentar buscar no schema cp primeiro, depois sem schema
  let tenant = null;
  let tenantError = null;
  
  // Tentar com schema cp
  const { data: cpTenant, error: cpError } = await supabase
    .from('cp.tenants')
    .select('id')
    .eq('slug', 'noro')
    .single();
    
  if (cpTenant) {
    tenant = cpTenant;
  } else {
    // Tentar sem schema (pode ser que o Supabase client precise do nome sem schema)
    const { data: publicTenant, error: publicError } = await supabase
      .schema('cp')
      .from('tenants')
      .select('id')
      .eq('slug', 'noro')
      .single();
      
    tenant = publicTenant;
    tenantError = publicError;
  }

  if (!tenant || tenantError) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800">⚠️ Tenant NORO não encontrado</h2>
          <p className="text-red-600 mt-2">Execute o seguinte SQL no Supabase Studio:</p>
          <pre className="mt-4 bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`-- Criar tenant NORO
INSERT INTO cp.tenants (id, name, slug, plan, status, billing_email)
VALUES (
  'f0f0f0f0-f0f0-f0f0-f0f0-f0f0f0f0f0f0',
  'Noro Guru',
  'noro',
  'enterprise',
  'active',
  'contato@noro.guru'
);`}
          </pre>
          {tenantError && (
            <p className="text-xs text-red-500 mt-2">Erro técnico: {JSON.stringify(tenantError)}</p>
          )}
        </div>
      </div>
    );
  }

  // Calcular KPIs
  const kpis = await calcularKPIs(tenant.id);

  // Obter dados para gráficos
  const graficos = await obterDadosGraficos(tenant.id);

  // Buscar receitas e despesas para alertas
  const { data: receitas } = await supabase
    .from('fin_receitas')
    .select('*')
    .eq('tenant_id', tenant.id)
    .eq('status', 'pendente');

  const { data: despesas } = await supabase
    .from('fin_despesas')
    .select('*')
    .eq('tenant_id', tenant.id)
    .eq('status', 'pendente');

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Financeiro</h1>
        <p className="text-muted-foreground">Visão geral das suas métricas financeiras</p>
      </div>

      {/* Alertas financeiros */}
      <AlertsBanner 
        receitas={receitas || []} 
        despesas={despesas || []} 
        saldoTotal={kpis.saldo_atual} 
      />

      <DashboardClient kpis={kpis} graficos={graficos} />
    </div>
  );
}
