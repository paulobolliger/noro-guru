// apps/core/(protected)/layout.tsx
import { redirect } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import type Database from '@/types/supabase';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import { getNotificacoes } from '@/lib/supabase/admin';
import { Toaster } from '@/components/ui/use-toast';
import { getConfiguracaoSistema } from './configuracoes/config-actions';
import { getEmpresaDados } from './configuracoes/empresa-actions'; // Importe a função

type NomadeUser = Database['public']['Tables']['noro_users']['Row'];

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // ... (existing code for supabase and userAuth) ...
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login?redirect=/dashboard');
  }

  const { data: userProfile } = await supabase
    .from('noro_users')
    .select('*')
    .eq('id', user.id)
    .single();

  const profile = userProfile as NomadeUser | null;

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    await supabase.auth.signOut();
    return redirect('/?error=unauthorized');
  }

  // Busca as configurações do sistema
  const configSistema = await getConfiguracaoSistema();

  // Busca as notificações
  const notificacoes = await getNotificacoes(user.id, 5);

  // Busca os dados da empresa para obter o nome
  const empresaDados = await getEmpresaDados();

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AdminLayoutClient
        user={profile}
        notificacoes={notificacoes}
        configSistema={configSistema}
        companyName={empresaDados?.nome_empresa}
        modules={empresaDados?.modulos_contratados}
      >
        {children}
        <Toaster />
      </AdminLayoutClient>
    </Suspense>
  );
}