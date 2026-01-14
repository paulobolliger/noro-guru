import { getTenantContext } from '../../tenant-actions';
import TenantSettingsForm from './TenantSettingsForm';

export default async function TenantSettingsPage({ params }: { params: { id: string } }) {
    const { configuracoes } = await getTenantContext(params.id);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-heading">Configurações do Sistema</h2>
                <p className="text-sm text-secondary">Personalize a aparência e os padrões regionais deste tenant.</p>
            </div>

            <div className="bg-surface-card border border-default rounded-xl overflow-hidden">
                <TenantSettingsForm tenantId={params.id} initialData={configuracoes} />
            </div>
        </div>
    );
}
