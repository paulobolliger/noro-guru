import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

if (process.env.NORO_ALLOW_LEGACY_DB_SCRIPT !== 'I_UNDERSTAND_THIS_TOUCHES_DATA') {
  throw new Error(
    'Legacy database script is frozen. Set NORO_ALLOW_LEGACY_DB_SCRIPT=I_UNDERSTAND_THIS_TOUCHES_DATA only after an audited rollback plan.',
  );
}

// Carregar .env.local
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não encontradas!');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'OK' : 'MISSING');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'OK' : 'MISSING');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'cp'
  }
});

async function main() {
  const userId = 'd368aedd-d0c7-49fc-9bd9-09a36cd9af2d';
  
  console.log('📋 Verificando tenants existentes...');
  const { data: tenants, error: tenantsError } = await supabase
    .schema('cp')
    .from('tenants')
    .select('id, name, slug')
    .limit(10);
  
  if (tenantsError) {
    console.error('❌ Erro ao buscar tenants:', tenantsError);
    return;
  }
  
  console.log(`✅ Found ${tenants?.length || 0} tenants:`);
  tenants?.forEach(t => console.log(`  - ${t.name} (${t.slug}) [${t.id}]`));
  
  let tenantId: string;
  
  if (!tenants || tenants.length === 0) {
    console.log('\n🏢 Criando tenant de teste...');
    const { data: newTenant, error: createError } = await supabase
      .schema('cp')
      .from('tenants')
      .insert({
        name: 'Empresa Teste',
        slug: 'empresa-teste'
      })
      .select()
      .single();
    
    if (createError) {
      console.error('❌ Erro ao criar tenant:', createError);
      return;
    }
    
    tenantId = newTenant.id;
    console.log(`✅ Tenant criado: ${newTenant.name} [${tenantId}]`);
  } else {
    tenantId = tenants[0].id;
    console.log(`\n🎯 Usando tenant existente: ${tenants[0].name} [${tenantId}]`);
  }
  
  console.log(`\n👤 Associando usuário ${userId} ao tenant ${tenantId}...`);
  const { data: association, error: assocError } = await supabase
    .schema('cp')
    .from('user_tenant_roles')
    .insert({
      user_id: userId,
      tenant_id: tenantId,
      role: 'admin'
    })
    .select()
    .single();
  
  if (assocError) {
    if (assocError.code === '23505') { // Unique violation
      console.log('ℹ️  Associação já existe!');
    } else {
      console.error('❌ Erro ao criar associação:', assocError);
      return;
    }
  } else {
    console.log('✅ Associação criada com sucesso!');
  }
  
  console.log('\n🔍 Verificando associações do usuário...');
  const { data: userTenants, error: checkError } = await supabase
    .schema('cp')
    .from('user_tenant_roles')
    .select(`
      user_id,
      tenant_id,
      role,
      tenants!user_tenant_roles_tenant_fkey (
        id,
        name,
        slug
      )
    `)
    .eq('user_id', userId);
  
  if (checkError) {
    console.error('❌ Erro ao verificar:', checkError);
    return;
  }
  
  console.log(`\n✅ Usuário tem ${userTenants?.length || 0} tenant(s) associado(s):`);
  userTenants?.forEach((ut: any) => {
    console.log(`  - ${ut.tenants.name} (${ut.tenants.slug}) - Role: ${ut.role}`);
  });
  
  console.log('\n🎉 Pronto! Recarregue a página /support para testar.');
}

main()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('💥 Erro:', err);
    process.exit(1);
  });
