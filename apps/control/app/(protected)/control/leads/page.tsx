import { listLeads, createLead, convertLead } from "./actions";
import { listLeadsByStage } from "./kanban/actions";
import { listStages } from "./stages/actions";
import KanbanBoardDnd from "./kanban/KanbanBoardDnd";
import { redirect } from "next/navigation";
import LeadHeader from "@/components/leads/LeadHeader";
import LeadKpis from "@/components/leads/LeadKpis";
import LeadTable from "@/components/leads/LeadTable";
import PageContainer from "@/components/layout/PageContainer";
import LeadImportModal from "@/components/leads/LeadImportModal";
import LeadStageManager from "@/components/leads/LeadStageManager";

export default async function ControlLeadsPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const view = (typeof searchParams?.view === 'string' ? searchParams?.view : '').toLowerCase();
  const leads = view === 'kanban' ? [] : await listLeads();
  const groups = view === 'kanban' ? await listLeadsByStage() : ({} as any);
  const stages = view === 'kanban' ? await listStages() : [];

  console.log('🔍 DEBUG:', { view, stagesCount: stages.length, groupsKeys: Object.keys(groups) });

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
      
      {/* KPIs - Sempre visível em ambas as views */}
      <PageContainer>
        <LeadKpis
          totals={{
            total: view === 'kanban' 
              ? Object.values(groups).flat().length 
              : (leads || []).length,
            valorTotal: view === 'kanban'
              ? Object.values(groups).flat().reduce((acc: number, l: any) => acc + (l.value_cents || 0), 0)
              : (leads || []).reduce((acc: number, l: any) => acc + (l.value_cents || 0), 0),
            abertos: view === 'kanban'
              ? Object.values(groups).flat().filter((l: any) => !['ganho', 'perdido'].includes((l.stage || '').toLowerCase())).length
              : (leads || []).filter((l: any) => !['ganho', 'perdido'].includes((l.stage || '').toLowerCase())).length,
            ganhos: view === 'kanban'
              ? Object.values(groups).flat().filter((l: any) => (l.stage || '').toLowerCase() === 'ganho').length
              : (leads || []).filter((l: any) => (l.stage || '').toLowerCase() === 'ganho').length,
          }}
        />
      </PageContainer>
      
      {/* Modal de Importação (abre via query ?open=import ou por botão no header futuro) */}
      {typeof searchParams?.open === 'string' && (searchParams?.open as string).toLowerCase()==='import' && (
        <LeadImportModal isOpen={true} onClose={() => redirect('/control/leads')} />
      )}

      {/* Stage Manager Modal */}
      {typeof searchParams?.open === 'string' && (searchParams?.open as string).toLowerCase()==='stages' && view === 'kanban' && (
        <LeadStageManager isOpen={true} onClose={() => redirect('/control/leads?view=kanban')} initialStages={stages as any} />
      )}

      {/* Criação agora somente pelo botão "+Novo Lead" no topo (LeadHeader/LeadCreateModal). */}
      {view === 'kanban' ? (
        <div className="mt-4">
          <p className="text-white mb-4">DEBUG: View=kanban, Stages={stages.length}, Groups={Object.keys(groups).length}</p>
          {(() => {
            const stageColumns = stages.map((s: any) => ({ key: s.slug, label: s.label }));
            console.log('🎯 stageColumns:', stageColumns);
            return <KanbanBoardDnd stages={stageColumns as any} groups={groups as any} />;
          })()}
        </div>
      ) : (
        <LeadTable leads={leads as any[]} />
      )}
    </div>
  );
}
