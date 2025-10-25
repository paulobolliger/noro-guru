"use server";

import { revalidatePath } from "next/cache";
import { supabaseServerAdmin } from "@/lib/supabase/cp";

export async function addMembership(formData: FormData) {
  const user_id = String(formData.get("user_id") || "").trim();
  const tenant_id = String(formData.get("tenant_id") || "").trim();
  const role = String(formData.get("role") || "").trim();
  if (!user_id || !tenant_id || !role) return { error: "Dados incompletos" };

  const supabase = supabaseServerAdmin() as any;
  const { error } = await supabase.upsertMembership({ user_id, tenant_id, role });
  if (error) return { error: error.message };

  revalidatePath(`/control/users/${user_id}`);
  return { ok: true };
}

export async function removeMembership(formData: FormData) {
  const user_id = String(formData.get("user_id") || "").trim();
  const tenant_id = String(formData.get("tenant_id") || "").trim();
  if (!user_id || !tenant_id) return { error: "Dados incompletos" };

  const supabase = supabaseServerAdmin() as any;
  const { error } = await supabase.removeMembership({ user_id, tenant_id });
  if (error) return { error: error.message };

  revalidatePath(`/control/users/${user_id}`);
  return { ok: true };
}

