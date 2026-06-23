"use client";

import { useState, useTransition } from "react";
import { 
  UploadCloud, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Search, 
  FileText, 
  Building2, 
  RefreshCw, 
  SlidersHorizontal,
  X,
  FileCheck,
  Check,
  ChevronDown
} from "lucide-react";
import { TenantSelector } from "@/components/TenantSelector";
import { 
  uploadBspFileAction, 
  manualReconcileAction, 
  createAgencyMemoAction, 
  updateAgencyMemoStatusAction,
  searchTrafficDocumentsAction
} from "./actions";

interface Tenant {
  id: string;
  name: string;
  slug: string;
}

interface Ingestion {
  id: string;
  fileName: string;
  fileSize: number;
  status: string;
  processedAt: string | Date | null;
  createdAt: string | Date;
}

interface BspRecord {
  id: string;
  ticketNumber: string;
  transactionType: string;
  issueDate: string | Date | null;
  billingAmount: string;
  taxAmount: string;
  commissionAmount: string;
  reconciledState: string;
  matchedDocId: string | null;
}

interface AgencyMemo {
  id: string;
  memoType: string;
  memoNumber: string;
  supplierId: string;
  ticketNumber: string | null;
  amount: string;
  reason: string | null;
  status: string;
  createdAt: string | Date;
}

interface Supplier {
  id: string;
  nome: string;
  tipo: string;
}

interface BspDashboardClientProps {
  tenants: Tenant[];
  activeTenantId: string;
  ingestions: Ingestion[];
  records: BspRecord[];
  memos: AgencyMemo[];
  suppliers: Supplier[];
  onTenantChange: (formData: FormData) => Promise<void>;
}

