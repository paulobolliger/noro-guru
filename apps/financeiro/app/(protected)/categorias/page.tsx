import { createClient } from '@/lib/supabase/server';
import { CategoriasClient } from './categorias-client';
import { redirect } from 'next/navigation';

export default async function CategoriasPage() {
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

  // Buscar categorias
  const { data: categorias, error } = await supabase
    .from('fin_categorias')
    .select('*')
    .eq('tenant_id', tenant.id)
    .order('tipo')
    .order('nome');

  console.log('📂 Categorias carregadas:', { 
    total: categorias?.length, 
    error,
    sample: categorias?.[0] 
  });

  return (
    <div className="container mx-auto p-6">
      <CategoriasClient
        categorias={categorias || []}
        tenantId={tenant.id}
      />
    </div>
  );
}
