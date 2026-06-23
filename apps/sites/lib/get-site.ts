import { createDatabaseClient } from '@noro/db';
import type { Blueprint } from '@noro/types/blueprint';

export async function getSiteBySlug(slug: string) {
  const { client, close } = createDatabaseClient();
  try {
    const rows = await client`
      SELECT blueprint_data, theme, status
      FROM sites.agency_sites
      WHERE slug = ${slug} AND status = 'published'
      LIMIT 1
    `;

    if (!rows || rows.length === 0) {
      return null;
    }

    const data = rows[0];
    return {
      blueprint_data: data.blueprint_data as unknown as Blueprint,
      theme: data.theme,
    };
  } catch (error) {
    console.error('Error fetching site by slug:', error);
    return null;
  } finally {
    await close();
  }
}
