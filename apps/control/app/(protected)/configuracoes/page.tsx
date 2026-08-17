// app/admin/(protected)/configuracoes/page.tsx
import ConfiguracoesClient from "@/components/ConfiguracoesClient";
import { redirect } from 'next/navigation';
import { getServerSession, getSessionClaims } from '@/lib/session';
import { createDatabaseClient } from '@noro/db';
import { getConfiguracaoSistema, getConfiguracaoUsuario } from './config-actions';
import { getEnvVariables } from './env-actions';

export default async function ConfiguracoesPage() {
  const ctx = await getServerSession().then(s => ({ isAuthenticated: Boolean(s?.claims?.sub), claims: s?.claims }));
  const userId = ctx.claims?.sub;

  if (!userId) {
    return redirect('/auth/sign-in');
  }

  const { client, close } = createDatabaseClient();

  try {
    // Busca todos os dados em paralelo
    const [
      noroUsers,
      configSistema,
      configUsuario,
      envVariables
    ] = await Promise.all([
      client`SELECT * FROM noro_auth.users_legado ORDER BY created_at DESC`,
      getConfiguracaoSistema(),
      getConfiguracaoUsuario(userId),
      getEnvVariables()
    ]);

    return (
      <ConfiguracoesClient 
        serverUsers={noroUsers as any || []} 
        configSistema={configSistema}
        configUsuario={configUsuario}
        currentUserId={userId}
        envVariables={envVariables}
      />
    );
  } finally {
    await close();
  }
}