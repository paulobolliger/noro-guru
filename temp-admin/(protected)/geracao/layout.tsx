// app/admin/(protected)/geracao/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, Map, FileText } from 'lucide-react';

export default function GeracaoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { href: '/admin/geracao/roteiros', icon: Map, label: 'Roteiros' },
    { href: '/admin/geracao/artigos', icon: FileText, label: 'Artigos' },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="text-purple-600" size={32} />
          Geração de Conteúdo com IA
        </h1>
        <p className="text-gray-600 mt-2">
          Gere roteiros e artigos em massa usando inteligência artificial
        </p>
      </div>

      {/* Tabs */}
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

      {/* Content */}
      {children}
    </div>
  );
}
