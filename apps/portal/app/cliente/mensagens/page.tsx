import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { getSessionFromCookie } from '@/lib/magic-link';
import { resolveTenantFromRequest } from '@/lib/tenant-context';
import { createDatabaseClient, proposalMessagesRepository } from '@noro/db';
import MensagensClient from './MensagensClient';

const SESSION_COOKIE = 'portal_session_id';

export default async function MensagensPage() {
  const tenant = await resolveTenantFromRequest();
  if (!tenant) notFound();

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) redirect('/login');

  const session = await getSessionFromCookie(sessionId);
  if (!session?.clientId) redirect('/login');

  const { db, close } = createDatabaseClient();
  let messages: Awaited<ReturnType<typeof proposalMessagesRepository.getMessagesByClient>> = [];

  try {
    messages = await proposalMessagesRepository.getMessagesByClient(
      db,
      tenant.tenantId,
      session.clientId,
    );
    // Marca mensagens do agente como lidas ao abrir a página
    const proposalIds = Array.from(new Set(messages.map((m) => m.proposalId).filter((id): id is string => !!id)));
    for (const pid of proposalIds) {
      await proposalMessagesRepository.markMessagesReadByClient(db, tenant.tenantId, pid);
    }
  } finally {
    await close();
  }

  return (
    <MensagensClient
      messages={messages}
      tenantId={tenant.tenantId}
      clientId={session.clientId}
    />
  );
}
