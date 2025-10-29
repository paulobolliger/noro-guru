"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@lib/supabase/client';
import Portal from "@/components/ui/portal";

type Item = { type: 'page'|'action'|'tenant'|'lead'; label: string; href?: string; onClick?: () => void };

export default function CommandPalette() {
  const router = useRouter();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [items, setItems] = useState<Item[]>([]);

  // keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) { setQ(''); setItems([]); }
  }, [open]);

  // basic search combining static destinations and top results
  useEffect(() => {
    let abort = false;
    (async () => {
      const base: Item[] = [
        { type: 'page', label: 'Dashboard', href: '/control' },
        { type: 'page', label: 'Leads', href: '/control/leads' },
        { type: 'page', label: 'Clientes/Empresas', href: '/control/orgs' },
        { type: 'action', label: 'Novo Lead', href: '/control/leads?open=create' },
        { type: 'action', label: 'Novo Cliente/Empresa', href: '/control/orgs?open=create' },
      ];
      const results: Item[] = [...base];
      const term = q.trim();
      if (term) {
        const { data: t } = await supabase.schema('cp').from('tenants').select('id, name, slug').ilike('name', `%${term}%`).limit(5);
        const { data: l } = await supabase.schema('cp').from('leads').select('id, organization_name').ilike('organization_name', `%${term}%`).limit(5);
        (t||[]).forEach((r: any) => results.push({ type: 'tenant', label: `Tenant: ${r.name}`, href: `/control/orgs/${r.id}` }));
        (l||[]).forEach((r: any) => results.push({ type: 'lead', label: `Lead: ${r.organization_name}`, href: `/control/leads` }));
      }
      if (!abort) setItems(results);
    })();
    return () => { abort = true; };
  }, [q, supabase]);

  const onSelect = (it: Item) => {
    if (it.onClick) it.onClick();
    if (it.href) router.push(it.href);
    setOpen(false);
  };

  if (!open) return null;
  return (
    <Portal>
    <div className="fixed inset-0 z-50" onClick={() => setOpen(false)}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative max-w-2xl mx-auto mt-24 bg-[#0B1220] border border-white/10 rounded-xl shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2 px-4 py-3 border-b border-default border-white/10">
          <Search size={18} className="text-slate-400" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busque páginas, tenants, leads... (Ctrl/Cmd+K)" className="flex-1 bg-transparent outline-none text-primary placeholder:text-primary0" />
          <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-primary"><X size={18} /></button>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {items.length === 0 && <div className="p-4 text-sm text-muted">Digite para buscar…</div>}
          {items.map((it, i) => (
            <button key={i} onClick={() => onSelect(it)} className="w-full text-left px-4 py-2 hover:bg-white/5 transition-colors">
              <div className="text-primary text-sm">{it.label}</div>
              {it.href && <div className="text-[11px] text-muted">{it.href}</div>}
            </button>
          ))}
        </div>
      </div>
    </div>
    </Portal>
  );
}
