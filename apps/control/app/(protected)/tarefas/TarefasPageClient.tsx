"use client";
import { useState, useMemo } from "react";
import { CheckSquare, Plus, Search, Clock, CheckCircle, AlertCircle, X, Calendar } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  status: string;
  tenant_id?: string;
  due_date?: string;
  created_at: string;
  entity_type?: string;
  entity_id?: string;
}

interface TarefasPageClientProps {
  tasks: Task[];
  createAction: (formData: FormData) => Promise<void>;
}

export default function TarefasPageClient({ tasks, createAction }: TarefasPageClientProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Calcular métricas
  const metrics = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === 'pending' || t.status === 'todo').length;
    const inProgress = tasks.filter(t => t.status === 'in_progress' || t.status === 'doing').length;
    const completed = tasks.filter(t => t.status === 'completed' || t.status === 'done').length;

    const now = new Date();
    const overdue = tasks.filter(t => {
      if (!t.due_date) return false;
      const dueDate = new Date(t.due_date);
      return dueDate < now && t.status !== 'completed' && t.status !== 'done';
    }).length;

    return { total, pending, inProgress, completed, overdue };
  }, [tasks]);

  // Filtrar dados
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(t => {
        if (statusFilter === "pending") return t.status === 'pending' || t.status === 'todo';
        if (statusFilter === "inProgress") return t.status === 'in_progress' || t.status === 'doing';
        if (statusFilter === "completed") return t.status === 'completed' || t.status === 'done';
        return true;
      });
    }

    // Filtro por busca
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(t =>
        t.title.toLowerCase().includes(query) ||
        (t.tenant_id || '').toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tasks, searchQuery, statusFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-heading flex items-center gap-2">
            <CheckSquare className="text-primary" size={24} />
            Tarefas
          </h2>
          <p className="text-sm text-secondary mt-1">Tarefas operacionais de onboarding, suporte e renovação por tenant.</p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Total</span>
            <CheckSquare size={18} className="text-primary" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-heading">{metrics.total}</span>
            <span className="text-xs text-secondary">tarefas</span>
          </div>
        </div>

        {/* Pending */}
        <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Pendentes</span>
            <Clock size={18} className="text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-heading">{metrics.pending}</span>
            <span className="text-xs text-secondary">aguardando</span>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Em Progresso</span>
            <AlertCircle size={18} className="text-blue-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-heading">{metrics.inProgress}</span>
            <span className="text-xs text-secondary">andamento</span>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-secondary uppercase tracking-wider">Concluídas</span>
            <CheckCircle size={18} className="text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-heading">{metrics.completed}</span>
            <span className={`text-xs font-medium ${metrics.overdue > 0 ? 'text-red-500' : 'text-secondary'}`}>
              {metrics.overdue > 0 ? `${metrics.overdue} atrasadas` : 'finalizadas'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="space-y-6">
        {/* Toolbar */}
        <div className="flex flex-col md:flex-row gap-4 justify-between md:items-center bg-surface-card p-4 rounded-xl border border-default shadow-sm">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 text-tertiary" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por título ou tenant..."
              className="w-full pl-10 pr-4 py-2 bg-surface-base border border-default rounded-lg text-heading text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-tertiary"
            />
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex bg-surface-base rounded-lg p-1 border border-default">
              {[
                { value: 'all', label: 'Todas' },
                { value: 'pending', label: 'Pendentes' },
                { value: 'inProgress', label: 'Em Progresso' },
                { value: 'completed', label: 'Concluídas' },
              ].map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setStatusFilter(filter.value)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${statusFilter === filter.value
                      ? 'bg-white text-primary shadow-sm'
                      : 'text-secondary hover:text-heading'
                    }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm whitespace-nowrap"
            >
              <Plus size={16} />
              <span>Nova Tarefa</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-card border border-default rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-base border-b border-default text-xs uppercase text-secondary font-semibold tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-left">Título</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Tenant</th>
                  <th className="px-6 py-4 text-left pl-10">Vencimento</th>
                  <th className="px-6 py-4 text-right">Criada em</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-default">
                {filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-surface-base/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-heading">{t.title}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${(t.status === 'completed' || t.status === 'done')
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : (t.status === 'in_progress' || t.status === 'doing')
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${(t.status === 'completed' || t.status === 'done') ? 'bg-emerald-500' :
                            (t.status === 'in_progress' || t.status === 'doing') ? 'bg-blue-500' : 'bg-amber-500'
                          }`}></span>
                        {t.status === 'in_progress' ? 'Em Progresso' : t.status === 'pending' ? 'Pendente' : 'Concluída'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-secondary">{t.tenant_id || '—'}</td>
                    <td className="px-6 py-4 text-secondary">
                      {t.due_date ? (
                        <div className="flex items-center gap-2">
                          <Calendar size={14} className="text-tertiary" />
                          <span>{new Date(t.due_date).toLocaleDateString('pt-BR')}</span>
                        </div>
                      ) : '—'}
                    </td>
                    <td className="px-6 py-4 text-right text-tertiary">
                      {new Date(t.created_at).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-secondary">
                      <CheckSquare size={32} className="mx-auto mb-2 opacity-20" />
                      Nenhuma tarefa encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Criar Tarefa */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-surface-card rounded-xl shadow-2xl border border-default w-full max-w-lg mx-4">
            <div className="p-5 border-b border-default flex justify-between items-center">
              <h3 className="text-lg font-bold text-heading">Nova Tarefa</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-secondary hover:text-heading transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form action={createAction} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                  Título *
                </label>
                <input
                  name="title"
                  placeholder="Ex: Configurar ambiente do cliente"
                  required
                  className="w-full px-3 py-2 bg-surface-base border border-default rounded-lg text-heading text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-tertiary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                    Tenant ID
                  </label>
                  <input
                    name="tenant_id"
                    placeholder="Opcional"
                    className="w-full px-3 py-2 bg-surface-base border border-default rounded-lg text-heading text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-tertiary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                    Vencimento
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    className="w-full px-3 py-2 bg-surface-base border border-default rounded-lg text-heading text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                    Tipo Entidade
                  </label>
                  <input
                    name="entity_type"
                    placeholder="Ex: lead"
                    className="w-full px-3 py-2 bg-surface-base border border-default rounded-lg text-heading text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-tertiary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-secondary uppercase tracking-wider mb-1.5">
                    ID Entidade
                  </label>
                  <input
                    name="entity_id"
                    placeholder="ID relacionado"
                    className="w-full px-3 py-2 bg-surface-base border border-default rounded-lg text-heading text-sm focus:ring-2 focus:ring-primary focus:border-primary transition-all placeholder:text-tertiary"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-default mt-4 relative">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-default text-secondary font-medium rounded-lg hover:bg-surface-base transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 btn-primary font-medium rounded-lg shadow-sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  Criar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
