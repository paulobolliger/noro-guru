import { redirect } from 'next/navigation';
import { getCurrentUser } from '@noro/lib/services/authService';
import { getCurrentTenantId } from '@/lib/tenant-helper';
import { createDatabaseClient, emergencyContactsRepository } from '@noro/db';
import EmergenciaGlobalClient from './EmergenciaGlobalClient';

export const dynamic = 'force-dynamic';

export default async function EmergenciaConfigPage() {
  const user = await getCurrentUser();
  if (!user) redirect('/login');

  const tenantId = await getCurrentTenantId(user.id);
  const { db, close } = createDatabaseClient();
  try {
    const contacts = await emergencyContactsRepository.getContactsByTenant(db, tenantId);
    return <EmergenciaGlobalClient contacts={contacts} />;
  } finally {
    await close();
  }
}
