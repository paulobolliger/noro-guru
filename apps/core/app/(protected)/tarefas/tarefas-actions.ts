'use server';

const message = 'Ação legada desativada: o modelo de dados legado deste recurso foi desativado.';

export interface Tarefa {
  id: string;
  titulo: string;
  descricao?: string | null;
  status: 'pendente' | 'em_andamento' | 'concluida' | 'cancelada' | string;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente' | string;
  data_vencimento?: string | null;
}

export async function getTarefas(..._args: unknown[]): Promise<any> {
  return [];
}

export async function createTarefa(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function updateTarefaStatus(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}

export async function deleteTarefa(..._args: unknown[]): Promise<any> {
  return { success: false, message };
}
