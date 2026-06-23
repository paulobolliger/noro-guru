import ConfiguracoesClient from '@/components/admin/ConfiguracoesClient';
import { redirect } from 'next/navigation';
import { getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';
import { createDatabaseClient } from '@noro/db';
import { getConfiguracaoSistema, getConfiguracaoUsuario } from './config-actions';
import { getEmpresaDados } from './empresa-actions';
import { getBillingStatusAction } from './billing-actions';

export const dynamic = 'force-dynamic';

export default async function ConfiguracoesPage() {
  const ctx = await getLogtoContext(logtoConfig);
  const userId = ctx.claims?.sub;

  if (!userId) {
    return redirect('/auth/sign-in');
  }

  const { client, close } = createDatabaseClient();

  try {
    const memberships = await client`
      SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userId} LIMIT 1
    `;
    if (!memberships || memberships.length === 0) {
      return (
        <div className="p-6">
          <h1 className="text-xl font-semibold">Sem acesso</h1>
          <p className="mt-2 text-sm text-gray-600">Usuário não está associado a nenhuma agência.</p>
        </div>
      );
    }
    const tenantId = memberships[0].tenant_id;

    const [
      tenantUsers,
      configSistema,
      configUsuario,
      empresaDados,
      billingAccount
    ] = await Promise.all([
      client`
        SELECT u.id, u.nome, u.email, m.role
        FROM noro.tenant_memberships m
        JOIN noro_auth.users_legado u ON m.user_id = u.id
        WHERE m.tenant_id = ${tenantId}
        ORDER BY u.created_at DESC
      `,
      getConfiguracaoSistema(),
      getConfiguracaoUsuario(userId),
      getEmpresaDados(),
      getBillingStatusAction()
    ]);

    const mappedUsers = (tenantUsers || []).map(u => ({
      id: u.id,
      nome: u.nome || null,
      email: u.email,
      role: u.role || 'membro',
      avatar_url: null
    }));

    return (
      <ConfiguracoesClient 
        serverUsers={mappedUsers} 
        configSistema={configSistema}
        configUsuario={configUsuario}
        empresaDados={empresaDados}
        currentUserId={userId}
        uploadPostStatus="disconnected"
        billingAccount={billingAccount}
      />
    );
  } catch (error) {
    console.error('Erro na página de configurações:', error);
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold text-red-600">Erro</h1>
        <p className="mt-2 text-sm text-gray-600">Ocorreu um erro ao carregar as configurações.</p>
      </div>
    );
  } finally {
    await close();
  }
}