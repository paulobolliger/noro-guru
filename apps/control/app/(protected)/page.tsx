    // app/admin/(protected)/page.tsx
    import { getDashboardMetrics, getLeads, getTarefas, getSupabaseAdmin } from "@lib/supabase/admin";
    import AdminDashboard from "@/components/AdminDashboard";
    import { createServerSupabaseClient } from "@lib/supabase/server";
    import { redirect } from 'next/navigation';

    export const dynamic = 'force-dynamic';

    export default async function AdminDashboardPage() {
      const supabase = createServerSupabaseClient();
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session || !session.user) {
        return redirect('/admin/login?redirect=/admin'); 
      }
      
      const authUser = session.user; 
      const supabaseAdmin = getSupabaseAdmin();

      const { data: userProfile } = await supabase
        .from('noro_users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (!userProfile) {
        // ... (código para criar perfil, mantenha como está)
        const nomePadrao = authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || 'Novo Admin';
        const { error: insertError } = await supabaseAdmin
          .from('noro_users')
          .insert({ id: authUser.id, email: authUser.email!, nome: nomePadrao, role: 'admin' });
        if (insertError) {
          console.error('❌ Erro ao criar perfil:', insertError);
          await supabase.auth.signOut();
          return redirect(`/admin/login?error=${encodeURIComponent('Erro ao criar perfil')}`);
        }
        return redirect('/admin'); 
      }

      // --- ÁREA DE TESTE ---
      // Vamos testar uma consulta de cada vez.
      // Descomente uma linha, reinicie o servidor e veja se o erro acontece.
      
      let metrics = {};
      let leadsRecentes = [];
      let tarefas = [];

      try {
        // Teste 1: A função RPC
        metrics = await getDashboardMetrics(30);
        console.log('✅ getDashboardMetrics funcionou.');

        // Teste 2: A tabela de Leads
        // leadsRecentes = await getLeads({ limit: 5 });
        // console.log('✅ getLeads funcionou.');

        // Teste 3: A tabela de Tarefas
        // tarefas = await getTarefas({ status: 'pendente', responsavel: authUser.id });
        // console.log('✅ getTarefas funcionou.');

      } catch (error: any) {
        console.error('🔴 FALHA NA CONSULTA AO BANCO DE DADOS 🔴');
        console.error(error.message);
        // Exibe uma mensagem de erro na página em vez de quebrar
        return (
          <div>
            <h1>Erro ao buscar dados do Dashboard</h1>
            <pre style={{ color: 'red', backgroundColor: '#333', padding: '1rem' }}>
              {error.message}
            </pre>
          </div>
        );
      }
      
      return (
        <AdminDashboard 
          user={userProfile} 
          metrics={metrics} 
          leadsRecentes={leadsRecentes} 
          tarefas={tarefas} 
        />
      );
    }
    

