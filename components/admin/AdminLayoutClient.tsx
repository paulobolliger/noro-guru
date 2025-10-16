// components/admin/AdminLayoutClient.tsx
'use client';

import Sidebar from './Sidebar';
import TopBar from './TopBar';
import type { Database } from '@/types/supabase';

type NomadeUser = Database['public']['Tables']['nomade_users']['Row'];
type Notificacao = Database['public']['Tables']['nomade_notificacoes']['Row'];


interface AdminLayoutClientProps {
  user: NomadeUser;
  notificacoes: Notificacao[];
  children: React.ReactNode;
}

export default function AdminLayoutClient({ user, notificacoes, children }: AdminLayoutClientProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Passa as props para o TopBar */}
        <TopBar user={user} initialNotificacoes={notificacoes} />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

