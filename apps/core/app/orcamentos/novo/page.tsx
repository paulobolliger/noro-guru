// apps/core/(protected)/orcamentos/novo/page.tsx
import { Metadata } from 'next';
import MainLayout from '@/components/layout/MainLayout';
import NovoOrcamentoForm from '@/components/admin/orcamentos/NovoOrcamentoForm';

export const metadata: Metadata = {
  title: 'Nova Proposta | Noro',
  description: 'Criar uma nova proposta de viagem.',
};

const mockUser = {
  email: 'dev@noro.com.br',
  nome: 'Desenvolvedor'
};

export default function NovoOrcamentoPage() {
  // A lógica de título e botões agora está dentro do NovoOrcamentoForm para melhor controle do estado do modal.
  return (
    <MainLayout user={mockUser}>
      <NovoOrcamentoForm />
    </MainLayout>
  );
}