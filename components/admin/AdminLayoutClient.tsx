// components/admin/AdminLayoutClient.tsx
'use client';

import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface AdminLayoutClientProps {
  user: {
    id: string;
    nome: string | null;
    email: string;
    role: string;
  };
  children: React.ReactNode;
}

export default function AdminLayoutClient({ user, children }: AdminLayoutClientProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar user={user} />
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}