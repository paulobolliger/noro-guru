import { getTenantContext, getTenantAiBalance } from '../../tenant-actions';
import { CreditCard, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import TenantModulesForm from './TenantModulesForm';
import TenantCreditsForm from './TenantCreditsForm';

export default async function TenantSubscriptionPage({ params }: { params: { id: string } }) {
    const { tenant, empresa } = await getTenantContext(params.id);
    const aiBalance = await getTenantAiBalance(params.id);

    // Mock subscription data for now as we don't have a subscriptions table yet
    const subscription = {
        plan: 'Plano Enterprise', // Defaulting for visual
        status: tenant.status || 'active',
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        amount: 299.90,
        interval: 'monthly'
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-heading">Assinatura e Planos</h2>
                    <p className="text-sm text-secondary">Gerencie o plano contratado e a fatura deste tenant.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Plan Card */}
                <div className="bg-surface-card border border-default rounded-xl overflow-hidden p-6">
                    <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 rounded-lg bg-orange-500/10 text-orange-500">
                                <CreditCard size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-secondary font-medium uppercase tracking-wider">Plano Atual</p>
                                <h3 className="text-2xl font-bold text-heading mt-1">{subscription.plan}</h3>
                            </div>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${subscription.status === 'active'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-red-500/10 text-red-400 border-red-500/20'
                            }`}>
                            {subscription.status.toUpperCase()}
                        </span>
                    </div>

                    <div className="space-y-4 border-t border-default pt-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2 text-secondary">
                                <Calendar size={16} />
                                <span className="text-sm">Expira em</span>
                            </div>
                            <span className="text-sm font-medium text-heading">
                                {new Date(subscription.validUntil).toLocaleDateString('pt-BR')}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-secondary">Ciclo de Cobrança</span>
                            <span className="text-sm font-medium text-heading">Mensal</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-secondary">Valor</span>
                            <span className="text-sm font-medium text-heading">R$ {subscription.amount.toFixed(2).replace('.', ',')} / mês</span>
                        </div>
                    </div>

                    <div className="mt-8">
                        <button className="w-full btn-primary py-2 rounded-lg text-sm font-medium">
                            Alterar Plano
                        </button>
                    </div>
                </div>

                {/* Feature Usage / Limits (Mock) */}
                <div className="bg-surface-card border border-default rounded-xl overflow-hidden p-6">
                    <h3 className="text-lg font-bold text-heading mb-4">Uso de Recursos</h3>
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-secondary">Usuários</span>
                                <span className="text-heading font-medium">5 / 10</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-1/2"></div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-secondary">Armazenamento</span>
                                <span className="text-heading font-medium">1.2GB / 5GB</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-purple-500 w-[24%]"></div>
                            </div>
                        </div>

                        <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex gap-3 text-sm text-secondary">
                            <AlertTriangle size={20} className="text-yellow-500 shrink-0" />
                            <p>O tenant está usando 50% das licenças disponíveis. Considere oferecer um upgrade em breve.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modules Management */}
            <div className="pt-4 border-t border-gray-100">
                <TenantCreditsForm
                    tenantId={tenant.id}
                    initialAiBalance={aiBalance}
                    initialEmailLimit={empresa?.limites?.email_monthly_quota || 0}
                    initialEmailUsed={empresa?.limites?.email_used || 0}
                />

                <TenantModulesForm
                    tenantId={tenant.id}
                    initialModules={empresa?.modulos_contratados}
                />
            </div>
        </div>
    );
}
