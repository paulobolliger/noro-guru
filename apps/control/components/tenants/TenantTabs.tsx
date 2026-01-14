'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Building2, Settings, Users, CreditCard } from 'lucide-react';

interface TenantTabsProps {
    tenantId: string;
}

export default function TenantTabs({ tenantId }: TenantTabsProps) {
    const pathname = usePathname();
    const baseUrl = `/tenants/${tenantId}`;

    const tabs = [
        { name: 'Visão Geral', href: baseUrl, icon: LayoutDashboard, exact: true },
        { name: 'Empresa', href: `${baseUrl}/empresa`, icon: Building2 },
        { name: 'Configurações', href: `${baseUrl}/configuracoes`, icon: Settings },
        { name: 'Usuários', href: `${baseUrl}/usuarios`, icon: Users },
        { name: 'Assinatura', href: `${baseUrl}/assinatura`, icon: CreditCard },
    ];

    return (
        <div className="border-b border-default mb-6">
            <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                {tabs.map((tab) => {
                    const isActive = tab.exact
                        ? pathname === tab.href
                        : pathname.startsWith(tab.href);

                    return (
                        <Link
                            key={tab.name}
                            href={tab.href}
                            className={`
                group inline-flex items-center border-b-2 py-4 px-1 text-sm font-medium transition-colors
                ${isActive
                                    ? 'border-[#D4AF37] text-[#D4AF37]'
                                    : 'border-transparent text-secondary hover:border-white/20 hover:text-primary'
                                }
              `}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            <tab.icon
                                className={`
                  -ml-0.5 mr-2 h-4 w-4
                  ${isActive ? 'text-[#D4AF37]' : 'text-secondary group-hover:text-primary'}
                `}
                                aria-hidden="true"
                            />
                            <span>{tab.name}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
