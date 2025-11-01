// apps/core/(protected)/custos/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TrendingUp, Map, FileText, Sparkles } from 'lucide-react';

export default function CustosLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { href: '/admin/custos/all', icon: Sparkles, label: 'Todos' },
    { href: '/admin/custos/roteiros', icon: Map, label: 'Roteiros' },
    { href: '/admin/custos/artigos', icon: FileText, label: 'Artigos' },
  ];

  return (
    <div>
      {/* Tabs (só aparece se não for a página principal de custos) */}
      {pathname !== '/admin/custos' && (
        <div className="border-b border-gray-200 px-6">
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
  );
}
