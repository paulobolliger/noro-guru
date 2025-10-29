// components/admin/Sidebar.tsx
'use client';

import Link from 'next/link';
import * as Popover from '@radix-ui/react-popover';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, Users, MessageSquare, DollarSign,
  Settings, Calendar, Menu, X, UserCheck, Key as KeyIcon,
  LogOut, Loader2, BookOpenText, ShieldCheck
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import packageJson from '@/package.json';
import { createClient } from '@lib/supabase/client';

interface SidebarProps {
  user: {
    id: string;
    nome: string | null;
    email: string;
    role: string;
    avatar_url?: string | null;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('noro.sidebar');
    return saved ? saved === '1' : true;
  });
  const [loggingOut, setLoggingOut] = useState(false);
  const version = packageJson.version;

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // ASCII-only labels to avoid UTF-8 issues on Windows
  const areaComercial = [
    { href: '/control', icon: Home, label: 'Dashboard' },
    { href: '/control/leads', icon: Users, label: 'Leads' },
    { href: '/control/orgs', icon: UserCheck, label: 'Clientes/Empresas' },
  ] as const;

  const areaOperacoes = [
    { href: '/tenants', icon: Users, label: 'Tenants' },
    { href: '/domains', icon: Settings, label: 'Dominios' },
    { href: '/api-keys', icon: KeyIcon, label: 'API Keys' },
    { href: '/webhooks', icon: MessageSquare, label: 'Webhooks' },
    { href: '/webhooks/endpoints', icon: Settings, label: 'Webhook Endpoints' },
    { href: '/control/tasks', icon: Calendar, label: 'Tarefas' },
  ] as const;

  const areaBilling = [
    { href: '/billing', icon: DollarSign, label: 'Billing' },
    { href: '/financeiro', icon: BookOpenText, label: 'Financeiro' },
  ] as const;

  const areaAdministracao = [
    { href: '/users', icon: UserCheck, label: 'Usuarios' },
    { href: '/auditoria', icon: ShieldCheck, label: 'Auditoria' },
    { href: '/configuracoes', icon: Settings, label: 'Configuracoes' },
  ] as const;

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('noro.sidebar', sidebarOpen ? '1' : '0');
  }, [sidebarOpen]);

  const NavGroup = ({ title, items }: { title: string, items: readonly { href: string; icon: any; label: string }[] }) => (
    <div className="space-y-1 mt-4">
      <div className="px-4 text-[11px] uppercase tracking-wide text-slate-400 mb-1">{title}</div>
      {items.map((item) => {
        // Active state only for exact path match to avoid multiple items active
        const isActive = pathname === item.href;
        const Icon = item.icon as any;
        const linkEl = (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            className={`group flex items-center gap-3 px-4 py-3 rounded-lg transition-all motion-safe:transform motion-safe:hover:scale-[1.02] ${isActive ? 'bg-white/5 text-indigo-300 ring-1 ring-white/10' : 'hover:bg-white/5 text-slate-300'}`}
          >
            <Icon size={20} strokeWidth={2.25} className={`transition-transform motion-safe:group-hover:translate-x-0.5 ${isActive ? 'text-indigo-300' : 'text-slate-300'}`} />
            {sidebarOpen && (<span className={`font-medium transition-colors ${isActive ? 'text-indigo-300' : 'text-slate-300'}`}>{item.label}</span>)}
          </Link>
        );
        if (sidebarOpen) return linkEl;
        return (
          <Popover.Root key={item.href}>
            <Popover.Trigger asChild>
              {linkEl}
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content side="right" align="start" sideOffset={10} className="surface-card px-3 py-2 text-sm text-primary shadow-xl border border-white/10 rounded-lg">
                <div className="font-medium mb-2">{item.label}</div>
                {item.href === '/control/leads' && (
                  <div className="flex flex-col gap-2">
                    <Link href="/control/leads?open=create" className="inline-flex items-center gap-2 text-xs bg-indigo-600/90 hover:bg-indigo-600 text-white px-2.5 py-1.5 rounded-md">
                      + Novo Lead
                    </Link>
                    <Link href="/control/leads?open=import" className="inline-flex items-center gap-2 text-xs bg-white/10 hover:bg-white/15 text-primary px-2.5 py-1.5 rounded-md">
                      Importar CSV
                    </Link>
                  </div>
                )}
                {item.href === '/control/orgs' && (
                  <Link href="/control/orgs?open=create" className="inline-flex items-center gap-2 text-xs bg-indigo-600/90 hover:bg-indigo-600 text-white px-2.5 py-1.5 rounded-md">
                    + Novo Cliente/Empresa
                  </Link>
                )}
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        );
      })}
    </div>
  );

  return (
    <div
      className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 flex flex-col h-screen surface-sidebar border-r border-default noro-sidebar`}
      tabIndex={0}
      ref={containerRef}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') setSidebarOpen(false);
        if (e.key === 'ArrowRight') setSidebarOpen(true);
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
          e.preventDefault();
          const root = containerRef.current;
          if (!root) return;
          const links = Array.from(root.querySelectorAll<HTMLAnchorElement>('nav a[href]'));
          if (links.length === 0) return;
          const active = document.activeElement as HTMLElement | null;
          let idx = Math.max(0, links.findIndex((a) => a === active));
          idx = idx === -1 ? 0 : idx;
          idx = e.key === 'ArrowDown' ? Math.min(links.length - 1, idx + 1) : Math.max(0, idx - 1);
          links[idx].focus();
        }
      }}
    >
      {/* Header */}
      <div className="h-16 px-4 border-b border-default border-default border-white/10 flex items-center justify-between">
        {sidebarOpen && (
          <div>
            <div className="text-xl font-bold tracking-tight text-slate-100">NORO | CONTROL</div>
            <p className="text-xs text-primary0 -mt-1">v{version}</p>
          </div>
        )}
        <button aria-label={sidebarOpen ? 'Recolher menu' : 'Expandir menu'} aria-expanded={sidebarOpen}
          onClick={() => setSidebarOpen(!sidebarOpen)} className="text-muted hover:text-primary transition-transform hover:scale-105">
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <NavGroup title="Comercial" items={areaComercial} />
        <NavGroup title="Operacoes" items={areaOperacoes} />
        <NavGroup title="Billing & Financeiro" items={areaBilling} />
        <NavGroup title="Administracao" items={areaAdministracao} />
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <img
            src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.nome || user.email}&background=random&color=fff`}
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
          {sidebarOpen && (
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-semibold text-primary truncate">{user.nome || user.email?.split('@')[0]}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            title="Sair"
          >
            {loggingOut ? <Loader2 className="animate-spin" size={20} /> : <LogOut size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
}
