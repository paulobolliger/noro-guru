import { headers } from 'next/headers';
import { createServiceRoleSupabaseClient } from '@/lib/supabase/server';

export type TenantRecord = {
  id: string;
  name: string;
  slug: string;
  schema_name: string;
  status: string;
  created_at: string;
};

export async function getTenantFromHeaders() {
  const h = headers();
  const slug = h.get('x-tenant-slug') || '';
  if (!slug) return null;
  const supabase = createServiceRoleSupabaseClient();
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug)
    .single<TenantRecord>();
  if (error) return null;
  return data;
}

export function getTenantSchemaClient(schemaName: string) {
  const supabase = createServiceRoleSupabaseClient();
  // Para operações dentro do schema do tenant
  return supabase.schema(schemaName);
}

