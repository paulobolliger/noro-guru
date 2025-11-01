"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, UploadCloud, Download, List, LayoutGrid, Settings, Search, Target } from 'lucide-react';
import { NButton, NInput, NSelect } from '@/components/ui';
import LeadCreateModal from './LeadCreateModal';
import LeadImportModal from './LeadImportModal';

export default function LeadHeader() {
  const router = useRouter();
  const sp = useSearchParams();
  const currentView = (sp.get("view") || "list").toLowerCase();
  const [q, setQ] = useState(sp.get("q") || "");
  const [status, setStatus] = useState(sp.get("status") || "");
  const [createOpen, setCreateOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  function update(params: Record<string, string>) {
    const p = new URLSearchParams(sp.toString());
    Object.entries(params).forEach(([k, v]) => {
      if (!v) p.delete(k); else p.set(k, v);
    });
    router.push(`/control/leads?${p.toString()}`);
  }

  return (
    <div className="sticky top-0 z-30">
      <div
        className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 max-w-[1200px] mx-auto px-4 md:px-6 py-4 mb-6 rounded-xl shadow-md"
        style={{ background: 'linear-gradient(135deg, rgba(59, 44, 164, 0.94), rgba(35, 33, 79, 0.92))' }}
      >
        {/* Left: Title */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Target size={28} className="text-[#D4AF37]" />
          <h1 className="text-xl md:text-2xl font-bold text-[#D4AF37] tracking-tight">Leads</h1>
        </div>

        {/* Right: Controls */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Search - Expandable */}
          <div className={`transition-all duration-200 ${searchExpanded ? 'w-64' : 'w-auto'}`}>
            {searchExpanded ? (
              <NInput
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") update({ q });
                  if (e.key === "Escape") { setSearchExpanded(false); setQ(""); update({ q: "" }); }
                }}
                onBlur={() => !q && setSearchExpanded(false)}
                placeholder="Buscar..."
                className="w-full"
                autoFocus
              />
            ) : (
              <button
                onClick={() => setSearchExpanded(true)}
                className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
                title="Buscar"
              >
                <Search size={18} />
              </button>
            )}
          </div>

          {/* Status Select */}
          <NSelect
            value={status}
            onChange={(e) => { setStatus(e.target.value); update({ status: e.target.value }); }}
            className="hover:bg-white/10 transition-colors w-auto"
          >
            <option value="">Todos</option>
            <option value="novo">Novo</option>
            <option value="qualificado">Qualificado</option>
            <option value="proposta">Proposta</option>
            <option value="negociacao">Negociação</option>
            <option value="ganho">Ganho</option>
            <option value="perdido">Perdido</option>
          </NSelect>
          
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-white/20 dark:bg-white/10 rounded-lg p-1">
            <button
              onClick={() => update({ view: "list" })}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentView !== "kanban" 
                  ? "bg-white dark:bg-slate-800 text-purple-700 dark:text-[#D4AF37] shadow-sm" 
                  : "text-white dark:text-white hover:bg-white/30 dark:hover:bg-white/20"
              }`}
            >
              <List size={14}/> <span className="hidden sm:inline">Lista</span>
            </button>
            <button
              onClick={() => update({ view: "kanban" })}
              className={`px-3 py-1.5 rounded-md text-sm font-semibold transition-all flex items-center gap-1.5 ${
                currentView === "kanban" 
                  ? "bg-white dark:bg-slate-800 text-purple-700 dark:text-[#D4AF37] shadow-sm" 
                  : "text-white dark:text-white hover:bg-white/30 dark:hover:bg-white/20"
              }`}
            >
              <LayoutGrid size={14}/> <span className="hidden sm:inline">Kanban</span>
            </button>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-white/20" />

          {/* Action Buttons */}
          {currentView === "kanban" && (
            <button
              onClick={() => router.push('/control/leads?view=kanban&open=stages')}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
              title="Configurar Pipeline"
            >
              <Settings size={18} />
            </button>
          )}
          <NButton onClick={() => setCreateOpen(true)} variant="primary" leftIcon={<Plus size={18} />}>
            <span className="hidden lg:inline">Novo Lead</span>
            <span className="lg:hidden">Novo</span>
          </NButton>
          <button
            onClick={() => setImportOpen(true)}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            title="Importar CSV"
          >
            <UploadCloud size={18} />
          </button>
          <a 
            href="/templates/leads_import.csv" 
            target="_blank" 
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition"
            title="Modelo CSV"
          >
            <Download size={18} />
          </a>
        </div>
      </div>
      {createOpen && <LeadCreateModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />}
      {importOpen && <LeadImportModal isOpen={importOpen} onClose={() => setImportOpen(false)} />}
    </div>
  );
}
