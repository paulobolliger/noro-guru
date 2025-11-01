import { listTasks, createTask } from "./actions";
import { revalidatePath } from "next/cache";
import TarefasPageClient from './TarefasPageClient';

export default async function TasksPage() {
  const tasks = await listTasks();
  
  async function create(formData: FormData) {
    "use server";
    await createTask(formData);
    revalidatePath('/tarefas');
  }

  return <TarefasPageClient tasks={tasks || []} createAction={create} />;
}
