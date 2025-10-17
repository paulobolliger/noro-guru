// components/admin/TopBar.tsx
'use client';

import { Search, Bell, ChevronRight, LogOut, Loader2 } from 'lucide-react';
import { useState } from 'react';
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
}

const generateBreadcrumbs = (pathname: string) => {
  if (pathname === '/admin') {
    return [{ label: 'Dashboard', href: '/admin' }];
  }

  const parts = pathname.replace('/admin', '').split('/').filter(Boolean);
  const breadcrumbs = [{ label: 'Dashboard', href: '/admin' }];

  let currentPath = '/admin';
  parts.forEach((part, index) => {
    const label = part.charAt(0).toUpperCase() + part.slice(1);
    currentPath += `/${part}`;
    
    if (index === parts.length - 1) {
       breadcrumbs.push({ label, href: '' });
    } else {
       breadcrumbs.push({ label, href: currentPath });
    }
  });

  return breadcrumbs;
};

export default function TopBar({ user, initialNotificacoes, logoUrl, topbarColor }: TopBarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(initialNotificacoes);
  const [showNotifications, setShowNotifications] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const breadcrumbs = generateBreadcrumbs(pathname);
  const naoLidas = notificacoes.filter(n => !n.lida).length;
  
  const finalLogoUrl = logoUrl || "https://res.cloudinary.com/dhqvjxgue/image/upload/c_crop,ar_4:3/v1744736404/logo_branco_sem_fundo_rucnug.png";

  return (
    <div 
      // A AÇÃO ESTÁ AQUI: Ajustei o padding para centralizar o logo de 60px. A altura total será de 76px.
      className="flex items-center border-b border-white/10 px-6 py-2 sticky top-0 z-20 text-white"
      style={{ backgroundColor: topbarColor || '#232452' }}
    >
      <div className="flex items-center justify-between w-full">
        {/* Lado Esquerdo: Logo e Breadcrumbs */}
        <div className="flex items-center gap-4">
          <Link href="/admin">
            {/* E A AÇÃO ESTÁ AQUI: Contêiner do logo com as novas dimensões */}
            <div className="relative h-[60px] w-[240px]">
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
          {/* Search Bar */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar..."
              className="w-full pl-9 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
          
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              title="Notificações"
            >
              <Bell size={20} />
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
                  <Link href="/admin/notificacoes" className="text-sm text-blue-600 hover:text-blue-700 font-medium" onClick={() => setShowNotifications(false)}>Ver todas</Link>
                </div>
              </div>
            )}
          </div>

          {/* User Avatar */}
          <div className="flex items-center gap-3">
             <img 
               src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.nome || user.email}&background=random&color=fff`} 
               alt="Avatar"
               className="w-8 h-8 rounded-full border-2 border-white/50"
             />
             <span className="hidden lg:block text-sm font-semibold">{user.nome || user.email?.split('@')[0]}</span>
          </div>

          {/* Botão de Logout */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="p-2 text-gray-300 hover:text-white hover:bg-red-500/50 rounded-lg transition-colors"
            title="Sair"
          >
            {loggingOut ? <Loader2 className="animate-spin" size={20} /> : <LogOut size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}