'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import type { Database } from '@/types/appwrite';
import type { ConfiguracaoSistema } from '@/app/(protected)/configuracoes/config-actions';

type NomadeUser = Database['public']['Tables']['noro_users']['Row'];
type Notificacao = Database['public']['Tables']['noro_notificacoes']['Row'];

interface AdminLayoutClientProps {
  user: NomadeUser;
  notificacoes: Notificacao[];
  children: React.ReactNode;
  configSistema: ConfiguracaoSistema;
  companyName?: string | null;
  modules?: Record<string, boolean> | null;
}

export default function AdminLayoutClient({
  user,
  notificacoes,
  children,
  configSistema,
  companyName,
  modules = {},
}: AdminLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#f6f7fb' }}>
      {/* Sidebar */}
      <Sidebar
        user={user}
        topbarColor={configSistema.topbar_color}
        logoUrl={configSistema.logo_url_admin}
        companyName={companyName}
        modules={modules || {}}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main column */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <TopBar
          user={user}
          initialNotificacoes={notificacoes}
          logoUrl={configSistema.logo_url_admin}
          topbarColor={configSistema.topbar_color}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 overflow-y-auto" style={{ padding: '24px 28px' }}>
          {children}
        </main>
      </div>
    </div>
  );
}