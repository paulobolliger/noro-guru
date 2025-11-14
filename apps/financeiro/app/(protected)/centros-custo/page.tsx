import { createClient } from '@/lib/supabase/server';
import { CentrosCustoClient } from './centros-custo-client';
import { getCurrentTenantId } from '@/lib/tenant';

export const metadata = {
  title: 'Centro de Custos | NORO Financeiro',
  description: 'Controle de rentabilidade por viagem, grupo ou cliente',
};

export default async function CentrosCustoPage() {
  const supabase = createClient();
  const tenantId = await getCurrentTenantId();

  // Buscar centros de custo
  const { data: centrosCusto } = await supabase
    .from('fin_centros_custo')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  // Buscar rentabilidade agregada via view
  const { data: rentabilidades } = await supabase
    .from('vw_rentabilidade_centros_custo')
    .select('*')
    .eq('tenant_id', tenantId);

  // Mesclar dados
  const centrosComRentabilidade = (centrosCusto || []).map(cc => {
    const rent = rentabilidades?.find(r => r.id === cc.id);
    return {
      ...cc,
      rentabilidade: rent || {
        receitas_total: 0,
        despesas_total: 0,
        margem_liquida: 0,
        margem_percentual: 0,
        saldo_orcamento: cc.orcamento_previsto,
        percentual_orcamento_utilizado: 0,
        qtd_receitas: 0,
        qtd_despesas: 0,
      }
    };
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Centro de Custos e Projetos</h1>
        <p className="text-muted-foreground">
          Controle de rentabilidade por viagem, grupo ou cliente
        </p>
      </div>

      <CentrosCustoClient centrosCusto={centrosComRentabilidade} tenantId={tenantId} />
    </div>
  );
}
