// app/admin/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCurrentUser, getDashboardMetrics, getLeads, getTarefas, supabaseAdmin } from '@/lib/supabase/admin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  // 1. Redirecionamento de Segurança (O Layout já faz isso)
  if (!session) {
    redirect('/admin/login?redirect=/admin');
  }

  let userProfile = await getCurrentUser();
  const authUser = session.user;

  // 2. CORREÇÃO: Criação de Perfil na primeira vez
  if (!userProfile) {
    console.log(`⚠️ Perfil na tabela nomade_users não encontrado para o usuário ${authUser.email}. Criando perfil...`);

    // Tenta obter um nome do metadata (útil para login com Google)
    const nomePadrao = authUser.user_metadata.full_name || authUser.email?.split('@')[0] || 'Novo Admin';

    // Insere o registro básico na tabela nomade_users
    const { error: insertError } = await supabaseAdmin
      .from('nomade_users')
      .insert({
        id: authUser.id,
        email: authUser.email,
        nome: nomePadrao,
        role: 'admin', // Define o papel padrão para quem acessa o admin
      });

    if (insertError) {
      console.error('❌ Erro ao criar perfil (insert):', insertError);
      // Caso a criação falhe, desloga para evitar o loop
      await supabase.auth.signOut();
      redirect(`/admin/login?error=${encodeURIComponent('Erro ao criar perfil. Tente novamente.')}`);
    }

    // Perfil criado. Redireciona para recarregar a página e carregar o perfil corretamente
    console.log('✅ Perfil criado com sucesso. Recarregando dashboard.');
    redirect('/admin'); 
    return null; // Evita a renderização do código abaixo
  }

  // 3. Busca dos dados da dashboard (se o perfil foi encontrado ou recém-criado)
  const [metrics, leadsRecentes, tarefas] = await Promise.all([
    getDashboardMetrics(30),
    getLeads({ limit: 5 }),
    getTarefas({ status: 'pendente', responsavel: authUser.id }),
  ]);
  
  // 4. Renderiza o dashboard
  return (
    <AdminDashboard 
      user={userProfile} 
      metrics={metrics} 
      leadsRecentes={leadsRecentes} 
      tarefas={tarefas} 
    />
  );
}