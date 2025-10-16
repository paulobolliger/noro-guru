// app/admin/(protected)/configuracoes/page.tsx
import ConfiguracoesClient from '@/components/admin/ConfiguracoesClient';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getConfiguracaoSistema, getConfiguracaoUsuario } from './config-actions';

export default async function ConfiguracoesPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/admin/login');
  }

  // Buscar lista de usuários
  const { data: users } = await supabase.from('nomade_users').select('*');

  // Buscar configurações do sistema e do usuário
  const configSistema = await getConfiguracaoSistema();
  const configUsuario = await getConfiguracaoUsuario(user.id);

  return (
    <ConfiguracoesClient 
      serverUsers={users || []} 
      configSistema={configSistema}
      configUsuario={configUsuario}
      currentUserId={user.id}
    />
  );
}