import { Metadata } from 'next';
import NovoClienteForm from "@/components/clientes/NovoClienteForm";

export const metadata: Metadata = {
  title: 'Novo Cliente | Nômade Guru',
  description: 'Cadastrar novo cliente',
};

export default function NovoClientePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Novo Cliente</h1>
          <p className="text-gray-600 mt-2">Cadastre um novo cliente no sistema</p>
        </div>

        <NovoClienteForm />
      </div>
    </div>
  );
}