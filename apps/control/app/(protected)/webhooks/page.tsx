import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import PageContainer from "@/components/layout/PageContainer";
import SectionHeader from "@/components/layout/SectionHeader";
import { NButton, NInput } from "@/components/ui";

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
    .limit(50);
  if (q) {
    query = (query as any).or(`event.ilike.%${q}%,source.ilike.%${q}%`);
  }
  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (
    <div className="container-app py-8 space-y-6">
      <PageContainer>
        <SectionHeader
          title="Webhooks"
          subtitle="Eventos recebidos (logs)."
          sticky
          right={(
            <form className="flex items-end gap-2" method="get">
              <div className="flex flex-col">
                <label className="text-sm text-primary">Filtro</label>
                <NInput name="q" placeholder="event/source" defaultValue={q} className="w-[220px]" />
              </div>
              <NButton type="submit" variant="secondary">Filtrar</NButton>
            </form>
          )}
        />
      </PageContainer>

      <PageContainer>
      <div className="rounded-xl surface-card border border-default overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 border-b border-default">
            <tr>
              <th className="text-left p-2">Source</th>
              <th className="text-left p-2">Event</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">When</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((w: any) => (
              <tr key={w.id} className="border-t border-white/10 hover:bg-white/[0.02] transition-colors">
                <td className="p-2">{w.provider || w.source || w.vendor || '-'}</td>
                <td className="p-2">{w.event || w.type || w.event_type || '-'}</td>
                <td className="p-2">{w.status || w.delivery_status || '-'}</td>
                <td className="p-2">{w.created_at}</td>
              </tr>
            ))}
            {!data?.length && (
              <tr>
                <td className="p-3 text-muted" colSpan={4}>No events</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      </PageContainer>
    </div>
  );
}
