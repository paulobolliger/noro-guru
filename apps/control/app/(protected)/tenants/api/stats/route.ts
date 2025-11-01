import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@noro/lib/supabase/server";

export async function GET() {
  const supabase = createServerSupabaseClient();

  const { data: tenants, error } = await supabase
    .schema("cp")
    .from("tenants")
    .select("id, status, plan")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar tenants:", error);
    return NextResponse.json({ total: 0, active: 0, trial: 0, inactive: 0 }, { status: 500 });
  }

  const stats = {
    total: tenants?.length || 0,
    active: tenants?.filter((t) => t.status === "active").length || 0,
    trial: tenants?.filter((t) => t.plan === "trial").length || 0,
    inactive: tenants?.filter((t) => t.status === "inactive").length || 0,
  };

  return NextResponse.json(stats);
}
