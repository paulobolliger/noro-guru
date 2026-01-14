// components/admin/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Package, FileText, Users, MessageSquare, Mail, DollarSign,
  BarChart3, Settings, Calendar, Instagram, Menu, X, UserCheck,
  Sparkles, TrendingUp, FolderOpen
} from 'lucide-react';
import { useState, useEffect } from 'react';

interface SidebarProps {
  user: {
    id: string;
    nome: string | null;
    email: string;
    role: string;
    avatar_url?: string | null;
  };
  topbarColor?: string;
  logoUrl?: string; // NOVO: Prop para o URL do logo
  companyName?: string | null; // NOVO: Prop para o nome da empresa
  modules?: Record<string, boolean>; // NOVO: Prop para permissões de módulos
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

export default function Sidebar({ user, topbarColor, logoUrl, companyName, modules = {}, mobileOpen = false, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Close mobile sidebar on route change
  useEffect(() => {
    if (mobileOpen && setMobileOpen) {
      setMobileOpen(false);
    }
  }, [pathname]);

  // Helper to check if module is enabled
  // Default to TRUE if module key doesn't exist to avoid hard locks on new features
  // Only blocks if explicitly FALSE
  const isEnabled = (moduleId: string) => {
    if (!moduleId) return true;
    return modules[moduleId] !== false;
  };

  const menuGroups = [
    {
      title: 'Principal',
      items: [
        { href: '/', icon: Home, label: 'Dashboard', color: 'text-blue-400' },
      ]
    },
    {
      title: 'Comercial & CRM',
      items: [
        { href: '/leads', icon: Users, label: 'Leads', color: 'text-emerald-400', moduleId: 'leads' },
        { href: '/clientes', icon: UserCheck, label: 'Clientes', color: 'text-teal-400', moduleId: 'clientes' },
        { href: '/comunicacao', icon: MessageSquare, label: 'Comunicação', color: 'text-sky-400', moduleId: 'comunicacao' },
        { href: '/tarefas', icon: Calendar, label: 'Tarefas', color: 'text-indigo-400', moduleId: 'tarefas' },
      ].filter(item => isEnabled(item.moduleId))
    },
    {
      title: 'Vendas & Financeiro',
      items: [
        { href: '/orcamentos', icon: FileText, label: 'Orçamentos', color: 'text-amber-400', moduleId: 'orcamentos' },
        { href: '/pedidos', icon: Package, label: 'Pedidos', color: 'text-orange-400', moduleId: 'pedidos' },
        { href: '/financeiro', icon: DollarSign, label: 'Financeiro', color: 'text-green-400', moduleId: 'financeiro' },
      ].filter(item => isEnabled(item.moduleId))
    },
    {
      title: 'Marketing & IA',
      items: [
        { href: '/marketing', icon: Instagram, label: 'Marketing', color: 'text-fuchsia-400', moduleId: 'marketing' },
        { href: '/geracao', icon: Sparkles, label: 'Geração AI', color: 'text-rose-400', moduleId: 'geracao_ai' },
        { href: '/conteudo', icon: FolderOpen, label: 'Conteúdo', color: 'text-cyan-400', moduleId: 'conteudo' },
        { href: '/custos', icon: TrendingUp, label: 'Custos AI', color: 'text-pink-400', moduleId: 'custos_ai' },
      ].filter(item => isEnabled(item.moduleId))
    },
    {
      title: 'Sistema',
      items: [
        { href: '/relatorios', icon: BarChart3, label: 'Relatórios', color: 'text-purple-400', moduleId: 'relatorios' },
        { href: '/configuracoes', icon: Settings, label: 'Administração', color: 'text-gray-300' },
      ].filter(item => !item.moduleId || isEnabled(item.moduleId))
    }
  ].filter(group => group.items.length > 0);

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen?.(false)}
        />
      )}

      <div
        className={`
          fixed md:relative z-50 h-full
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          ${sidebarOpen ? 'w-64' : 'w-20'} 
          border-r border-white/10 text-slate-100 transition-all duration-300 flex flex-col
        `}
        style={{ backgroundColor: topbarColor || '#232452' }}
      >
        {/* Header */}
        <div
          className="h-16 px-4 border-b border-white/10 flex items-center justify-between flex-shrink-0"
        >
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              {logoUrl ? (
                <img src={logoUrl} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 truncate max-w-[180px]" title={companyName || 'NORO'}>
                  {companyName || 'NORO'}
                </div>
              )}

            </div>
          )}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:block text-slate-300 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-md"
            >
              {sidebarOpen ? <X size={20} strokeWidth={3} /> : <Menu size={20} strokeWidth={3} />}
            </button>
            <button
              onClick={() => setMobileOpen?.(false)}
              className="md:hidden text-slate-300 hover:text-white transition-colors p-1.5 hover:bg-white/10 rounded-md"
            >
              <X size={20} strokeWidth={3} />
            </button>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-3 overflow-y-auto overflow-x-hidden space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {sidebarOpen && (
                <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2 px-3">
                  {group.title}
                </h3>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = item.href === '/'
                    ? pathname === '/'
                    : pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${isActive
                        ? 'bg-white/20 text-white shadow-sm'
                        : 'hover:bg-white/10 text-white/80 hover:text-white'
                        }`}
                      title={!sidebarOpen ? item.label : undefined}
                    >
                      <item.icon
                        size={20}
                        strokeWidth={3}
                        className={`flex-shrink-0 ${isActive ? 'text-white' : `${item.color} group-hover:text-white transition-colors`}`}
                      />
                      {sidebarOpen && (
                        <span className={`text-sm font-bold transition-colors whitespace-nowrap ${isActive ? 'text-white' : 'group-hover:text-white'}`}>
                          {item.label}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>


      </div>
    </>
  );
}