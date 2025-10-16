// components/admin/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, Package, FileText, Users, MessageSquare, Mail, DollarSign, 
  BarChart3, Settings, Calendar, Instagram, Menu, X, LogOut, UserCheck
} from 'lucide-react';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface SidebarProps {
  user?: {
    nome: string | null;
    email: string;
    role: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  const menuItems = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { href: '/admin/leads', icon: Users, label: 'Leads' },
    { href: '/admin/clientes', icon: UserCheck, label: 'Clientes' }, // NOVO LINK ADICIONADO
    { href: '/admin/orcamentos', icon: FileText, label: 'Orçamentos' },
    { href: '/admin/pedidos', icon: Package, label: 'Pedidos' },
    { href: '/admin/financeiro', icon: DollarSign, label: 'Financeiro' },
    { href: '/admin/tarefas', icon: Calendar, label: 'Tarefas' },
    { href: '/admin/relatorios', icon: BarChart3, label: 'Relatórios' },
    { href: '/admin/marketing', icon: Instagram, label: 'Marketing' },
    { href: '/admin/email', icon: Mail, label: 'E-mails' },
    { href: '/admin/comunicacao', icon: MessageSquare, label: 'Comunicação' },
    { href: '/admin/configuracoes', icon: Settings, label: 'Configurações' },
  ];

  return (
    <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-gray-200 transition-all duration-300 flex flex-col h-screen`}>
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        {sidebarOpen && (
          <Link href="/admin" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Nomade Guru
          </Link>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-200">
        {user && sidebarOpen && (
          <div className="mb-3">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.nome || 'Admin'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded">
              {user.role}
            </span>
          </div>
        )}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all w-full ${
            loggingOut
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'text-red-600 hover:bg-red-50'
          }`}
        >
          <LogOut size={20} />
          {sidebarOpen && <span className="font-medium">{loggingOut ? 'Saindo...' : 'Sair'}</span>}
        </button>
      </div>
    </div>
  );
}
