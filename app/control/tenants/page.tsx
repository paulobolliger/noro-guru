import Link from "next/link";
import { supabaseServerAdmin } from "@/lib/supabase/cp";

export default async function TenantsPage() {
  const supabase = supabaseServerAdmin();
  const { data, error } = await supabase.getTenants();

  if (error) {
    return (
      <div className="p-6 text-red-400">
        Erro ao carregar tenants: {error.message}
      </div>
    );
  }

  const tenants = data ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Gerenciar Tenants</h2>
        <Link
          href="/control/tenants/new"
          className="rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-3 py-2"
        >
          Novo Tenant
        </Link>
      </div>

      {tenants.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-white/5 p-6 text-white/80">
          Nenhum tenant cadastrado ainda.
        </div>
      ) : (
        <div className="rounded-lg border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/70">
              <tr>
                <th className="px-4 py-2 text-left">Nome</th>
                <th className="px-4 py-2 text-left">Slug</th>
                <th className="px-4 py-2 text-left">Plano</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">Criado em</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((t) => (
                <tr
                  key={t.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="px-4 py-2">{t.name}</td>
                  <td className="px-4 py-2 text-white/80">{t.slug}</td>
                  <td className="px-4 py-2">{t.plan || "starter"}</td>
                  <td className="px-4 py-2">{t.status || "active"}</td>
                  <td className="px-4 py-2">
                    {new Date(t.created_at).toLocaleString("pt-BR")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

