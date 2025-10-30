"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, UploadCloud, Download, List, LayoutGrid } from 'lucide-react';
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
        className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between max-w-[1200px] mx-auto px-4 md:px-6 p-6 md:p-8 mb-6 rounded-xl shadow-md"
        style={{ background: 'linear-gradient(135deg, rgba(59, 44, 164, 0.94), rgba(35, 33, 79, 0.92))' }}
      >
        <div className="transition-colors">
          <h1 className="text-2xl md:text-3xl font-bold text-[#D4AF37] tracking-tight">Leads</h1>
          <p className="text-sm text-white">Pipeline comercial (Control)</p>
        </div>
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <div className="flex-1 md:w-72">
            <NInput
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && update({ q })}
              placeholder="Buscar por nome, email, origem..."
              className="w-full"
            />
          </div>
          <NSelect
            value={status}
            onChange={(e) => { setStatus(e.target.value); update({ status: e.target.value }); }}
            className="hover:bg-white/10 transition-colors"
          >
            <option value="">Todos statuses</option>
            <option value="novo">Novo</option>
            <option value="qualificado">Qualificado</option>
            <option value="proposta">Proposta</option>
            <option value="negociacao">Negociação</option>
            <option value="ganho">Ganho</option>
            <option value="perdido">Perdido</option>
          </NSelect>
        <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
          <button
            onClick={() => update({ view: "list" })}
            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition flex items-center gap-2 ${currentView!=="kanban" ? "surface-card text-primary shadow-sm" : "text-muted hover:bg-white/10"}`}
          >
            <List size={14}/> Lista
          </button>
          <button
            onClick={() => update({ view: "kanban" })}
            className={`px-3 py-1.5 rounded-md text-sm font-semibold transition flex items-center gap-2 ${currentView==="kanban" ? "surface-card text-primary shadow-sm" : "text-muted hover:bg-white/10"}`}
          >
            <LayoutGrid size={14}/> Kanban
          </button>
        </div>
        <div className="flex gap-2">
        <NButton onClick={() => setCreateOpen(true)} variant="primary" leftIcon={<Plus size={18} />}>Novo Lead</NButton>
        <NButton onClick={() => setImportOpen(true)} variant="secondary" leftIcon={<UploadCloud size={18} />}>Importar CSV</NButton>
        <a href="/templates/leads_import.csv" target="_blank" className="inline-flex items-center gap-2 bg-white/5 text-primary px-3 py-2 rounded-lg font-semibold hover:bg-white/10 transition">
          <Download size={16}/> Modelo CSV
        </a>
        </div>
        </div>
      </div>
      {createOpen && <LeadCreateModal isOpen={createOpen} onClose={() => setCreateOpen(false)} />}
      {importOpen && <LeadImportModal isOpen={importOpen} onClose={() => setImportOpen(false)} />}
    </div>
  );
}
