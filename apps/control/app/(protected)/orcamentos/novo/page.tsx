// app/admin/(protected)/orcamentos/novo/page.tsx
import { Metadata } from 'next';
import NovoOrcamentoForm from "@/components/admin/orcamentos/NovoOrcamentoForm";

export const metadata: Metadata = {
  title: 'Nova Proposta | Noro',
  description: 'Criar uma nova proposta de viagem.',
};

export default function NovoOrcamentoPage() {
  // A lógica de título e botões agora está dentro do NovoOrcamentoForm para melhor controle do estado do modal.
  return <NovoOrcamentoForm />;
}