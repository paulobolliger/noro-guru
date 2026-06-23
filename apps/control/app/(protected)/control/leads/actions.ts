"use server";
import { createDatabaseClient } from "@noro/db";

export async function listLeads() {
  const { client, close } = createDatabaseClient();
  try {
    const data = await client`
      SELECT *
      FROM platform_crm.leads
      ORDER BY created_at DESC
      LIMIT 200
    `;
    return data || [];
  } catch (error: any) {
    console.error('Erro ao buscar leads:', error);
    throw new Error(error.message);
  } finally {
    await close();
  }
}

// Alias for compatibility
export const getLeads = listLeads;

export async function createLead(formData: FormData) {
  const payload = {
    organization_name: String(formData.get('organization_name') || '').trim(),
    email: String(formData.get('email') || '').trim(),
    phone: String(formData.get('phone') || '').trim(),
    source: String(formData.get('source') || '').trim(),
    value_cents: Number(formData.get('value_cents') || 0) || 0,
  };
  if (!payload.organization_name) throw new Error('organization_name required');

  const { client, close } = createDatabaseClient();
  try {
    await client`
      INSERT INTO platform_crm.leads (organization_name, email, phone, source, value_cents)
      VALUES (${payload.organization_name}, ${payload.email}, ${payload.phone}, ${payload.source}, ${payload.value_cents})
    `;
  } catch (error: any) {
    console.error('Erro ao criar lead:', error);
    throw new Error(error.message);
  } finally {
    await close();
  }
}

export async function convertLead(formData: FormData) {
  const id = String(formData.get('id') || '');
  if (!id) throw new Error('id required');

  const { client, close } = createDatabaseClient();
  try {
    const [lead] = await client`
      SELECT *
      FROM platform_crm.leads
      WHERE id = ${id}
      LIMIT 1
    `;

    await client`
      UPDATE platform_crm.leads
      SET stage = 'ganho'
      WHERE id = ${id}
    `;

    return lead;
  } catch (error: any) {
    console.error('Erro ao converter lead:', error);
    throw new Error(error.message);
  } finally {
    await close();
  }
}
