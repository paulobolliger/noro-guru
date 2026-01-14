'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AdminFooter from './AdminFooter';
import type { Database } from '@/types/supabase';
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

export default function AdminLayoutClient({ user, notificacoes, children, configSistema, companyName, modules = {} }: AdminLayoutClientProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          user={user}
          topbarColor={configSistema.topbar_color}
          logoUrl={configSistema.logo_url_admin}
          companyName={companyName}
          modules={modules || {}}
          mobileOpen={mobileMenuOpen}
          setMobileOpen={setMobileMenuOpen}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          <TopBar
            user={user}
            initialNotificacoes={notificacoes}
            logoUrl={configSistema.logo_url_admin}
            topbarColor={configSistema.topbar_color}
            onMenuClick={() => setMobileMenuOpen(true)}
          />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
      <AdminFooter footerColor={configSistema.topbar_color} />
    </div>
  );
}