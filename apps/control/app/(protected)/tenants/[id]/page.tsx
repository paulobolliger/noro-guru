import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Building2, CreditCard, Users, Globe } from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";

async function getTenant(id: string) {
    const supabase = createAdminSupabaseClient();
    const { data, error } = await supabase
        .schema('cp')
        .from('tenants')
        .select('*')
        .eq('id', id)
        .maybeSingle();

    if (error || !data) return null;
    return data;
}

async function getTenantStats(id: string) {
    const supabase = createAdminSupabaseClient();

    // Get API keys count
    const { data: apiKeys } = await supabase
        .schema('cp')
        .from('api_keys')
        .select('id')
        .eq('tenant_id', id);

    return {
        apiKeysCount: apiKeys?.length || 0,
        usersCount: 0, // TODO: Add users query when available
    };
}

export default async function TenantDetailsPage({ params }: { params: { id: string } }) {
    const tenant = await getTenant(params.id);

    if (!tenant) {
        notFound();
    }

    const stats = await getTenantStats(params.id);

    return (
        <div className="p-6 md:p-8 space-y-6">
            {/* Back Button */}
            <Link
                href="/tenants"
                className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
                <ArrowLeft size={16} />
                Voltar para lista de tenants
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                        {tenant.name?.substring(0, 2).toUpperCase() || 'T'}
                    </div>

                    {/* Info */}
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-semibold text-gray-900">{tenant.name}</h1>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${(tenant.status || '').toLowerCase() === 'active'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-700'
                                }`}>
                                {tenant.status || 'inactive'}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span>ID: {tenant.id}</span>
                            <span>•</span>
                            <span>slug: {tenant.slug}</span>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <Link
                    href={`https://${tenant.slug}.yourdomain.com`}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    Acessar como Tenant
                </Link>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <KpiCard
                    label="Usuários Ativos"
                    value={stats.usersCount}
                />
                <KpiCard
                    label="Empresa Configurada"
                    value={tenant.company_name ? "Sim" : "Não"}
                />
                <KpiCard
                    label="Plano Atual"
                    value={tenant.plan || 'Trial'}
                />
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Link href={`/tenants/${tenant.id}`} className="surface-card rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer border-2 border-indigo-600">
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-indigo-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">Visão Geral</span>
                    </div>
                </Link>

                <Link href={`/tenants/${tenant.id}/empresa`} className="surface-card rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Empresa</span>
                    </div>
                </Link>

                <Link href={`/tenants/${tenant.id}/configuracoes`} className="surface-card rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-600">Configurações</span>
                    </div>
                </Link>

                <Link href={`/tenants/${tenant.id}/dominios`} className="surface-card rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Globe className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Domínios</span>
                    </div>
                </Link>

                <Link href={`/tenants/${tenant.id}/usuarios`} className="surface-card rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Usuários</span>
                    </div>
                </Link>

                <Link href={`/tenants/${tenant.id}/assinatura`} className="surface-card rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex flex-col items-center text-center gap-2">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-gray-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">Assinatura</span>
                    </div>
                </Link>
            </div>

            {/* Content Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Dados da Empresa */}
                <div className="surface-card rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Dados da Empresa</h2>

                    {tenant.company_name ? (
                        <div className="space-y-3">
                            <div>
                                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Nome</div>
                                <div className="text-sm text-gray-900">{tenant.company_name}</div>
                            </div>
                            {tenant.company_cnpj && (
                                <div>
                                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">CNPJ</div>
                                    <div className="text-sm text-gray-900">{tenant.company_cnpj}</div>
                                </div>
                            )}
                            {tenant.company_email && (
                                <div>
                                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Email</div>
                                    <div className="text-sm text-gray-900">{tenant.company_email}</div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                            <p className="text-sm">Nenhum dado de empresa cadastrado.</p>
                        </div>
                    )}
                </div>

                {/* Serviços Ativos */}
                <div className="surface-card rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Serviços Ativos</h2>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-gray-900">Tenant</div>
                                    <div className="text-xs text-gray-600">Ativo</div>
                                </div>
                            </div>
                            <span className="text-xs font-medium text-indigo-600">Ativo</span>
                        </div>

                        {stats.apiKeysCount > 0 && (
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <CreditCard className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">API</div>
                                        <div className="text-xs text-gray-600">{stats.apiKeysCount} chave(s)</div>
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-blue-600">Ativo</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
