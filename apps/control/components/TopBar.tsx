// components/admin/TopBar.tsx
'use client';

import { Search, Bell, ChevronRight } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Breadcrumbs from './layout/Breadcrumbs';
import ThemeToggle from './theme/ThemeToggle';
import CommandPalette from './command/CommandPalette';
import { createClient } from "@lib/supabase/client";
import type { Database } from "@noro-types/supabase";

type NomadeUser = Database['public']['Tables']['noro_users']['Row'];
type Notificacao = Database['public']['Tables']['noro_notificacoes']['Row'];

interface TopBarProps {
  user: NomadeUser;
  initialNotificacoes: Notificacao[];
}

// Extend Breadcrumbs with optional last label override (e.g., client name)

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
        const { data, error } = await supabase
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
  
  // Foca no input quando a busca é aberta
  useEffect(() => {
    if (isSearchOpen) {
      searchInputRef.current?.focus();
    }
  }, [isSearchOpen]);

  // Hotkeys: '/' focuses search, 'Esc' blurs
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
  const naoLidas = notificacoes.filter(n => !n.lida).length;
  
  const finalLogoUrl = '';

  return (
    <div 
      className="flex h-16 items-center border-b border-default border-default border-default px-6 sticky top-0 z-20 surface-header backdrop-blur"
    >
      <div className="flex items-center justify-between w-full">
        {/* Lado Esquerdo: Logo e Breadcrumbs */}
        <div className="flex items-center gap-4">
          <Link href={pathname.startsWith('/control') ? '/control' : '/admin'} className="logo-text font-bold tracking-tight text-slate-100">NORO</Link>
          
          <div className="hidden md:flex items-center gap-2 text-sm text-primary font-medium">
            <ChevronRight size={16} />
            <Breadcrumbs baseHref={base} baseLabel="Dashboard" currentLabel={isClientePage ? (clienteNome || undefined) : undefined} />
          </div>
        </div>

        {/* Lado Direito: Ações */}
        <div className="flex items-center gap-4">
          {/* Search Bar Interativa */}
          <div className="relative flex items-center justify-end">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => setIsSearchOpen(false)}
              placeholder={isSearchOpen ? 'Buscar...' : ''}
              className={`
                transition-all duration-200 ease-out
                h-10 rounded-lg bg-white/5 border border-default text-primary placeholder:text-muted
                focus:outline-none focus:ring-2 focus:ring-indigo-400/40
                ${isSearchOpen ? 'w-64 pl-10 pr-4 cursor-text' : 'w-10 pl-2 cursor-pointer'}
              `}
            />
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none" 
              size={18} 
            />
          </div>
          
          {/* Tema */}
          <ThemeToggle />

          {/* Command Palette (Ctrl/Cmd+K) */}
          <CommandPalette />

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-primary hover:bg-white/10 rounded-lg transition-colors"
              title="Notificações"
            >
              <Bell size={20} />
              {naoLidas > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[1.1rem] h-4 px-1 rounded-full bg-red-500 text-white text-[10px] leading-4 text-center">
                  {naoLidas > 9 ? '9+' : naoLidas}
                </span>
              )}
            </button>
              {showNotifications && (
               <div className="absolute right-0 mt-2 w-80 surface-card rounded-lg shadow-lg border border-default overflow-hidden z-50">
                <div className="p-4 border-b border-default border-default border-white/10">
                  <h3 className="font-semibold">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto divide-y divide-white/5">
                  {notificacoes.length === 0 ? (
                    <div className="p-4 text-center text-muted">Nenhuma notificação</div>
                  ) : (
                    notificacoes.map((notif) => (
                      <Link key={notif.id} href={notif.link || '/admin'} onClick={() => setShowNotifications(false)} className={`block p-4 hover:bg-white/[0.03] transition-colors ${!notif.lida ? 'bg-blue-50' : ''}`}>
                        <p className="font-medium text-sm">{notif.titulo}</p>
                        {notif.mensagem && (<p className="text-sm text-muted mt-1">{notif.mensagem}</p>)}
                        <p className="text-xs text-muted mt-2">{new Date(notif.created_at).toLocaleString('pt-BR')}</p>
                      </Link>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <Link href="/notificacoes" className="text-sm text-indigo-300 hover:text-indigo-200 font-medium" onClick={() => setShowNotifications(false)}>Ver todas</Link>
                  <button
                    className="text-xs text-muted hover:text-primary"
                    onClick={async () => {
                      try {
                        await supabase.from('noro_notificacoes').update({ lida: true }).eq('user_id', user.id);
                        setNotificacoes((prev) => prev.map((n) => ({ ...n, lida: true })));
                      } catch {}
                    }}
                  >
                    Marcar todas como lidas
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
