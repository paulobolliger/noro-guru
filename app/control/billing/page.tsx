import { supabaseServerAdmin } from "@/lib/supabase/cp";

type TenantRow = {
  id: string;
  name: string;
  slug: string;
  plan: string | null;
  status: keyof typeof statusColors | string | null;
  billing_email: string | null;
  next_invoice_date: string | null;
};

const statusColors = {
  active: "bg-green-500 text-white",
  paused: "bg-yellow-500 text-black",
  cancelled: "bg-red-500 text-white",
} as const;

export default async function BillingPage() {
  const supabase = supabaseServerAdmin();
  const { data: tenants, error } = await supabase.getTenants();

  if (error) {
    return (
      <div className="p-6 text-red-400">
        Erro ao carregar dados de billing: {error.message}
      </div>
    );
  }

  return (
    <div className="text-white">
      <h1 className="text-3xl font-semibold mb-6">Painel de Billing</h1>
      <div className="rounded-lg border border-white/10 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left bg-white/5">
              <th className="py-2 px-4">Nome</th>
              <th className="py-2 px-4">Slug</th>
              <th className="py-2 px-4">Plano</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">E-mail de Cobranca</th>
              <th className="py-2 px-4">Proxima Fatura</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody>
            {tenants?.map((t: TenantRow) => (
              <tr key={t.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="py-2 px-4">{t.name}</td>
                <td className="py-2 px-4 text-white/80">{t.slug}</td>
                <td className="py-2 px-4">{t.plan || "starter"}</td>
                <td className="py-2 px-4">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      statusColors[t.status as keyof typeof statusColors] ||
                      "bg-gray-600 text-white"
                    }`}
                  >
                    {t.status || "active"}
                  </span>
                </td>
                <td className="py-2 px-4">{t.billing_email || "-"}</td>
                <td className="py-2 px-4">
                  {t.next_invoice_date
                    ? new Date(t.next_invoice_date).toLocaleDateString("pt-BR")
                    : "-"}
                </td>
                <td className="py-2 px-4 text-right">
                  <button className="text-indigo-400 hover:underline">
                    Ver Detalhes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

