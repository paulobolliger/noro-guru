import { getTenantContext } from '../../tenant-actions';
import TenantCompanyForm from './TenantCompanyForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Using relative path assuming default shadcn/ui structure

export default async function TenantCompanyPage({ params }: { params: { id: string } }) {
    const { tenant, empresa } = await getTenantContext(params.id);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-heading">Dados da Empresa</h2>
                <p className="text-sm text-secondary">Gerencie as informações legais e de contato deste tenant.</p>
            </div>

            <div className="bg-surface-card border border-default rounded-xl overflow-hidden">
                <TenantCompanyForm tenantId={params.id} initialData={empresa} />
            </div>
        </div>
    );
}
