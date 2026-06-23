import { redirect } from 'next/navigation';
import { ReactNode, Suspense } from 'react';
import { createDatabaseClient } from '@noro/db';
import { requireUser, UnauthenticatedError, UserNotFoundError, logtoSessionAdapter } from '@noro/auth';
import { logtoConfig } from '@/lib/logto';
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';
import { Toaster } from '@/components/ui/use-toast';
import { getConfiguracaoSistema } from './configuracoes/config-actions';

export default async function ProtectedAdminLayout({ children }: { children: ReactNode }) {
  const { db, client, close } = createDatabaseClient();

  try {
    const userCtx = await requireUser({
      db,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });

    // Resolve tenantId
    const memberships = await client`
      SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userCtx.user.id} LIMIT 1
    `;
    const tenantId = memberships[0]?.tenant_id;

    // Fetch dynamic modules config from sites.empresa
    let modules: Record<string, boolean> = {};
    let companyName = "NORO";

    if (tenantId) {
      const [empresa] = await client`
        SELECT nome_empresa as "nomeEmpresa", modulos_contratados as "modulosContratados"
        FROM sites.empresa
        WHERE tenant_id = ${tenantId}
        LIMIT 1
      `;
      if (empresa) {
        if (empresa.nomeEmpresa) {
          companyName = empresa.nomeEmpresa;
        }
        if (empresa.modulosContratados) {
          modules = empresa.modulosContratados;
        }
      }
    }

    const configSistema = await getConfiguracaoSistema();

    const profile = {
      id: userCtx.user.id,
      nome: userCtx.user.displayName ?? (userCtx.claims?.name as string) ?? userCtx.user.email,
      email: userCtx.user.email,
      role: 'admin',
      avatar_url: (userCtx.claims?.picture as string) ?? null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return (
      <Suspense fallback={<div>Carregando...</div>}>
        <AdminLayoutClient
          user={profile as any}
          notificacoes={[]}
          configSistema={configSistema}
          companyName={companyName}
          modules={modules}
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
