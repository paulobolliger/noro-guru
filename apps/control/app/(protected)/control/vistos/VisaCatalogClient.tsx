"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search, Edit2, ExternalLink, Globe, Check, X, Loader2, Info } from "lucide-react";
import { updateVisaRuleAction } from "./actions";
import { useToast } from "@ui/use-toast";

interface VisaRule {
  id: string;
  country: string;
  countryCode: string;
  flagEmoji: string | null;
  region: string | null;
  continent: string | null;
  allowedStayDays: number | null;
  isVisaExempt: boolean;
  visaOnArrival: boolean;
  eVisaAvailable: boolean;
  travelInsuranceRequired: boolean;
  financialProofRequired: boolean;
  minBankBalanceUsd: number | null;
  consulateBookingUrl: string | null;
  officialVisaLink: string | null;
  healthInfo: { vaccines?: string; notes?: string } | null;
  dataSource: string | null;
  lastVerified: string | null;
}

interface Props {
  initialRules: VisaRule[];
  query?: string;
  continent?: string;
}

const CONTINENTS = [
  { value: "", label: "Todos os Continentes" },
  { value: "América do Norte", label: "América do Norte" },
  { value: "América do Sul", label: "América do Sul" },
  { value: "Europa", label: "Europa" },
  { value: "Ásia", label: "Ásia" },
  { value: "África", label: "África" },
  { value: "Oceania", label: "Oceania" },
];

