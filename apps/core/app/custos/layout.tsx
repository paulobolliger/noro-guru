// app/custos/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, Map, FileText, Sparkles } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

export default function CustosLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const mockUser = {
    email: 'dev@noro.com.br',
    nome: 'Desenvolvedor'
  };

  const tabs = [
    { href: '/custos/all', icon: Sparkles, label: 'Todos' },
    { href: '/custos/roteiros', icon: Map, label: 'Roteiros' },
    { href: '/custos/artigos', icon: FileText, label: 'Artigos' },
  ];

  return (
    <MainLayout user={mockUser}>
      <div>
        {/* Tabs (só aparece se não for a página principal de custos) */}
        {pathname !== '/custos' && (
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex gap-4">
              {tabs.map((tab) => {
                const isActive = pathname === tab.href;
                return (
                  <Link
                    key={tab.href}
                    href={tab.href}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                      isActive
                        ? 'border-blue-600 text-blue-600 font-semibold'
                        : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon size={20} />
                    {tab.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </MainLayout>
  );
}
