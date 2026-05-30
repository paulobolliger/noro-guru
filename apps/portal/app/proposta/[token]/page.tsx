import { notFound } from 'next/navigation';
import { createDatabaseClient, proposalsRepository } from '@noro/db';
import { resolveTenantFromRequest } from '@/lib/tenant-context';
import PropostaPublicaView from './PropostaPublicaView';

interface Props {
  params: Promise<{ token: string }>;
}

export default async function PropostaPublicaPage({ params }: Props) {
  const { token } = await params;
  const tenant = await resolveTenantFromRequest();
  if (!tenant) notFound();

  const { db, close } = createDatabaseClient();
  let proposal: Awaited<ReturnType<typeof proposalsRepository.getProposalByToken>> = null;
  try {
    proposal = await proposalsRepository.getProposalByToken(db, token);
  } finally {
    await close();
  }

  if (!proposal || proposal.tenantId !== tenant.tenantId) notFound();

  // Acionar 'visualizada' automaticamente (fire-and-forget)
  if (proposal.status === 'enviada') {
    const { createDatabaseClient: getDb } = await import('@noro/db');
    const client = getDb();
    proposalsRepository.markProposalVisualizadaByToken(client.db, token)
      .finally(() => client.close());
  }

  return <PropostaPublicaView proposal={proposal} tenantName={tenant.name} />;
}
