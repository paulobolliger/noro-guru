// components/admin/AdminLayoutClient.tsx
'use client';

import Sidebar from './Sidebar';
import TopBar from './TopBar';
import AdminFooter from './AdminFooter';
import type { Database } from '@/types/supabase';
import type { ConfiguracaoSistema } from '@/app/configuracoes/config-actions'; // Importa o tipo

type NomadeUser = Database['public']['Tables']['noro_users']['Row'];
type Notificacao = Database['public']['Tables']['noro_notificacoes']['Row'];

interface AdminLayoutClientProps {
  user: NomadeUser;
  notificacoes: Notificacao[];
  children: React.ReactNode;
  configSistema: ConfiguracaoSistema; // Adiciona a prop
}

export default function AdminLayoutClient({ user, notificacoes, children, configSistema }: AdminLayoutClientProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        user={user} 
        topbarColor={configSistema.topbar_color} // Passa a cor para a Sidebar
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar 
          user={user} 
          initialNotificacoes={notificacoes}
          logoUrl={configSistema.logo_url_admin} // Passa a URL do logo
          topbarColor={configSistema.topbar_color} // Passa a cor
        />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}