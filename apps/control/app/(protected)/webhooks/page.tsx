import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import WebhooksPageClient from './WebhooksPageClient';

// NOTE: This file is saved with plain ASCII to avoid UTF-8 issues on Windows shells.
// Please keep strings simple (no special punctuation) to prevent encoding errors.

export default async function WebhooksPage({ searchParams }: { searchParams?: Record<string, string> }) {
  const supabase = createAdminSupabaseClient();
  const q = (searchParams?.q || '').trim();
  let query = supabase
    .schema("cp")
    .from("webhook_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);
  
  if (q) {
    query = (query as any).or(`event.ilike.%${q}%,source.ilike.%${q}%`);
  }
  
  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return <WebhooksPageClient data={data || []} initialQuery={q} />;
}
