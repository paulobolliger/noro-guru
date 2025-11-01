"use server";

import { getSupabaseServer } from "@/lib/supabaseServer";

export async function getTickets() {
  const supabase = getSupabaseServer();
  
  const { data, error } = await supabase
    .schema('cp')
    .from("support_tickets")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching tickets:", error);
    return [];
  }

  return data || [];
}
