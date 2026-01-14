'use client';

import { useState } from 'react';
import { updateTenantModules } from '../../tenant-actions';

interface TenantModulesFormProps {
    tenantId: string;
    initialModules?: Record<string, boolean>;
}

const MODULES_GROUPS = [
    {
        title: 'Comercial & CRM',
        modules: [
            { id: 'leads', label: 'Leads e Oportunidades' },
            { id: 'clientes', label: 'Gestão de Clientes' },
            { id: 'comunicacao', label: 'Central de Comunicação' },
            { id: 'tarefas', label: 'Tarefas e Agenda' },
        ]
    },
    {
        title: 'Vendas & Financeiro',
        modules: [
            { id: 'orcamentos', label: 'Orçamentos e Propostas' },
            { id: 'pedidos', label: 'Gestão de Pedidos' },
            { id: 'financeiro', label: 'Controle Financeiro' },
        ]
    },
    {
        title: 'Marketing & IA',
        modules: [
            { id: 'marketing', label: 'Campanhas e Posts' },
            { id: 'geracao_ai', label: 'Estúdio de Criação IA' },
            { id: 'conteudo', label: 'Gestão de Conteúdo' },
            { id: 'custos_ai', label: 'Monitoramento de Custos AI' },
        ]
    },
    {
        title: 'Sistema',
        modules: [
            { id: 'relatorios', label: 'Relatórios e BI' },
        ]
    }
];

export default function TenantModulesForm({ tenantId, initialModules = {} }: TenantModulesFormProps) {
    const [loading, setLoading] = useState(false);
    // Initialize state with existing permissions or defaults
    const [permissions, setPermissions] = useState<Record<string, boolean>>(() => {
        const state: Record<string, boolean> = {};
        MODULES_GROUPS.forEach(group => {
            group.modules.forEach(mod => {
                // If it exists in DB, use it. If undefined, default to FALSE (locked) except maybe core ones?
                // For now locked by default is safer for "liberado o que o usuario tera acesso"
                state[mod.id] = initialModules[mod.id] || false;
            });
        });
        return state;
    });

    const handleToggle = (moduleId: string) => {
        setPermissions(prev => ({
            ...prev,
            [moduleId]: !prev[moduleId]
        }));
    };

    const handleSelectAll = (groupModules: any[]) => {
        const allEnabled = groupModules.every(m => permissions[m.id]);
        const newState = { ...permissions };
        groupModules.forEach(m => {
            newState[m.id] = !allEnabled;
        });
        setPermissions(newState);
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await updateTenantModules(tenantId, permissions);
            alert('Permissões de módulos atualizadas com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar permissões.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-6">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Módulos Contratados</h3>
                    <p className="text-sm text-gray-500">Selecione quais módulos este tenant tem acesso.</p>
                </div>
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                    {loading ? 'Salvando...' : 'Salvar Permissões'}
                </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {MODULES_GROUPS.map((group) => (
                    <div key={group.title} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-gray-900">{group.title}</h4>
                            <button
                                onClick={() => handleSelectAll(group.modules)}
                                className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
                            >
                                Alternar Todos
                            </button>
                        </div>
                        <div className="space-y-3">
                            {group.modules.map(module => (
                                <label key={module.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-all">
                                    <span className="text-sm text-gray-700 font-medium">{module.label}</span>
                                    <div className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={permissions[module.id] || false}
                                            onChange={() => handleToggle(module.id)}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
