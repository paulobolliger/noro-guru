"use client";
import React, { useMemo, useState, useTransition } from "react";
import Papa from "papaparse";
import { X, UploadCloud, Loader2, Download } from "lucide-react";
import Portal from "@/components/ui/portal";

type Row = Record<string, string>;
const FIELDS = [
  { key: 'organization_name', label: 'Cliente/Empresa (organization_name)', required: true },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Telefone' },
  { key: 'source', label: 'Fonte' },
  { key: 'value_cents', label: 'Valor (centavos)' },
  { key: 'stage', label: 'Estágio' },
];

function normalize(s: string) {
  return (s || '').toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');
}

export default function LeadImportModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [step, setStep] = useState<1|2>(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  function autoMap(cols: string[]) {
    const m: Record<string, string> = {};
    cols.forEach(c => {
      const n = normalize(c);
      if (n.includes('org') || n.includes('empresa') || n.includes('cliente')) m['organization_name'] = c;
      else if (n.includes('email')) m['email'] = c;
      else if (n.includes('fone') || n.includes('tel') || n.includes('phone')) m['phone'] = c;
      else if (n.includes('fonte') || n.includes('source') || n.includes('origem')) m['source'] = c;
      else if (n.includes('valor_cent') || n === 'value_cents' || n.includes('valor')) m['value_cents'] = c;
      else if (n.includes('estagio') || n.includes('stage') || n.includes('status')) m['stage'] = c;
    });
    setMapping(m);
  }

  function onSelectFile(f: File) {
    setFile(f); setError(null);
    Papa.parse<Row>(f, {
      header: true,
      skipEmptyLines: true,
      complete: (res) => {
        setRows(res.data || []);
        const cols = res.meta.fields || [];
        setHeaders(cols);
        autoMap(cols);
        setStep(2);
      },
      error: (err) => setError(err.message || 'Falha ao ler CSV'),
    });
  }

  const preview = useMemo(() => rows.slice(0, 5), [rows]);

  function downloadTemplate() {
    window.open('/templates/leads_import.csv', '_blank');
  }

  function mappedRows() {
    return rows.map((r) => {
      const obj: any = {};
      for (const f of FIELDS) {
        const col = mapping[f.key];
        if (!col) continue;
        let v: any = r[col] ?? '';
        if (f.key === 'value_cents') {
          const num = String(v).replace(/[^0-9.,-]/g, '').replace('.', '').replace(',', '.');
          const val = parseFloat(num || '0');
          v = Math.round(val * 100);
        }
        obj[f.key] = v;
      }
      return obj;
    }).filter((o) => (o.organization_name || '').trim());
  }

  function canImport() {
    const req = FIELDS.filter(f => f.required).every(f => !!mapping[f.key]);
    return req && rows.length > 0;
  }

  async function submit() {
    const payload = mappedRows();
    if (!payload.length) { setError('Nenhuma linha válida para importar'); return; }
    startTransition(async () => {
      try {
        const res = await fetch('/control/leads/import', {
          method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rows: payload }),
        });
        if (!res.ok) throw new Error((await res.json().catch(()=>({}))).error || 'Falha ao importar');
        onClose();
        window.location.reload();
      } catch (e: any) {
        setError(e?.message || 'Erro inesperado');
      }
    });
  }

  return (
    <Portal>
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="surface-card w-full max-w-3xl p-6 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-muted hover:text-primary" aria-label="Fechar"><X size={20} /></button>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-primary">Importar Leads via CSV</h2>
            <p className="text-sm text-muted">Faça upload do CSV, cheque o mapeamento e importe.</p>
          </div>
          <button onClick={downloadTemplate} className="inline-flex items-center gap-2 text-xs bg-white/10 hover:bg-white/15 text-primary px-3 py-2 rounded-md"><Download size={14}/> Baixar modelo</button>
        </div>

        {step === 1 && (
          <div className="p-6 border border-dashed border-white/10 rounded-lg text-center">
            <input type="file" accept=".csv" onChange={(e)=> e.target.files && e.target.files[0] && onSelectFile(e.target.files[0])} className="hidden" id="csvfile" />
            <label htmlFor="csvfile" className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition cursor-pointer"><UploadCloud size={18}/> Selecionar CSV</label>
            <div className="text-xs text-muted mt-2">Formato: UTF-8, separador vírgula, 1a linha cabeçalhos.</div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <div className="text-sm text-muted mb-2">Mapeie as colunas do seu CSV para os campos de Lead</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {FIELDS.map(f => (
                  <div key={f.key} className="flex flex-col gap-1">
                    <label className="text-xs text-muted">{f.label}{f.required && ' *'}</label>
                    <select value={mapping[f.key] || ''} onChange={(e)=> setMapping({ ...mapping, [f.key]: e.target.value })} className="rounded-lg border px-3 py-2 bg-white/5 text-primary">
                      <option value="">-- não importar --</option>
                      {headers.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm text-muted mb-2">Prévia (primeiras 5 linhas)</div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead className="border-b border-default border-white/10">
                    <tr>
                      {headers.map(h => (<th key={h} className="text-left px-3 py-2 text-muted">{h}</th>))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.map((r,i)=> (
                      <tr key={i} className="border-b border-default border-white/5">
                        {headers.map(h => (<td key={h} className="px-3 py-2">{r[h]}</td>))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {error && <div className="text-sm text-rose-400">{error}</div>}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button onClick={() => setStep(1)} className="px-4 py-2 rounded-lg text-muted hover:bg-white/5">Voltar</button>
              <button onClick={submit} disabled={isPending || !canImport()} className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition disabled:opacity-60">
                {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : <UploadCloud className="h-4 w-4" />} Importar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </Portal>
  );
}