export default function VisaCatalogClient({ initialRules, query = "", continent = "" }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [searchVal, setSearchVal] = useState(query);
  const [continentVal, setContinentVal] = useState(continent);
  const [editingRule, setEditingRule] = useState<VisaRule | null>(null);

  // Form states for the modal
  const [allowedStayDays, setAllowedStayDays] = useState<string>("");
  const [isVisaExempt, setIsVisaExempt] = useState(false);
  const [visaOnArrival, setVisaOnArrival] = useState(false);
  const [eVisaAvailable, setEVisaAvailable] = useState(false);
  const [travelInsuranceRequired, setTravelInsuranceRequired] = useState(false);
  const [financialProofRequired, setFinancialProofRequired] = useState(false);
  const [minBankBalanceUsd, setMinBankBalanceUsd] = useState<string>("");
  const [consulateBookingUrl, setConsulateBookingUrl] = useState("");
  const [officialVisaLink, setOfficialVisaLink] = useState("");
  const [vaccines, setVaccines] = useState("");
  const [healthNotes, setHealthNotes] = useState("");
  const [dataSource, setDataSource] = useState("");

  const handleSearch = (q: string, cont: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (cont) params.set("continent", cont);
    router.push(`${pathname}?${params.toString()}`);
  };

  const openEditModal = (rule: VisaRule) => {
    setEditingRule(rule);
    setAllowedStayDays(rule.allowedStayDays !== null ? String(rule.allowedStayDays) : "");
    setIsVisaExempt(rule.isVisaExempt);
    setVisaOnArrival(rule.visaOnArrival);
    setEVisaAvailable(rule.eVisaAvailable);
    setTravelInsuranceRequired(rule.travelInsuranceRequired);
    setFinancialProofRequired(rule.financialProofRequired);
    setMinBankBalanceUsd(rule.minBankBalanceUsd !== null ? String(rule.minBankBalanceUsd) : "");
    setConsulateBookingUrl(rule.consulateBookingUrl || "");
    setOfficialVisaLink(rule.officialVisaLink || "");
    setVaccines(rule.healthInfo?.vaccines || "");
    setHealthNotes(rule.healthInfo?.notes || "");
    setDataSource(rule.dataSource || "");
  };

  const handleSave = () => {
    if (!editingRule) return;

    startTransition(async () => {
      const res = await updateVisaRuleAction(editingRule.id, {
        allowedStayDays: allowedStayDays === "" ? null : Number(allowedStayDays),
        isVisaExempt,
        visaOnArrival,
        eVisaAvailable,
        travelInsuranceRequired,
        financialProofRequired,
        minBankBalanceUsd: minBankBalanceUsd === "" ? null : Number(minBankBalanceUsd),
        consulateBookingUrl,
        officialVisaLink,
        healthInfo: {
          vaccines: vaccines.trim() || undefined,
          notes: healthNotes.trim() || undefined,
        },
        dataSource,
      });

      if (res.success) {
        toast({
          title: "Sucesso",
          description: `Regras de vistos para ${editingRule.country} atualizadas com sucesso.`,
          variant: "default",
        });
        setEditingRule(null);
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
            <Globe className="text-[#D4AF37] dark:text-[#4aede5]" size={28} />
            Catálogo de Vistos & Regras Geopolíticas
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Pesquise, gerencie e atualize os requisitos de entrada para mais de 190 países parceiros.
          </p>
        </div>
      </div>

      {/* Toolbar / Filters */}
      <div className="bg-white dark:bg-[#1e1a2f] border border-gray-200 dark:border-white/10 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por país ou código ISO..."
              value={searchVal}
              onChange={(e) => {
                setSearchVal(e.target.value);
                handleSearch(e.target.value, continentVal);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-white/10 bg-transparent rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Continent Filter */}
          <div className="w-full md:w-64">
            <select
              value={continentVal}
              onChange={(e) => {
                setContinentVal(e.target.value);
                handleSearch(searchVal, e.target.value);
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-white dark:bg-[#1a1625] rounded-lg text-sm text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CONTINENTS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Rules Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/10 shadow-lg bg-white dark:bg-[#1a1625]">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 dark:bg-indigo-950/20 border-b border-gray-200 dark:border-white/10">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">País</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Continente</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Estadia Permitida</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Status Visto</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Seguro Viagem</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Fundo Mínimo</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Última Validação</th>
              <th className="px-4 py-3 text-right font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/10">
            {initialRules.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                  Nenhum país encontrado correspondente aos filtros aplicados.
                </td>
              </tr>
            ) : (
              initialRules.map((rule) => {
                let statusLabel = "Visto Consular Exigido";
                let statusColor = "bg-red-500/10 text-red-500 border border-red-500/20";
                
                if (rule.isVisaExempt) {
                  statusLabel = "Visto Isento";
                  statusColor = "bg-green-500/10 text-green-500 border border-green-500/20";
                } else if (rule.visaOnArrival && rule.eVisaAvailable) {
                  statusLabel = "eVisa / VoA Disponível";
                  statusColor = "bg-blue-500/10 text-blue-500 border border-blue-500/20";
                } else if (rule.eVisaAvailable) {
                  statusLabel = "E-Visa Exigido";
                  statusColor = "bg-sky-500/10 text-sky-500 border border-sky-500/20";
                } else if (rule.visaOnArrival) {
                  statusLabel = "Visa on Arrival";
                  statusColor = "bg-amber-500/10 text-amber-500 border border-amber-500/20";
                }

                return (
                  <tr key={rule.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span className="text-xl" role="img" aria-label={rule.country}>
                          {rule.flagEmoji || "🏳️"}
                        </span>
                        <div>
                          <span>{rule.country}</span>
                          <span className="ml-1.5 text-xs text-gray-400 font-mono">({rule.countryCode})</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{rule.continent || "—"}</td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                      {rule.allowedStayDays ? `${rule.allowedStayDays} dias` : "Não definido"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${statusColor}`}>
                        {statusLabel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {rule.travelInsuranceRequired ? (
                        <span className="inline-flex items-center gap-1 text-green-500 text-xs font-semibold">
                          <Check size={14} /> Obrigatório
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
                          <X size={14} /> Não Exigido
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-200">
                      {rule.minBankBalanceUsd ? `$${rule.minBankBalanceUsd} USD` : "Não exigido"}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {rule.lastVerified ? new Date(rule.lastVerified).toLocaleDateString("pt-BR") : "Não verificado"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEditModal(rule)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg text-indigo-600 dark:text-[#4aede5] transition-colors"
                        title="Editar regras"
                      >
                        <Edit2 size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal / Backdrop */}
      {editingRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white dark:bg-[#1a1625] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-gray-50 dark:bg-indigo-950/20 border-b border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{editingRule.flagEmoji}</span>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Editar Requisitos: {editingRule.country}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">ID do País: {editingRule.countryCode}</p>
                </div>
              </div>
              <button
                onClick={() => setEditingRule(null)}
                className="p-1 hover:bg-gray-200 dark:hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Allowed Stay Days */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Estadia Permitida (Dias)
                  </label>
                  <input
                    type="number"
                    value={allowedStayDays}
                    onChange={(e) => setAllowedStayDays(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-transparent rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ex: 90"
                  />
                </div>

                {/* Min Bank Balance */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Saldo Bancário Mínimo (USD)
                  </label>
                  <input
                    type="number"
                    value={minBankBalanceUsd}
                    onChange={(e) => setMinBankBalanceUsd(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-transparent rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ex: 2000"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3 bg-gray-50 dark:bg-white/[0.02] p-4 rounded-xl border border-gray-200 dark:border-white/5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isVisaExempt}
                    onChange={(e) => {
                      setIsVisaExempt(e.target.checked);
                      if (e.target.checked) {
                        setVisaOnArrival(false);
                        setEVisaAvailable(false);
                      }
                    }}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Visto Isento</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={eVisaAvailable}
                    disabled={isVisaExempt}
                    onChange={(e) => setEVisaAvailable(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">E-Visa Disponível</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={visaOnArrival}
                    disabled={isVisaExempt}
                    onChange={(e) => setVisaOnArrival(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Visa on Arrival</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={travelInsuranceRequired}
                    onChange={(e) => setTravelInsuranceRequired(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Seguro Obrigatório</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer col-span-2 mt-1">
                  <input
                    type="checkbox"
                    checked={financialProofRequired}
                    onChange={(e) => setFinancialProofRequired(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Comprovante Financeiro Exigido
                  </span>
                </label>
              </div>

              {/* Booking & Info Links */}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Link Oficial de Visto
                  </label>
                  <input
                    type="url"
                    value={officialVisaLink}
                    onChange={(e) => setOfficialVisaLink(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-transparent rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://example.gov"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Link de Agendamento do Consulado
                  </label>
                  <input
                    type="url"
                    value={consulateBookingUrl}
                    onChange={(e) => setConsulateBookingUrl(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-transparent rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://booking.example.gov"
                  />
                </div>
              </div>

              {/* Health Info (Vaccines / Notes) */}
              <div className="space-y-3 border-t border-gray-200 dark:border-white/10 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Info size={16} className="text-[#D4AF37]" /> Informações de Saúde & Vacinas
                </h4>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Vacinas Obrigatórias
                  </label>
                  <input
                    type="text"
                    value={vaccines}
                    onChange={(e) => setVaccines(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-transparent rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Febre Amarela, COVID-19, etc."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                    Observações de Saúde
                  </label>
                  <textarea
                    value={healthNotes}
                    onChange={(e) => setHealthNotes(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-transparent rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Ex: Vacina de febre amarela exigida para viajantes vindo de áreas de risco..."
                  />
                </div>
              </div>

              {/* Data Source */}
              <div className="border-t border-gray-200 dark:border-white/10 pt-4">
                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">
                  Fonte dos Dados (Auditoria)
                </label>
                <input
                  type="text"
                  value={dataSource}
                  onChange={(e) => setDataSource(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-white/10 bg-transparent rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: Consulado Americano, Ministério de Assuntos Exteriores..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-gray-50 dark:bg-indigo-950/20 border-t border-gray-200 dark:border-white/10">
              <button
                type="button"
                disabled={isPending}
                onClick={() => setEditingRule(null)}
                className="px-4 py-2 border border-gray-300 dark:border-white/10 text-gray-700 dark:text-gray-300 text-sm font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isPending && <Loader2 className="animate-spin" size={16} />}
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
