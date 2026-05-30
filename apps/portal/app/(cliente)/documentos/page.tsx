import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { getSessionFromCookie } from '@/lib/magic-link';
import { resolveTenantFromRequest } from '@/lib/tenant-context';
import { createDatabaseClient, proposalDocumentsRepository } from '@noro/db';
import { createSignedDownloadUrl } from '@/lib/storage';

const SESSION_COOKIE = 'portal_session_id';

const TIPO_ICON: Record<string, string> = {
  voucher:   '🏨',
  bilhete:   '✈️',
  visto:     '🛂',
  seguro:    '🛡️',
  contrato:  '📝',
  recibo:    '🧾',
  outro:     '📄',
};

const TIPO_LABEL: Record<string, string> = {
  voucher:   'Voucher',
  bilhete:   'Bilhete',
  visto:     'Visto',
  seguro:    'Seguro',
  contrato:  'Contrato',
  recibo:    'Recibo',
  outro:     'Documento',
};

function formatBytes(bytes: number | null | undefined) {
  if (!bytes) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function DocumentosPage() {
  const tenant = await resolveTenantFromRequest();
  if (!tenant) notFound();

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) redirect('/login');

  const session = await getSessionFromCookie(sessionId);
  if (!session?.clientId) redirect('/login');

  const { db, close } = createDatabaseClient();
  let docs: Awaited<ReturnType<typeof proposalDocumentsRepository.getDocumentsByClient>> = [];
  try {
    docs = await proposalDocumentsRepository.getDocumentsByClient(db, tenant.tenantId, session.clientId);
  } finally {
    await close();
  }

  // Gera signed URLs para cada documento
  type DocWithUrl = (typeof docs)[number] & { signedUrl: string | null };
  const docsWithUrls: DocWithUrl[] = await Promise.all(
    docs.map(async (d) => {
      try {
        const signedUrl = await createSignedDownloadUrl(d.fileUrl);
        return { ...d, signedUrl };
      } catch {
        return { ...d, signedUrl: null };
      }
    }),
  );

  // Agrupa por proposta
  type GroupKey = string;
  const groups = new Map<GroupKey, { label: string; docs: DocWithUrl[] }>();

  for (const doc of docsWithUrls) {
    const key = doc.proposalId ?? '__avulso__';
    if (!groups.has(key)) {
      const label = doc.proposal
        ? `${doc.proposal.titulo}${doc.proposal.destinoPrincipal ? ` · ${doc.proposal.destinoPrincipal}` : ''}`
        : 'Documentos avulsos';
      groups.set(key, { label, docs: [] });
    }
    groups.get(key)!.docs.push(doc);
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>Meus documentos</h1>
      <p style={{ color: '#64748b', marginBottom: 32, fontSize: 14 }}>
        Vouchers, bilhetes e arquivos disponibilizados pela agência
      </p>

      {docsWithUrls.length === 0 ? (
        <div style={{
          padding: 40,
          textAlign: 'center',
          border: '1px dashed #e2e8f0',
          borderRadius: 16,
          color: '#94a3b8',
        }}>
          <p style={{ fontSize: '2rem', marginBottom: 12 }}>📂</p>
          <p style={{ fontWeight: 600, color: '#64748b' }}>Nenhum documento ainda</p>
          <p style={{ fontSize: 14, marginTop: 8 }}>
            Seus vouchers e documentos de viagem aparecerão aqui quando a agência os disponibilizar.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {Array.from(groups.entries()).map(([key, group]) => (
            <div key={key}>
              <p style={{
                fontSize: 12,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: '#94a3b8',
                marginBottom: 12,
              }}>
                {group.label}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {group.docs.map((doc) => (
                  <div
                    key={doc.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 16,
                      padding: '14px 20px',
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      background: '#fff',
                    }}
                  >
                    <span style={{ fontSize: 24, flexShrink: 0 }}>
                      {TIPO_ICON[doc.tipo] ?? '📄'}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {doc.name}
                      </p>
                      <p style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                        {TIPO_LABEL[doc.tipo] ?? 'Documento'}
                        {doc.sizeBytes ? ` · ${formatBytes(doc.sizeBytes)}` : ''}
                        {' · '}
                        {new Date(doc.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    {doc.signedUrl ? (
                      <a
                        href={doc.signedUrl}
                        download={doc.name}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          flexShrink: 0,
                          padding: '8px 18px',
                          background: '#1e293b',
                          color: '#fff',
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          textDecoration: 'none',
                        }}
                      >
                        Baixar
                      </a>
                    ) : (
                      <span style={{ flexShrink: 0, fontSize: 12, color: '#94a3b8' }}>
                        Indisponível
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
