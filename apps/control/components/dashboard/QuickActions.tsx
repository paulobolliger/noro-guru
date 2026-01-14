'use client';

import { Plus, Key, Settings, FileText, Users, Zap } from 'lucide-react';
import Link from 'next/link';

export default function QuickActions() {
    const actions = [
        { icon: Plus, label: 'Novo Tenant', href: '/tenants/new', color: 'text-indigo-600' },
        { icon: Users, label: 'Novo Lead', href: '/control/leads/create', color: 'text-indigo-600' },
        { icon: Key, label: 'Gerar API Key', href: '/api-keys', color: 'text-indigo-600' },
        { icon: FileText, label: 'Documentação', href: '/docs', color: 'text-indigo-600' },
    ];

    return (
        <div className="surface-card rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ações Rápidas</h2>

            <div className="space-y-2">
                {actions.map((action, index) => (
                    <Link
                        key={index}
                        href={action.href}
                        className="flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors group"
                    >
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-50 group-hover:bg-indigo-100 transition-colors">
                            <action.icon className={`w-5 h-5 ${action.color}`} />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{action.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
