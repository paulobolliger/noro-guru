'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Activity, Settings } from 'lucide-react';

export default function WebhooksTabs() {
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    {
      id: 'eventos',
      label: 'Eventos',
      icon: Activity,
      href: '/webhooks',
      description: 'Logs de webhooks enviados',
    },
    {
      id: 'endpoints',
      label: 'Endpoints',
      icon: Settings,
      href: '/webhooks/endpoints',
      description: 'Configurar endpoints de destino',
    },
  ];

  const activeTab = pathname === '/webhooks/endpoints' ? 'endpoints' : 'eventos';

  return (
    <div className="border-b border-default bg-surface-alt">
      <div className="flex gap-1 px-6">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.href)}
              className={`
                flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors
                ${isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-muted hover:text-primary hover:border-default'
                }
              `}
            >
              <Icon size={18} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