export default function BspDashboardClient({
  tenants,
  activeTenantId,
  ingestions,
  records,
  memos,
  suppliers,
  onTenantChange
}: BspDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"reconciliation" | "files" | "memos">("reconciliation");
  
  // Search & Filter states
  const [recordSearch, setRecordSearch] = useState("");
  const [recordFilter, setRecordFilter] = useState<"ALL" | "RECONCILED" | "UNRECONCILED">("ALL");
  const [memoSearch, setMemoSearch] = useState("");
  
  // File Upload states
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);

  // Manual Reconciliation Modal state
  const [selectedRecord, setSelectedRecord] = useState<BspRecord | null>(null);
  const [docSearchQuery, setDocSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ id: string; docNumber: string; validatingCarrier: string | null }>>([]);
  const [isSearchingDocs, setIsSearchingDocs] = useState(false);
  const [reconcilingRecordId, setReconcilingRecordId] = useState<string | null>(null);

  // Agency Memo Modal state
  const [isMemoModalOpen, setIsMemoModalOpen] = useState(false);
  const [newMemoType, setNewMemoType] = useState<"ADM" | "ACM">("ADM");
  const [newMemoNumber, setNewMemoNumber] = useState("");
  const [newMemoSupplierId, setNewMemoSupplierId] = useState("");
  const [newMemoTicketNumber, setNewMemoTicketNumber] = useState("");
  const [newMemoAmount, setNewMemoAmount] = useState("");
  const [newMemoReason, setNewMemoReason] = useState("");
  const [isCreatingMemo, setIsCreatingMemo] = useState(false);
  const [memoError, setMemoError] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  // Helper formatting functions
  const formatCurrency = (amount: string | number) => {
    const val = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);
  };

  const formatDate = (dateVal: string | Date | null) => {
    if (!dateVal) return "—";
    const date = new Date(dateVal);
    return date.toLocaleDateString("pt-BR");
  };

  // KPI Calculations
  const totalBspBilling = records.reduce((sum, r) => sum + parseFloat(r.billingAmount), 0);
  const reconciledCount = records.filter(r => r.reconciledState === "RECONCILED").length;
  const unreconciledCount = records.filter(r => r.reconciledState === "UNRECONCILED").length;
  const reconciliationRate = records.length > 0 ? Math.round((reconciledCount / records.length) * 100) : 0;
  
  const openMemosCount = memos.filter(m => ["OPEN", "IN_DISPUTE"].includes(m.status)).length;
  const openMemosAmount = memos
    .filter(m => ["OPEN", "IN_DISPUTE"].includes(m.status))
    .reduce((sum, m) => sum + parseFloat(m.amount), 0);

  // Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadError(null);
      setUploadSuccess(null);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadBspFileAction(formData);
    setIsUploading(false);

    if (result.success) {
      setUploadSuccess(`Sucesso! Arquivo importado e ${result.count} registros adicionados/atualizados.`);
      setFile(null);
      // Reset input element
      const fileInput = document.getElementById("bsp-file-input") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } else {
      setUploadError(result.error || "Erro ao processar o arquivo.");
    }
  };

  const triggerSearchDocs = async (query: string) => {
    setDocSearchQuery(query);
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    setIsSearchingDocs(true);
    const results = await searchTrafficDocumentsAction(query);
    setSearchResults(results);
    setIsSearchingDocs(false);
  };

  const handleManualReconcile = async (docId: string) => {
    if (!selectedRecord) return;
    setReconcilingRecordId(selectedRecord.id);
    
    const result = await manualReconcileAction(selectedRecord.id, docId);
    setReconcilingRecordId(null);
    
    if (result.success) {
      setSelectedRecord(null);
      setDocSearchQuery("");
      setSearchResults([]);
    } else {
      alert(result.error || "Erro ao vincular bilhete.");
    }
  };

  const handleCreateMemo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoNumber || !newMemoSupplierId || !newMemoAmount) {
      setMemoError("Por favor preencha todos os campos obrigatórios.");
      return;
    }

    setIsCreatingMemo(true);
    setMemoError(null);

    const result = await createAgencyMemoAction({
      memoType: newMemoType,
      memoNumber: newMemoNumber,
      supplierId: newMemoSupplierId,
      ticketNumber: newMemoTicketNumber,
      amount: newMemoAmount,
      reason: newMemoReason
    });

    setIsCreatingMemo(false);

    if (result.success) {
      setIsMemoModalOpen(false);
      setNewMemoNumber("");
      setNewMemoTicketNumber("");
      setNewMemoAmount("");
      setNewMemoReason("");
    } else {
      setMemoError(result.error || "Erro ao criar disputa.");
    }
  };

  const handleUpdateMemoStatus = async (memoId: string, status: string) => {
    const res = await updateAgencyMemoStatusAction(memoId, status);
    if (!res.success) {
      alert(res.error || "Erro ao atualizar status do memo.");
    }
  };

  // Filter records
  const filteredRecords = records.filter(r => {
    const matchesSearch = r.ticketNumber.includes(recordSearch) || r.transactionType.includes(recordSearch.toUpperCase());
    const matchesFilter = 
      recordFilter === "ALL" || 
      (recordFilter === "RECONCILED" && r.reconciledState === "RECONCILED") ||
      (recordFilter === "UNRECONCILED" && r.reconciledState === "UNRECONCILED");
    return matchesSearch && matchesFilter;
  });

  // Filter memos
  const filteredMemos = memos.filter(m => {
    const matchesSearch = m.memoNumber.toLowerCase().includes(memoSearch.toLowerCase()) || 
      (m.ticketNumber && m.ticketNumber.includes(memoSearch)) ||
      (m.reason && m.reason.toLowerCase().includes(memoSearch.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Controls: Tenant Selection */}
      <div className="flex items-center justify-between bg-surface-card p-4 rounded-xl border border-default shadow-sm">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-secondary">Organização Ativa:</span>
          <TenantSelector
            tenants={tenants}
            activeTenantId={activeTenantId}
            onTenantChange={onTenantChange}
          />
        </div>
        <div className="text-xs text-secondary font-mono">
          Tenant ID: {activeTenantId}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Card 1: Total Volume */}
        <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Volume Faturado</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <FileText size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-heading mt-1">{formatCurrency(totalBspBilling)}</h3>
          <p className="text-xs text-secondary mt-1">{records.length} transações importadas</p>
        </div>

        {/* Card 2: Reconciled rate */}
        <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Taxa Conciliação</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-heading mt-1">{reconciliationRate}%</h3>
          <div className="flex items-center gap-1.5 text-xs text-secondary mt-1">
            <span className="text-emerald-500 font-semibold">{reconciledCount}</span> bilhetes vinculados
          </div>
        </div>

        {/* Card 3: Unreconciled tickets */}
        <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Bilhetes Pendentes</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-heading mt-1">{unreconciledCount}</h3>
          <p className="text-xs text-secondary mt-1">Aguardando correspondência operacional</p>
        </div>

        {/* Card 4: Open Memos Dispute */}
        <div className="bg-surface-card rounded-xl p-5 border border-default shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-secondary uppercase tracking-wider">Disputas (ADMs)</span>
            <div className="p-2 bg-red-50 text-red-600 rounded-lg">
              <AlertTriangle size={18} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-heading mt-1">{openMemosCount}</h3>
          <p className="text-xs text-secondary mt-1">Total de {formatCurrency(openMemosAmount)} contestados</p>
        </div>
      </div>

      {/* Tabs Menu Navigation */}
      <div className="border-b border-default flex gap-6">
        <button
          onClick={() => setActiveTab("reconciliation")}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeTab === "reconciliation" 
              ? "text-primary border-b-2 border-primary" 
              : "text-secondary hover:text-primary"
          }`}
        >
          Painel de Conciliação
        </button>
        <button
          onClick={() => setActiveTab("files")}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeTab === "files" 
              ? "text-primary border-b-2 border-primary" 
              : "text-secondary hover:text-primary"
          }`}
        >
          Importar Arquivos BSP
        </button>
        <button
          onClick={() => setActiveTab("memos")}
          className={`pb-3 text-sm font-semibold transition-all relative ${
            activeTab === "memos" 
              ? "text-primary border-b-2 border-primary" 
              : "text-secondary hover:text-primary"
          }`}
        >
          Agency Memos (Contestações)
        </button>
      </div>

      {/* Tab Contents */}
      
      {/* 1. RECONCILIATION TAB */}
      {activeTab === "reconciliation" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface-card p-4 rounded-xl border border-default shadow-sm">
            {/* Search */}
            <div className="flex-1 max-w-sm relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
              <input
                type="text"
                placeholder="Buscar por bilhete ou tipo..."
                value={recordSearch}
                onChange={e => setRecordSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-default rounded-lg text-sm bg-surface-base focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex gap-2 bg-surface-base p-1 rounded-lg border border-default">
              <button
                onClick={() => setRecordFilter("ALL")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  recordFilter === "ALL" 
                    ? "bg-surface-card text-heading shadow-sm" 
                    : "text-secondary hover:text-heading"
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setRecordFilter("RECONCILED")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  recordFilter === "RECONCILED" 
                    ? "bg-surface-card text-heading shadow-sm" 
                    : "text-secondary hover:text-heading"
                }`}
              >
                Conciliados
              </button>
              <button
                onClick={() => setRecordFilter("UNRECONCILED")}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                  recordFilter === "UNRECONCILED" 
                    ? "bg-surface-card text-heading shadow-sm" 
                    : "text-secondary hover:text-heading"
                }`}
              >
                Pendentes
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-surface-card border border-default rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-surface-base text-secondary font-medium border-b border-default">
                  <tr>
                    <th className="px-6 py-4">Nº Bilhete</th>
                    <th className="px-6 py-4">Transação</th>
                    <th className="px-6 py-4">Data Emissão</th>
                    <th className="px-6 py-4">Faturamento</th>
                    <th className="px-6 py-4">Taxas</th>
                    <th className="px-6 py-4">Comissão</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default">
                  {filteredRecords.map(r => (
                    <tr key={r.id} className="hover:bg-surface-base/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-heading font-semibold">
                        {r.ticketNumber}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs px-2 py-0.5 rounded bg-surface-base border border-default font-semibold text-secondary">
                          {r.transactionType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-secondary">
                        {formatDate(r.issueDate)}
                      </td>
                      <td className="px-6 py-4 font-semibold text-heading">
                        {formatCurrency(r.billingAmount)}
                      </td>
                      <td className="px-6 py-4 text-secondary">
                        {formatCurrency(r.taxAmount)}
                      </td>
                      <td className="px-6 py-4 text-secondary">
                        {formatCurrency(r.commissionAmount)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          r.reconciledState === "RECONCILED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          {r.reconciledState === "RECONCILED" ? "Conciliado" : "Pendente"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {r.reconciledState === "UNRECONCILED" ? (
                          <button
                            onClick={() => setSelectedRecord(r)}
                            className="text-primary hover:underline font-semibold text-xs"
                          >
                            Conciliar Manualmente
                          </button>
                        ) : (
                          <span className="text-xs text-secondary font-mono">
                            ID: {r.matchedDocId?.substring(0, 6)}...
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {filteredRecords.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-secondary">
                        Nenhum registro encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. FILES IMPORT TAB */}
      {activeTab === "files" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ingestion form */}
          <div className="bg-surface-card p-6 border border-default rounded-xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-heading">Carregar Relatório BSP</h3>
            <p className="text-xs text-secondary">
              Importe um arquivo de texto no formato semicolon-separated para alimentar o staging de conciliação. 
              O arquivo deve possuir cabeçalho ou iniciar com os dados:
              <br />
              <code className="block mt-1 font-mono p-1 bg-surface-base rounded text-secondary border border-default text-[10px]">
                TICKET;TIPO;VALOR;TAXAS;COMISSAO
                <br />
                7770001122;SALE;1200.00;100.00;90.00
              </code>
            </p>

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="border-2 border-dashed border-default rounded-xl p-6 text-center hover:border-primary transition-all bg-surface-base/50">
                <UploadCloud className="mx-auto text-secondary mb-2" size={32} />
                <input
                  id="bsp-file-input"
                  type="file"
                  accept=".txt,.csv,.ret"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="bsp-file-input"
                  className="text-xs font-semibold text-primary hover:underline cursor-pointer block"
                >
                  {file ? file.name : "Clique para escolher o arquivo"}
                </label>
                {file && (
                  <span className="text-[10px] text-secondary mt-1 block">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                )}
              </div>

              {uploadError && (
                <div className="p-3 text-xs bg-red-50 text-red-700 rounded-lg border border-red-200">
                  {uploadError}
                </div>
              )}

              {uploadSuccess && (
                <div className="p-3 text-xs bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                  {uploadSuccess}
                </div>
              )}

              <button
                type="submit"
                disabled={!file || isUploading}
                className="w-full btn-primary py-2 px-4 rounded-lg text-xs font-semibold shadow-sm hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <RefreshCw className="animate-spin" size={14} />
                    Processando...
                  </>
                ) : (
                  "Iniciar Importação"
                )}
              </button>
            </form>
          </div>

          {/* Ingestions History */}
          <div className="bg-surface-card p-6 border border-default rounded-xl shadow-sm md:col-span-2 space-y-4">
            <h3 className="text-base font-bold text-heading">Histórico de Ingestões</h3>
            <div className="overflow-x-auto border border-default rounded-xl overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-surface-base text-secondary font-medium border-b border-default">
                  <tr>
                    <th className="px-4 py-3">Arquivo</th>
                    <th className="px-4 py-3">Tamanho</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Data Processamento</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default">
                  {ingestions.map(ing => (
                    <tr key={ing.id} className="hover:bg-surface-base/50 transition-colors">
                      <td className="px-4 py-3 font-medium text-heading flex items-center gap-2">
                        <FileText size={16} className="text-secondary" />
                        {ing.fileName}
                      </td>
                      <td className="px-4 py-3 text-secondary">
                        {(ing.fileSize / 1024).toFixed(1)} KB
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                          ing.status === "PROCESSED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}>
                          {ing.status === "PROCESSED" ? "Processado" : "Erro"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-secondary">
                        {formatDate(ing.processedAt || ing.createdAt)}
                      </td>
                    </tr>
                  ))}
                  {ingestions.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-secondary">
                        Nenhuma ingestão registrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 3. DISPUTES MEMOS TAB */}
      {activeTab === "memos" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface-card p-4 rounded-xl border border-default shadow-sm">
            {/* Search */}
            <div className="flex-1 max-w-sm relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
              <input
                type="text"
                placeholder="Buscar disputas..."
                value={memoSearch}
                onChange={e => setMemoSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-default rounded-lg text-sm bg-surface-base focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <button
              onClick={() => {
                setMemoError(null);
                setIsMemoModalOpen(true);
              }}
              className="btn-primary py-1.5 px-4 rounded-lg text-xs font-semibold shadow-sm hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus size={16} />
              Nova Contestações (ADM/ACM)
            </button>
          </div>

          {/* Table */}
          <div className="bg-surface-card border border-default rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-surface-base text-secondary font-medium border-b border-default">
                  <tr>
                    <th className="px-6 py-4">Nº Memo</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Companhia Aérea</th>
                    <th className="px-6 py-4">Bilhete</th>
                    <th className="px-6 py-4">Valor</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Data Registro</th>
                    <th className="px-6 py-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-default">
                  {filteredMemos.map(m => {
                    const sup = suppliers.find(s => s.id === m.supplierId);
                    return (
                      <tr key={m.id} className="hover:bg-surface-base/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-heading font-semibold">
                          {m.memoNumber}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs px-2 py-0.5 rounded border font-semibold ${
                            m.memoType === "ADM" 
                              ? "bg-red-50 text-red-700 border-red-200" 
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}>
                            {m.memoType}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-heading font-medium">
                          {sup ? sup.nome : "Airlines"}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs text-secondary">
                          {m.ticketNumber || "—"}
                        </td>
                        <td className="px-6 py-4 font-semibold text-heading">
                          {formatCurrency(m.amount)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${
                            m.status === "RESOLVED" || m.status === "ACCEPTED"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : m.status === "IN_DISPUTE"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : m.status === "REJECTED"
                                  ? "bg-red-50 text-red-700 border-red-200"
                                  : "bg-gray-50 text-secondary border-default"
                          }`}>
                            {m.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-secondary">
                          {formatDate(m.createdAt)}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          {m.status === "OPEN" && (
                            <button
                              onClick={() => handleUpdateMemoStatus(m.id, "IN_DISPUTE")}
                              className="text-amber-600 hover:text-amber-700 font-semibold text-xs border border-amber-200 bg-amber-50 px-2 py-1 rounded"
                            >
                              Contestar
                            </button>
                          )}
                          {m.status === "IN_DISPUTE" && (
                            <>
                              <button
                                onClick={() => handleUpdateMemoStatus(m.id, "ACCEPTED")}
                                className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs border border-emerald-200 bg-emerald-50 px-2 py-1 rounded"
                              >
                                Aceitar
                              </button>
                              <button
                                onClick={() => handleUpdateMemoStatus(m.id, "REJECTED")}
                                className="text-red-600 hover:text-red-700 font-semibold text-xs border border-red-200 bg-red-50 px-2 py-1 rounded"
                              >
                                Rejeitar
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  {filteredMemos.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-secondary">
                        Nenhuma disputa registrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODALS */}

      {/* 1. Manual Reconciliation Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1625] border border-white/10 rounded-xl p-6 w-full max-w-md shadow-2xl relative space-y-4">
            <button
              onClick={() => {
                setSelectedRecord(null);
                setDocSearchQuery("");
                setSearchResults([]);
              }}
              className="absolute top-4 right-4 text-secondary hover:text-heading"
            >
              <X size={18} />
            </button>

            <div>
              <h3 className="text-base font-bold text-heading flex items-center gap-2">
                <FileCheck className="text-primary" size={20} />
                Conciliação Manual
              </h3>
              <p className="text-xs text-secondary mt-1">
                Selecione o bilhete emitido internamente para correspondência do bilhete BSP <b>#{selectedRecord.ticketNumber}</b> (Valor: {formatCurrency(selectedRecord.billingAmount)}).
              </p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-secondary">Buscar Bilhete Interno</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                <input
                  type="text"
                  placeholder="Digite pelo menos 3 dígitos do bilhete..."
                  value={docSearchQuery}
                  onChange={e => triggerSearchDocs(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 border border-default rounded-lg text-sm bg-surface-base focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {isSearchingDocs && (
                <p className="text-xs text-secondary animate-pulse text-center">Buscando bilhetes...</p>
              )}

              {searchResults.length > 0 ? (
                <div className="border border-default rounded-lg divide-y divide-default max-h-48 overflow-y-auto bg-surface-base">
                  {searchResults.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => handleManualReconcile(doc.id)}
                      disabled={reconcilingRecordId === selectedRecord.id}
                      className="w-full flex items-center justify-between p-2.5 hover:bg-surface-card transition-colors text-left disabled:opacity-50"
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-mono text-heading font-semibold">{doc.docNumber}</span>
                        <span className="text-xs text-secondary">Cia Aérea: {doc.validatingCarrier}</span>
                      </div>
                      <Check className="text-emerald-500" size={16} />
                    </button>
                  ))}
                </div>
              ) : (
                docSearchQuery.length >= 3 && !isSearchingDocs && (
                  <p className="text-xs text-secondary text-center py-2">Nenhum bilhete correspondente encontrado.</p>
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. Create Agency Memo Modal */}
      {isMemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-[#1a1625] border border-white/10 rounded-xl p-6 w-full max-w-lg shadow-2xl relative space-y-4">
            <button
              onClick={() => setIsMemoModalOpen(false)}
              className="absolute top-4 right-4 text-secondary hover:text-heading"
            >
              <X size={18} />
            </button>

            <div>
              <h3 className="text-base font-bold text-heading flex items-center gap-2">
                <AlertTriangle className="text-primary" size={20} />
                Nova Disputa / Agency Memo
              </h3>
              <p className="text-xs text-secondary mt-1">
                Abra uma nota de débito (ADM) ou crédito (ACM) recebida da companhia aérea.
              </p>
            </div>

            {memoError && (
              <div className="p-3 text-xs bg-red-50 text-red-700 rounded-lg border border-red-200">
                {memoError}
              </div>
            )}

            <form onSubmit={handleCreateMemo} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Type */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-secondary">Tipo</label>
                  <select
                    value={newMemoType}
                    onChange={e => setNewMemoType(e.target.value as any)}
                    className="w-full px-3 py-2 border border-default rounded-lg text-sm bg-surface-base focus:outline-none focus:ring-1 focus:ring-primary text-heading"
                  >
                    <option value="ADM">ADM (Débito)</option>
                    <option value="ACM">ACM (Crédito)</option>
                  </select>
                </div>

                {/* Memo Number */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-secondary">Número do Memo *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: ADM-99120"
                    value={newMemoNumber}
                    onChange={e => setNewMemoNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-default rounded-lg text-sm bg-surface-base focus:outline-none focus:ring-1 focus:ring-primary text-heading"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Supplier */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-secondary">Companhia Aérea *</label>
                  <select
                    required
                    value={newMemoSupplierId}
                    onChange={e => setNewMemoSupplierId(e.target.value)}
                    className="w-full px-3 py-2 border border-default rounded-lg text-sm bg-surface-base focus:outline-none focus:ring-1 focus:ring-primary text-heading"
                  >
                    <option value="">Selecione...</option>
                    {suppliers.map(s => (
                      <option key={s.id} value={s.id}>{s.nome}</option>
                    ))}
                  </select>
                </div>

                {/* Ticket Number */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-secondary">Nº do Bilhete Relacionado</label>
                  <input
                    type="text"
                    placeholder="Ex: 7771234567"
                    value={newMemoTicketNumber}
                    onChange={e => setNewMemoTicketNumber(e.target.value)}
                    className="w-full px-3 py-2 border border-default rounded-lg text-sm bg-surface-base focus:outline-none focus:ring-1 focus:ring-primary text-heading"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {/* Amount */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-secondary">Valor do Memo * (BRL)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 150.00"
                    value={newMemoAmount}
                    onChange={e => setNewMemoAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-default rounded-lg text-sm bg-surface-base focus:outline-none focus:ring-1 focus:ring-primary text-heading"
                  />
                </div>

                {/* Reason */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-secondary">Motivo da Disputa</label>
                  <textarea
                    placeholder="Descrição do motivo apontado pela cia aérea..."
                    value={newMemoReason}
                    onChange={e => setNewMemoReason(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-default rounded-lg text-sm bg-surface-base focus:outline-none focus:ring-1 focus:ring-primary text-heading"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsMemoModalOpen(false)}
                  className="px-4 py-2 border border-default rounded-lg text-xs font-semibold text-secondary hover:text-heading cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreatingMemo}
                  className="btn-primary px-4 py-2 rounded-lg text-xs font-semibold shadow-sm hover:opacity-90 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isCreatingMemo ? (
                    <>
                      <RefreshCw className="animate-spin" size={12} />
                      Salvando...
                    </>
                  ) : (
                    "Registrar Memo"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
