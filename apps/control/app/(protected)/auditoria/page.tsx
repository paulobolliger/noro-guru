// app/(protected)/auditoria/page.tsx
import { createAdminSupabaseClient } from '@/lib/supabase/admin';
import PageContainer from "@/components/layout/PageContainer";
import SectionHeader from "@/components/layout/SectionHeader";
import { FileSearch } from 'lucide-react';

export default async function AuditoriaPage() {
  const supabase = createAdminSupabaseClient();
  // Try a few known tables/views; fall back gracefully if they don't exist
  const tryQueries = [
    { label: 'API Key Logs', schema: 'cp', table: 'api_key_logs' },
    { label: 'Webhooks', schema: 'cp', table: 'webhook_logs' },
    { label: 'Invoices', schema: 'cp', table: 'invoices' },
  ];

  const sections: { label: string; rows: any[] }[] = [];
  for (const q of tryQueries) {
    const { data, error } = await supabase.schema(q.schema).from(q.table).select('*').order('created_at', { ascending: false }).limit(20);
    if (!error && data) sections.push({ label: q.label, rows: data });
  }
  return (
    <div className="container-app py-8 space-y-6">
      <PageContainer>
        <SectionHeader 
          title="Auditoria" 
          subtitle="Tabelas e eventos recentes para diagnóstico." 
          sticky 
          icon={<FileSearch size={28} />}
        />
      </PageContainer>

      {sections.length === 0 && (
        <PageContainer>
          <div className="text-sm text-primary0">Sem dados de auditoria disponíveis.</div>
        </PageContainer>
      )}
      <div className="space-y-8">
        {sections.map((s, idx) => (
          <div key={idx}>
            <h2 className="text-lg font-medium mb-3 text-gray-900 dark:text-white">{s.label}</h2>
            <div className="overflow-auto rounded-xl border-2 border-[#D4AF37] dark:border-[#4aede5] shadow-lg">
              <table className="min-w-full text-sm bg-white dark:bg-[#1a1625]">
                <thead className="sticky top-[68px] z-10 bg-gradient-to-b from-gray-100 dark:from-indigo-500/10 via-gray-50 dark:via-purple-500/5 to-transparent border-b-2 border-[#D4AF37] dark:border-[#4aede5] backdrop-blur supports-[backdrop-filter]:bg-white/90 dark:supports-[backdrop-filter]:bg-black/20">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-[#D4AF37]">ID</th>
                    <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-[#D4AF37]">created_at</th>
                    <th className="px-3 py-2 text-left text-xs font-bold uppercase tracking-wide text-[#D4AF37]">payload</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-white/10">
                  {s.rows.map((r: any) => (
                    <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-3 py-2 align-top text-gray-900 dark:text-white">{r.id}</td>
                      <td className="px-3 py-2 align-top text-gray-700 dark:text-gray-300">{r.created_at}</td>
                      <td className="px-3 py-2 align-top text-gray-700 dark:text-gray-300">
                        <pre className="whitespace-pre-wrap break-words text-xs">{JSON.stringify(r, null, 2)}</pre>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
