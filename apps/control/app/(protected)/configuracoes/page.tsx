// app/admin/(protected)/configuracoes/page.tsx
import ConfiguracoesClient from "@/components/ConfiguracoesClient";
import { createServerSupabaseClient } from "@/../../packages/lib/supabase/server";
import { redirect } from 'next/navigation';
import { getConfiguracaoSistema, getConfiguracaoUsuario } from './config-actions';
import { getEnvVariables } from './env-actions';

export default async function ConfiguracoesPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/admin/login');
  }

  // Busca todos os dados em paralelo
  const [
    noroUsersData,
    configSistema,
    configUsuario,
    envVariables
  ] = await Promise.all([
    supabase.from('noro_users').select('*').order('created_at', { ascending: false }),
    getConfiguracaoSistema(),
    getConfiguracaoUsuario(user.id),
    getEnvVariables()
  ]);

  const { data: noroUsers } = noroUsersData;

  return (
    <ConfiguracoesClient 
      serverUsers={noroUsers || []} 
      configSistema={configSistema}
      configUsuario={configUsuario}
      currentUserId={user.id}
      envVariables={envVariables}
    />
  );
}