// components/admin/Sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Package, FileText, Users, MessageSquare, Mail, DollarSign, 
  BarChart3, Settings, Calendar, Instagram, Menu, X, UserCheck
} from 'lucide-react';
import { useState } from 'react';
import packageJson from '@/../package.json';

interface SidebarProps {
  user?: {
    nome: string | null;
    email: string;
    role: string;
  };
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const version = packageJson.version;

  const menuItems = [
    { href: '/admin', icon: Home, label: 'Dashboard' },
    { href: '/admin/leads', icon: Users, label: 'Leads' },
    { href: '/admin/clientes', icon: UserCheck, label: 'Clientes' },
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
          <div>
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NORO
            </div>
            <p className="text-xs text-gray-400 -mt-1">v{version}</p>
          </div>
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
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
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

      {/* A SEÇÃO DE LOGOUT FOI REMOVIDA DAQUI */}
    </div>
  );
}