"use server";
import { createDatabaseClient } from "@noro/db";
import { getServerSession, getSessionClaims } from '@/lib/session';

export async function listTasks() {
  const { client, close } = createDatabaseClient();
  try {
    const data = await client`
      SELECT * 
      FROM platform.tasks
      ORDER BY created_at DESC
      LIMIT 100
    `;
    return data;
  } finally {
    await close();
  }
}

export async function createTask(formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const ctx = await getServerSession().then(s => ({ isAuthenticated: Boolean(s?.claims?.sub), claims: s?.claims }));
    const uid = ctx.claims?.sub;
    
    const payload = {
      title: String(formData.get('title') || '').trim(),
      tenant_id: String(formData.get('tenant_id') || '') || null,
      due_date: String(formData.get('due_date') || '') || null,
      assigned_to: uid || null,
      entity_type: String(formData.get('entity_type') || '') || null,
      entity_id: String(formData.get('entity_id') || '') || null,
    };
    
    if (!payload.title) throw new Error('Título é obrigatório');
    
    await client`
      INSERT INTO platform.tasks (title, tenant_id, due_date, assigned_to, entity_type, entity_id)
      VALUES (${payload.title}, ${payload.tenant_id}, ${payload.due_date}, ${payload.assigned_to}, ${payload.entity_type}, ${payload.entity_id})
    `;
  } finally {
    await close();
  }
}

