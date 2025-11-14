// app/conteudo/roteiros/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, CheckCircle2 } from 'lucide-react';

export default function RoteirosLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { href: '/conteudo/roteiros/a-publicar', icon: Clock, label: 'A Publicar' },
    { href: '/conteudo/roteiros/publicados', icon: CheckCircle2, label: 'Publicados' },
  ];

  return (
    <div>
      {/* Sub-tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-4">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2 border-b-2 transition-colors text-sm ${
                  isActive
                    ? 'border-purple-600 text-purple-600 font-semibold'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon size={16} />
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
