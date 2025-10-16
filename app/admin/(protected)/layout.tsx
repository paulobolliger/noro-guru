// app/admin/(protected)/layout.tsx
import { redirect } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import type Database from '@/types/supabase';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import { getNotificacoes, getSupabaseAdmin } from '@/lib/supabase/admin';

type NomadeUser = Database['public']['Tables']['nomade_users']['Row'];
type Notificacao = Database['public']['Tables']['nomade_notificacoes']['Row'];

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  console.log('--- A verificar sessão no ProtectedAdminLayout ---');
  const supabase = createServerSupabaseClient();
  
  // A Supabase recomenda usar getUser() para validar a sessão no servidor
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    console.log('Sessão não encontrada. A redirecionar para o login...');
    return redirect('/admin/login?redirect=/admin');
  }
  console.log(`Sessão encontrada para o utilizador: ${user.id}`);

  const { data: userProfile } = await supabase
    .from('nomade_users')
    .select('*')
    .eq('id', user.id)
    .single();

  const profile = userProfile as NomadeUser | null;

  if (!profile || !['admin', 'super_admin'].includes(profile.role)) {
    console.warn(`Tentativa de acesso não autorizada pelo utilizador: ${user.id} com role: ${profile?.role}`);
    await supabase.auth.signOut();
    return redirect('/?error=unauthorized');
  }
  
  console.log(`Permissão verificada. Role: ${profile.role}. A renderizar layout...`);

  // Buscar notificações no servidor
  const notificacoes = await getNotificacoes(user.id, 5);

  return (
    <Suspense fallback={<div>A carregar layout do admin...</div>}>
      <AdminLayoutClient user={profile} notificacoes={notificacoes}>
        {children}
      </AdminLayoutClient>
    </Suspense>
  );
}

