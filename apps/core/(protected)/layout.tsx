// apps/core/(protected)/layout.tsx
import { redirect } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import type Database from '@/types/supabase';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import { getNotificacoes } from '@/lib/supabase/admin';
import { Toaster } from '@/components/ui/use-toast';

type NomadeUser = Database['public']['Tables']['noro_users']['Row'];

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
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

  // Busca as notificações
  const notificacoes = await getNotificacoes(user.id, 5);

  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <AdminLayoutClient 
        user={profile} 
        notificacoes={notificacoes}
      >
        {children}
        <Toaster /> 
      </AdminLayoutClient>
    </Suspense>
  );
}