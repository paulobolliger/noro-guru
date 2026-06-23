"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Shield, Settings, CheckCircle2, AlertTriangle, KeyRound, Loader2, X, Calendar } from "lucide-react";
import { updatePartnerAction } from "./actions";
import { useToast } from "@ui/use-toast";

interface Partner {
  id: string;
  companyName: string;
  document: string;
  status: "pending_approval" | "active" | "suspended";
  rateLimitPerMinute: number;
  createdAt: string;
  updatedAt: string;
  expiresAt: string | null;
}

interface Props {
  initialPartners: Partner[];
  query?: string;
}

export default function PartnersClient({ initialPartners, query = "" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [searchVal, setSearchVal] = useState(query);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);

  // Modal edit states
  const [rateLimit, setRateLimit] = useState<number>(60);
  const [expiresAt, setExpiresAt] = useState<string>("");
  const [hasExpiry, setHasExpiry] = useState<boolean>(false);
  const [status, setStatus] = useState<"pending_approval" | "active" | "suspended">("pending_approval");

  const handleSearch = (q: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleStatusChange = (partner: Partner, newStatus: "active" | "suspended") => {
    startTransition(async () => {
      const res = await updatePartnerAction(partner.id, {
        status: newStatus,
        rateLimitPerMinute: partner.rateLimitPerMinute,
        expiresAt: partner.expiresAt,
      });

      if (res.success) {
        toast({
          title: "Status Atualizado",
          description: `Parceiro ${partner.companyName} está agora ${
            newStatus === "active" ? "ATIVO" : "SUSPENSO"
          }.`,
          variant: "default",
        });
      } else {
        toast({
          title: "Erro ao atualizar status",
          description: res.error || "Ocorreu um erro.",
          variant: "destructive",
        });
      }
    });
  };

  const openSettingsModal = (partner: Partner) => {
    setEditingPartner(partner);
    setRateLimit(partner.rateLimitPerMinute);
    setStatus(partner.status);
    if (partner.expiresAt) {
      setHasExpiry(true);
      setExpiresAt(partner.expiresAt.substring(0, 10)); // Format YYYY-MM-DD
    } else {
      setHasExpiry(false);
      setExpiresAt("");
    }
  };

  const handleSaveSettings = () => {
    if (!editingPartner) return;

    startTransition(async () => {
      const res = await updatePartnerAction(editingPartner.id, {
        status,
        rateLimitPerMinute: rateLimit,
        expiresAt: hasExpiry && expiresAt ? expiresAt : null,
      });

      if (res.success) {
        toast({
          title: "Configurações Salvas",
          description: `Configurações do parceiro ${editingPartner.companyName} atualizadas.`,
          variant: "default",
        });
        setEditingPartner(null);
      } else {
        toast({
          title: "Erro ao salvar",
          description: res.error || "Ocorreu um erro ao salvar as alterações.",
          variant: "destructive",
        });
      }
    });
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <KeyRound className="text-[#D4AF37] dark:text-[#4aede5]" size={28} />
            Parceiros API B2B
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Controle e audite o acesso de parceiros externos consumindo as APIs de vistos do Noro Guru.
          </p>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="bg-white dark:bg-[#1e1a2f] border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por Empresa ou CNPJ/CPF..."
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                handleSearch(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-white/10 bg-transparent rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Partners Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10 shadow-lg bg-white dark:bg-[#1a1625]">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-indigo-950/20 border-b border-gray-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Empresa</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Documento</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Criado em</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Expiração</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Rate Limit</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-right font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/10">
            {initialPartners.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  Nenhum parceiro B2B cadastrado no sistema.
                </td>
              </tr>
            ) : (
              initialPartners.map((partner) => {
                let badgeClass = "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20";
                let statusLabel = "Pendente";

                if (partner.status === "active") {
                  badgeClass = "bg-green-500/10 text-green-500 border border-green-500/20";
                  statusLabel = "Ativo";
                } else if (partner.status === "suspended") {
                  badgeClass = "bg-red-500/10 text-red-500 border border-red-500/20";
                  statusLabel = "Suspenso";
                }

                return (
                  <tr key={partner.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">
                      {partner.companyName}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300 font-mono text-xs">
                      {partner.document}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {new Date(partner.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">
                      {partner.expiresAt ? (
                        <span className="flex items-center gap-1 text-xs">
                          <Calendar size={14} className="text-gray-400" />
                          {new Date(partner.expiresAt).toLocaleDateString("pt-BR")}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Sem expiração</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                      <span className="font-semibold">{partner.rateLimitPerMinute}</span> req/min
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${badgeClass}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {partner.status !== "active" && (
                          <button
                            disabled={isPending}
                            onClick={() => handleStatusChange(partner, "active")}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-green-600/10 hover:bg-green-600/20 text-green-500 font-semibold rounded-lg transition-colors"
                            title="Aprovar / Ativar Parceiro"
                          >
                            <CheckCircle2 size={14} /> Ativar
                          </button>
                        )}
                        {partner.status === "active" && (
                          <button
                            disabled={isPending}
                            onClick={() => handleStatusChange(partner, "suspended")}
                            className="flex items-center gap-1 px-2.5 py-1 text-xs bg-red-600/10 hover:bg-red-600/20 text-red-500 font-semibold rounded-lg transition-colors"
                            title="Suspender Acesso"
                          >
                            <AlertTriangle size={14} /> Suspender
                          </button>
                        )}
                        <button
                          onClick={() => openSettingsModal(partner)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-indigo-600 dark:text-[#4aede5] transition-colors"
                          title="Configurar limites"
                        >
                          <Settings size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Settings Modal */}
      {editingPartner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white dark:bg-[#1a1625] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-indigo-950/20 border-b border-gray-200 dark:border-white/10">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Limites: {editingPartner.companyName}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">Configuração de taxas e validade</p>
              </div>
              <button
                onClick={() => setEditingPartner(null)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              {/* Status Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Status da Conta
                </label>
                <select
                  value={status}
                  onChange={(e: any) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1625] rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="pending_approval">Pendente de Aprovação</option>
                  <option value="active">Ativo</option>
                  <option value="suspended">Suspenso</option>
                </select>
              </div>

              {/* Rate Limit */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Taxa Limite (Chamadas por Minuto)
                </label>
                <input
                  type="number"
                  value={rateLimit}
                  onChange={(e) => setRateLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-transparent rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: 60"
                  min={1}
                />
              </div>

              {/* Expiry config */}
              <div className="space-y-2 border-t border-gray-200 dark:border-white/10 pt-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasExpiry}
                    onChange={(e) => {
                      setHasExpiry(e.target.checked);
                      if (!e.target.checked) setExpiresAt("");
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Definir Data de Expiração
                  </span>
                </label>

                {hasExpiry && (
                  <div>
                    <input
                      type="date"
                      value={expiresAt}
                      onChange={(e) => setExpiresAt(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1625] rounded-lg text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-indigo-950/20 border-t border-gray-200 dark:border-white/10">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setEditingPartner(null)}
                className="px-4 py-2 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleSaveSettings}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isPending && <Loader2 className="animate-spin" size={16} />}
                Salvar Configurações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
