// app/admin/(protected)/orcamentos/page.tsx
import OrcamentosClientPage from '@/components/admin/OrcamentosClientPage';
import { getOrcamentos } from './orcamentos-actions'; 

export const dynamic = 'force-dynamic';

export default async function OrcamentosPage() {
    const orcamentos = await getOrcamentos();
    
    return <OrcamentosClientPage orcamentos={orcamentos} />;
}