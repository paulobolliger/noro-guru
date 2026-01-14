// components/admin/TopBar.tsx
'use client';

import { Search, Bell, ChevronRight, Menu, LogOut, Loader2, User } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { Database } from '@/types/supabase';

type NomadeUser = Database['public']['Tables']['noro_users']['Row'];
type Notificacao = Database['public']['Tables']['noro_notificacoes']['Row'];

interface TopBarProps {
  user: NomadeUser;
  initialNotificacoes: Notificacao[];
  logoUrl?: string;
  topbarColor?: string;
  onMenuClick?: () => void;
}

const generateBreadcrumbs = (pathname: string, clienteNome: string | null) => {
  if (pathname === '/admin') {
    return [{ label: 'Dashboard', href: '/admin' }];
  }

  const parts = pathname.replace('/admin', '').split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Dashboard', href: '/admin' }];

  let currentPath = '/admin';
  parts.forEach((part, index) => {
    const isLastPart = index === parts.length - 1;
    let label = part.charAt(0).toUpperCase() + part.slice(1);

    if (isLastPart && pathname.includes('/clientes/') && clienteNome) {
      label = clienteNome;
    }
    else if (isLastPart && pathname.includes('/clientes/')) {
      label = 'Carregando cliente...'
    }

    currentPath += `/${part}`;

    breadcrumbs.push({
      label,
      href: isLastPart ? '' : currentPath
    });
  });

  return breadcrumbs;
};

export default function TopBar({ user, initialNotificacoes, logoUrl, topbarColor, onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(initialNotificacoes);
  const [showNotifications, setShowNotifications] = useState(false);
  const [clienteNome, setClienteNome] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

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

  const breadcrumbs = generateBreadcrumbs(pathname, clienteNome);
  const naoLidas = notificacoes.filter(n => !n.lida).length;

  const finalLogoUrl = logoUrl || "https://res.cloudinary.com/dhqvjxgue/image/upload/c_crop,ar_4:3/v1744736404/logo_branco_sem_fundo_rucnug.png";

  return (
    <div
      className="flex h-16 items-center border-b border-white/10 px-4 md:px-6 sticky top-0 z-20 text-white"
      style={{ backgroundColor: topbarColor || '#232452' }}
    >
      <div className="flex items-center justify-between w-full">
        {/* Lado Esquerdo: Logo e Breadcrumbs */}
        <div className="flex items-center gap-2 md:gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden text-white/70 hover:text-white p-1"
          >
            <Menu size={24} />
          </button>

          <Link href="/admin">
            <div className="relative h-14 w-40">
              <Image
                src={finalLogoUrl}
                alt="Logo do Painel"
                fill
                priority
                style={{ objectFit: 'contain' }}
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-2 text-sm text-gray-300">
            <ChevronRight size={16} />
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-white">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-white">{crumb.label}</span>
                )}
                {index < breadcrumbs.length - 1 && <ChevronRight size={16} />}
              </div>
            ))}
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
                transition-all duration-300 ease-in-out
                h-10 rounded-lg bg-white/10 border border-white/20 text-white
                focus:outline-none focus:ring-2 focus:ring-white/50
                ${isSearchOpen ? 'w-64 pl-10 pr-4 cursor-text' : 'w-10 pl-2 cursor-pointer'}
              `}
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 pointer-events-none"
              size={18}
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-yellow-400 hover:text-yellow-200 hover:bg-white/10 rounded-lg transition-colors"
              title="Notificações"
            >
              <Bell size={20} strokeWidth={3} />
              {naoLidas > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50 text-gray-900">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold">Notificações</h3>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notificacoes.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">Nenhuma notificação</div>
                  ) : (
                    notificacoes.map((notif) => (
                      <Link key={notif.id} href={notif.link || '/admin'} onClick={() => setShowNotifications(false)} className={`block p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 ${!notif.lida ? 'bg-blue-50' : ''}`}>
                        <p className="font-medium text-sm">{notif.titulo}</p>
                        {notif.mensagem && (<p className="text-sm text-gray-600 mt-1">{notif.mensagem}</p>)}
                        <p className="text-xs text-gray-400 mt-2">{new Date(notif.created_at).toLocaleString('pt-BR')}</p>
                      </Link>
                    ))
                  )}
                </div>
                <div className="p-4 border-t border-gray-200 text-center">
                  <Link href="/notificacoes" className="text-sm text-blue-600 hover:text-blue-700 font-medium" onClick={() => setShowNotifications(false)}>Ver todas</Link>
                </div>
              </div>
            )}
          </div>


          <div className="h-6 w-px bg-white/20"></div>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/20">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={18} className="text-white/70" />
                )}
              </div>
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-white leading-tight">{user.nome || 'Usuário'}</p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              disabled={loggingOut}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors ml-1"
              title="Sair"
            >
              {loggingOut ? <Loader2 className="animate-spin" size={20} /> : <LogOut size={20} strokeWidth={3} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}