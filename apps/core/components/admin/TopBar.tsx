// components/admin/TopBar.tsx
'use client';

import { Search, Bell, Menu } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Database } from '@/types/database';

type NomadeUser = Database['public']['Tables']['noro_users']['Row'];
type Notificacao = Database['public']['Tables']['noro_notificacoes']['Row'];

interface TopBarProps {
  user: NomadeUser;
  initialNotificacoes: Notificacao[];
  logoUrl?: string;
  topbarColor?: string;
  onMenuClick?: () => void;
}

// Route → title + subtitle map (matches wireframe copy)
const ROUTE_MAP: Record<string, { title: string; subtitle: string }> = {
  '/':              { title: 'Dashboard',     subtitle: 'Visão geral do seu negócio' },
  '/leads':         { title: 'Leads',         subtitle: 'Funil de captação e qualificação' },
  '/clientes':      { title: 'Clientes',      subtitle: 'Base de clientes da agência' },
  '/comunicacao':   { title: 'Comunicação',   subtitle: 'Inbox unificada — WhatsApp, e-mail, Instagram' },
  '/tarefas':       { title: 'Tarefas',       subtitle: 'Atividades, follow-ups e prazos' },
  '/orcamentos':    { title: 'Orçamentos',    subtitle: 'Propostas em andamento' },
  '/pedidos':       { title: 'Pedidos',       subtitle: 'Gestão de vendas e contratos' },
  '/financeiro':    { title: 'Financeiro',    subtitle: 'Cobranças, recebíveis e fluxo de caixa' },
  '/conteudo':      { title: 'Conteúdo IA',   subtitle: 'Roteiros e artigos gerados por IA' },
  '/marketing':     { title: 'Marketing',     subtitle: 'Campanhas e automações' },
  '/social':        { title: 'Social Media',  subtitle: 'Calendário editorial' },
  '/custos':        { title: 'Custos',        subtitle: 'Análise de custos e fornecedores' },
  '/relatorios':    { title: 'Relatórios',    subtitle: 'Performance comercial e financeira' },
  '/site':          { title: 'Meu Site',      subtitle: 'Editor visual · domínio próprio · publicação 1-clique' },
  '/configuracoes': { title: 'Configurações', subtitle: 'Perfil, integrações e preferências' },
};

function getRouteInfo(pathname: string) {
  // Exact match
  if (ROUTE_MAP[pathname]) return ROUTE_MAP[pathname];
  // Prefix match (e.g. /clientes/123)
  const match = Object.entries(ROUTE_MAP).find(
    ([key]) => key !== '/' && pathname.startsWith(key + '/')
  );
  return match?.[1] ?? { title: 'Portal', subtitle: '' };
}

export default function TopBar({ initialNotificacoes, onMenuClick }: TopBarProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificacoes] = useState<Notificacao[]>(initialNotificacoes);

  const routeInfo = getRouteInfo(pathname);
  const naoLidas = notificacoes.filter((n) => !n.lida).length;

  return (
    <header
      className="flex items-center gap-4 flex-shrink-0 sticky top-0 z-20"
      style={{
        height: 60,
        padding: '0 24px',
        background: '#ffffff',
        borderBottom: '1px solid #eceef3',
      }}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onMenuClick}
        className="md:hidden flex items-center justify-center rounded-lg w-8 h-8 transition-colors"
        style={{ color: 'rgba(31,36,51,0.6)' }}
      >
        <Menu size={20} />
      </button>

      {/* Page title + subtitle */}
      <div className="flex-1 min-w-0">
        <div
          className="font-bold leading-none truncate"
          style={{ fontSize: 16, letterSpacing: '-0.012em', color: '#1f2433' }}
        >
          {routeInfo.title}
        </div>
        {routeInfo.subtitle && (
          <div
            className="mt-0.5 truncate"
            style={{ fontSize: 11.5, color: 'rgba(31,36,51,0.55)' }}
          >
            {routeInfo.subtitle}
          </div>
        )}
      </div>

      {/* Search pill */}
      <div
        className="hidden md:flex items-center gap-2 rounded-lg cursor-pointer transition-colors"
        style={{
          width: 280,
          padding: '6px 10px',
          background: '#f6f7fb',
          color: 'rgba(31,36,51,0.55)',
          fontSize: 12.5,
          border: '1px solid #eceef3',
        }}
      >
        <Search size={15} className="flex-shrink-0" />
        <span className="flex-1">Buscar clientes, pedidos, destinos…</span>
        <span className="font-mono opacity-70" style={{ fontSize: 10.5 }}>⌘ K</span>
      </div>

      {/* Bell */}
      <div className="relative flex-shrink-0">
        <button
          onClick={() => setShowNotifications(!showNotifications)}
          className="flex items-center justify-center rounded-lg transition-colors"
          style={{
            width: 34,
            height: 34,
            color: '#1f2433',
          }}
        >
          <Bell size={17} />
          {naoLidas > 0 && (
            <span
              className="absolute rounded-full bg-red-500 border-2 border-white"
              style={{ width: 7, height: 7, top: 6, right: 6 }}
            />
          )}
        </button>

        {/* Notifications dropdown */}
        {showNotifications && (
          <div
            className="absolute right-0 mt-2 bg-white rounded-xl shadow-lg overflow-hidden z-50"
            style={{ width: 320, border: '1px solid #eceef3' }}
          >
            <div className="flex items-center justify-between p-4" style={{ borderBottom: '1px solid #eceef3' }}>
              <h3 className="font-semibold text-sm" style={{ color: '#1f2433' }}>Notificações</h3>
              {naoLidas > 0 && (
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: '#e0eaff', color: '#1f3da8' }}
                >
                  {naoLidas} nova{naoLidas > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: 320 }}>
              {notificacoes.length === 0 ? (
                <div className="p-6 text-center text-sm" style={{ color: 'rgba(31,36,51,0.5)' }}>
                  Nenhuma notificação
                </div>
              ) : (
                notificacoes.map((notif) => (
                  <Link
                    key={notif.id}
                    href={notif.link || '/'}
                    onClick={() => setShowNotifications(false)}
                    className="block transition-colors"
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #eceef3',
                      background: !notif.lida ? '#f0f4ff' : 'transparent',
                    }}
                  >
                    <p className="font-medium text-sm" style={{ color: '#1f2433' }}>{notif.titulo}</p>
                    {notif.mensagem && (
                      <p className="text-xs mt-0.5" style={{ color: 'rgba(31,36,51,0.55)' }}>{notif.mensagem}</p>
                    )}
                    <p className="text-xs mt-1.5" style={{ color: 'rgba(31,36,51,0.4)' }}>
                      {new Date(notif.created_at).toLocaleString('pt-BR')}
                    </p>
                  </Link>
                ))
              )}
            </div>

            <div className="p-3 text-center" style={{ borderTop: '1px solid #eceef3' }}>
              <Link
                href="/notificacoes"
                className="text-xs font-semibold hover:opacity-70 transition-opacity"
                style={{ color: '#232452' }}
                onClick={() => setShowNotifications(false)}
              >
                Ver todas
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
