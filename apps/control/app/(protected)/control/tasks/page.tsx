import { listTasks, createTask } from "./actions";
import SectionHeader from '@/components/layout/SectionHeader';

export default async function TasksPage() {
  const tasks = await listTasks();
  async function create(formData: FormData) { "use server"; await createTask(formData); }
  return (
    <div className="container-app py-8 space-y-6">
      <SectionHeader 
        title="Tarefas (Control)" 
        subtitle="Tarefas de onboarding/suporte/renovação por tenant."
      />
      <form action={create} className="grid grid-cols-1 md:grid-cols-6 gap-2">
        <input name="title" placeholder="Título" className="border px-3 py-2 rounded md:col-span-2" />
        <input name="tenant_id" placeholder="Tenant ID (opcional)" className="border px-3 py-2 rounded" />
        <input type="date" name="due_date" className="border px-3 py-2 rounded" />
        <input name="entity_type" placeholder="Entidade (opcional)" className="border px-3 py-2 rounded" />
        <input name="entity_id" placeholder="Entidade ID" className="border px-3 py-2 rounded" />
        <button className="btn-primary px-4 py-2 rounded shadow-card">Adicionar</button>
      </form>

      <div className="border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              <th className="text-left p-2">Título</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Tenant</th>
              <th className="text-left p-2">Vencimento</th>
              <th className="text-left p-2">Criada</th>
            </tr>
          </thead>
          <tbody>
            {(tasks ?? []).map((t: any) => (
              <tr key={t.id} className="border-t">
                <td className="p-2">{t.title}</td>
                <td className="p-2">{t.status}</td>
                <td className="p-2">{t.tenant_id || '—'}</td>
                <td className="p-2">{t.due_date || '—'}</td>
                <td className="p-2">{t.created_at}</td>
              </tr>
            ))}
            {!tasks?.length && <tr><td className="p-3 text-muted" colSpan={5}>Sem tarefas</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
