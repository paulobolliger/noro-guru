"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Tenant = {
  id: string;
  name: string;
  slug?: string;
  role?: string;
  plan?: string;
  status?: string;
  created_at?: string;
};

export default function TenantsTable() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [items, setItems] = useState<Tenant[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setPage(1), 250);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (q) params.set('q', q);

        const res = await fetch(`/tenants/api/list?${params.toString()}`, { credentials: 'same-origin', signal: controller.signal });
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const body = await res.json();
        if (!mounted) return;
        setItems(body.items || []);
        setTotal(Number(body.total || 0));
      } catch (err) {
        if ((err as any).name === 'AbortError') return;
        console.error('Erro carregando tenants', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
      controller.abort();
    };
  }, [page, pageSize, q]);

  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;

  return (
    <div className="noro-card">
      <div className="noro-card-header flex items-center justify-between">
        <div>
          <div className="noro-card-title">Tenants</div>
          <div className="text-sm text-muted">Gerencie as organizações (tenants) do sistema.</div>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nome, slug ou plano"
            className="px-3 py-2 rounded border bg-transparent text-primary placeholder:text-muted"
          />
          <Link href="/control/tenants/create" className="btn btn-primary">
            Criar
          </Link>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted uppercase">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Slug</th>
              <th className="p-3">Plano</th>
              <th className="p-3">Status</th>
              <th className="p-3">Criado em</th>
              <th className="p-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t.id} className="border-t">
                <td className="p-3">{t.name}</td>
                <td className="p-3 text-muted">{t.slug}</td>
                <td className="p-3">{t.plan || "-"}</td>
                <td className="p-3">{t.status || "-"}</td>
                <td className="p-3">{t.created_at ? new Date(t.created_at).toLocaleString() : "-"}</td>
                <td className="p-3">
                  <Link href={`/control/orgs/${t.id}`} className="text-primary hover:underline">
                    Abrir
                  </Link>
                </td>
              </tr>
            ))}

            {items.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted">
                  Nenhum tenant encontrado.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-muted">
                  Carregando...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-3">
        <div className="text-xs text-muted">
          Mostrando {total === 0 ? 0 : start + 1} - {Math.min(start + pageSize, total)} de {total}
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-xs">
            {page}/{pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(p + 1, pages))}
            className="px-2 py-1 border rounded disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
