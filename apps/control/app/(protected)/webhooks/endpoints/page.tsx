import { createDatabaseClient } from "@noro/db";
import { revalidatePath } from "next/cache";
import EndpointsPageClient from './EndpointsPageClient';

export const dynamic = 'force-dynamic';

async function fetchEndpoints() {
  const { client, close } = createDatabaseClient();
  try {
    const data = await client`
      SELECT *
      FROM platform.webhooks
      ORDER BY created_at DESC
    `;
    if (!data) return [];
    return data.map(row => ({
      ...row,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
    })) as any[];
  } catch (err) {
    console.error('Error fetching webhooks:', err);
    return [];
  } finally {
    await close();
  }
}

async function remove(formData: FormData) {
  "use server";
  const id = String(formData.get('id') || '');
  const { client, close } = createDatabaseClient();
  try {
    await client`
      DELETE FROM platform.webhooks
      WHERE id = ${id}
    `;
  } finally {
    await close();
  }
  revalidatePath('/webhooks/endpoints');
}

async function toggle(formData: FormData) {
  "use server";
  const id = String(formData.get('id') || '');
  const active = String(formData.get('active') || '') === 'true';
  const { client, close } = createDatabaseClient();
  try {
    await client`
      UPDATE platform.webhooks
      SET is_active = ${!active}
      WHERE id = ${id}
    `;
  } finally {
    await close();
  }
  revalidatePath('/webhooks/endpoints');
}

export default async function WebhookEndpointsPage() {
  const endpoints = await fetchEndpoints();

  return (
    <EndpointsPageClient 
      endpoints={endpoints} 
      toggleAction={toggle}
      removeAction={remove}
    />
  );
}