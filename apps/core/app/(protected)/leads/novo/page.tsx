import { Metadata } from 'next';
import NovoLeadForm from '@/components/admin/leads/NovoLeadForm';

export const metadata: Metadata = {
  title: 'Novo Lead | Noro',
  description: 'Cadastrar novo lead no sistema',
};

export default function NovoLeadPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Novo Lead</h1>
          <p className="text-gray-600 mt-2">Cadastre um novo lead no sistema</p>
        </div>

        <NovoLeadForm />
      </div>
    </div>
  );
}
