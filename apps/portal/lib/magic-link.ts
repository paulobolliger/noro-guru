'use server';

import { createDatabaseClient, clientPortalSessionsRepository, clientsRepository } from '@noro/db';
import { sendTransactionalEmail } from '@noro/lib';

const SESSION_COOKIE = 'portal_session_id';

export async function requestMagicLink(
  tenantId: string,
  email: string,
  baseUrl: string,
  agencyDisplayName: string,
) {
  const { db, close } = createDatabaseClient();
  try {
    // Busca o cliente pelo email dentro do tenant
    const allClients = await clientsRepository.getClientsByTenant(db, tenantId, { limit: 1 });
    const { and, eq } = await import('drizzle-orm');
    const { clients } = await import('@noro/db');

    // Busca cliente pelo email no tenant
    const client = await db.query.clients.findFirst({
      where: and(eq(clients.tenantId, tenantId), eq(clients.email, email)),
    });

    // Cria o token mesmo se o cliente não existe — o email informará que não encontramos
    const session = await clientPortalSessionsRepository.createMagicLinkToken(db, {
      tenantId,
      clientId: client?.id ?? null,
      clientEmail: email,
    });

    if (!session) return { success: false, message: 'Erro ao gerar link.' };

    const magicUrl = `${baseUrl}/auth/verify?token=${session.token}`;

    // Envia email apenas se o cliente existe — evita enumeração de e-mails
    if (client) {
      await sendTransactionalEmail({
        project_slug: 'noro_guru',
        template: 'noro_id_magic_link',
        to: email,
        variables: {
          client_name: client.nomePreferido ?? client.nome,
          magic_url: magicUrl,
          agency_display_name: agencyDisplayName || 'Portal do Viajante',
        },
      });
    }

    // Responde sempre com sucesso para não revelar se o email existe
    return { success: true };
  } finally {
    await close();
  }
}

export async function verifyMagicLinkAndCreateSession(token: string) {
  const { db, close } = createDatabaseClient();
  try {
    const session = await clientPortalSessionsRepository.verifyMagicLinkToken(db, token);
    if (!session || !session.clientId) return null;

    return session;
  } finally {
    await close();
  }
}

export async function getSessionFromCookie(cookieValue: string) {
  if (!cookieValue) return null;
  const { db, close } = createDatabaseClient();
  try {
    return await clientPortalSessionsRepository.getActiveSession(db, cookieValue);
  } finally {
    await close();
  }
}

export async function revokeSessionCookie(sessionId: string) {
  const { db, close } = createDatabaseClient();
  try {
    await clientPortalSessionsRepository.revokeSession(db, sessionId);
  } finally {
    await close();
  }
}
