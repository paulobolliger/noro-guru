"use server";
import { createDatabaseClient } from "@noro/db";
import { getLogtoContext } from "@logto/next/server-actions";
import { logtoConfig } from "@/lib/logto";

export async function getOrg(id: string) {
  const { client, close } = createDatabaseClient();
  try {
    const [data] = await client`
      SELECT * 
      FROM platform.tenants 
      WHERE id = ${id} 
      LIMIT 1
    `;
    return data || null;
  } finally {
    await close();
  }
}

export async function listNotes(id: string) {
  const { client, close } = createDatabaseClient();
  try {
    const data = await client`
      SELECT * 
      FROM platform_crm.notes 
      WHERE tenant_id = ${id} 
      ORDER BY created_at DESC 
      LIMIT 50
    `;
    return data || [];
  } finally {
    await close();
  }
}

export async function addNote(formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const tenant_id = String(formData.get('tenant_id') || '');
    const content = String(formData.get('content') || '');
    if (!tenant_id || !content) throw new Error('Campos obrigatórios');
    
    const ctx = await getLogtoContext(logtoConfig);
    const uid = ctx.claims?.sub || null;

    await client`
      INSERT INTO platform_crm.notes (tenant_id, entity_type, entity_id, content, created_by)
      VALUES (${tenant_id}, 'tenant', ${tenant_id}, ${content}, ${uid})
    `;
  } finally {
    await close();
  }
}

export async function createContact(formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const tenant_id = String(formData.get('tenant_id') || '');
    const name = String(formData.get('name') || '');
    const email = String(formData.get('email') || '');
    const phone = String(formData.get('phone') || '');
    const role = String(formData.get('role') || '');
    const is_primary = String(formData.get('is_primary') || '') === 'on';
    if (!tenant_id || !name) throw new Error('Campos obrigatórios');

    await client`
      INSERT INTO platform_crm.contacts (tenant_id, name, email, phone, role, is_primary)
      VALUES (${tenant_id}, ${name}, ${email}, ${phone}, ${role}, ${is_primary})
    `;
  } finally {
    await close();
  }
}

export async function deleteContact(formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const id = String(formData.get('id') || '');
    if (!id) throw new Error('Contato inválido');

    await client`
      DELETE FROM platform_crm.contacts 
      WHERE id = ${id}
    `;
  } finally {
    await close();
  }
}

export async function updateContact(formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const id = String(formData.get('id') || '');
    if (!id) throw new Error('Contato inválido');
    const email = String(formData.get('email') || '');
    const phone = String(formData.get('phone') || '');
    const role = String(formData.get('role') || '');
    const is_primary = String(formData.get('is_primary') || '') === 'on';

    await client`
      UPDATE platform_crm.contacts 
      SET 
        email = ${email}, 
        phone = ${phone}, 
        role = ${role}, 
        is_primary = ${is_primary} 
      WHERE id = ${id}
    `;
  } finally {
    await close();
  }
}
