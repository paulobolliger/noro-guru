// apps/core/(protected)/configuracoes/page.tsx
import ConfiguracoesClient from '@/components/admin/ConfiguracoesClient';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getConfiguracaoSistema, getConfiguracaoUsuario } from './config-actions';
import { getEmpresaDados } from './empresa-actions'; // NOVO: Importa a nova action

export default async function ConfiguracoesPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/admin/login');
  }

  // Busca todos os dados em paralelo
  const [
    usersData,
    configSistema,
    configUsuario,
    empresaDados,
    socialConfigData
  ] = await Promise.all([
    supabase.from('noro_users').select('*'),
    getConfiguracaoSistema(),
    getConfiguracaoUsuario(user.id),
    getEmpresaDados(),
    supabase.from('social_network_configs').select('*').limit(1).single()
  ]);

  const { data: users } = usersData;
  const { data: socialConfig } = socialConfigData;

  // Determine Upload-Post status
  const uploadPostStatus = socialConfig?.active_provider === 'upload-post' &&
                           socialConfig?.status === 'connected'
    ? 'connected'
    : 'disconnected';

  return (
    <ConfiguracoesClient
      serverUsers={users || []}
      configSistema={configSistema}
      configUsuario={configUsuario}
      empresaDados={empresaDados}
      currentUserId={user.id}
      uploadPostStatus={uploadPostStatus as 'connected' | 'disconnected'}
    />
  );
}