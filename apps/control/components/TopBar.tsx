// components/admin/TopBar.tsx
'use client';

import { Bell, ChevronRight, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Breadcrumbs from './layout/Breadcrumbs';
import ThemeToggle from './theme/ThemeToggle';
import CommandPalette from './command/CommandPalette';
import GlobalSearch from './GlobalSearch';
import { createClient } from '@lib/supabase/client';
import type { Database } from '@noro-types/supabase';
import packageJson from '@/package.json';

type NomadeUser = Database['public']['Tables']['noro_users']['Row'];
type Notificacao = Database['public']['Tables']['noro_notificacoes']['Row'];

interface TopBarProps {
  user: NomadeUser;
  initialNotificacoes: Notificacao[];
}

export default function TopBar({ user, initialNotificacoes }: TopBarProps) {
  const pathname = usePathname();
  const supabase = createClient();
  const version = packageJson.version;

  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(initialNotificacoes);
  const [showNotifications, setShowNotifications] = useState(false);
  const [clienteNome, setClienteNome] = useState<string | null>(null);
  const [unreadMessages, setUnreadMessages] = useState(0);

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

  // Buscar mensagens não lidas
  useEffect(() => {
    const fetchUnreadMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('conversations')
          .select('unread_count')
          .eq('status', 'active');
        
        if (data && !error) {
          const total = data.reduce((sum, conv) => sum + (conv.unread_count || 0), 0);
          setUnreadMessages(total);
        }
      } catch (error) {
        console.error('Error fetching unread messages:', error);
      }
    };

    fetchUnreadMessages();

    // Atualizar a cada 30 segundos
    const interval = setInterval(fetchUnreadMessages, 30000);
    
    return () => clearInterval(interval);
  }, [supabase]);

  const base = pathname.startsWith('/control') ? '/control' : '/admin';
  const isClientePage = pathname.includes('/admin/clientes/');
  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <div className="surface-header flex h-16 items-center px-6 sticky top-0 z-30 backdrop-blur">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href={pathname.startsWith('/control') ? '/control' : '/admin'}
            className="flex items-center gap-3"
          >
            <div>
              <div className="logo-text font-display text-xl font-bold tracking-tight text-white">
                NORO | CONTROL
              </div>
              <p className="text-xs text-[#D4AF37] -mt-0.5">v{version}</p>
            </div>
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
          <GlobalSearch />

          {/* Chat Button with Badge */}
          <Link
            href="/comunicacao"
            className="btn-secondary relative flex h-10 w-10 items-center justify-center rounded-lg hover:scale-105 transition-transform"
            title="Chat e Atendimento"
          >
            <MessageSquare size={20} />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-[1.1rem] rounded-full bg-[#D4AF37] px-1 text-[10px] leading-4 text-[#1b1b1b] font-bold text-center animate-pulse">
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </span>
            )}
          </Link>

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
