import { DollarSign, CheckSquare } from "lucide-react";
import { getBspDataAction, switchTenantAction } from "./actions";
import BspDashboardClient from "./BspDashboardClient";

export const dynamic = "force-dynamic";

export default async function BspPage() {
  const data = await getBspDataAction();

  if (!data.success) {
    return (
      <div className="p-6 md:p-8 space-y-6">
        <div className="surface-card rounded-lg p-6 text-center border border-red-200 bg-red-50/50">
          <h2 className="text-lg font-semibold text-red-700">Erro ao Carregar BSP</h2>
          <p className="text-sm text-red-600 mt-2">{data.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-heading flex items-center gap-2">
            <CheckSquare className="text-primary" size={24} />
            Conciliação BSP & Disputas
          </h2>
          <p className="text-sm text-secondary mt-1">
            Faturamento de bilhetes aéreos IATA, arquivos de retorno e gestão de ADMs/ACMs.
          </p>
        </div>
      </div>

      <BspDashboardClient
        tenants={data.tenants || []}
        activeTenantId={data.activeTenantId || ""}
        ingestions={data.ingestions || []}
        records={data.records || []}
        memos={data.memos || []}
        suppliers={data.suppliers || []}
        onTenantChange={switchTenantAction}
      />
    </div>
  );
}
