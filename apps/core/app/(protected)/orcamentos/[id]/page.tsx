import { notFound, redirect } from 'next/navigation';
import { getCurrentUser } from '@noro/lib/services/authService';
import { getCurrentTenantId } from '@/lib/tenant-helper';
import {
  createDatabaseClient,
  proposalsRepository,
  proposalDocumentsRepository,
  proposalItineraryRepository,
  proposalMessagesRepository,
  emergencyContactsRepository,
} from '@noro/db';
import OrcamentoDetalheClient from './OrcamentoDetalheClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: { id: string };
}

export default async function OrcamentoDetalhePage({ params }: PageProps) {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const tenantId = await getCurrentTenantId(user.id);
  const { id } = params;

  const { db, close } = createDatabaseClient();
  try {
    const [proposal, documents, itinerary, messages, emergencyContacts] = await Promise.all([
      proposalsRepository.getProposalById(db, tenantId, id),
      proposalDocumentsRepository.getAllDocumentsByProposal(db, tenantId, id),
      proposalItineraryRepository.getItineraryByProposal(db, tenantId, id),
      proposalMessagesRepository.getMessagesByProposal(db, tenantId, id),
      emergencyContactsRepository.getContactsByProposal(db, tenantId, id),
    ]);

    if (!proposal) notFound();

    // Remove `document` nested object de itinerary para serializar ao client component
    const itineraryPlain = itinerary.map(({ document: _doc, ...item }) => item);

    return (
      <OrcamentoDetalheClient
        proposal={proposal}
        documents={documents}
        itinerary={itineraryPlain}
        messages={messages}
        emergencyContacts={emergencyContacts}
      />
    );
  } finally {
    await close();
  }
}
