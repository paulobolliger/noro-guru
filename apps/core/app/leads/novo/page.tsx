import { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import NovoLeadForm from '@/components/admin/leads/NovoLeadForm';

export const metadata: Metadata = {
  title: 'Novo Lead | Noro',
  description: 'Cadastrar novo lead no sistema',
};

const mockUser = {
  email: 'dev@noro.com.br',
  nome: 'Desenvolvedor'
};

export default function NovoLeadPage() {
  return (
    <MainLayout user={mockUser}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Novo Lead</h1>
          <p className="text-gray-600 mt-2">Cadastre um novo lead no sistema</p>
        </div>

        <NovoLeadForm />
      </div>
    </MainLayout>
  );
}
