// components/admin/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Package, FileText, Users, MessageSquare, Mail, DollarSign,
  BarChart3, Settings, Calendar, Instagram, Menu, X, UserCheck,
  LogOut, Loader2, Sparkles, TrendingUp, FolderOpen
} from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface SidebarProps {
  user: {
    id: string;
    nome: string | null;
    email: string;
    role: string;
    avatar_url?: string | null;
  };
  topbarColor?: string;
}

export default function Sidebar({ user, topbarColor }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const version = '0.1.0';

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const menuItems = [
    { href: '/', icon: Home, label: 'Dashboard' },
    { href: '/leads', icon: Users, label: 'Leads' },
    { href: '/clientes', icon: UserCheck, label: 'Clientes' },
    { href: '/orcamentos', icon: FileText, label: 'Orçamentos' },
    { href: '/pedidos', icon: Package, label: 'Pedidos' },
    { href: '/financeiro', icon: DollarSign, label: 'Financeiro' },
    { href: '/tarefas', icon: Calendar, label: 'Tarefas' },
    { href: '/relatorios', icon: BarChart3, label: 'Relatórios' },
    { href: '/geracao', icon: Sparkles, label: 'Geração AI' },
    { href: '/conteudo', icon: FolderOpen, label: 'Conteúdo' },
    { href: '/custos', icon: TrendingUp, label: 'Custos AI' },
    { href: '/marketing', icon: Instagram, label: 'Marketing' },
    { href: '/email', icon: Mail, label: 'E-mails' },
    { href: '/comunicacao', icon: MessageSquare, label: 'Comunicação' },
    { href: '/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  return (
    <aside
      className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-slate-900 text-slate-300 transition-all duration-300 flex flex-col h-screen border-r border-slate-800`}
      role="navigation"
      aria-label="Menu principal"
    >
      {/* Header */}
      <div
        className="h-16 px-4 border-b border-slate-800 flex items-center justify-between"
      >
        {sidebarOpen && (
          <div>
            <div className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              NORO
            </div>
            <p className="text-xs text-slate-500 -mt-1">v{version}</p>
          </div>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          aria-label={sidebarOpen ? 'Recolher menu' : 'Expandir menu'}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = item.href === '/' 
              ? pathname === '/' 
              : pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-900/30'
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon
                  size={20}
                  strokeWidth={2.5}
                  className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}
                  aria-hidden="true"
                />
                {sidebarOpen && (
                    <span className={`font-medium transition-colors ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                        {item.label}
                    </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Rodapé com Utilizador e Botão de Logout */}
      <div className="border-t border-slate-800 p-4 bg-slate-950">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.nome || user.email}&background=5053c4&color=fff`}
            alt={`Avatar de ${user.nome || user.email}`}
            className="w-8 h-8 rounded-full ring-2 ring-slate-700"
          />
          {sidebarOpen && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-slate-100 truncate">{user.nome || user.email?.split('@')[0]}</p>
              <p className="text-xs text-slate-400 truncate">{user.role === 'admin' ? 'Administrador' : 'Usuário'}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            aria-label={loggingOut ? 'Saindo...' : 'Sair da aplicação'}
            title="Sair"
          >
            {loggingOut ? <Loader2 className="animate-spin" size={20} aria-hidden="true" /> : <LogOut size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>
    </aside>
  );
}