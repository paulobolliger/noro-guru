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

interface TenantsTableProps {
  searchQuery?: string;
}

export default function TenantsTable({ searchQuery = "" }: TenantsTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [items, setItems] = useState<Tenant[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set('page', String(page));
        params.set('pageSize', String(pageSize));
        if (searchQuery) params.set('q', searchQuery);

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
  }, [page, pageSize, searchQuery]);

  const pages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;

  return (
    <div className="rounded-xl border-2 border-[#D4AF37] dark:border-[#4aede5] shadow-lg overflow-hidden">
      <div className="overflow-auto">
        <table className="w-full text-sm bg-white dark:bg-[#1a1625]">
          <thead className="text-left text-xs uppercase bg-gradient-to-b from-gray-100 dark:from-indigo-500/10 via-gray-50 dark:via-purple-500/5 to-transparent border-b-2 border-[#D4AF37] dark:border-[#4aede5]">
            <tr>
              <th className="p-3 font-bold text-[#D4AF37]">Nome</th>
              <th className="p-3 font-bold text-[#D4AF37]">Slug</th>
              <th className="p-3 font-bold text-[#D4AF37]">Plano</th>
              <th className="p-3 font-bold text-[#D4AF37]">Status</th>
              <th className="p-3 font-bold text-[#D4AF37]">Criado em</th>
              <th className="p-3 font-bold text-[#D4AF37]">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-white/10">
            {items.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                <td className="p-3 font-medium text-gray-900 dark:text-white">{t.name}</td>
                <td className="p-3 text-gray-700 dark:text-gray-300">{t.slug}</td>
                <td className="p-3 text-gray-700 dark:text-gray-300">{t.plan || "-"}</td>
                <td className="p-3 text-gray-700 dark:text-gray-300">{t.status || "-"}</td>
                <td className="p-3 text-gray-700 dark:text-gray-300">{t.created_at ? new Date(t.created_at).toLocaleString() : "-"}</td>
                <td className="p-3">
                  <Link href={`/tenants/${t.id}`} className="text-[#4aede5] hover:underline font-medium">
                    Ver Detalhes
                  </Link>
                </td>
              </tr>
            ))}

            {items.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-600 dark:text-gray-400">
                  Nenhum tenant encontrado.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-gray-600 dark:text-gray-400">
                  Carregando...
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between p-3 border-t-2 border-[#D4AF37] dark:border-[#4aede5] bg-gradient-to-b from-gray-100 dark:from-indigo-500/10 via-gray-50 dark:via-purple-500/5 to-transparent">
        <div className="text-xs text-gray-700 dark:text-gray-300">
          Mostrando {total === 0 ? 0 : start + 1} - {Math.min(start + pageSize, total)} de {total}
        </div>
        <div className="flex items-center gap-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-2 py-1 border-2 border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            Anterior
          </button>
          <span className="text-xs text-gray-700 dark:text-gray-300">
            {page}/{pages}
          </span>
          <button
            disabled={page >= pages}
            onClick={() => setPage((p) => Math.min(p + 1, pages))}
            className="px-2 py-1 border-2 border-gray-300 dark:border-gray-600 rounded disabled:opacity-50 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}
