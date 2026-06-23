'use server';

import { createDatabaseClient } from '@noro/db';
import { getLogtoContext } from '@logto/next/server-actions';
import { logtoConfig } from '@/lib/logto';

export async function getUnreadMessagesCount(): Promise<number> {
  const { client, close } = createDatabaseClient();
  try {
    const data = await client`
      SELECT unread_count
      FROM comunicacao.conversations
      WHERE status IN ('active', 'waiting')
    `;
    return data.reduce((sum: number, conv: any) => sum + (conv.unread_count || 0), 0);
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return 0;
  } finally {
    await close();
  }
}

export async function getClientName(clientId: string): Promise<string | null> {
  const { client, close } = createDatabaseClient();
  try {
    const [data] = await client`
      SELECT nome
      FROM crm.clients
      WHERE id = ${clientId}
      LIMIT 1
    `;
    return data?.nome || null;
  } catch (error) {
    console.error('Error fetching client name:', error);
    return null;
  } finally {
    await close();
  }
}

export async function getTenantSlug(tenantId: string): Promise<string | null> {
  const { client, close } = createDatabaseClient();
  try {
    const [data] = await client`
      SELECT slug
      FROM platform.tenants
      WHERE id = ${tenantId}
      LIMIT 1
    `;
    return data?.slug || null;
  } catch (error) {
    console.error('Error fetching tenant slug:', error);
    return null;
  } finally {
    await close();
  }
}

export async function markAllNotificationsAsRead(): Promise<boolean> {
  const ctx = await getLogtoContext(logtoConfig);
  const userId = ctx.claims?.sub;
  if (!userId) return false;

  const { client, close } = createDatabaseClient();
  try {
    await client`
      UPDATE comunicacao.notificacoes
      SET lida = true
      WHERE user_id = ${userId}
    `;
    return true;
  } catch (error) {
    console.error('Error marking notifications read:', error);
    return false;
  } finally {
    await close();
  }
}

export async function searchCommandPalette(term: string): Promise<Array<{ type: 'tenant'|'lead'; label: string; href: string }>> {
  if (!term.trim()) return [];
  const { client, close } = createDatabaseClient();
  try {
    const termLike = `%${term}%`;
    const tenants = await client`
      SELECT id, name, slug
      FROM platform.tenants
      WHERE name ILIKE ${termLike}
      LIMIT 5
    `;
    const leads = await client`
      SELECT id, organization_name
      FROM platform_crm.leads
      WHERE organization_name ILIKE ${termLike}
      LIMIT 5
    `;

    const results: Array<{ type: 'tenant'|'lead'; label: string; href: string }> = [];
    tenants.forEach((r: any) => {
      results.push({ type: 'tenant', label: `Tenant: ${r.name}`, href: `/control/orgs/${r.id}` });
    });
    leads.forEach((r: any) => {
      results.push({ type: 'lead', label: `Lead: ${r.organization_name}`, href: `/control/leads` });
    });
    return results;
  } catch (error) {
    console.error('Error during command palette search:', error);
    return [];
  } finally {
    await close();
  }
}
