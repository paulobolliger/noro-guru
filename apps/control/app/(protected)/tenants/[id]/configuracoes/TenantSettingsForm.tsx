'use client';

import { useState } from 'react';
import { updateTenantSettings } from '../../tenant-actions';

interface TenantSettingsFormProps {
    tenantId: string;
    initialData?: any;
}

export default function TenantSettingsForm({ tenantId, initialData }: TenantSettingsFormProps) {
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        try {
            await updateTenantSettings(tenantId, formData);
            alert('Configurações atualizadas com sucesso!');
        } catch (error) {
            alert('Erro ao atualizar configurações');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-8">

            {/* Regional Settings Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-heading uppercase tracking-wider border-b border-default pb-2">Regionalização</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-heading">Moeda Padrão</label>
                        <select
                            name="moeda_padrao"
                            defaultValue={initialData?.moeda_padrao || 'BRL'}
                            className="w-full bg-surface-app border border-default rounded-lg px-3 py-2 text-sm text-heading focus:outline-none focus:border-primary"
                        >
                            <option value="BRL">Real (BRL)</option>
                            <option value="USD">Dólar (USD)</option>
                            <option value="EUR">Euro (EUR)</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-heading">Fuso Horário</label>
                        <select
                            name="fuso_horario"
                            defaultValue={initialData?.fuso_horario || 'America/Sao_Paulo'}
                            className="w-full bg-surface-app border border-default rounded-lg px-3 py-2 text-sm text-heading focus:outline-none focus:border-primary"
                        >
                            <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                            <option value="Europe/Lisbon">Lisboa (GMT+0)</option>
                            <option value="UTC">UTC</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-heading">Idioma</label>
                        <select
                            name="idioma"
                            defaultValue={initialData?.idioma || 'pt'}
                            className="w-full bg-surface-app border border-default rounded-lg px-3 py-2 text-sm text-heading focus:outline-none focus:border-primary"
                        >
                            <option value="pt">Português</option>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-heading">Formato de Data</label>
                        <select
                            name="formato_data"
                            defaultValue={initialData?.formato_data || 'DD/MM/YYYY'}
                            className="w-full bg-surface-app border border-default rounded-lg px-3 py-2 text-sm text-heading focus:outline-none focus:border-primary"
                        >
                            <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2024)</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2024)</option>
                            <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-31)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Branding Settings Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-bold text-heading uppercase tracking-wider border-b border-default pb-2">Identidade Visual (White Label)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-sm font-medium text-heading">Logo URL (Admin)</label>
                        <input
                            name="logo_url_admin"
                            defaultValue={initialData?.logo_url_admin}
                            className="w-full bg-surface-app border border-default rounded-lg px-3 py-2 text-sm text-heading focus:outline-none focus:border-primary"
                            placeholder="https://..."
                        />
                        <p className="text-xs text-secondary">URL pública da imagem do logo para a barra superior.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-heading">Cor da Topbar (Hex)</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                name="topbar_color"
                                defaultValue={initialData?.topbar_color || '#232452'}
                                className="h-9 w-12 rounded border border-default bg-transparent p-1 cursor-pointer"
                            />
                            <input
                                type="text"
                                name="topbar_color_text"
                                defaultValue={initialData?.topbar_color || '#232452'}
                                readOnly
                                className="flex-1 bg-surface-app border border-default rounded-lg px-3 py-2 text-sm text-heading focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-t border-default pt-4 flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>
        </form>
    );
}
