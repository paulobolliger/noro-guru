import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { getSessionFromCookie } from '@/lib/magic-link';
import { resolveTenantFromRequest } from '@/lib/tenant-context';
import { createDatabaseClient, emergencyContactsRepository } from '@noro/db';

const SESSION_COOKIE = 'portal_session_id';

const TIPO_ICON: Record<string, string> = {
  agencia: '🏢',
  seguradora: '🛡️',
  consulado: '🏛️',
  hospital: '🏥',
  outro: '📞',
};

const TIPO_LABEL: Record<string, string> = {
  agencia: 'Agência',
  seguradora: 'Seguradora',
  consulado: 'Consulado',
  hospital: 'Hospital',
  outro: 'Outro',
};

export default async function EmergenciaPage() {
  const tenant = await resolveTenantFromRequest();
  if (!tenant) notFound();

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) redirect('/login');

  const session = await getSessionFromCookie(sessionId);
  if (!session?.clientId) redirect('/login');

  const { db, close } = createDatabaseClient();
  let contacts: Awaited<ReturnType<typeof emergencyContactsRepository.getContactsForClient>> = [];

  try {
    contacts = await emergencyContactsRepository.getContactsForClient(
      db,
      tenant.tenantId,
      session.clientId,
    );
  } finally {
    await close();
  }

  const activeContacts = contacts.filter((c) => c.ativo);

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 4 }}>
        Central de emergência
      </h1>
      <p style={{ color: '#64748b', marginBottom: 32, fontSize: 14 }}>
        Contatos importantes para durante e após a viagem
      </p>

      {activeContacts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
          <p style={{ fontSize: '2.5rem', marginBottom: 12 }}>🆘</p>
          <p style={{ fontWeight: 600, color: '#64748b' }}>Nenhum contato cadastrado</p>
          <p style={{ fontSize: 13, marginTop: 4 }}>
            Sua agência ainda não adicionou contatos de emergência.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {activeContacts.map((contact) => (
            <div
              key={contact.id}
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 16,
                padding: 20,
                background: '#fff',
              }}
            >
              {/* Cabeçalho */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}>
                  {TIPO_ICON[contact.tipo] ?? '📞'}
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#94a3b8' }}>
                    {TIPO_LABEL[contact.tipo] ?? contact.tipo}
                    {contact.proposal && (
                      <span style={{ marginLeft: 6, color: '#c7d2fe' }}>
                        · {contact.proposal.titulo}
                      </span>
                    )}
                  </p>
                  <p style={{ fontWeight: 700, fontSize: 15, color: '#1e293b', marginTop: 1 }}>
                    {contact.nome}
                  </p>
                </div>
              </div>

              {/* Contatos */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {contact.whatsapp && (
                  <a
                    href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: '#dcfce7',
                      color: '#15803d',
                      fontWeight: 600,
                      fontSize: 14,
                      textDecoration: 'none',
                    }}
                  >
                    <span>💬</span>
                    <span>{contact.whatsapp}</span>
                  </a>
                )}
                {contact.telefone && (
                  <a
                    href={`tel:${contact.telefone.replace(/\D/g, '')}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: '#f1f5f9',
                      color: '#334155',
                      fontWeight: 600,
                      fontSize: 14,
                      textDecoration: 'none',
                    }}
                  >
                    <span>☎️</span>
                    <span>{contact.telefone}</span>
                  </a>
                )}
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px 14px',
                      borderRadius: 10,
                      background: '#f1f5f9',
                      color: '#334155',
                      fontSize: 14,
                      textDecoration: 'none',
                    }}
                  >
                    <span>✉️</span>
                    <span>{contact.email}</span>
                  </a>
                )}
                {contact.observacoes && (
                  <p style={{ fontSize: 13, color: '#64748b', marginTop: 4, lineHeight: 1.5 }}>
                    {contact.observacoes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
