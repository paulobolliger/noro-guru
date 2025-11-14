// apps/core/(protected)/orcamentos/page.tsx
import MainLayout from '@/components/layout/MainLayout';
import OrcamentosClientPage from '@/components/admin/OrcamentosClientPage';
import { getOrcamentos } from './orcamentos-actions';

export const dynamic = 'force-dynamic';

const mockUser = {
  email: 'dev@noro.com.br',
  nome: 'Desenvolvedor'
};

export default async function OrcamentosPage() {
    const orcamentos = await getOrcamentos();

    return (
      <MainLayout user={mockUser}>
        <OrcamentosClientPage orcamentos={orcamentos} />
      </MainLayout>
    );
}