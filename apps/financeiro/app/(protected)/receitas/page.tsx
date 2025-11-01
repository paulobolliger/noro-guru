import { createClient } from '@/lib/supabase/server';
import { ReceitasClient } from './receitas-client';
import { redirect } from 'next/navigation';

export default async function ReceitasPage() {
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

  // Buscar receitas
  const { data: receitas, error } = await supabase
    .from('fin_receitas')
    .select(`
      *,
      categoria:fin_categorias(id, nome, cor, icone),
      conta_bancaria:fin_contas_bancarias(id, nome, banco)
    `)
    .eq('tenant_id', tenant.id)
    .order('data_vencimento', { ascending: false });

  // Buscar categorias para o filtro
  const { data: categorias } = await supabase
    .from('fin_categorias')
    .select('id, nome, tipo, cor, icone')
    .eq('tenant_id', tenant.id)
    .eq('tipo', 'receita')
    .order('nome');

  // Buscar contas bancárias
  const { data: contas } = await supabase
    .from('fin_contas_bancarias')
    .select('id, nome, banco, tipo')
    .eq('tenant_id', tenant.id)
    .eq('ativo', true)
    .order('nome');

  console.log('📊 Receitas carregadas:', { 
    total: receitas?.length, 
    error,
    sample: receitas?.[0] 
  });

  return (
    <div className="container mx-auto p-6">
      <ReceitasClient
        receitas={receitas || []}
        categorias={categorias || []}
        contas={contas || []}
        tenantId={tenant.id}
      />
    </div>
  );
}
