import { listLeads, createLead, convertLead } from "./actions";
import { listLeadsByStage } from "./kanban/actions";
import KanbanBoardDnd from "./kanban/KanbanBoardDnd";
import { redirect } from "next/navigation";
import LeadHeader from "@/components/leads/LeadHeader";
import LeadKpis from "@/components/leads/LeadKpis";
import LeadTable from "@/components/leads/LeadTable";
import PageContainer from "@/components/layout/PageContainer";
import LeadImportModal from "@/components/leads/LeadImportModal";

export default async function ControlLeadsPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const view = (typeof searchParams?.view === 'string' ? searchParams?.view : '').toLowerCase();
  const leads = view === 'kanban' ? [] : await listLeads();
  const groups = view === 'kanban' ? await listLeadsByStage() : ({} as any);

  async function create(formData: FormData) {
    "use server";
    await createLead(formData);
  }
  async function convert(formData: FormData) {
    "use server";
    await convertLead(formData);
  }

  return (
    <div className="container-app py-8 space-y-6">
      <LeadHeader />
      <PageContainer>
        {view !== 'kanban' && (
          <LeadKpis
            totals={{
              total: (leads || []).length,
              valorTotal: (leads || []).reduce((acc: number, l: any) => acc + (l.value_cents || 0), 0),
              abertos: (leads || []).filter((l: any) => !['ganho', 'perdido'].includes((l.stage || '').toLowerCase())).length,
              ganhos: (leads || []).filter((l: any) => (l.stage || '').toLowerCase() === 'ganho').length,
            }}
          />
        )}
      </PageContainer>
      {/* Modal de Importação (abre via query ?open=import ou por botão no header futuro) */}
      {typeof searchParams?.open === 'string' && (searchParams?.open as string).toLowerCase()==='import' && (
        <LeadImportModal isOpen={true} onClose={() => redirect('/control/leads')} />
      )}

      {/* Criação agora somente pelo botão "+Novo Lead" no topo (LeadHeader/LeadCreateModal). */}
      {view === 'kanban' ? (
        <div className="mt-4">
          {(() => {
            const stages = Object.keys(groups).map((k) => ({ key: k, label: k }));
            return <KanbanBoardDnd stages={stages as any} groups={groups as any} />;
          })()}
        </div>
      ) : (
        <LeadTable leads={leads as any[]} />
      )}
    </div>
  );
}
