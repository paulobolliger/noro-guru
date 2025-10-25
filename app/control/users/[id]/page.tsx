import { supabaseServerAdmin } from "@/lib/supabase/cp";
import { addMembership, removeMembership } from "./actions";

export default async function UserDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const supabase = supabaseServerAdmin() as any;

  const [
    { data: userData, error: userErr },
    { data: memberships, error: memErr },
    { data: tenantsData }
  ] = await Promise.all([
    supabase.getUser(id),
    supabase.listUserMemberships(id),
    supabase.getTenants(),
  ]);

  if (userErr) {
    return <div className="p-6 text-red-400">Erro ao carregar usuário: {userErr.message}</div>;
  }
  if (memErr) {
    return <div className="p-6 text-red-400">Erro ao carregar memberships: {memErr.message}</div>;
  }

  const u = userData?.[0];
  if (!u) return <div className="p-6 text-white/70">Usuário não encontrado.</div>;

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-2xl font-semibold">Usuário</h1>
        <p className="text-white/80">{u.email}</p>
        <div className="mt-2 text-sm text-white/70">
          <p>Criado em: {u.created_at ? new Date(u.created_at).toLocaleString("pt-BR") : "-"}</p>
          <p>Último login: {u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleString("pt-BR") : "-"}</p>
          <p>Tenants vinculados: {u.tenants_count ?? 0}</p>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-white/70">
            <tr>
              <th className="px-4 py-2 text-left">Tenant</th>
              <th className="px-4 py-2 text-left">Slug</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2"></th>
            </tr>
          </thead>
          <tbody>
            {memberships?.map((m: any) => (
              <tr key={`${m.tenant_id}`} className="border-t border-white/10">
                <td className="px-4 py-2">{m.tenant_name}</td>
                <td className="px-4 py-2 text-white/80">{m.tenant_slug}</td>
                <td className="px-4 py-2">{m.role}</td>
                <td className="px-4 py-2 text-right">
                  <form action={removeMembership}>
                    <input type="hidden" name="user_id" value={id} />
                    <input type="hidden" name="tenant_id" value={m.tenant_id} />
                    <button className="text-red-400 hover:underline">Remover</button>
                  </form>
                </td>
              </tr>
            ))}
            {(!memberships || memberships.length === 0) && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-center text-white/70">Nenhum vínculo encontrado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg border border-white/10 p-4">
        <h2 className="font-semibold mb-3">Adicionar vínculo</h2>
        <form action={addMembership} className="flex flex-wrap items-center gap-3">
          <input type="hidden" name="user_id" value={id} />
          <select name="tenant_id" className="px-3 py-2 rounded bg-white/10 border border-white/10 text-sm">
            <option value="">Selecione um tenant</option>
            {tenantsData?.map((t: any) => (
              <option key={t.id} value={t.id}>{t.name} ({t.slug})</option>
            ))}
          </select>
          <select name="role" className="px-3 py-2 rounded bg-white/10 border border-white/10 text-sm">
            <option value="">Selecione o papel</option>
            <option value="owner">owner</option>
            <option value="admin">admin</option>
            <option value="member">member</option>
            <option value="viewer">viewer</option>
          </select>
          <button className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-sm">Adicionar</button>
        </form>
      </div>
    </div>
  );
}
