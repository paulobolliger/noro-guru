'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ativarBillingAsaas } from '../../../billing/actions';
import { CreditCard, ShieldCheck, Landmark, AlertCircle, Loader2 } from 'lucide-react';

interface TenantAsaasOnboardingFormProps {
    tenantId: string;
    activatedByUserId: string;
    initialBillingAccount: {
        providerAccountId: string | null;
        providerWalletId: string | null;
        onboardingStatus: string;
        status: string;
        metadata: any;
    } | null;
    tenantName: string;
    tenantEmail: string;
}

export default function TenantAsaasOnboardingForm({
    tenantId,
    activatedByUserId,
    initialBillingAccount,
    tenantName,
    tenantEmail
}: TenantAsaasOnboardingFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        name: tenantName || '',
        email: tenantEmail || '',
        cpfCnpj: '',
        mobilePhone: '',
        incomeValue: 5000,
        address: '',
        addressNumber: '',
        province: '',
        postalCode: '',
        complement: '',
        companyType: 'MEI' as 'MEI' | 'LIMITED' | 'INDIVIDUAL' | 'ASSOCIATION',
    });

    const isAlreadyActive = initialBillingAccount?.status === 'active';

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: id === 'incomeValue' ? parseFloat(value) || 0 : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            console.log('[Asaas Onboarding] Iniciando onboarding para o tenant:', tenantId);
            const result = await ativarBillingAsaas(tenantId, activatedByUserId, formData);
            
            if (result.success) {
                alert(`Billing Asaas ativado com sucesso!\nWallet ID: ${result.walletId}`);
                router.refresh();
            } else {
                setError(result.message || 'Erro desconhecido ao ativar subconta Asaas.');
            }
        } catch (err: any) {
            console.error('[Asaas Onboarding] Erro:', err);
            setError(err.message || 'Falha ao conectar com o serviço de onboarding.');
        } finally {
            setLoading(false);
        }
    };

    if (isAlreadyActive) {
        return (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-6 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-emerald-100 text-emerald-600">
                        <ShieldCheck size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Integração Financeira Asaas</h3>
                        <p className="text-sm text-gray-500">A subconta do Asaas está ativa para este tenant.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4 mt-2 text-sm">
                    <div>
                        <span className="text-gray-500 font-medium block">ID da Subconta Asaas</span>
                        <span className="font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded border border-gray-200 inline-block mt-1">
                            {initialBillingAccount?.providerAccountId}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500 font-medium block">ID da Carteira (Wallet ID)</span>
                        <span className="font-mono text-gray-900 bg-gray-50 px-2 py-1 rounded border border-gray-200 inline-block mt-1">
                            {initialBillingAccount?.providerWalletId}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500 font-medium block">Status do Onboarding</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mt-1 uppercase">
                            {initialBillingAccount?.onboardingStatus}
                        </span>
                    </div>
                    <div>
                        <span className="text-gray-500 font-medium block">Consentimento Registrado</span>
                        <span className="text-gray-600 block mt-1">
                            Ativado por {initialBillingAccount?.metadata?.createdAt ? new Date(initialBillingAccount?.metadata?.createdAt).toLocaleDateString() : 'N/A'}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl overflow-hidden mt-6">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Landmark className="text-indigo-600" size={22} />
                        Ativar Subconta Asaas (Gateway de Agência)
                    </h3>
                    <p className="text-sm text-gray-500">Preencha os dados regulatórios da agência para criar a carteira de recebimentos.</p>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="animate-spin h-4 w-4" />
                            Ativando...
                        </>
                    ) : (
                        'Ativar Subconta'
                    )}
                </button>
            </div>

            {error && (
                <div className="p-4 mx-6 mt-6 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={20} className="shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            {initialBillingAccount?.onboardingStatus === 'rejected' && (
                <div className="p-4 mx-6 mt-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg flex items-center gap-2 text-sm">
                    <AlertCircle size={20} className="shrink-0" />
                    <div>
                        <p className="font-semibold">Última tentativa de onboarding falhou:</p>
                        <p className="text-xs mt-1 font-mono">{initialBillingAccount?.metadata?.error || 'Erro interno do provedor'}</p>
                    </div>
                </div>
            )}

            <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label htmlFor="name" className="text-sm font-semibold text-gray-700">Razão Social / Nome da Agência</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="email" className="text-sm font-semibold text-gray-700">E-mail Financeiro</label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="cpfCnpj" className="text-sm font-semibold text-gray-700">CPF ou CNPJ (apenas números)</label>
                        <input
                            type="text"
                            id="cpfCnpj"
                            value={formData.cpfCnpj}
                            onChange={handleInputChange}
                            placeholder="ex: 12345678909"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="mobilePhone" className="text-sm font-semibold text-gray-700">Celular / Telefone com DDD</label>
                        <input
                            type="text"
                            id="mobilePhone"
                            value={formData.mobilePhone}
                            onChange={handleInputChange}
                            placeholder="ex: 11999998888"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="companyType" className="text-sm font-semibold text-gray-700">Tipo de Empresa</label>
                        <select
                            id="companyType"
                            value={formData.companyType}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                        >
                            <option value="MEI">MEI (Microempreendedor Individual)</option>
                            <option value="LIMITED">LTDA (Sociedade Limitada)</option>
                            <option value="INDIVIDUAL">EI (Empresa Individual)</option>
                            <option value="ASSOCIATION">Associação / Terceiro Setor</option>
                        </select>
                    </div>

                    <div className="space-y-1">
                        <label htmlFor="incomeValue" className="text-sm font-semibold text-gray-700">Faturamento Mensal Estimado (R$)</label>
                        <input
                            type="number"
                            id="incomeValue"
                            value={formData.incomeValue}
                            onChange={handleInputChange}
                            required
                            min="1"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-2">
                    <h4 className="text-sm font-bold text-gray-900 mb-3">Endereço Comercial</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-1 md:col-span-2">
                            <label htmlFor="address" className="text-sm font-semibold text-gray-700">Logradouro / Rua</label>
                            <input
                                type="text"
                                id="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Rua, Avenida, etc."
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="addressNumber" className="text-sm font-semibold text-gray-700">Número</label>
                            <input
                                type="text"
                                id="addressNumber"
                                value={formData.addressNumber}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="province" className="text-sm font-semibold text-gray-700">Bairro</label>
                            <input
                                type="text"
                                id="province"
                                value={formData.province}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="postalCode" className="text-sm font-semibold text-gray-700">CEP (apenas números)</label>
                            <input
                                type="text"
                                id="postalCode"
                                value={formData.postalCode}
                                onChange={handleInputChange}
                                placeholder="ex: 01001000"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <label htmlFor="complement" className="text-sm font-semibold text-gray-700">Complemento (opcional)</label>
                            <input
                                type="text"
                                id="complement"
                                value={formData.complement}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
