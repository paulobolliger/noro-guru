import { redirect } from 'next/navigation';
import { createDatabaseClient } from '@noro/db';
import { requireUser, keycloakSessionAdapter, UnauthenticatedError, UserNotFoundError } from '@noro/auth';
import { getServerSession } from '@/lib/session';
import WizardClient from './WizardClient';

export const dynamic = 'force-dynamic';

export default async function WizardPage() {
  const { db, close } = createDatabaseClient();

  try {
    const userCtx = await requireUser({
      db,
      sessionAdapter: keycloakSessionAdapter(getServerSession),
    });

    const user = userCtx.user;
    
    // Query user's tenant memberships to resolve their tenant ID
    const membership = await db.query.tenantMemberships.findFirst({
      where: (tbl, { eq }) => eq(tbl.userId, user.id),
    });

    const tenantId = membership?.tenantId ?? '00000000-0000-0000-0000-000000000001';

    return <WizardClient initialEmail={user.email} tenantId={tenantId} />;
  } catch (error) {
    if (error instanceof UnauthenticatedError || error instanceof UserNotFoundError) {
      redirect('/auth/sign-in?redirect_uri=/wizard');
    }
    throw error;
  } finally {
    await close();
  }
}
