// Importações necessárias
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient'; // O nosso cliente Supabase
import { Roteiro } from '@/lib/types';           // A nossa interface TypeScript

// Esta é uma função de Server Component, por isso pode ser assíncrona
async function DestinosPage() {
  // Ir buscar os dados diretamente da tabela 'nomade_roteiros'
  const { data: roteiros, error } = await supabase
    .from('nomade_roteiros')
    .select('*')
    .order('created_at', { ascending: false }); // Ordenar pelos mais recentes

  // Se houver um erro na busca, exibimos uma mensagem
  if (error) {
    return <p className="text-center text-red-500">Não foi possível carregar os roteiros. Tente novamente mais tarde.</p>;
  }

  // Se não houver roteiros na base de dados, exibimos uma mensagem amigável
  if (!roteiros || roteiros.length === 0) {
    return <p className="text-center text-gray-400">Ainda não há roteiros disponíveis. Volte em breve!</p>;
  }

  return (
    <div className="bg-slate-900">
      {/* Cabeçalho da página */}
      <div className="bg-primary-dark text-white text-center py-24 px-4">
        <h1 className="text-5xl font-bold mb-4">Explore os Nossos Roteiros</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Encontre a sua próxima grande aventura nos destinos que preparámos para si.
        </p>
      </div>

      {/* Grelha de Roteiros */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {roteiros.map((roteiro: Roteiro) => (
            <Link 
              href={`/destinos/${roteiro.slug}`} 
              key={roteiro.id} 
              className="group bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:-translate-y-2 border border-slate-700"
            >
              <div className="relative w-full h-56">
                <Image
                  src={roteiro.imagem_url || 'https://placehold.co/600x400/232452/FFF?text=Sem+Imagem'}
                  alt={`Imagem do roteiro ${roteiro.titulo}`}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white mb-2">{roteiro.titulo}</h3>
                <p className="text-gray-400 mb-4">{roteiro.duracao_dias ? `${roteiro.duracao_dias} dias` : 'Duração a definir'}</p>
                <div className="text-2xl font-extrabold text-primary">
                  {roteiro.preco_base ? `A partir de €${roteiro.preco_base}` : 'Preço sob consulta'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DestinosPage;

