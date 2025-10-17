// app/admin/(protected)/orcamentos/novo/page.tsx
import { Metadata } from 'next';
import NovoOrcamentoForm from '@/components/admin/orcamentos/NovoOrcamentoForm';

export const metadata: Metadata = {
  title: 'Novo Orçamento | Noro',
  description: 'Criar um novo orçamento de viagem.',
};

export default function NovoOrcamentoPage() {
  // A lógica de busca de clientes (para o seletor) será implementada no componente.
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Novo Orçamento</h1>
        <p className="text-gray-600 mt-2">Crie uma proposta detalhada para o seu cliente.</p>
      </div>

      <NovoOrcamentoForm />
    </div>
  );
}