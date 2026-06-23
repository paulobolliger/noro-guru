'use server';

import { createDatabaseClient } from '@noro/db';
import crypto from 'node:crypto';
import { requireUser, logtoSessionAdapter } from '@noro/auth';
import { logtoConfig } from '@/lib/logto';

export type CreateApiKeyResult = 
  | { ok: true; plaintext: string; last4: string } 
  | { ok: false; error: string };

async function getTenantId(client: any, userId: string): Promise<string> {
  const memberships = await client`
    SELECT tenant_id FROM noro.tenant_memberships WHERE user_id = ${userId} LIMIT 1
  `;
  if (!memberships || memberships.length === 0) {
    throw new Error('Usuário não associado a nenhuma agência.');
  }
  return memberships[0].tenant_id;
}

export async function listApiKeys() {
  const { client, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });
    const tenantId = await getTenantId(client, userCtx.user.id);

    const keys = await client`
      SELECT id, name, last4, scope, expires_at, created_at 
      FROM platform.api_keys
      WHERE tenant_id = ${tenantId}
      ORDER BY created_at DESC
    `;
    return keys.map(row => ({
      ...row,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
      expires_at: row.expires_at ? new Date(row.expires_at).toISOString() : null,
    })) as any[];
  } catch (err) {
    console.error('Erro ao listar API keys no Core:', err);
    return [];
  } finally {
    await close();
  }
}

export async function createApiKey(
  name: string, 
  scope: string[] = ["visa:read"], 
  expiresAt: string | null = null
): Promise<CreateApiKeyResult> {
  const { client, close } = createDatabaseClient();
  try {
    if (!name?.trim()) return { ok: false, error: 'Nome obrigatório' };
    
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });
    const tenantId = await getTenantId(client, userCtx.user.id);

    const plaintext = crypto.randomBytes(24).toString('base64url');
    const last4 = plaintext.slice(-4);
    const hash = crypto.createHash('sha256').update(plaintext).digest('hex');

    await client`
      INSERT INTO platform.api_keys (tenant_id, name, hash, last4, scope, expires_at)
      VALUES (${tenantId}, ${name}, ${hash}, ${last4}, ${scope}, ${expiresAt})
    `;
    
    return { ok: true, plaintext, last4 };
  } catch (e: any) {
    console.error('Erro ao criar API key no Core:', e);
    return { ok: false, error: e.message || String(e) };
  } finally {
    await close();
  }
}

export async function revokeApiKey(id: string) {
  const { client, close } = createDatabaseClient();
  try {
    const userCtx = await requireUser({
      db: client as any,
      sessionAdapter: logtoSessionAdapter(logtoConfig),
    });
    const tenantId = await getTenantId(client, userCtx.user.id);

    await client`
      DELETE FROM platform.api_keys
      WHERE id = ${id} AND tenant_id = ${tenantId}
    `;
    return { success: true };
  } catch (err) {
    console.error('Erro ao revogar API key no Core:', err);
    return { success: false, error: 'Erro ao revogar chave.' };
  } finally {
    await close();
  }
}
