import { addNote, getOrg, listNotes, createContact, deleteContact, updateContact } from "./actions";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export default async function OrgDetail({ params }: { params: { id: string } }) {
  const org = await getOrg(params.id);
  const notes = await listNotes(params.id);
  const supabase = createAdminSupabaseClient();
  const { data: contacts } = await supabase.schema('cp').from('contacts').select('*').eq('tenant_id', params.id).order('is_primary', { ascending: false });

  async function create(formData: FormData) {
    "use server";
    await addNote(formData);
  }

  async function addContact(formData: FormData) { "use server"; await createContact(formData); }
  async function delContact(formData: FormData) { "use server"; await deleteContact(formData); }
  async function updContact(formData: FormData) { "use server"; await updateContact(formData); }

  return (
    <div className="container-app py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{org?.name || 'Organização'}</h1>
        <p className="text-muted">Slug: {org?.slug} • Plano: {org?.plan || '—'} • Status: {org?.status || '—'}</p>
      </div>

      <form action={create} className="flex gap-2">
        <input type="hidden" name="tenant_id" value={params.id} />
        <input name="content" placeholder="Adicionar nota" className="border px-3 py-2 rounded w-full" />
        <button className="btn-primary px-4 py-2 rounded shadow-card">Salvar</button>
      </form>

      <div className="border rounded">
        <div className="p-3 border-b border-default border-default bg-white/5 font-medium">Contatos</div>
        <form action={addContact} className="p-3 flex flex-wrap gap-2 border-b">
          <input type="hidden" name="tenant_id" value={params.id} />
          <input name="name" placeholder="Nome" className="border px-3 py-2 rounded" />
          <input name="email" placeholder="Email" className="border px-3 py-2 rounded" />
          <input name="phone" placeholder="Telefone" className="border px-3 py-2 rounded" />
          <input name="role" placeholder="Papel" className="border px-3 py-2 rounded" />
          <label className="text-sm flex items-center gap-1"><input type="checkbox" name="is_primary" /> Principal</label>
          <button className="btn-primary px-3 py-2 rounded shadow-card">Adicionar</button>
        </form>
        <table className="min-w-full text-sm">
          <thead className="bg-white/5"><tr><th className="text-left p-2">Nome</th><th className="text-left p-2">Email</th><th className="text-left p-2">Telefone</th><th className="text-left p-2">Papel</th><th className="text-left p-2">Principal</th></tr></thead>
          <tbody>
            {(contacts ?? []).map((c: any) => (
              <tr key={c.id} className="border-t">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.email || '—'}</td>
                <td className="p-2">{c.phone || '—'}</td>
                <td className="p-2">{c.role || '—'}</td>
                <td className="p-2">{c.is_primary ? 'Sim' : '—'}</td>
                <td className="p-2 text-right">
                  <form action={updContact} className="inline-flex gap-1">
                    <input type="hidden" name="id" value={c.id} />
                    <input name="email" defaultValue={c.email || ''} className="border px-2 py-1 rounded w-40" />
                    <input name="phone" defaultValue={c.phone || ''} className="border px-2 py-1 rounded w-32" />
                    <input name="role" defaultValue={c.role || ''} className="border px-2 py-1 rounded w-32" />
                    <label className="text-xs flex items-center gap-1"><input type="checkbox" name="is_primary" defaultChecked={c.is_primary} /> Principal</label>
                    <button className="text-xs bg-yellow-500 text-white px-2 py-1 rounded">Salvar</button>
                  </form>
                  <form action={delContact} className="inline">
                    <input type="hidden" name="id" value={c.id} />
                    <button className="text-xs text-red-600 hover:underline ml-2">Remover</button>
                  </form>
                </td>
              </tr>
            ))}
            {!contacts?.length && <tr><td className="p-3 text-muted" colSpan={5}>Sem contatos</td></tr>}
          </tbody>
        </table>
      </div>

      <div className="border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5"><tr><th className="text-left p-2">Nota</th><th className="text-left p-2">Quando</th></tr></thead>
          <tbody>
            {(notes ?? []).map((n: any) => (
              <tr key={n.id} className="border-t">
                <td className="p-2">{n.content}</td>
                <td className="p-2">{n.created_at}</td>
              </tr>
            ))}
            {!notes?.length && <tr><td className="p-3 text-muted" colSpan={2}>Sem notas</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
