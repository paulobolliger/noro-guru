// components/admin/TopBar.tsx
'use client';

import { Search, Bell, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Breadcrumbs from './layout/Breadcrumbs';
import ThemeToggle from './theme/ThemeToggle';
import CommandPalette from './command/CommandPalette';
import { createClient } from '@lib/supabase/client';
import type { Database } from '@noro-types/supabase';

type NomadeUser = Database['public']['Tables']['noro_users']['Row'];
type Notificacao = Database['public']['Tables']['noro_notificacoes']['Row'];

interface TopBarProps {
  user: NomadeUser;
  initialNotificacoes: Notificacao[];
}

export default function TopBar({ user, initialNotificacoes }: TopBarProps) {
  const pathname = usePathname();
  const supabase = createClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(initialNotificacoes);
  const [showNotifications, setShowNotifications] = useState(false);
  const [clienteNome, setClienteNome] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const parts = pathname.split('/');
    if (parts[1] === 'admin' && parts[2] === 'clientes' && parts.length === 4 && parts[3] && parts[3] !== 'novo') {
      const clienteId = parts[3];

      const fetchClienteName = async () => {
        setClienteNome('Carregando...');
        const { data } = await supabase
          .from('noro_clientes')
          .select('nome')
          .eq('id', clienteId)
          .single();

        if (data?.nome) {
          setClienteNome(data.nome);
        } else {
          setClienteNome(clienteId.substring(0, 8) + '...');
        }
      };

      fetchClienteName();
    } else {
      setClienteNome(null);
    }
  }, [pathname, supabase]);

  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const typing = tag === 'input' || tag === 'textarea' || (e.target as HTMLElement)?.isContentEditable;
      if (!typing && e.key === '/') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 0);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        (document.activeElement as HTMLElement)?.blur?.();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const base = pathname.startsWith('/control') ? '/control' : '/admin';
  const isClientePage = pathname.includes('/admin/clientes/');
  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <div className="surface-header flex h-16 items-center px-6 sticky top-0 z-30 backdrop-blur">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={pathname.startsWith('/control') ? '/control' : '/admin'}
            className="logo-text font-display text-2xl font-semibold text-white"
          >
            NORO
          </Link>

          <div className="hidden md:flex items-center gap-2 text-sm breadcrumb-text font-medium">
            <ChevronRight size={16} className="topbar-icon" />
            <Breadcrumbs
              baseHref={base}
              baseLabel="Dashboard"
              currentLabel={isClientePage ? clienteNome || undefined : undefined}
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-end">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setIsSearchOpen(false)}
              placeholder={isSearchOpen ? 'Buscar...' : ''}
              className={`topbar-search h-10 rounded-lg text-sm transition-all duration-200 ease-in-out focus-visible:outline-none ${
                isSearchOpen ? 'w-64 pl-10 pr-4 cursor-text' : 'w-10 pl-2 cursor-pointer'
              }`}
            />
            <Search
              className="topbar-icon pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 transform"
              size={18}
            />
          </div>

          <ThemeToggle />
          <CommandPalette />

          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="btn-secondary relative flex h-10 w-10 items-center justify-center rounded-lg"
              title="Notificacoes"
            >
              <Bell size={20} />
              {naoLidas > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[1.1rem] rounded-full bg-red-500 px-1 text-[10px] leading-4 text-white text-center">
                  {naoLidas > 9 ? '9+' : naoLidas}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="surface-card dropdown-pop absolute right-0 mt-2 w-80 overflow-hidden rounded-lg border border-default z-50">
                <div className="border-b border-default p-4">
                  <h3 className="text-heading text-sm font-semibold">Notificacoes</h3>
                </div>
                <div className="max-h-96 overflow-y-auto divide-y divide-default">
                  {notificacoes.length === 0 ? (
                    <div className="p-4 text-center text-secondary">Nenhuma notificacao</div>
                  ) : (
                    notificacoes.map((notif) => (
                      <Link
                        key={notif.id}
                        href={notif.link || '/admin'}
                        onClick={() => setShowNotifications(false)}
                        className={`block p-4 transition-colors ${
                          !notif.lida ? 'bg-[rgba(29,211,192,0.12)]' : ''
                        } hover:bg-[rgba(29,211,192,0.18)]`}
                      >
                        <p className="text-sm font-medium text-heading">{notif.titulo}</p>
                        {notif.mensagem && <p className="mt-1 text-sm text-secondary">{notif.mensagem}</p>}
                        <p className="mt-2 text-xs text-secondary">
                          {new Date(notif.created_at).toLocaleString('pt-BR')}
                        </p>
                      </Link>
                    ))
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-default p-3">
                  <Link
                    href="/notificacoes"
                    className="footer-link text-sm font-medium"
                    onClick={() => setShowNotifications(false)}
                  >
                    Ver todas
                  </Link>
                  <button
                    className="text-xs text-secondary hover:text-primary"
                    onClick={async () => {
                      try {
                        await supabase.from('noro_notificacoes').update({ lida: true }).eq('user_id', user.id);
                        setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
                      } catch {
                        // silent
                      }
                    }}
                  >
                    Marcar como lidas
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
