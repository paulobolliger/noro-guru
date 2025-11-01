import { createClient } from '@/lib/supabase/server';
import { CentrosCustoClient } from './centros-custo-client';

export const metadata = {
  title: 'Centro de Custos | NORO Financeiro',
  description: 'Controle de rentabilidade por viagem, grupo ou cliente',
};

const TENANT_ID = 'd43ef2d2-cbf1-4133-b805-77c3f6444bc2'; // NORO

export default async function CentrosCustoPage() {
  const supabase = createClient();

  // Buscar centros de custo
  const { data: centrosCusto } = await supabase
    .from('fin_centros_custo')
    .select('*')
    .eq('tenant_id', TENANT_ID)
    .order('created_at', { ascending: false });

  // Buscar rentabilidade agregada via view
  const { data: rentabilidades } = await supabase
    .from('vw_rentabilidade_centros_custo')
    .select('*')
    .eq('tenant_id', TENANT_ID);

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

      <CentrosCustoClient centrosCusto={centrosComRentabilidade} tenantId={TENANT_ID} />
    </div>
  );
}
