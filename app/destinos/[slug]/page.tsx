import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createServerSupabaseClient, createServiceRoleSupabaseClient } from '@/lib/supabase/server';
import { Roteiro } from '@/lib/types';
import { Metadata } from 'next';

async function getRoteiro(slug: string): Promise<Roteiro | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from('nomade_roteiros')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) {
    if (error.code !== 'PGRST116') {
      console.error('Erro ao buscar roteiro:', error);
    }
    return null;
  }
  return data;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const roteiro = await getRoteiro(params.slug);
  if (!roteiro) {
    return { title: 'Roteiro Não Encontrado | Nomade Guru' };
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

export async function generateStaticParams() {
  const supabase = createServiceRoleSupabaseClient();
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

export default async function RoteiroDetalhesPage({ params }: { params: { slug: string } }) {
  const roteiro = await getRoteiro(params.slug);
  if (!roteiro) {
    notFound();
  }

  return (
    <main className="bg-slate-900 text-slate-200 pt-24 md:pt-32">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-12">
          <div className="lg:col-span-2">
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl shadow-slate-950/50">
              <Image
                src={roteiro.imagem_url || '/placeholder.jpg'}
                alt={roteiro.imagem_alt_text || roteiro.titulo}
                fill
                className="object-cover"
                priority
              />
            </div>
            <header className="mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">{roteiro.titulo}</h1>
              <div className="flex items-center gap-4 text-slate-400">
                <span>
                  <i className="fa-solid fa-tag mr-2 text-primary"></i>
                  {roteiro.categoria}
                </span>
              </div>
            </header>
            {roteiro.descricao_curta && (
              <p className="text-lg text-slate-300 mb-12 leading-relaxed border-l-4 border-primary pl-6 italic">
                {roteiro.descricao_curta}
              </p>
            )}
            {roteiro.detalhes && roteiro.detalhes.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold text-white mb-8 border-b-2 border-primary pb-4">
                  Itinerário Dia a Dia
                </h2>
                <div className="space-y-8">
                  {roteiro.detalhes.map((dia, index) => (
                    <div key={dia.dia} className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30">
                          {dia.dia}
                        </div>
                        {index < roteiro.detalhes.length - 1 && <div className="flex-grow w-0.5 bg-slate-700 mt-2"></div>}
                      </div>
                      <div className="pb-8 flex-1">
                        <h3 className="text-2xl font-bold text-white mb-2">{dia.titulo}</h3>
                        <p className="text-slate-400 leading-relaxed">{dia.descricao}</p>
                        <p className="text-slate-400 leading-relaxed">
                          {typeof dia.descricao === 'string' ? dia.descricao : JSON.stringify(dia.descricao)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-32 rounded-2xl border border-slate-700 bg-slate-800 p-8 shadow-lg">
              <div className="mb-6">
                <p className="text-slate-400">Duração</p>
                <p className="text-2xl font-bold text-white">{roteiro.duracao_dias} dias</p>
              </div>
              <div className="mb-8">
                <p className="text-slate-400">A partir de</p>
                <p className="text-4xl font-bold text-primary">
                  {roteiro.preco_base ? `€ ${roteiro.preco_base.toLocaleString('pt-PT')}` : 'Sob Consulta'}
                </p>
              </div>
              <Link href="/?popup=true" className="w-full block text-center rounded-lg bg-white px-6 py-4 font-bold text-primary transition-transform hover:scale-105 shadow-lg">
                Quero Personalizar Este Roteiro ✨
              </Link>
              <p className="mt-6 text-center text-xs text-slate-500">
                Valores e disponibilidade sujeitos a alteração. Fale com um especialista para um orçamento exato.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

