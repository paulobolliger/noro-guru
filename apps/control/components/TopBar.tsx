// components/admin/TopBar.tsx
'use client';

import { Bell, MessageSquare, LogOut, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Breadcrumbs from './layout/Breadcrumbs';
import CommandPalette from './command/CommandPalette';
import GlobalSearch from './GlobalSearch';
import { createClient } from '@noro/lib/supabase/client';

type NomadeUser = {
  id: string;
  nome: string | null;
  email: string;
  role: string;
  avatar_url?: string | null;
};

type Notificacao = {
  id: string;
  user_id: string;
  titulo: string;
  mensagem: string | null;
  link: string | null;
  lida: boolean;
  created_at: string;
};

interface TopBarProps {
  user: NomadeUser;
  initialNotificacoes: Notificacao[];
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: (open: boolean) => void;
}

export default function TopBar({
  user,
  initialNotificacoes,
  sidebarOpen,
  setSidebarOpen,
  mobileMenuOpen,
  setMobileMenuOpen
}: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(initialNotificacoes);
  const [showNotifications, setShowNotifications] = useState(false);
  const [clienteNome, setClienteNome] = useState<string | null>(null);
  const [segmentOverrides, setSegmentOverrides] = useState<Record<string, string>>({});
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const parts = pathname.split('/');

    // Logic for Clients (Admin)
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

    // Logic for Tenants (Control)
    if (pathname.includes('/tenants/')) {
      const tenantIndex = parts.indexOf('tenants');
      if (tenantIndex !== -1 && parts[tenantIndex + 1]) {
        const tenantId = parts[tenantIndex + 1];

        // Only fetch if valid ID and not already fetched
        if (tenantId && tenantId !== 'new' && !segmentOverrides[tenantId]) {
          const fetchTenantSlug = async () => {
            const { data } = await supabase
              .schema('cp')
              .from('tenants')
              .select('slug')
              .eq('id', tenantId)
              .maybeSingle();

            if (data?.slug) {
              setSegmentOverrides(prev => ({ ...prev, [tenantId]: data.slug }));
            }
          };
          fetchTenantSlug();
        }
      }
    }
  }, [pathname, supabase, segmentOverrides]);

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

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const toggleSidebar = () => {
    // If mobile, toggle mobile menu
    if (window.innerWidth < 768 && setMobileMenuOpen) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else if (setSidebarOpen) {
      // If desktop, toggle sidebar collapse
      setSidebarOpen(!sidebarOpen);
    }
  };

  const base = pathname.startsWith('/control') ? '/control' : '/admin';
  const isClientePage = pathname.includes('/admin/clientes/');
  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <div className="surface-header flex h-16 items-center px-4 md:px-6 w-full">
      <div className="flex w-full items-center justify-between">

        {/* Lado Esquerdo: Breadcrumbs */}
        <div className="flex items-center gap-2">
          <Breadcrumbs
            baseHref={base}
            baseLabel="Dashboard"
            currentLabel={isClientePage ? clienteNome || undefined : undefined}
            segmentOverrides={segmentOverrides}
          />
        </div>

        {/* Lado Direito: Actions e User Profile */}
        <div className="flex items-center gap-3 md:gap-4">
          <GlobalSearch />

          {/* Chat Button with Badge */}
          <Link
            href="/comunicacao"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:text-white hover:bg-indigo-600 transition-colors"
            title="Chat e Atendimento"
          >
            <MessageSquare size={18} />
            {unreadMessages > 0 && (
              <span className="absolute -top-1 -right-1 h-4 min-w-[1.1rem] rounded-full bg-red-500 px-1 text-[10px] leading-4 text-white font-bold text-center animate-pulse">
                {unreadMessages > 9 ? '9+' : unreadMessages}
              </span>
            )}
          </Link>
          <CommandPalette />

          <div className="relative">
            <button
              onClick={() => setShowNotifications((prev) => !prev)}
              className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 hover:text-white hover:bg-indigo-600 transition-colors"
              title="Notificações"
            >
              <Bell size={18} />
              {naoLidas > 0 && (
                <span className="absolute -top-1 -right-1 h-4 min-w-[1.1rem] rounded-full bg-red-500 px-1 text-[10px] leading-4 text-white text-center">
                  {naoLidas > 9 ? '9+' : naoLidas}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg z-50">
                <div className="border-b border-gray-200 p-4">
                  <h3 className="text-gray-900 text-sm font-semibold">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto divide-y divide-gray-200">
                  {notificacoes.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">Nenhuma notificação</div>
                  ) : (
                    notificacoes.map((notif) => (
                      <Link
                        key={notif.id}
                        href={notif.link || '/admin'}
                        onClick={() => setShowNotifications(false)}
                        className={`block p-4 transition-colors ${!notif.lida ? 'bg-indigo-50' : ''} hover:bg-gray-50`}
                      >
                        <p className="text-sm font-medium text-gray-900">{notif.titulo}</p>
                        {notif.mensagem && <p className="mt-1 text-sm text-gray-600">{notif.mensagem}</p>}
                        <p className="mt-2 text-xs text-gray-500">
                          {new Date(notif.created_at).toLocaleString('pt-BR')}
                        </p>
                      </Link>
                    ))
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 border-t border-gray-200 p-3">
                  <Link
                    href="/notificacoes"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                    onClick={() => setShowNotifications(false)}
                  >
                    Ver todas
                  </Link>
                  <button
                    className="text-xs text-gray-600 hover:text-gray-900"
                    onClick={async () => {
                      try {
                        await supabase.from('noro_notificacoes').update({ lida: true }).eq('user_id', user.id);
                        setNotificacoes(notificacoes.map(n => ({ ...n, lida: true })));
                      } catch (error) {
                        console.error(error);
                      }
                    }}
                  >
                    Marcar todas como lidas
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-gray-200 mx-2"></div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-2">
            <img
              src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.nome || user.email}&background=4F46E5&color=fff`}
              alt={user.nome || 'User'}
              className="w-9 h-9 rounded-full border-2 border-gray-200"
            />
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-red-600 hover:text-white hover:bg-red-600 rounded-lg transition-colors"
              title="Sair"
            >
              {loggingOut ? <Loader2 className="animate-spin" size={16} /> : <LogOut size={16} />}
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
