import Link from "next/link";
import { supabaseServerAdmin } from "@/lib/supabase/cp";

type SearchParams = {
  search?: string;
  page?: string;
};

export default async function UsersPage({ searchParams }: { searchParams?: SearchParams }) {
  const supabase = supabaseServerAdmin();
  const page = Number(searchParams?.page ?? 1) || 1;
  const limit = 20;
  const offset = (page - 1) * limit;
  const search = (searchParams?.search || "").trim() || undefined;

  const { data, error } = await (supabase as any).listUsers({ search, limit, offset });
  if (error) {
    return <div className="p-6 text-red-400">Erro ao carregar usuários: {error.message}</div>;
  }

  const users = data ?? [];
  const total = users.length > 0 ? users[0].total_count ?? 0 : 0;
  const pageCount = Math.max(1, Math.ceil((total || 0) / limit));
  const prevPage = Math.max(page - 1, 1);
  const nextPage = Math.min(page + 1, pageCount);

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Usuários</h1>
        <form className="flex items-center gap-2" method="get">
          <input
            type="text"
            name="search"
            defaultValue={search || ""}
            placeholder="Buscar por email..."
            className="px-3 py-2 rounded bg-white/10 border border-white/10 text-sm"
          />
          <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm">Buscar</button>
        </form>
      </div>

      <div className="rounded-lg border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Criado em</th>
              <th className="px-4 py-2 text-left">Último login</th>
              <th className="px-4 py-2 text-left">Tenants</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr key={u.id} className="border-t border-white/10 hover:bg-white/5">
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">{u.created_at ? new Date(u.created_at).toLocaleString("pt-BR") : "-"}</td>
                <td className="px-4 py-2">{u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString("pt-BR") : "-"}</td>
                <td className="px-4 py-2">{u.tenants_count ?? 0}</td>
                <td className="px-4 py-2 text-right">
                  <Link href={`/control/users/${u.id}`} className="text-indigo-400 hover:underline">Ver</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <div className="text-white/70">
          {total > 0 ? (
            <span>
              Mostrando {offset + 1}–{Math.min(offset + limit, total)} de {total}
            </span>
          ) : (
            <span>Nenhum registro</span>
          )}
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Link
            href={`/control/users?search=${encodeURIComponent(search || "")}&page=${prevPage}`}
            className={`px-3 py-2 rounded border ${page > 1 ? "bg-white/10 border-white/10" : "bg-white/5 border-white/5 text-white/40 pointer-events-none"}`}
          >
            Anterior
          </Link>
          <span className="text-white/70">Página {page} de {pageCount}</span>
          <Link
            href={`/control/users?search=${encodeURIComponent(search || "")}&page=${nextPage}`}
            className={`px-3 py-2 rounded border ${(page < pageCount) ? "bg-white/10 border-white/10" : "bg-white/5 border-white/5 text-white/40 pointer-events-none"}`}
          >
            Próxima
          </Link>
        </div>
      </div>
    </div>
  );
}
