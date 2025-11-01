'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  TrendingUp, 
  TrendingDown, 
  Landmark, 
  FolderOpen,
  Target
} from 'lucide-react';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/receitas', label: 'Receitas', icon: TrendingUp },
  { href: '/despesas', label: 'Despesas', icon: TrendingDown },
  { href: '/bancos', label: 'Contas Bancárias', icon: Landmark },
  { href: '/categorias', label: 'Categorias', icon: FolderOpen },
  { href: '/centros-custo', label: 'Centro de Custos', icon: Target },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">💰 Financeiro</h1>
        <p className="text-sm text-gray-500 mt-1">NORO Grupo</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          v1.0.0 • Modo Desenvolvimento
        </div>
      </div>
    </aside>
  );
}
