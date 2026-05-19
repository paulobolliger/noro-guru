import { listLeadsByStage } from "./kanban/actions";
import { listStages } from "./stages/actions";
import KanbanBoardDnd from "./kanban/KanbanBoardDnd";
import { redirect } from "next/navigation";
import LeadKpis from "@/components/leads/LeadKpis";
import PageContainer from "@/components/layout/PageContainer";
import LeadImportModal from "@/components/leads/LeadImportModal";
import LeadStageManager from "@/components/leads/LeadStageManager";
import LeadsClientPage from "@/components/LeadsClientPage";
import { getLeads } from "./actions";

export default async function ControlLeadsPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const view = (typeof searchParams?.view === 'string' ? searchParams?.view : '').toLowerCase();

  // If Kanban view is requested, show Kanban
  if (view === 'kanban') {

    const groups = await listLeadsByStage();
    const stages = await listStages();

    return (
      <div className="p-6 md:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Leads - Kanban</h1>
            <p className="text-sm text-gray-600 mt-1">
              Visualize e gerencie leads por estágio
            </p>
          </div>
        </div>

        {/* KPIs */}
        <LeadKpis
          totals={{
            total: Object.values(groups).flat().length,
            valorTotal: Object.values(groups).flat().reduce((acc: number, l: any) => acc + (l.value_cents || 0), 0),
            abertos: Object.values(groups).flat().filter((l: any) => !['ganho', 'perdido'].includes((l.stage || '').toLowerCase())).length,
            ganhos: Object.values(groups).flat().filter((l: any) => (l.stage || '').toLowerCase() === 'ganho').length,
          }}
        />

        {/* Modal de Importação */}
        {typeof searchParams?.open === 'string' && (searchParams?.open as string).toLowerCase() === 'import' && (
          <LeadImportModal isOpen={true} onClose={() => redirect('/control/leads?view=kanban')} />
        )}

        {/* Stage Manager Modal */}
        {typeof searchParams?.open === 'string' && (searchParams?.open as string).toLowerCase() === 'stages' && (
          <LeadStageManager isOpen={true} onClose={() => redirect('/control/leads?view=kanban')} initialStages={stages as any} />
        )}

        {/* Kanban Board */}
        <div className="mt-4">
          {(() => {
            const stageColumns = stages.map((s: any) => ({ key: s.slug, label: s.label }));
            return <KanbanBoardDnd stages={stageColumns as any} groups={groups as any} />;
          })()}
        </div>
      </div>
    );
  }

  // Default: List/Table view
  const leads = await getLeads();

  return <LeadsClientPage leads={leads} />;
}
