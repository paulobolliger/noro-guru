// app/admin/(protected)/configuracoes/page.tsx
import MainLayout from '@/components/layout/MainLayout';
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

  // Busca dados do usuário
  const userProfile = await supabase
    .from('noro_users')
    .select('nome, email, role, avatar_url')
    .eq('id', user.id)
    .single()
    .then(res => res.data);

  const fullUser = {
    id: user.id,
    nome: userProfile?.nome || null,
    email: userProfile?.email || user.email || '',
    role: userProfile?.role || 'user',
    avatar_url: userProfile?.avatar_url || null,
  };

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
    <MainLayout user={fullUser}>
      <ConfiguracoesClient
        serverUsers={users || []}
        configSistema={configSistema}
        configUsuario={configUsuario}
        empresaDados={empresaDados}
        currentUserId={user.id}
        uploadPostStatus={uploadPostStatus as 'connected' | 'disconnected'}
      />
    </MainLayout>
  );
}