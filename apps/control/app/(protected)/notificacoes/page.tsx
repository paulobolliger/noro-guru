import { createDatabaseClient } from "@noro/db";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeader from "@/components/layout/SectionHeader";
import NotificacoesTableClient from '@/app/(protected)/notificacoes/NotificacoesTableClient';
import { MarkAllReadButton } from '@/app/(protected)/notificacoes/NotificacoesActions';
import { revalidatePath } from 'next/cache';
import { Bell } from 'lucide-react';
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/logto";

async function markAllRead(userId: string) {
  "use server";
  const { client, close } = createDatabaseClient();
  try {
    await client`
      UPDATE comunicacao.notificacoes 
      SET lida = TRUE 
      WHERE user_id = ${userId}
    `;
    revalidatePath('/notificacoes');
  } finally {
    await close();
  }
}

export default async function NotificacoesPage() {
  const ctx = await getLogtoContext(logtoConfig);
  const userId = ctx.claims?.sub;
  if (!userId) return null;

  const { client, close } = createDatabaseClient();
  try {
    const data = await client`
      SELECT * 
      FROM comunicacao.notificacoes
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
      LIMIT 100
    `;

    const serializedData = data ? data.map(row => ({
      ...row,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
    })) : [];

    return (
      <div className="container-app py-8 space-y-6">
        <PageContainer>
          <SectionHeader
            title="Notificações"
            subtitle="Suas últimas atividades no sistema"
            icon={<Bell size={28} />}
            right={<MarkAllReadButton markAllReadAction={async () => { 'use server'; await markAllRead(userId); }} />}
            sticky
          />
        </PageContainer>

        <PageContainer>
          <NotificacoesTableClient data={serializedData as any} />
        </PageContainer>
      </div>
    );
  } finally {
    await close();
  }
}

