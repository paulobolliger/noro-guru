// app/admin/(protected)/configuracoes/page.tsx
import ConfiguracoesClient from '@/components/admin/ConfiguracoesClient';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function ConfiguracoesPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/admin/login');
  }

  // No futuro, podemos buscar dados do servidor aqui, como a lista de usuários,
  // e passá-los para o componente de cliente.
  const { data: users } = await supabase.from('nomade_users').select('*');

  return <ConfiguracoesClient serverUsers={users || []} />;
}

