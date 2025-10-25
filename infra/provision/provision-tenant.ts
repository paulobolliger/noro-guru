/*
  Provisionador de tenant via Supabase service role.
  Uso:
    SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
    TENANT_NAME="Agência Exemplo" TENANT_SLUG="agencia-exemplo" \
    npx tsx infra/provision/provision-tenant.ts
*/
import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const name = process.env.TENANT_NAME || '';
const slugInput = process.env.TENANT_SLUG || '';

if (!url || !serviceKey) {
  console.error('SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórios');
  process.exit(1);
}

if (!name || !slugInput) {
  console.error('TENANT_NAME e TENANT_SLUG são obrigatórios');
  process.exit(1);
}

const slug = slugInput.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '');
const schema = `tenant_${slug.replace(/-/g, '_')}`;

async function main() {
  const supabase = createClient(url, serviceKey);

  console.log(`Criando tenant: name=${name}, slug=${slug}, schema=${schema}`);
  const { data: inserted, error: insertError } = await supabase
    .from('tenants')
    .insert({ name, slug, schema_name: schema, status: 'creating' })
    .select('id')
    .single();

  if (insertError) {
    console.error('Erro ao inserir tenant:', insertError.message);
    process.exit(1);
  }

  const tenantId = inserted!.id as string;

  console.log('Provisionando schema…');
  const { error: rpcError } = await supabase.rpc('create_tenant_schema', { p_schema_name: schema });
  if (rpcError) {
    console.error('Erro ao provisionar schema:', rpcError.message);
    await supabase.from('tenants').update({ status: 'failed' }).eq('id', tenantId);
    process.exit(1);
  }

  console.log('Atualizando status → active');
  await supabase.from('tenants').update({ status: 'active' }).eq('id', tenantId);

  console.log('Tenant provisionado com sucesso.');
}

main().catch((e) => {
  console.error('Falha inesperada:', e);
  process.exit(1);
});

