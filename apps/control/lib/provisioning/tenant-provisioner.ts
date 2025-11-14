// lib/provisioning/tenant-provisioner.ts
import { createClient } from '@supabase/supabase-js';

/**
 * Tenant Provisioner
 *
 * Responsável por criar e configurar novo tenant no sistema
 */

interface ProvisioningResult {
  success: boolean;
  tenant_id?: string;
  schema_name?: string;
  error?: string;
  steps_completed?: string[];
}

interface TenantConfig {
  tenant_id: string;
  slug: string;
  copy_from_core?: boolean;
}

/**
 * Cria schema dedicado para o tenant
 */
export async function createTenantSchema(config: TenantConfig): Promise<ProvisioningResult> {
  const steps: string[] = [];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const schemaName = `tenant_${config.slug}`;

    // 1. Criar schema
    console.log(`[Provisioning] Creating schema: ${schemaName}`);
    const { error: schemaError } = await supabase.rpc('create_tenant_schema', {
      p_schema_name: schemaName,
      p_tenant_id: config.tenant_id
    });

    if (schemaError) {
      // Se a função RPC não existe, criar schema diretamente
      // NOTA: Isso requer permissões de superuser
      console.warn('[Provisioning] RPC not found, attempting direct schema creation');

      // Fallback: usar SQL direto (apenas em dev/setup inicial)
      const { error: directError } = await supabase.rpc('exec_sql', {
        sql: `CREATE SCHEMA IF NOT EXISTS "${schemaName}";`
      });

      if (directError) {
        throw new Error(`Failed to create schema: ${directError.message}`);
      }
    }

    steps.push('schema_created');
    console.log(`[Provisioning] Schema created: ${schemaName}`);

    // 2. Copiar estrutura do core (tabelas base)
    if (config.copy_from_core) {
      console.log(`[Provisioning] Copying core structure to ${schemaName}`);

      const coreTables = [
        'noro_clientes',
        'noro_clientes_documentos',
        'noro_leads',
        'noro_orcamentos',
        'noro_orcamentos_itens',
        'noro_pedidos',
        'noro_pedidos_itens',
        'noro_pagamentos',
        'noro_comissoes',
        'noro_fornecedores',
        'noro_interacoes',
        'noro_tarefas',
        'noro_notificacoes',
        'noro_usuarios',
        'ai_costs',
        'roteiros',
        'artigos',
      ];

      // Copiar estrutura das tabelas (sem dados)
      for (const table of coreTables) {
        try {
          const { error } = await supabase.rpc('copy_table_structure', {
            p_source_schema: 'public',
            p_source_table: table,
            p_target_schema: schemaName,
            p_target_table: table
          });

          if (error) {
            console.warn(`[Provisioning] Warning copying ${table}: ${error.message}`);
          } else {
            console.log(`[Provisioning] Copied table: ${table}`);
          }
        } catch (err) {
          console.warn(`[Provisioning] Error copying ${table}:`, err);
        }
      }

      steps.push('tables_copied');
    }

    // 3. Criar dados iniciais
    console.log(`[Provisioning] Creating initial data for ${schemaName}`);

    // Configurações iniciais (exemplo)
    const { error: settingsError } = await supabase
      .schema(schemaName)
      .from('noro_configuracoes')
      .insert({
        tenant_id: config.tenant_id,
        tipo: 'sistema',
        chave: 'moeda_padrao',
        valor: 'EUR',
      });

    if (settingsError && !settingsError.message.includes('does not exist')) {
      console.warn('[Provisioning] Warning creating initial settings:', settingsError.message);
    }

    steps.push('initial_data_created');

    // 4. Configurar permissões RLS
    console.log(`[Provisioning] Configuring RLS for ${schemaName}`);

    // Habilitar RLS em todas as tabelas
    const rlsQuery = `
      DO $$
      DECLARE
        r RECORD;
      BEGIN
        FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = '${schemaName}'
        LOOP
          EXECUTE format('ALTER TABLE "${schemaName}".%I ENABLE ROW LEVEL SECURITY', r.tablename);
        END LOOP;
      END$$;
    `;

    const { error: rlsError } = await supabase.rpc('exec_sql', { sql: rlsQuery });
    if (rlsError && !rlsError.message.includes('does not exist')) {
      console.warn('[Provisioning] Warning enabling RLS:', rlsError.message);
    }

    steps.push('rls_configured');

    console.log(`[Provisioning] Tenant ${schemaName} provisioned successfully`);

    return {
      success: true,
      tenant_id: config.tenant_id,
      schema_name: schemaName,
      steps_completed: steps,
    };

  } catch (error: any) {
    console.error('[Provisioning] Error:', error);
    return {
      success: false,
      error: error.message || 'Unknown error during provisioning',
      steps_completed: steps,
    };
  }
}

/**
 * Valida se o schema do tenant foi criado corretamente
 */
export async function validateTenantSchema(schemaName: string): Promise<boolean> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Verifica se o schema existe
    const { data, error } = await supabase.rpc('schema_exists', {
      p_schema_name: schemaName
    });

    if (error || !data) {
      // Fallback: query SQL direta
      const { data: schemas, error: schemaError } = await supabase
        .rpc('exec_sql', {
          sql: `SELECT schema_name FROM information_schema.schemata WHERE schema_name = '${schemaName}';`
        });

      return !schemaError && schemas && schemas.length > 0;
    }

    return data === true;
  } catch (error) {
    console.error('[Provisioning] Error validating schema:', error);
    return false;
  }
}

/**
 * Remove schema do tenant (DANGER)
 */
export async function deleteTenantSchema(schemaName: string): Promise<ProvisioningResult> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    console.log(`[Provisioning] DELETING schema: ${schemaName}`);

    const { error } = await supabase.rpc('exec_sql', {
      sql: `DROP SCHEMA IF EXISTS "${schemaName}" CASCADE;`
    });

    if (error) {
      throw new Error(`Failed to delete schema: ${error.message}`);
    }

    console.log(`[Provisioning] Schema ${schemaName} deleted`);

    return {
      success: true,
      schema_name: schemaName,
    };

  } catch (error: any) {
    console.error('[Provisioning] Error deleting schema:', error);
    return {
      success: false,
      error: error.message || 'Unknown error during deletion',
    };
  }
}

/**
 * Lista todos os schemas de tenants
 */
export async function listTenantSchemas(): Promise<string[]> {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const { data, error } = await supabase.rpc('exec_sql', {
      sql: `
        SELECT schema_name
        FROM information_schema.schemata
        WHERE schema_name LIKE 'tenant_%'
        ORDER BY schema_name;
      `
    });

    if (error) {
      console.error('[Provisioning] Error listing schemas:', error);
      return [];
    }

    return data?.map((row: any) => row.schema_name) || [];
  } catch (error) {
    console.error('[Provisioning] Error listing schemas:', error);
    return [];
  }
}
