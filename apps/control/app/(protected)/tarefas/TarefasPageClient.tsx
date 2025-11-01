"use client";
import { useState, useMemo } from "react";
import { CheckSquare, Plus, Search, Clock, CheckCircle, AlertCircle } from 'lucide-react';

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
  const [searchExpanded, setSearchExpanded] = useState(false);
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
        t.tenant_id?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [tasks, searchQuery, statusFilter]);

  return (
    <>
      {/* Header */}
      <div className="sticky top-0 z-30 mb-6">
        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 max-w-[1200px] mx-auto px-4 md:px-6 py-4 rounded-xl shadow-md"
          style={{ background: 'linear-gradient(135deg, rgba(59, 44, 164, 0.94), rgba(35, 33, 79, 0.92))' }}
        >
          <div className="flex items-center gap-3 flex-shrink-0">
            <CheckSquare size={28} className="text-[#D4AF37]" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-[#D4AF37] tracking-tight">Tarefas</h1>
              <p className="text-sm text-gray-300 mt-1">Tarefas operacionais de onboarding, suporte e renovação por tenant.</p>
            </div>
          </div>

          {/* Search + Botão Nova Tarefa */}
          <div className="flex items-center gap-2">
            {!searchExpanded && (
              <button
                onClick={() => setSearchExpanded(true)}
                className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                aria-label="Expandir busca"
              >
                <Search size={20} className="text-[#D4AF37]" />
              </button>
            )}
            {searchExpanded && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por título ou tenant..."
                  className="px-3 py-2 rounded-lg border-2 border-[#D4AF37] dark:border-[#4aede5] bg-white/10 backdrop-blur-sm text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] dark:focus:ring-[#4aede5] w-64"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearchExpanded(false);
                    setSearchQuery("");
                  }}
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  ✕
                </button>
              </div>
            )}

            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#E6C25A] hover:from-[#E6C25A] hover:to-[#D4AF37] text-[#1a1625] font-bold rounded-lg transition-all hover:scale-105 shadow-lg"
            >
              <Plus size={18} />
              <span className="hidden md:inline">Nova Tarefa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cards de Métricas */}
      <div className="mb-6 max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-50 dark:bg-[#1a1625] rounded-xl p-4 border-2 border-cyan-400 dark:border-[#4aede5] hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Total</span>
              <CheckSquare size={20} className="text-cyan-500 dark:text-[#4aede5]" />
            </div>
            <div className="text-3xl font-bold text-cyan-600 dark:text-[#4aede5]">{metrics.total}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Todas as tarefas</div>
          </div>

          <div className="bg-gray-50 dark:bg-[#1a1625] rounded-xl p-4 border-2 border-amber-400 dark:border-amber-500 hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Pendentes</span>
              <Clock size={20} className="text-amber-500" />
            </div>
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{metrics.pending}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Aguardando início</div>
          </div>

          <div className="bg-gray-50 dark:bg-[#1a1625] rounded-xl p-4 border-2 border-blue-400 dark:border-blue-500 hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Em Progresso</span>
              <AlertCircle size={20} className="text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{metrics.inProgress}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">Em andamento</div>
          </div>

          <div className="bg-gray-50 dark:bg-[#1a1625] rounded-xl p-4 border-2 border-emerald-400 dark:border-emerald-500 hover:scale-105 transition-transform shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Concluídas</span>
              <CheckCircle size={20} className="text-emerald-500" />
            </div>
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{metrics.completed}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {metrics.overdue > 0 && <span className="text-red-500">{metrics.overdue} atrasadas</span>}
              {metrics.overdue === 0 && "Finalizadas"}
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="mb-6 max-w-[1200px] mx-auto px-4 md:px-6 flex gap-2">
        {[
          { value: 'all', label: 'Todas', color: 'gray' },
          { value: 'pending', label: 'Pendentes', color: 'amber' },
          { value: 'inProgress', label: 'Em Progresso', color: 'blue' },
          { value: 'completed', label: 'Concluídas', color: 'emerald' },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setStatusFilter(filter.value)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              statusFilter === filter.value
                ? `bg-${filter.color}-500 text-white shadow-lg scale-105`
                : `bg-gray-100 dark:bg-[#1a1625] text-gray-600 dark:text-gray-400 border-2 border-gray-300 dark:border-gray-600 hover:border-${filter.color}-400`
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Tabela */}
      <div className="border-2 border-[#D4AF37] dark:border-[#4aede5] rounded-xl shadow-lg overflow-hidden max-w-[1200px] mx-auto px-4 md:px-6">
        <div className="overflow-auto">
          <table className="w-full text-sm bg-white dark:bg-[#1a1625]">
            <thead className="bg-gradient-to-b from-gray-100 dark:from-indigo-500/10 via-gray-50 dark:via-purple-500/5 to-transparent border-b-2 border-[#D4AF37] dark:border-[#4aede5]">
              <tr>
                <th className="text-left px-4 md:px-6 py-3 font-bold text-[#D4AF37] uppercase tracking-wide text-xs">Título</th>
                <th className="text-left px-4 md:px-6 py-3 font-bold text-[#D4AF37] uppercase tracking-wide text-xs">Status</th>
                <th className="text-left px-4 md:px-6 py-3 font-bold text-[#D4AF37] uppercase tracking-wide text-xs">Tenant</th>
                <th className="text-left px-4 md:px-6 py-3 font-bold text-[#D4AF37] uppercase tracking-wide text-xs">Vencimento</th>
                <th className="text-left px-4 md:px-6 py-3 font-bold text-[#D4AF37] uppercase tracking-wide text-xs">Criada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {filteredTasks.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 md:px-6 py-3 font-medium text-gray-900 dark:text-white">{t.title}</td>
                  <td className="px-4 md:px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      (t.status === 'completed' || t.status === 'done')
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : (t.status === 'in_progress' || t.status === 'doing')
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 md:px-6 py-3 text-gray-700 dark:text-gray-300">{t.tenant_id || '—'}</td>
                  <td className="px-4 md:px-6 py-3 text-gray-700 dark:text-gray-300">
                    {t.due_date ? new Date(t.due_date).toLocaleDateString('pt-BR') : '—'}
                  </td>
                  <td className="px-4 md:px-6 py-3 text-gray-700 dark:text-gray-300">
                    {new Date(t.created_at).toLocaleDateString('pt-BR')}
                  </td>
                </tr>
              ))}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-gray-600 dark:text-gray-400">
                    {searchQuery || statusFilter !== 'all' 
                      ? 'Nenhuma tarefa encontrada com os filtros aplicados.' 
                      : 'Nenhuma tarefa cadastrada.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Criar Tarefa */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1a1625] rounded-xl shadow-2xl border-2 border-[#D4AF37] dark:border-[#4aede5] w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b-2 border-[#D4AF37] dark:border-[#4aede5] bg-gradient-to-b from-gray-100 dark:from-indigo-500/10 via-gray-50 dark:via-purple-500/5 to-transparent">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckSquare size={24} className="text-[#D4AF37]" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Nova Tarefa</h2>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
                >
                  ✕
                </button>
              </div>
            </div>

            <form action={createAction} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Título *
                </label>
                <input
                  name="title"
                  placeholder="Ex: Configurar ambiente do cliente"
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] dark:focus:ring-[#4aede5]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tenant ID
                  </label>
                  <input
                    name="tenant_id"
                    placeholder="ID do tenant"
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] dark:focus:ring-[#4aede5]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Data de Vencimento
                  </label>
                  <input
                    type="date"
                    name="due_date"
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#D4AF37] dark:focus:ring-[#4aede5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tipo de Entidade
                  </label>
                  <input
                    name="entity_type"
                    placeholder="Ex: lead, support_ticket"
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] dark:focus:ring-[#4aede5]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    ID da Entidade
                  </label>
                  <input
                    name="entity_id"
                    placeholder="ID da entidade relacionada"
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-transparent text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] dark:focus:ring-[#4aede5]"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-[#D4AF37] to-[#E6C25A] hover:from-[#E6C25A] hover:to-[#D4AF37] text-[#1a1625] font-bold rounded-lg transition-all hover:scale-105 shadow-lg"
                  onClick={() => setShowCreateModal(false)}
                >
                  Criar Tarefa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
