import { redirect } from 'next/navigation';

export default function LeadsKanbanRedirect() {
  redirect('/control/leads?view=kanban');
}
