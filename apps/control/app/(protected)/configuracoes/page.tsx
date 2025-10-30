// app/admin/(protected)/configuracoes/page.tsx
import ConfiguracoesClient from "@/components/ConfiguracoesClient";
import { createServerSupabaseClient } from "@/../../packages/lib/supabase/server";
import { redirect } from 'next/navigation';
import { getConfiguracaoSistema, getConfiguracaoUsuario } from './config-actions';
import { getEmpresaDados } from './empresa-actions'; // NOVO: Importa a nova action

export default async function ConfiguracoesPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/admin/login');
  }

  // Busca usuários do noro_users
  const { data: noroUsers } = await supabase
    .from('noro_users')
    .select('*');

  // Para cada usuário em noro_users, garantir que existe em control_plane_users
  if (noroUsers?.length) {
    for (const noroUser of noroUsers) {
      const { data: existingUser } = await supabase
        .from('control_plane_users')
        .select('*')
        .eq('email', noroUser.email)
        .single();

      if (!existingUser) {
        // Se não existe, criar entrada em control_plane_users
        await supabase
          .from('control_plane_users')
          .insert({
            auth_id: noroUser.id, // ID do auth.users
            email: noroUser.email,
            nome: noroUser.nome,
            role: noroUser.role === 'admin' ? 'super_admin' : 'readonly', // Mapeamento inicial de roles
            status: 'ativo',
            avatar_url: noroUser.avatar_url
          });
      }
    }
  }

  // Busca todos os dados em paralelo
  const [
    usersData,
    configSistema,
    configUsuario,
    empresaDados,
    userActivities
  ] = await Promise.all([
    supabase.from('control_plane_users').select('*').order('created_at', { ascending: false }),
    getConfiguracaoSistema(),
    getConfiguracaoUsuario(user.id),
    getEmpresaDados(),
    supabase.from('control_plane_user_activities').select('*').order('created_at', { ascending: false })
  ]);

  const { data: users } = usersData;

  return (
    <ConfiguracoesClient 
      serverUsers={users || []} 
      configSistema={configSistema}
      configUsuario={configUsuario}
      empresaDados={empresaDados}
      currentUserId={user.id}
      userActivities={userActivities?.data || []}
    />
  );
}