import { createServerSupabaseClient } from "@noro/lib/supabase/server";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeader from "@/components/layout/SectionHeader";
import NotificacoesTableClient from '@/app/(protected)/notificacoes/NotificacoesTableClient';
import { MarkAllReadButton } from '@/app/(protected)/notificacoes/NotificacoesActions';
import { revalidatePath } from 'next/cache';
import { Bell } from 'lucide-react';

async function markAllRead(userId: string) {
  "use server";
  const supabase = createServerSupabaseClient();
  const { error } = await supabase.from('noro_notificacoes').update({ lida: true }).eq('user_id', userId);
  if (error) throw error;
  revalidatePath('/notificacoes');
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
          icon={<Bell size={28} />}
          right={<MarkAllReadButton markAllReadAction={async () => { 'use server'; await markAllRead(user.id); }} />}
          sticky
        />
      </PageContainer>

      <PageContainer>
        <NotificacoesTableClient data={data || []} />
      </PageContainer>
    </div>
  );
}

