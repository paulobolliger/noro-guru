// app/admin/(protected)/clientes/page.tsx
import ClientesClientPage from '@/components/admin/ClientesClientPage';
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function ClientesPage() {
  const supabase = createServerSupabaseClient();
  const { data } = await supabase
    .from('noro_clientes')
    .select('id, nome, email, telefone, created_at')
    .order('created_at', { ascending: false });
  return <ClientesClientPage clientes={data || []} />;
}
