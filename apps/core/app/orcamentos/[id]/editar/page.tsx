// app/admin/(protected)/orcamentos/[id]/editar/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { getOrcamentoById } from '../../orcamentos-actions';
import { getClientes } from '@/app/clientes/actions';
import EditOrcamentoForm from '@/components/admin/orcamentos/EditOrcamentoForm';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const result = await getOrcamentoById(params.id);

  if (!result.success || !result.data) {
    return { title: 'Orçamento não encontrado' };
  }

  return {
    title: `Editar Orçamento ${result.data.numero_orcamento || result.data.titulo} | Noro`,
    description: `Edição do orçamento ${result.data.titulo}.`,
  };
}

const mockUser = {
  email: 'dev@noro.com.br',
  nome: 'Desenvolvedor'
};

export default async function EditOrcamentoPage({ params }: PageProps) {
  const { id } = params;

  // 1. Buscar o orçamento existente
  const orcamentoResult = await getOrcamentoById(id);
  if (!orcamentoResult.success || !orcamentoResult.data) {
    notFound();
  }
  const orcamento = orcamentoResult.data;

  // 2. Buscar a lista completa de clientes para o seletor (autocomplete)
  const clientes = await getClientes();

  // O componente EditOrcamentoForm aceita o objeto do orçamento e a lista de clientes.
  return (
    <MainLayout user={mockUser}>
      <div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Editar Orçamento</h1>
          <p className="text-gray-600 mt-2">Modifique a proposta e os itens do orçamento {orcamento.numero_orcamento || orcamento.titulo}.</p>
        </div>

        <EditOrcamentoForm
          orcamentoInicial={orcamento}
          clientes={clientes}
        />
      </div>
    </MainLayout>
  );
}