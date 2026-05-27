// components/admin/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { signOut } from '@noro/lib/services/authService';
import {
  LayoutDashboard, Columns2, UserCheck, MessageSquare, CheckSquare,
  FileText, Package, DollarSign, Sparkles, Megaphone,
  Share2, TrendingUp, BarChart3, Settings, Globe, LogOut,
  ChevronLeft, ChevronRight, X, Loader2,
  type LucideIcon,
} from 'lucide-react';

interface SidebarProps {
  user: {
    id: string;
    nome: string | null;
    email: string;
    role: string;
    avatar_url?: string | null;
  };
  topbarColor?: string;
  logoUrl?: string | null;
  companyName?: string | null;
  modules?: Record<string, boolean>;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
}

type MenuItem = {
  href: string;
  icon: LucideIcon;
  label: string;
  moduleId?: string;
  pill?: string;
};

const MENU_GROUPS: { label: string; items: MenuItem[] }[] = [
  {
    label: 'Principal',
    items: [
      { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    label: 'Comercial & CRM',
    items: [
      { href: '/leads',       icon: Columns2,     label: 'Leads',       moduleId: 'leads' },
      { href: '/clientes',    icon: UserCheck,    label: 'Clientes',    moduleId: 'clientes' },
      { href: '/comunicacao', icon: MessageSquare,label: 'Comunicação', moduleId: 'comunicacao' },
      { href: '/tarefas',     icon: CheckSquare,  label: 'Tarefas',     moduleId: 'tarefas' },
    ],
  },
  {
    label: 'Vendas & Financeiro',
    items: [
      { href: '/orcamentos', icon: FileText,   label: 'Orçamentos', moduleId: 'orcamentos' },
      { href: '/pedidos',    icon: Package,    label: 'Pedidos',    moduleId: 'pedidos' },
      { href: '/financeiro', icon: DollarSign, label: 'Financeiro', moduleId: 'financeiro' },
    ],
  },
  {
    label: 'Marketing & Conteúdo',
    items: [
      { href: '/conteudo',  icon: Sparkles,  label: 'Conteúdo IA',  moduleId: 'conteudo' },
      { href: '/marketing', icon: Megaphone, label: 'Marketing',     moduleId: 'marketing' },
      { href: '/social',    icon: Share2,    label: 'Social Media',  moduleId: 'social' },
      { href: '/custos',    icon: TrendingUp,label: 'Custos',        moduleId: 'custos' },
    ],
  },
  {
    label: 'Site',
    items: [
      { href: '/site', icon: Globe, label: 'Meu Site', pill: 'NOVO' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { href: '/relatorios',    icon: BarChart3, label: 'Relatórios' },
      { href: '/configuracoes', icon: Settings,  label: 'Configurações' },
    ],
  },
];

export default function Sidebar({
  user,
  topbarColor,
  companyName,
  modules = {},
  mobileOpen = false,
  setMobileOpen,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const primary = topbarColor || '#232452';
  const accent  = '#19b8a8';

  // Close mobile sidebar on route change
  useEffect(() => {
    if (mobileOpen && setMobileOpen) setMobileOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isEnabled = (moduleId?: string) => {
    if (!moduleId) return true;
    return modules[moduleId] !== false;
  };

  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/'
      : pathname === href || pathname.startsWith(href + '/');

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut();
    router.push('/login');
    router.refresh();
  };

  // Monogram: first letter of each word, max 2
  const monogram = (companyName || 'NO')
    .trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  // User initials
  const userInitials = (user.nome || user.email || 'U')
    .trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase().slice(0, 2);

  const roleLabel =
    user.role === 'super_admin' ? 'Super Admin'
    : user.role === 'admin' ? 'Admin'
    : user.role;

  // ─── Sidebar inner ───────────────────────────────────────────────────
  const sidebarInner = (
    <div
      className={`flex flex-col h-full flex-shrink-0 transition-[width] duration-200 overflow-hidden`}
      style={{
        width: collapsed ? 64 : 232,
        backgroundColor: primary,
        color: 'rgba(255,255,255,0.86)',
      }}
    >
      {/* Header — tenant brand */}
      <div
        className="flex items-center flex-shrink-0"
        style={{
          height: 60,
          gap: 10,
          padding: collapsed ? '0 15px' : '0 18px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {/* Monogram */}
        <div
          className="flex items-center justify-center rounded-lg flex-shrink-0 font-mono font-bold"
          style={{ width: 34, height: 34, fontSize: 13, background: accent, color: primary }}
        >
          {monogram}
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0">
            <div className="text-white font-semibold truncate" style={{ fontSize: 13.5, letterSpacing: '-0.005em' }}>
              {companyName || 'NORO'}
            </div>
            <div className="font-mono truncate" style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>
              noro.guru
            </div>
          </div>
        )}

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex items-center justify-center rounded w-5 h-5 transition-colors flex-shrink-0"
          style={{ color: 'rgba(255,255,255,0.35)' }}
          title={collapsed ? 'Expandir' : 'Recolher'}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>

        {/* Mobile close */}
        <button
          onClick={() => setMobileOpen?.(false)}
          className="md:hidden flex items-center justify-center rounded w-5 h-5 flex-shrink-0"
          style={{ color: 'rgba(255,255,255,0.45)' }}
        >
          <X size={15} />
        </button>
      </div>

      {/* Navigation */}
      <nav
        className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scroll flex flex-col"
        style={{ padding: '10px 8px', gap: 12 }}
      >
        {MENU_GROUPS.map((group) => {
          const visible = group.items.filter((item) => isEnabled(item.moduleId));
          if (visible.length === 0) return null;

          return (
            <div key={group.label} style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Section label */}
              {!collapsed && (
                <div
                  className="font-bold uppercase"
                  style={{
                    fontSize: 9.5,
                    letterSpacing: '0.09em',
                    color: 'rgba(255,255,255,0.38)',
                    padding: '4px 10px 5px',
                  }}
                >
                  {group.label}
                </div>
              )}

              {visible.map((item) => {
                const active = isActive(item.href);
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: collapsed ? 0 : 10,
                      padding: collapsed ? '8px 0' : '7px 10px',
                      justifyContent: collapsed ? 'center' : 'flex-start',
                      borderRadius: 7,
                      background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
                      color: active ? '#ffffff' : 'rgba(255,255,255,0.78)',
                      fontWeight: active ? 600 : 500,
                      fontSize: 13,
                      textDecoration: 'none',
                      transition: 'background 0.1s, color 0.1s',
                    }}
                    className="hover:bg-white/[0.07] hover:text-white"
                  >
                    <Icon size={17} strokeWidth={active ? 2.25 : 1.75} className="flex-shrink-0" />
                    {!collapsed && (
                      <>
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.pill && (
                          <span
                            className="text-white font-bold"
                            style={{
                              fontSize: 9,
                              padding: '2px 6px',
                              borderRadius: 999,
                              background: 'linear-gradient(90deg, #f59e0b, #f97316)',
                              letterSpacing: '0.04em',
                              flexShrink: 0,
                            }}
                          >
                            {item.pill}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div
        className="flex items-center flex-shrink-0"
        style={{
          gap: 10,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: collapsed ? '10px 15px' : '10px 12px',
        }}
      >
        {/* Avatar */}
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-full font-bold overflow-hidden"
          style={{ width: 30, height: 30, fontSize: 11, color: '#fff', background: 'linear-gradient(135deg, #f472b6, #f59e0b)' }}
        >
          {user.avatar_url
            ? <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
            : userInitials}
        </div>

        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <div className="text-white font-semibold truncate" style={{ fontSize: 12.5 }}>
                {user.nome || 'Usuário'}
              </div>
              <div className="truncate capitalize" style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.4)' }}>
                {roleLabel}
              </div>
            </div>
            <button
              onClick={handleLogout}
              disabled={loggingOut}
              style={{ color: 'rgba(255,255,255,0.35)', transition: 'color 0.1s' }}
              className="hover:text-white/80 disabled:opacity-50"
              title="Sair"
            >
              {loggingOut ? <Loader2 size={15} className="animate-spin" /> : <LogOut size={15} />}
            </button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen?.(false)}
        />
      )}

      <aside
        className={`
          fixed md:relative z-50 h-full flex-shrink-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          transition-transform duration-300
        `}
      >
        {sidebarInner}
      </aside>
    </>
  );
}
