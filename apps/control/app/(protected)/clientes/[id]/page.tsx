import { notFound } from 'next/navigation';
import { getClienteDetalhes } from './actions';
import ClienteDetalhes360 from "@/components/clientes/ClienteDetalhes360";

// Interface CORRIGIDA: params é um objeto, não uma Promise.
interface PageProps {
  params: { id: string };
}

export default async function ClienteDetalhesPage({ params }: PageProps) {
  // Acesso CORRETO: diretamente do objeto params, sem await.
  const { id } = params;

  // Agora a função será chamada com o ID correto.
  const result = await getClienteDetalhes(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <ClienteDetalhes360 cliente={result.data} />;
}

// Corrigindo a função de metadados também
export async function generateMetadata({ params }: PageProps) {
  // Acesso CORRETO aqui também.
  const { id } = params;
  const result = await getClienteDetalhes(id);

  if (!result.success || !result.data) {
    return {
      title: 'Cliente não encontrado',
    };
  }

  return {
    title: `${result.data.nome} | Clientes`,
    description: `Detalhes completos do cliente ${result.data.nome}`,
  };
}