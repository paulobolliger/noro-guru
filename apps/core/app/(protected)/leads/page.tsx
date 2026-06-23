import { redirect } from 'next/navigation';
import LeadsClientPage from '@/components/admin/LeadsClientPage';
import { createDatabaseClient } from '@noro/db';
import { requireUser, logtoSessionAdapter } from '@noro/auth';
import { logtoConfig } from '@/lib/logto';
import { getLeads } from './actions';

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
  const { client, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });

    const memberships = await client`
      SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userCtx.user.id} LIMIT 1
    `;

    if (!memberships || memberships.length === 0) {
      return (
        <div className="p-8 text-center text-red-500">
          Você não está associado a nenhuma agência.
        </div>
      );
    }

    const tenantId = memberships[0].tenant_id;
    const leads = await getLeads(tenantId);
    return <LeadsClientPage leads={leads} />;
  } catch (error) {
    console.error('Error loading Leads page:', error);
    redirect('/auth/sign-in');
  } finally {
    await close();
  }
}
