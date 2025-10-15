// app/admin/(protected)/layout.tsx

import { redirect } from 'next/navigation';
import { ReactNode } from 'react';
import { Database } from '@/types/supabase';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';

// DEFINE O TIPO PARA EVITAR ERROS NO VS CODE
type NomadeUser = Database['public']['Tables']['nomade_users']['Row'];

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  // 1. VERIFICAÇÃO DE SESSÃO ROBUSTA: Se não tem sessão OU se a sessão não tem um user válido
  if (!session || !session.user) { 
    redirect('/admin/login?redirect=/admin');
  }

  // 2. BUSCA DO USUÁRIO E AUTORIZAÇÃO
  // Agora temos a certeza de que session.user existe
  const { data } = await supabase
    .from('nomade_users')
    .select('*')
    .eq('id', session.user.id)
    .single();

  const user = data as NomadeUser | null;

  if (!user || !['admin', 'super_admin'].includes(user.role)) {
    await supabase.auth.signOut(); 
    redirect('/?error=unauthorized');
  }

  // Se tudo OK, renderiza o layout visual do admin
  return (
    <AdminLayoutClient user={user}>
        {children}
    </AdminLayoutClient>
  );
}