// app/admin/(protected)/configuracoes/page.tsx
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
  // Busca configurações e dados em paralelo
  const [
    configSistema,
    configUsuario,
    empresaDados,
    socialConfigData
  ] = await Promise.all([
    getConfiguracaoSistema(),
    getConfiguracaoUsuario(user.id),
    getEmpresaDados(),
    supabase.from('social_network_configs').select('*').limit(1).single()
  ]);

  // Busca Tenant ID do usuário logado
  const { data: currentUserTenant } = await supabase
    .from('user_tenants')
    .select('tenant_id')
    .eq('user_id', user.id)
    .single();

  const tenantId = currentUserTenant?.tenant_id;

  // Busca usuários deste tenant explicitamente
  let users: any[] = [];
  if (tenantId) {
    const { data: tenantUsers } = await supabase
      .from('user_tenants')
      .select(`
        role,
        user:users (
          id,
          nome,
          email,
          avatar_url
        )
      `)
      .eq('tenant_id', tenantId);

    if (tenantUsers) {
      users = tenantUsers.map((item: any) => ({
        id: item.user.id,
        nome: item.user.nome,
        email: item.user.email,
        role: item.role,
        avatar_url: item.user.avatar_url
      }));
    }
  }

  const { data: socialConfig } = socialConfigData;

  // Determine Upload-Post status
  const uploadPostStatus = socialConfig?.active_provider === 'upload-post' &&
    socialConfig?.status === 'connected'
    ? 'connected'
    : 'disconnected';

  return (
    <ConfiguracoesClient
      serverUsers={users}
      configSistema={configSistema}
      configUsuario={configUsuario}
      empresaDados={empresaDados}
      currentUserId={user.id}
      uploadPostStatus={uploadPostStatus as 'connected' | 'disconnected'}
    />
  );
}