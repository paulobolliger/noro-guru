// components/admin/AdminLayoutClient.tsx
'use client';

import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import type { Database } from "@noro-types/supabase";
import type { ConfiguracaoSistema } from "@/app/(protected)/configuracoes/config-actions";

type NomadeUser = Database['public']['Tables']['noro_users']['Row'];
type Notificacao = Database['public']['Tables']['noro_notificacoes']['Row'];

interface AdminLayoutClientProps {
  user: NomadeUser;
  notificacoes: Notificacao[];
  children: React.ReactNode;
  configSistema: ConfiguracaoSistema;
}

export default function AdminLayoutClient({ user, notificacoes, children, configSistema }: AdminLayoutClientProps) {
  // State for sidebar (collapsed/expanded)
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    const saved = localStorage.getItem('noro.sidebar');
    return saved ? saved === '1' : true;
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Persist sidebar state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('noro.sidebar', sidebarOpen ? '1' : '0');
    }
  }, [sidebarOpen]);

  return (
    <div className="surface-app flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        user={user}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* TopBar */}
        <TopBar
          user={user}
          initialNotificacoes={notificacoes}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />

        {/* Mobile Overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Page Content */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
