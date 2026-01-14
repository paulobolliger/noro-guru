// components/admin/Sidebar.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home, Users, MessageSquare, DollarSign,
  Settings, Key as KeyIcon,
  BookOpenText, ShieldCheck, LifeBuoy, CheckSquare, Globe,
  Building2, Layers, GlobeLock, Webhook
} from 'lucide-react';

interface SidebarProps {
  user: {
    id: string;
    nome: string | null;
    email: string;
    role: string;
    avatar_url?: string | null;
  };
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen, mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();

  const areaComercial = [
    { href: '/control', icon: 'Home', label: 'Dashboard', color: 'text-blue-400' },
    { href: '/control/leads', icon: 'Users', label: 'Leads', color: 'text-indigo-400' },
    { href: '/control/orgs', icon: 'Building2', label: 'Clientes/Empresas', color: 'text-violet-400' },
    { href: '/comunicacao', icon: 'MessageSquare', label: 'Chat & Atendimento', color: 'text-pink-400' },
    { href: '/tarefas', icon: 'CheckSquare', label: 'Tarefas', color: 'text-sky-400' },
  ] as const;

  const areaOperacoes = [
    { href: '/tenants', icon: 'Layers', label: 'Tenants', color: 'text-emerald-400' },
    { href: '/custom-domains', icon: 'Globe', label: 'Domínios Clientes', color: 'text-teal-400' },
    { href: '/support', icon: 'LifeBuoy', label: 'Suporte', color: 'text-cyan-400' },
  ] as const;

  const areaBilling = [
    { href: '/billing', icon: 'DollarSign', label: 'Billing', color: 'text-amber-400' },
  ] as const;

  const areaAdministracao = [
    { href: '/domains', icon: 'GlobeLock', label: 'Domínios (Sistema)', color: 'text-slate-400' },
    { href: '/webhooks', icon: 'Webhook', label: 'Webhooks', color: 'text-orange-400' },
    { href: '/api-keys', icon: 'KeyIcon', label: 'API Keys', color: 'text-rose-400' },
    { href: '/configuracoes', icon: 'Settings', label: 'Configurações', color: 'text-gray-400' },
    { href: '/docs', icon: 'BookOpenText', label: 'Documentação', color: 'text-lime-400' },
    { href: '/security', icon: 'ShieldCheck', label: 'Segurança', color: 'text-red-400' },
  ] as const;

  const iconMap: Record<string, any> = {
    Home, Users, MessageSquare, DollarSign, Settings, KeyIcon, BookOpenText,
    ShieldCheck, LifeBuoy, CheckSquare, Globe, Building2, Layers, GlobeLock, Webhook
  };

  const NavGroup = ({ title, items }: { title: string, items: readonly { href: string; icon: string; label: string; color: string }[] }) => (
    <div className={`space-y-1 ${isOpen ? 'mt-6 pt-4 border-t border-white/10 first:border-0 first:mt-0 first:pt-0' : 'mt-4'}`}>
      {isOpen && (
        <div className="px-4 text-xs uppercase tracking-wide text-gray-400 mb-2 font-semibold">{title}</div>
      )}
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
        const Icon = iconMap[item.icon] || Home;
        const isChatRoute = item.href === '/comunicacao';

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            onClick={() => setMobileOpen(false)}
            className={`sidebar-link ${isActive ? 'sidebar-link-active' : ''} ${isChatRoute ? 'relative' : ''} ${!isOpen ? 'justify-center' : ''}`}
          >
            <Icon
              size={20}
              strokeWidth={2}
              className={`flex-shrink-0 transition-colors ${isActive ? 'text-white' : item.color} group-hover:text-white`}
            />
            {isOpen && (
              <>
                <span className="font-medium truncate">{item.label}</span>
                {isChatRoute && (
                  <span className="ml-auto bg-yellow-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
              </>
            )}
            {!isOpen && isChatRoute && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            )}
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`surface-sidebar hidden md:flex flex-col transition-all duration-300 border-r border-white/10 ${isOpen ? 'w-64' : 'w-16'}`}
      >
        {/* Logo */}
        <div className={`flex items-center ${isOpen ? 'justify-between px-4' : 'justify-center'} h-16 border-b border-white/10`}>
          {isOpen ? (
            <>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm">
                  N
                </div>
                <span className="font-bold text-white text-lg">NORO</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                ←
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
            >
              →
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <NavGroup title="Comercial" items={areaComercial} />
          <NavGroup title="Operações" items={areaOperacoes} />
          <NavGroup title="Billing & Financeiro" items={areaBilling} />
          <NavGroup title="Administração" items={areaAdministracao} />
        </nav>
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`surface-sidebar fixed inset-y-0 left-0 z-30 w-64 flex flex-col md:hidden transition-transform duration-300 border-r border-white/10 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm">
              N
            </div>
            <span className="font-bold text-white text-lg">NORO</span>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-4 overflow-y-auto">
          <NavGroup title="Comercial" items={areaComercial} />
          <NavGroup title="Operações" items={areaOperacoes} />
          <NavGroup title="Billing & Financeiro" items={areaBilling} />
          <NavGroup title="Administração" items={areaAdministracao} />
        </nav>
      </aside>
    </>
  );
}
