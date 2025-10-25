"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createTenantAction(formData: FormData) {
  const name = formData.get("name");
  const slug = formData.get("slug");
  const plan = formData.get("plan");

  const res = await fetch("/api/control/tenants", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, slug, plan }),
  });

  if (!res.ok) throw new Error("Erro ao criar tenant");

  revalidatePath("/control/tenants");
  redirect("/control/tenants");
}

