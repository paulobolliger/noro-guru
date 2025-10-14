import { Metadata } from 'next';

type Props = {
  params: { id: string };
};

// Esta função busca dados no servidor para gerar o título e a descrição da página
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
  const roteiroId = params.id;

  if (!apiUrl) {
    return { title: 'Roteiro - Nomade Guru' };
  }

  try {
    const res = await fetch(`${apiUrl}/api/roteiros?filters[documentId][$eq]=${roteiroId}&fields[0]=Titulo&fields[1]=Introducao`);
    if (!res.ok) throw new Error();

    const data = await res.json();
    if (!data.data || data.data.length === 0) {
      return { title: 'Roteiro Não Encontrado - Nomade Guru' };
    }
    
    const roteiro = data.data[0];
    const titulo = roteiro.Titulo || 'Roteiro Detalhado';
    const descricao = roteiro.Introducao?.substring(0, 160) + '...' || `Explore o roteiro ${titulo}`;

    return {
      title: `${titulo} - Nomade Guru`,
      description: descricao,
    };

  } catch (error) {
    return {
      title: 'Erro ao Carregar Roteiro - Nomade Guru',
      description: 'Não foi possível carregar as informações deste roteiro.',
    };
  }
}
