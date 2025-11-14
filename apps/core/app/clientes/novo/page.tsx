import { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import NovoClienteForm from '@/components/admin/clientes/NovoClienteForm';

export const metadata: Metadata = {
  title: 'Novo Cliente | Nômade Guru',
  description: 'Cadastrar novo cliente',
};

const mockUser = {
  email: 'dev@noro.com.br',
  nome: 'Desenvolvedor'
};

export default function NovoClientePage() {
  return (
    <MainLayout user={mockUser}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Novo Cliente</h1>
          <p className="text-gray-600 mt-2">Cadastre um novo cliente no sistema</p>
        </div>

        <NovoClienteForm />
      </div>
    </MainLayout>
  );
}