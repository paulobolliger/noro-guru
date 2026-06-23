"use server";
import { createDatabaseClient } from "@noro/db";
import { getActiveTenantId } from "../tenants/actions";

export async function listDomains() {
  const { client, close } = createDatabaseClient();
  try {
    const data = await client`
      SELECT id, tenant_id, domain, is_default, created_at 
      FROM platform.domains 
      ORDER BY created_at DESC
    `;
    return data || [];
  } catch (error: any) {
    console.error("Error listing domains:", error);
    throw new Error(error.message || String(error));
  } finally {
    await close();
  }
}

export async function createDomain(formData: FormData) {
  const { client, close } = createDatabaseClient();
  try {
    const tenantId = await getActiveTenantId();
    const domain = String(formData.get('domain') || '').trim().toLowerCase();
    const is_default = formData.get('is_default') === 'on';
    if (!tenantId) throw new Error('Tenant ativo não encontrado');
    if (!domain) throw new Error('Domínio obrigatório');

    // Validação simples de FQDN
    const fqdn = /^(?=.{3,253}$)([a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
    if (!fqdn.test(domain)) throw new Error('Domínio inválido');

    const suffixes = (process.env.NEXT_PUBLIC_ALLOWED_DOMAIN_SUFFIXES || '').split(',').map(s => s.trim()).filter(Boolean);
    if (suffixes.length && !suffixes.some(suf => domain.endsWith(suf))) {
      throw new Error('Domínio não autorizado para esta instância');
    }

    // Unicidade global
    const [exists] = await client`
      SELECT id 
      FROM platform.domains 
      WHERE domain = ${domain} 
      LIMIT 1
    `;
    if (exists) throw new Error('Domínio já cadastrado');

    // Se marcar default, zera anteriores do tenant
    if (is_default) {
      await client`
        UPDATE platform.domains 
        SET is_default = false 
        WHERE tenant_id = ${tenantId}
      `;
    }

    await client`
      INSERT INTO platform.domains (tenant_id, domain, is_default) 
      VALUES (${tenantId}, ${domain}, ${is_default})
    `;
  } catch (error: any) {
    console.error("Error creating domain:", error);
    throw new Error(error.message || String(error));
  } finally {
    await close();
  }
}

export async function deleteDomain(id: string) {
  const { client, close } = createDatabaseClient();
  try {
    await client`
      DELETE FROM platform.domains 
      WHERE id = ${id}
    `;
  } catch (error: any) {
    console.error("Error deleting domain:", error);
    throw new Error(error.message || String(error));
  } finally {
    await close();
  }
}

export async function setDefaultDomain(id: string) {
  const { client, close } = createDatabaseClient();
  try {
    // Obter domínio para saber o tenant
    const [dom] = await client`
      SELECT tenant_id 
      FROM platform.domains 
      WHERE id = ${id} 
      LIMIT 1
    `;
    if (!dom) throw new Error('Domínio não encontrado');
    
    // Desmarcar anteriores e marcar este
    await client`
      UPDATE platform.domains 
      SET is_default = false 
      WHERE tenant_id = ${dom.tenant_id}
    `;
    await client`
      UPDATE platform.domains 
      SET is_default = true 
      WHERE id = ${id}
    `;
  } catch (error: any) {
    console.error("Error setting default domain:", error);
    throw new Error(error.message || String(error));
  } finally {
    await close();
  }
}
