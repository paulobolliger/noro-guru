import { supabaseServerAdmin } from "@/lib/supabase/cp";

const statusColors: Record<string, string> = {
  active: "bg-green-500 text-white",
  paused: "bg-yellow-500 text-black",
  cancelled: "bg-red-500 text-white",
};

type DashboardRow = {
  tenant_id: string;
  tenant_name: string;
  plan: string | null;
  status: string | null;
  total_users: number;
  total_events: number;
  last_event_at: string | null;
};

export default async function DashboardPage() {
  const supabase = supabaseServerAdmin();
  const { data, error } = await supabase.getDashboardOverview();

  if (error) {
    return (
      <div className="p-8 text-red-400">Erro ao carregar Dashboard: {error.message}</div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="p-8 text-white/70">Nenhum dado encontrado.</div>;
  }

  return (
    <div className="p-8 text-white space-y-8">
      <h1 className="text-3xl font-semibold mb-6">Visao Geral do Sistema</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((t: DashboardRow) => (
          <div
            key={t.tenant_id}
            className="rounded-xl border border-white/10 bg-white/5 p-5 hover:bg-white/10 transition"
          >
            <h2 className="text-lg font-semibold mb-1">{t.tenant_name}</h2>
            <span
              className={`px-2 py-1 text-xs rounded ${
                statusColors[t.status || ""] || "bg-gray-500"
              }`}
            >
              {t.status || "indefinido"}
            </span>
            <p className="mt-3 text-sm">Plano: {t.plan || "-"}</p>
            <div className="mt-4 text-sm space-y-1">
              <p>Usuarios: <span className="font-semibold">{t.total_users}</span></p>
              <p>Eventos: <span className="font-semibold">{t.total_events}</span></p>
              <p>
                Ultimo evento:{" "}
                {t.last_event_at
                  ? new Date(t.last_event_at).toLocaleString("pt-BR")
                  : "Sem registros"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
