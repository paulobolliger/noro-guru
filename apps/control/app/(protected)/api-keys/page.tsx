import PageContainer from "@/components/layout/PageContainer";
import SectionHeader from "@/components/layout/SectionHeader";
import { listApiKeys, createApiKey, revokeApiKey, loadUsageDaily } from "./actions";
import { revalidatePath } from "next/cache";

export default async function ApiKeysPage() {
  const keys = await listApiKeys();
  const usage = await loadUsageDaily();
  const usageByKey = usage.reduce((acc: Record<string, any[]>, row: any) => {
    acc[row.key_id] = acc[row.key_id] || [];
    acc[row.key_id].push(row);
    return acc;
  }, {} as Record<string, any[]>);

  async function create(formData: FormData) {
    "use server";
    const name = String(formData.get("name") || "");
    await createApiKey(name);
    revalidatePath("/api-keys");
  }

  async function revoke(formData: FormData) {
    "use server";
    const id = String(formData.get("id") || "");
    await revokeApiKey(id);
    revalidatePath("/api-keys");
  }

  return (
    <div className="container-app py-8 space-y-6">
      <PageContainer>
        <SectionHeader title="API Keys" subtitle="Crie e revogue chaves por tenant." sticky />
      </PageContainer>

      <PageContainer>
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-semibold text-primary">API Keys</h1>

          <form action={create} className="flex gap-2 items-end">
            <div className="flex flex-col">
              <label className="text-sm">Nome</label>
              <input name="name" placeholder="Ex: Visa Read" className="border border-white/10 bg-white/5 text-primary placeholder:text-primary0 px-3 py-2 rounded w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400/40" />
            </div>
            <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition">Criar</button>
          </form>

          <div className="rounded-xl bg-[#0B1220] border border-white/5 shadow-[0_1px_0_0_rgba(255,255,255,0.03)]">
            <table className="min-w-full text-sm">
              <thead className="bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent border-b border-default border-default border-white/10 backdrop-blur supports-[backdrop-filter]:bg-black/20">
                <tr>
                  <th className="text-left p-2 text-xs font-medium uppercase tracking-wide text-slate-400">Nome</th>
                  <th className="text-left p-2 text-xs font-medium uppercase tracking-wide text-slate-400">Last4</th>
                  <th className="text-left p-2 text-xs font-medium uppercase tracking-wide text-slate-400">Scope</th>
                  <th className="text-left p-2 text-xs font-medium uppercase tracking-wide text-slate-400">Expira</th>
                  <th className="text-left p-2 text-xs font-medium uppercase tracking-wide text-slate-400">Criada</th>
                  <th className="p-2 text-slate-300">Ações</th>
                </tr>
              </thead>
              <tbody>
                {keys.map((k: any) => (
                  <tr key={k.id} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="p-2 text-slate-300">{k.name}</td>
                    <td className="p-2 text-slate-300">••••{k.last4}</td>
                    <td className="p-2 text-slate-300">{Array.isArray(k.scope) ? k.scope.join(", ") : String(k.scope)}</td>
                    <td className="p-2 text-slate-300">{k.expires_at ?? "—"}</td>
                    <td className="p-2 text-slate-300">{k.created_at}</td>
                    <td className="p-2 text-right">
                      <form action={revoke}>
                        <input type="hidden" name="id" value={k.id} />
                        <button className="text-rose-400 hover:underline">Revogar</button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="space-y-3">
            <h2 className="text-xl font-medium">Uso (últimos 30 dias)</h2>
            {keys.map((k: any) => (
              <div key={k.id} className="rounded-xl bg-[#0B1220] border border-white/5 p-3">
                <div className="font-medium">{k.name} ••••{k.last4}</div>
                <div className="text-xs text-primary0">Chaves por dia (calls | avg ms | errors)</div>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                  {(usageByKey[k.id] || []).slice(0, 12).map((row: any) => (
                    <div key={row.day} className="p-2 bg-white/5 rounded border border-white/10 text-xs text-slate-300">
                      <div>{new Date(row.day).toISOString().slice(0, 10)}</div>
                      <div>calls: {row.calls}</div>
                      <div>avg: {row.avg_ms}ms</div>
                      <div>err: {row.errors}</div>
                    </div>
                  ))}
                  {!(usageByKey[k.id]?.length) && <div className="text-sm text-primary0">Sem chamadas recentes</div>}
                </div>
              </div>
            ))}
          </div>

          <div className="text-sm text-slate-400">
            <p>Obs.: a chave em texto claro aparece apenas no momento da criação. Guarde com segurança.</p>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
