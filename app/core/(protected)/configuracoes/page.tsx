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
    return redirect('/core/login');
  }

  // Busca todos os dados em paralelo
  const [
    usersData,
    configSistema,
    configUsuario,
    empresaDados // NOVO: Busca os dados da empresa
  ] = await Promise.all([
    supabase.from('noro_users').select('*'),
    getConfiguracaoSistema(),
    getConfiguracaoUsuario(user.id),
    getEmpresaDados()
  ]);

  const { data: users } = usersData;

  return (
    <ConfiguracoesClient 
      serverUsers={users || []} 
      configSistema={configSistema}
      configUsuario={configUsuario}
      empresaDados={empresaDados} // NOVO: Passa os dados para o componente
      currentUserId={user.id}
    />
  );
}
