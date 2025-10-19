// app/admin/(protected)/layout.tsx
import { redirect } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import type Database from '@/types/supabase';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import { getNotificacoes } from '@/lib/supabase/admin';
// NOVO: Importa a função de buscar config do sistema
import { getConfiguracaoSistema } from './configuracoes/config-actions'; 
// NOVO: Importa o Toaster
import { Toaster } from '@/components/ui/use-toast'; // Assumindo que use-toast.tsx também exporta Toaster

type NomadeUser = Database['public']['Tables']['noro_users']['Row'];

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/admin/login?redirect=/admin');
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

  // Busca as notificações E as configurações do sistema
  const [notificacoes, configSistema] = await Promise.all([
    getNotificacoes(user.id, 5),
    getConfiguracaoSistema()
  ]);

  return (
    // O Toaster deve ser renderizado no lado do cliente, assim como o AdminLayoutClient
    <Suspense fallback={<div>A carregar layout do admin...</div>}>
      <AdminLayoutClient 
        user={profile} 
        notificacoes={notificacoes}
        configSistema={configSistema} // Passa a config para o layout do cliente
      >
        {children}
        {/* CRÍTICO: O Toaster deve ser incluído para renderizar as notificações */}
        <Toaster /> 
      </AdminLayoutClient>
    </Suspense>
  );
}