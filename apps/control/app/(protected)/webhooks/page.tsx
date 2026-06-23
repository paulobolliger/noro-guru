import { createDatabaseClient } from "@noro/db";
import WebhooksPageClient from './WebhooksPageClient';

export const dynamic = 'force-dynamic';

async function fetchWebhookLogs(q: string) {
  const { client, close } = createDatabaseClient();
  try {
    let data;
    if (q) {
      const term = `%${q}%`;
      data = await client`
        SELECT *
        FROM platform.webhook_logs
        WHERE event ILIKE ${term} OR source ILIKE ${term}
        ORDER BY created_at DESC
        LIMIT 100
      `;
    } else {
      data = await client`
        SELECT *
        FROM platform.webhook_logs
        ORDER BY created_at DESC
        LIMIT 100
      `;
    }
    if (!data) return [];
    return data.map(row => ({
      ...row,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
    })) as any[];
  } catch (err) {
    console.error('Error fetching webhook logs:', err);
    return [];
  } finally {
    await close();
  }
}

export default async function WebhooksPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const q = (searchParams?.q || '').trim();
  const data = await fetchWebhookLogs(q);

  return <WebhooksPageClient data={data} initialQuery={q} />;
}
