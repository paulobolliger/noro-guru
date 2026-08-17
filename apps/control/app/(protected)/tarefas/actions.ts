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
    return data.map(row => ({
      ...row,
      created_at: row.created_at ? new Date(row.created_at).toISOString() : null,
      due_date: row.due_date ? new Date(row.due_date).toISOString() : null,
    })) as any[];
  } finally {
    await close();
  }
}

export async function createTask(formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const ctx = await getServerSession().then(s => ({ isAuthenticated: Boolean(s?.claims?.sub), claims: s?.claims }));
    const uid = ctx.claims?.sub || null;
    
    const payload = {
      title: String(formData.get('title') || '').trim(),
      tenant_id: String(formData.get('tenant_id') || '') || null,
      due_date: String(formData.get('due_date') || '') || null,
      assigned_to: uid,
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

export async function createTicket(formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const ctx = await getServerSession().then(s => ({ isAuthenticated: Boolean(s?.claims?.sub), claims: s?.claims }));
    const uid = ctx.claims?.sub || null;
    const email = ctx.claims?.email || null;
    
    const subject = String(formData.get('subject') || '').trim();
    const summary = String(formData.get('description') || '').trim() || null;
    const priority = String(formData.get('priority') || 'normal').trim().toLowerCase() || 'normal';
    const tenantId = String(formData.get('tenant_id') || '').trim() || null;

    if (!subject) throw new Error('Assunto é obrigatório');

    await client`
      INSERT INTO platform.support_tickets (
        subject, summary, priority, tenant_id, source, requester_id, requester_email
      ) VALUES (
        ${subject}, ${summary}, ${priority}, ${tenantId}, 'manual', ${uid}, ${email}
      )
    `;
  } finally {
    await close();
  }
}

