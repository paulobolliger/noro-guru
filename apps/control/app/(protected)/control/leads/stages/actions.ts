"use server";
import { createDatabaseClient } from "@noro/db";
import { revalidatePath } from "next/cache";

export async function listStages() {
  const { client, close } = createDatabaseClient();
  try {
    // Buscar stages globais do Control Plane (tenant_id IS NULL)
    const data = await client`
      SELECT *
      FROM platform_crm.lead_stages
      WHERE tenant_id IS NULL
      ORDER BY ord ASC
    `;
    
    // Se não tiver nenhuma stage, criar as padrão
    if (!data || data.length === 0) {
      const defaultStages = [
        { slug: "novo", label: "Novo", ord: 0, is_won: false, is_lost: false },
        { slug: "contato_inicial", label: "Contato Inicial", ord: 1, is_won: false, is_lost: false },
        { slug: "qualificado", label: "Qualificado", ord: 2, is_won: false, is_lost: false },
        { slug: "proposta", label: "Proposta", ord: 3, is_won: false, is_lost: false },
        { slug: "negociacao", label: "Negociação", ord: 4, is_won: false, is_lost: false },
        { slug: "ganho", label: "Ganho", ord: 5, is_won: true, is_lost: false },
        { slug: "perdido", label: "Perdido", ord: 6, is_won: false, is_lost: true },
      ];
      
      try {
        const newStages = [];
        for (const s of defaultStages) {
          const [inserted] = await client`
            INSERT INTO platform_crm.lead_stages (tenant_id, slug, label, ord, is_won, is_lost)
            VALUES (NULL, ${s.slug}, ${s.label}, ${s.ord}, ${s.is_won}, ${s.is_lost})
            RETURNING *
          `;
          newStages.push(inserted);
        }
        return newStages;
      } catch (insertError) {
        console.error('Falha ao criar stages padrão — usando fallback em memória:', insertError);
        return defaultStages.map((s, i) => ({
          id: `fallback-${i}`,
          ...s,
          tenant_id: null,
          created_at: new Date().toISOString()
        }));
      }
    }
    
    return data || [];
  } catch (error: any) {
    console.error('Erro ao buscar stages:', error);
    return [];
  } finally {
    await close();
  }
}

export async function createStage(formData: FormData) {
  const label = String(formData.get("label") || "").trim();
  const slug = String(formData.get("slug") || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  
  if (!label || !slug) throw new Error("Label e slug são obrigatórios");
  
  const { client, close } = createDatabaseClient();
  try {
    // Get max ord
    const [maxData] = await client`
      SELECT ord
      FROM platform_crm.lead_stages
      WHERE tenant_id IS NULL
      ORDER BY ord DESC
      LIMIT 1
    `;
    
    const nextOrd = (maxData?.ord ?? -1) + 1;
    
    await client`
      INSERT INTO platform_crm.lead_stages (tenant_id, slug, label, ord, is_won, is_lost)
      VALUES (NULL, ${slug}, ${label}, ${nextOrd}, false, false)
    `;
    
    revalidatePath("/control/leads");
  } catch (error: any) {
    console.error('Erro ao criar estágio:', error);
    throw new Error(error.message);
  } finally {
    await close();
  }
}

export async function updateStage(formData: FormData) {
  const id = String(formData.get("id") || "");
  const label = String(formData.get("label") || "").trim();
  const is_won = formData.get("is_won") === "true";
  const is_lost = formData.get("is_lost") === "true";
  
  if (!id || !label) throw new Error("ID e label são obrigatórios");
  
  const { client, close } = createDatabaseClient();
  try {
    await client`
      UPDATE platform_crm.lead_stages
      SET label = ${label}, is_won = ${is_won}, is_lost = ${is_lost}
      WHERE id = ${id} AND tenant_id IS NULL
    `;
    
    revalidatePath("/control/leads");
  } catch (error: any) {
    console.error('Erro ao atualizar estágio:', error);
    throw new Error(error.message);
  } finally {
    await close();
  }
}

export async function deleteStage(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("ID é obrigatório");
  
  const { client, close } = createDatabaseClient();
  try {
    // Check if stage has leads
    const [stage] = await client`
      SELECT slug
      FROM platform_crm.lead_stages
      WHERE id = ${id} AND tenant_id IS NULL
      LIMIT 1
    `;
    
    if (!stage) throw new Error("Stage não encontrada");
    
    const [{ count }] = await client`
      SELECT COUNT(*)::integer as count
      FROM platform_crm.leads
      WHERE stage = ${stage.slug}
    `;
    
    if (count && count > 0) {
      throw new Error(`Não é possível deletar. Existem ${count} lead(s) nesta stage.`);
    }
    
    await client`
      DELETE FROM platform_crm.lead_stages
      WHERE id = ${id} AND tenant_id IS NULL
    `;
    
    revalidatePath("/control/leads");
  } catch (error: any) {
    console.error('Erro ao deletar estágio:', error);
    throw new Error(error.message);
  } finally {
    await close();
  }
}

export async function reorderStages(formData: FormData) {
  const idsJson = String(formData.get("ids") || "[]");
  const ids: string[] = JSON.parse(idsJson);
  
  if (!ids.length) throw new Error("IDs são obrigatórios");
  
  const { client, close } = createDatabaseClient();
  try {
    // Update each stage with new ord
    await client.begin(async (sql) => {
      for (let i = 0; i < ids.length; i++) {
        await sql`
          UPDATE platform_crm.lead_stages
          SET ord = ${i}
          WHERE id = ${ids[i]} AND tenant_id IS NULL
        `;
      }
    });
    
    revalidatePath("/control/leads");
  } catch (error: any) {
    console.error('Erro ao reordenar estágios:', error);
    throw new Error(error.message);
  } finally {
    await close();
  }
}
