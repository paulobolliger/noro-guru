// app/admin/(protected)/orcamentos/page.tsx
import OrcamentosClientPage from '@/components/admin/OrcamentosClientPage';
// Assume-se que o arquivo de actions foi criado no mesmo diretório
import { getOrcamentos } from './orcamentos-actions'; 

export const dynamic = 'force-dynamic';

export default async function OrcamentosPage() {
    // 1. Buscar todos os orçamentos no servidor usando a Server Action
    const orcamentos = await getOrcamentos();
    
    // 2. Passar a lista para o componente cliente para renderização e interatividade
    return <OrcamentosClientPage orcamentos={orcamentos} />;
}