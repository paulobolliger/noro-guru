// app/admin/page.tsx
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { getDashboardMetrics, getLeads, getTarefas, supabaseAdmin } from '@/lib/supabase/admin';
import AdminDashboard from '@/components/admin/AdminDashboard';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/admin/login?redirect=/admin');
  }

  const authUser = session.user;

  // Buscar perfil do usuário
  const { data: userProfile } = await supabase
    .from('nomade_users')
    .select('*')
    .eq('id', authUser.id)
    .single();

  // Criar perfil se não existir
  if (!userProfile) {
    console.log(`⚠️ Perfil não encontrado. Criando...`);

    const nomePadrao = authUser.user_metadata.full_name || authUser.email?.split('@')[0] || 'Novo Admin';

    const { error: insertError } = await supabaseAdmin
      .from('nomade_users')
      .insert({
        id: authUser.id,
        email: authUser.email!,
        nome: nomePadrao,
        role: 'admin',
      });

    if (insertError) {
      console.error('❌ Erro ao criar perfil:', insertError);
      await supabase.auth.signOut();
      redirect(`/admin/login?error=${encodeURIComponent('Erro ao criar perfil')}`);
    }

    console.log('✅ Perfil criado');
    redirect('/admin');
    return null;
  }

  const [metrics, leadsRecentes, tarefas] = await Promise.all([
    getDashboardMetrics(30),
    getLeads({ limit: 5 }),
    getTarefas({ status: 'pendente', responsavel: authUser.id }),
  ]);
  
  return (
    <AdminDashboard 
      user={userProfile} 
      metrics={metrics} 
      leadsRecentes={leadsRecentes} 
      tarefas={tarefas} 
    />
  );
}