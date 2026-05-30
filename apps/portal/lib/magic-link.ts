'use server';

import { createDatabaseClient, clientPortalSessionsRepository, clientsRepository } from '@noro/db';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
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
    // Lookup direto por email no tenant — getClientsByTenant não tem filtro por email ainda,
    // mas clientsRepository pode ser extendido. Por ora, usamos query direta.
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
      await resend.emails.send({
        from: process.env.CONTACT_FROM ?? 'NORO <no-reply@noro.guru>',
        to: email,
        subject: `Seu acesso ao portal — ${agencyDisplayName}`,
        html: `
          <p>Olá, ${client.nomePreferido ?? client.nome}!</p>
          <p>Clique no link abaixo para acessar seu portal de viagens:</p>
          <p><a href="${magicUrl}" style="font-size:18px;font-weight:bold;">Acessar meu portal</a></p>
          <p>O link expira em 15 minutos e pode ser usado apenas uma vez.</p>
          <p>${agencyDisplayName}</p>
        `,
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
