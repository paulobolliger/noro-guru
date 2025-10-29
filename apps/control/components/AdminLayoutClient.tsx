// components/admin/AdminLayoutClient.tsx
'use client';

import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { usePathname } from 'next/navigation';
import AdminFooter from './AdminFooter';
import type { Database } from "@noro-types/supabase";
import type { ConfiguracaoSistema } from "@/app/(protected)/configuracoes/config-actions"; // Importa o tipo

type NomadeUser = Database['public']['Tables']['noro_users']['Row'];
type Notificacao = Database['public']['Tables']['noro_notificacoes']['Row'];

interface AdminLayoutClientProps {
  user: NomadeUser;
  notificacoes: Notificacao[];
  children: React.ReactNode;
  configSistema: ConfiguracaoSistema; // Adiciona a prop
}

export default function AdminLayoutClient({ user, notificacoes, children, configSistema }: AdminLayoutClientProps) {
  const pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  return (
    <div className="admin-theme flex h-screen bg-[#0B0F14] text-slate-300">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={user} initialNotificacoes={notificacoes} />
        <main className="flex-1 overflow-y-auto">
          <div key={pathname} className="page-enter mx-auto max-w-7xl px-6 md:px-8 py-8">
            {children}
          </div>
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}
