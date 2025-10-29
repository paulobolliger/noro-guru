import { createServerSupabaseClient } from "@lib/supabase/server";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeader from "@/components/layout/SectionHeader";

async function markAllRead(userId: string) {
  "use server";
  const supabase = createServerSupabaseClient();
  await supabase.from('noro_notificacoes').update({ lida: true }).eq('user_id', userId);
}

export default async function NotificacoesPage() {
  const supabase = createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from('noro_notificacoes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(100);

  return (
    <div className="container-app py-8 space-y-6">
      <PageContainer>
        <SectionHeader
          title="Notificações"
          subtitle="Suas últimas atividades no sistema"
          right={(
            <form action={async () => { 'use server'; await markAllRead(user.id); }}>
              <button className="text-sm text-muted hover:text-primary">Marcar todas como lidas</button>
            </form>
          )}
          sticky
        />
      </PageContainer>

      <PageContainer>
        <div className="rounded-xl surface-card border border-default overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="border-b border-default border-default border-default">
              <tr>
                <th className="text-left p-2 text-xs font-medium uppercase tracking-wide text-muted">Título</th>
                <th className="text-left p-2 text-xs font-medium uppercase tracking-wide text-muted">Mensagem</th>
                <th className="text-left p-2 text-xs font-medium uppercase tracking-wide text-muted">Quando</th>
                <th className="text-left p-2 text-xs font-medium uppercase tracking-wide text-muted">Lida</th>
              </tr>
            </thead>
            <tbody>
              {(data || []).map((n: any) => (
                <tr key={n.id} className="border-t border-default hover:bg-white/[0.02]">
                  <td className="p-2 text-primary">{n.titulo}</td>
                  <td className="p-2 text-muted">{n.mensagem || '—'}</td>
                  <td className="p-2 text-muted">{new Date(n.created_at).toLocaleString('pt-BR')}</td>
                  <td className="p-2 text-muted">{n.lida ? 'Sim' : 'Não'}</td>
                </tr>
              ))}
              {!data?.length && (
                <tr>
                  <td className="p-3 text-muted" colSpan={4}>Sem notificações</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PageContainer>
    </div>
  );
}

