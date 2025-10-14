import { notFound } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { Roteiro } from '@/lib/types';
import { Metadata } from 'next';

// Função para buscar os dados de um único roteiro pelo slug
async function getRoteiro(slug: string): Promise<Roteiro | null> {
  const { data, error } = await supabase
    .from('nomade_roteiros')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published') // Apenas buscar roteiros publicados
    .single(); // Esperamos apenas um resultado

  if (error) {
    // Se o erro for 'PGRST116', significa que não encontrou nenhuma linha, o que é normal.
    // Para outros erros, é bom registá-los.
    if (error.code !== 'PGRST116') {
      console.error('Erro ao buscar roteiro:', error);
    }
    return null;
  }

  return data;
}

// Geração de metadados dinâmicos para SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const roteiro = await getRoteiro(params.slug);

  if (!roteiro) {
    return {
      title: 'Roteiro Não Encontrado | Nomade Guru',
    };
  }

  return {
    title: roteiro.meta_title || roteiro.titulo,
    description: roteiro.meta_description || roteiro.descricao_curta,
    keywords: roteiro.keywords || [],
    openGraph: {
      title: roteiro.og_title || roteiro.titulo,
      description: roteiro.og_description || roteiro.descricao_curta || '',
      images: roteiro.og_image_url ? [{ url: roteiro.og_image_url, alt: roteiro.og_image_alt_text || '' }] : [],
    },
    alternates: {
      canonical: roteiro.canonical_url || `/destinos/${roteiro.slug}`,
    },
  };
}

// Pré-renderização das páginas no momento da build para melhor performance e SEO
export async function generateStaticParams() {
  const { data: roteiros, error } = await supabase
    .from('nomade_roteiros')
    .select('slug')
    .eq('status', 'published');

  if (error || !roteiros) {
    return [];
  }

  return roteiros.map((roteiro) => ({
    slug: roteiro.slug,
  }));
}

// O componente da página
export default async function RoteiroDetalhesPage({ params }: { params: { slug: string } }) {
  const roteiro = await getRoteiro(params.slug);

  if (!roteiro) {
    notFound(); // Se o roteiro não for encontrado, exibe a página not-found.tsx (404)
  }

  return (
    <main className="bg-slate-900 text-slate-200 pt-24 md:pt-32">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        {/* Imagem Principal */}
        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl shadow-slate-950/50">
          <Image
            src={roteiro.imagem_url || '/placeholder.jpg'}
            alt={roteiro.imagem_alt_text || roteiro.titulo}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Cabeçalho do Roteiro */}
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{roteiro.titulo}</h1>
          <div className="flex items-center gap-4 text-slate-400">
            <span>
              <i className="fa fa-calendar-alt mr-2 text-primary"></i>
              {roteiro.duracao_dias} dias
            </span>
            <span>
              <i className="fa fa-tag mr-2 text-primary"></i>
              {roteiro.categoria}
            </span>
          </div>
        </header>

        {/* Descrição Curta */}
        {roteiro.descricao_curta && (
          <p className="text-lg text-slate-300 mb-12 leading-relaxed border-l-4 border-primary pl-6 italic">
            {roteiro.descricao_curta}
          </p>
        )}

        {/* Detalhes Dia a Dia */}
        {roteiro.detalhes && roteiro.detalhes.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-white mb-8 border-b-2 border-primary pb-4">
              Itinerário Dia a Dia
            </h2>
            <div className="space-y-8">
              {roteiro.detalhes.map((dia) => (
                <div key={dia.dia} className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30">
                      {dia.dia}
                    </div>
                    {/* Não renderiza a linha no último item */}
                    {dia.dia !== roteiro.detalhes.length && <div className="flex-grow w-0.5 bg-slate-700 mt-2"></div>}
                  </div>
                  <div className="pb-8 flex-1">
                    <h3 className="text-2xl font-bold text-white mb-2">{dia.titulo}</h3>
                    <p className="text-slate-400 leading-relaxed">{dia.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

