// app/admin/page.tsx (NOVO CONTEÚDO: Dashboard)
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { getCurrentUser, getDashboardMetrics, getLeads, getTarefas } from '@/lib/supabase/admin';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { redirect } from 'next/navigation';

// Força a renderização dinâmica para garantir que o cookie de sessão seja lido
export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();

  // O layout já protege a rota, mas é um bom ponto de checagem.
  if (!session) {
    redirect('/admin/login?redirect=/admin');
  }

  // Busca dos dados no Servidor em paralelo (otimizado)
  const [userProfile, metrics, leadsRecentes, tarefas] = await Promise.all([
    getCurrentUser(), 
    getDashboardMetrics(30), // Busca métricas dos últimos 30 dias
    getLeads({ limit: 5 }),  // Busca 5 leads recentes
    // Busca tarefas pendentes atribuídas ao usuário logado
    getTarefas({ status: 'pendente', responsavel: session.user.id }),
  ]);

  if (!userProfile) {
    // Trata o caso de sessão válida, mas perfil incompleto
    await supabase.auth.signOut();
    redirect('/admin/login?error=Perfil de usuário não encontrado.');
  }
  
  // Renderiza o dashboard (Client Component que você já tem)
  return (
    <AdminDashboard 
      user={userProfile} 
      metrics={metrics} 
      leadsRecentes={leadsRecentes} 
      tarefas={tarefas} 
    />
  );
}