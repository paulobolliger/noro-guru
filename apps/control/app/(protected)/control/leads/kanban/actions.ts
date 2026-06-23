"use server";
import { createDatabaseClient } from "@noro/db";

export async function listLeadsByStage() {
  const { client, close } = createDatabaseClient();
  try {
    // Fetch stages globais (Control Plane não usa tenant_id para stages)
    const stagesData = await client`
      SELECT slug, label, ord
      FROM platform_crm.lead_stages
      WHERE tenant_id IS NULL
      ORDER BY ord ASC
    `;

    let stageSlugs = (stagesData || []).map((s: any) => s.slug);
    if (!stageSlugs.length) {
      // fallback defaults
      stageSlugs = ["novo","contato_inicial","qualificado","proposta","negociacao","ganho","perdido"];
    }
    const map: Record<string, any[]> = Object.fromEntries(stageSlugs.map((s: string) => [s, []]));

    // Buscar TODOS os leads do Control Plane (não filtrar por tenant)
    // Leads no Control Plane são prospects para virar tenants, não têm tenant_id ainda
    const data = await client`
      SELECT *
      FROM platform_crm.leads
      ORDER BY position ASC, created_at DESC
    `;

    for (const l of data || []) {
      const st = (l as any).stage;
      const key = st && stageSlugs.includes(st) ? st : stageSlugs[0];
      if (key) map[key]?.push(l as any);
    }
    return map;
  } catch (error: any) {
    console.error('Erro ao buscar leads por estágio:', error);
    throw new Error(error.message);
  } finally {
    await close();
  }
}

export async function moveLead(formData: FormData) {
  const id = String(formData.get("id") || "");
  const stage = String(formData.get("stage") || "");
  if (!id || !stage) throw new Error("Parametros invalidos");

  const { client, close } = createDatabaseClient();
  try {
    await client`
      UPDATE platform_crm.leads
      SET stage = ${stage}
      WHERE id = ${id}
    `;
  } catch (error: any) {
    console.error('Erro ao mover lead:', error);
    throw new Error(error.message);
  } finally {
    await close();
  }
}

export async function convertLeadToTenant(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("Lead invalido");

  const { client, close } = createDatabaseClient();
  try {
    const [lead] = await client`
      SELECT *
      FROM platform_crm.leads
      WHERE id = ${id}
      LIMIT 1
    `;
    if (!lead) throw new Error("Lead nao encontrado");

    const slug = (lead.organization_name || "org")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30);

    const [tenant] = await client`
      INSERT INTO platform.tenants (name, slug, status)
      VALUES (${lead.organization_name || slug}, ${slug}, 'active')
      RETURNING *
    `;

    if (!tenant) throw new Error("Erro ao criar tenant");

    await client`
      UPDATE platform_crm.leads
      SET tenant_id = ${tenant.id}, stage = 'ganho'
      WHERE id = ${id}
    `;
  } catch (error: any) {
    console.error('Erro ao converter lead para tenant:', error);
    throw new Error(error.message);
  } finally {
    await close();
  }
}
