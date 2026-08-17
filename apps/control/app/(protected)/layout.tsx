import { redirect } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import { createDatabaseClient } from '@noro/db';
import { requireUser, UnauthenticatedError, UserNotFoundError, keycloakSessionAdapter } from '@noro/auth';
import { getServerSession } from '@/lib/session';
import AdminLayoutClient from '@/components/AdminLayoutClient';
import { getConfiguracaoSistema } from './configuracoes/config-actions';
import { Toaster } from '@ui/use-toast';

const DEFAULT_CONFIG = {
  moeda_padrao: 'BRL' as const,
  fuso_horario: 'America/Sao_Paulo',
  idioma: 'pt' as const,
  formato_data: 'DD/MM/YYYY' as const,
};

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const { db, close } = createDatabaseClient();

  try {
    const userCtx = await requireUser({
      db,
      sessionAdapter: keycloakSessionAdapter(getServerSession),
    });

    const configSistema = await getConfiguracaoSistema().catch(() => DEFAULT_CONFIG);

    const profile = {
      id: userCtx.user.id,
      nome: userCtx.user.displayName ?? (userCtx.claims?.name as string) ?? userCtx.user.email,
      email: userCtx.user.email,
      role: 'super_admin',
      avatar_url: (userCtx.claims?.picture as string) ?? null,
    };

    return (
      <Suspense fallback={<div>Carregando...</div>}>
        <AdminLayoutClient
          user={profile as any}
          notificacoes={[]}
          configSistema={configSistema}
        >
          {children}
          <Toaster />
        </AdminLayoutClient>
      </Suspense>
    );
  } catch (error) {
    if (error instanceof UnauthenticatedError || error instanceof UserNotFoundError) {
      redirect('/auth/sign-in');
    }
    throw error;
  } finally {
    await close();
  }
}
