"use server";
import { createServerSupabaseClient } from "@noro/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

// Control Plane usa tenant_id NULL para stages globais (não são por tenant)
const CONTROL_PLANE_TENANT_ID = null;

export async function listStages() {
  const admin = createAdminSupabaseClient();
  
  // Buscar stages globais do Control Plane (tenant_id IS NULL)
  const { data, error } = await admin
    .schema("cp")
    .from("lead_stages")
    .select("*")
    .is("tenant_id", null) // Stages globais
    .order("ord", { ascending: true });
  
  if (error) {
    console.error("❌ Erro ao buscar stages:", error);
  }
  
  console.log("📊 Stages encontradas no banco:", data?.length || 0);
  
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
    
    const stagesToInsert = defaultStages.map(s => ({ ...s, tenant_id: CONTROL_PLANE_TENANT_ID }));
    
    console.log("🔧 Tentando criar stages padrão...");
    
    try {
      const { data: newStages, error: insertError } = await admin
        .schema("cp")
        .from("lead_stages")
        .insert(stagesToInsert)
        .select();
      
      if (insertError) {
        console.error("❌ Erro ao inserir stages:", insertError);
        throw insertError;
      }
      
      console.log("✅ Stages criadas com sucesso:", newStages?.length);
      return newStages || defaultStages.map((s, i) => ({ 
        id: `default-${i}`, 
        ...s, 
        tenant_id: null,
        created_at: new Date().toISOString()
      }));
    } catch (insertError) {
      console.error("❌ FALHA ao criar stages padrão:", insertError);
      // Retornar stages em memória se falhar
      const fallbackStages = defaultStages.map((s, i) => ({ 
        id: `fallback-${i}`, 
        ...s, 
        tenant_id: null,
        created_at: new Date().toISOString()
      }));
      console.log("⚠️ Retornando stages em memória:", fallbackStages.length);
      return fallbackStages;
    }
  }
  
  return data || [];
}

export async function createStage(formData: FormData) {
  const label = String(formData.get("label") || "").trim();
  const slug = String(formData.get("slug") || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  
  if (!label || !slug) throw new Error("Label e slug são obrigatórios");
  
  const admin = createAdminSupabaseClient();
  
  // Get max ord
  const { data: maxData } = await admin
    .schema("cp")
    .from("lead_stages")
    .select("ord")
    .is("tenant_id", null)
    .order("ord", { ascending: false })
    .limit(1)
    .maybeSingle();
  
  const nextOrd = (maxData?.ord ?? -1) + 1;
  
  const { error } = await admin
    .schema("cp")
    .from("lead_stages")
    .insert({
      tenant_id: CONTROL_PLANE_TENANT_ID,
      slug,
      label,
      ord: nextOrd,
      is_won: false,
      is_lost: false,
    });
  
  if (error) throw new Error(error.message);
  revalidatePath("/control/leads");
}

export async function updateStage(formData: FormData) {
  const id = String(formData.get("id") || "");
  const label = String(formData.get("label") || "").trim();
  const is_won = formData.get("is_won") === "true";
  const is_lost = formData.get("is_lost") === "true";
  
  if (!id || !label) throw new Error("ID e label são obrigatórios");
  
  const admin = createAdminSupabaseClient();
  const { error } = await admin
    .schema("cp")
    .from("lead_stages")
    .update({ label, is_won, is_lost })
    .eq("id", id)
    .is("tenant_id", null);
  
  if (error) throw new Error(error.message);
  revalidatePath("/control/leads");
}

export async function deleteStage(formData: FormData) {
  const id = String(formData.get("id") || "");
  if (!id) throw new Error("ID é obrigatório");
  
  const admin = createAdminSupabaseClient();
  
  // Check if stage has leads
  const { data: stage } = await admin
    .schema("cp")
    .from("lead_stages")
    .select("slug")
    .eq("id", id)
    .is("tenant_id", null)
    .maybeSingle();
  
  if (!stage) throw new Error("Stage não encontrada");
  
  const { count } = await admin
    .schema("cp")
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("stage", stage.slug);
  
  if (count && count > 0) {
    throw new Error(`Não é possível deletar. Existem ${count} lead(s) nesta stage.`);
  }
  
  const { error } = await admin
    .schema("cp")
    .from("lead_stages")
    .delete()
    .eq("id", id)
    .is("tenant_id", null);
  
  if (error) throw new Error(error.message);
  revalidatePath("/control/leads");
}

export async function reorderStages(formData: FormData) {
  const idsJson = String(formData.get("ids") || "[]");
  const ids: string[] = JSON.parse(idsJson);
  
  if (!ids.length) throw new Error("IDs são obrigatórios");
  
  const admin = createAdminSupabaseClient();
  
  // Update each stage with new ord
  for (let i = 0; i < ids.length; i++) {
    await admin
      .schema("cp")
      .from("lead_stages")
      .update({ ord: i })
      .eq("id", ids[i])
      .is("tenant_id", null);
  }
  
  revalidatePath("/control/leads");
}

