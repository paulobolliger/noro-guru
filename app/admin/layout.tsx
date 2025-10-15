// app/admin/layout.tsx
import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { ReactNode } from 'react';

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  // Se não tem sessão, redireciona para login
  if (!session) {
    redirect('/admin/login');
  }

  // Verifica se é admin
  const { data: user } = await supabase
    .from('nomade_users')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    redirect('/?error=unauthorized');
  }

  return <>{children}</>;
}