'use client';

import { useState } from 'react';
import { updateTenantCredits } from '../../tenant-actions';
import { Coins, Mail } from 'lucide-react';

interface TenantCreditsFormProps {
    tenantId: string;
    initialAiBalance: number; // In R$
    initialEmailLimit: number;
    initialEmailUsed: number;
}

export default function TenantCreditsForm({
    tenantId,
    initialAiBalance,
    initialEmailLimit,
    initialEmailUsed
}: TenantCreditsFormProps) {
    const [loading, setLoading] = useState(false);
    const [aiBalance, setAiBalance] = useState(initialAiBalance);
    const [emailLimit, setEmailLimit] = useState(initialEmailLimit);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await updateTenantCredits(tenantId, { aiBalance, emailLimit });
            alert('Créditos e limites atualizados com sucesso!');
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar créditos.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-6">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-gray-900">Gestão de Créditos & Limites</h3>
                    <p className="text-sm text-gray-500">Defina os saldos disponíveis para uso de recursos premium.</p>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                    {loading ? 'Salvando...' : 'Salvar Limites'}
                </button>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* AI Credits */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <Coins size={20} />
                        </div>
                        <h4 className="font-semibold text-gray-900">Créditos de IA</h4>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                        <label className="block text-sm font-medium text-purple-900 mb-1">
                            Saldo Disponível (R$)
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-purple-400">R$</span>
                            <input
                                type="number"
                                step="0.01"
                                value={aiBalance}
                                onChange={(e) => setAiBalance(parseFloat(e.target.value))}
                                className="w-full pl-10 pr-4 py-2 border-purple-200 focus:border-purple-500 focus:ring-purple-500 rounded-md text-purple-900 font-bold bg-white"
                            />
                        </div>
                        <p className="text-xs text-purple-600 mt-2">
                            Define o valor em reais disponível na carteira do tenant para consumo de IA.
                        </p>
                    </div>
                </div>

                {/* Email Marketing */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <Mail size={20} />
                        </div>
                        <h4 className="font-semibold text-gray-900">Email Marketing</h4>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-blue-900 mb-1">
                                Cota Mensal de Envios
                            </label>
                            <input
                                type="number"
                                value={emailLimit}
                                onChange={(e) => setEmailLimit(parseInt(e.target.value))}
                                className="w-full px-4 py-2 border-blue-200 focus:border-blue-500 focus:ring-blue-500 rounded-md text-blue-900 font-bold bg-white"
                            />
                        </div>

                        <div className="pt-2 border-t border-blue-200">
                            <div className="flex justify-between text-sm text-blue-800 mb-1">
                                <span>Uso Atual</span>
                                <span className="font-medium">{initialEmailUsed} / {emailLimit}</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-2">
                                <div
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${Math.min((initialEmailUsed / (emailLimit || 1)) * 100, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
