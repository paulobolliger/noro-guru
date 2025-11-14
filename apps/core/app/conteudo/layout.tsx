// app/conteudo/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FolderOpen, Map, FileText } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

export default function ConteudoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const mockUser = {
    email: 'dev@noro.com.br',
    nome: 'Desenvolvedor'
  };

  const tabs = [
    { href: '/conteudo/roteiros/a-publicar', icon: Map, label: 'Roteiros' },
    { href: '/conteudo/artigos/a-publicar', icon: FileText, label: 'Artigos' },
  ];

  return (
    <MainLayout user={mockUser}>
      <div>
        {/* Header */}
        {pathname !== '/conteudo' && (
          <>
            <div className="mb-6">
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <FolderOpen className="text-blue-600" size={32} />
                Gerenciamento de Conteúdo
              </h1>
              <p className="text-gray-600 mt-2">
                Publique e gerencie roteiros e artigos do site
              </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="flex gap-4">
                {tabs.map((tab) => {
                  const isActive = pathname.includes(tab.href.split('/')[2]); // Check if path includes 'roteiros' or 'artigos'
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
          </>
        )}

        {/* Content */}
        {children}
      </div>
    </MainLayout>
  );
}
