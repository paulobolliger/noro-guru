// components/DestinosClient.tsx

'use client'; // <-- Marca este como um Componente de Cliente

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Roteiro, RoteiroCategorias } from '@/lib/types';

// Este componente recebe a lista de todos os roteiros e cuida da interatividade
export default function DestinosClient({ allRoteiros }: { allRoteiros: Roteiro[] }) {
  const [activeCategory, setActiveCategory] = useState<string>('Todos');

  // Filtra os roteiros com base na categoria ativa
  const filteredRoteiros = useMemo(() => {
    if (activeCategory === 'Todos') {
      return allRoteiros;
    }
    return allRoteiros.filter(roteiro => roteiro.categoria === activeCategory);
  }, [allRoteiros, activeCategory]);

  return (
    <div className="pt-20 bg-slate-900">
      <section className="bg-gradient-to-r from-primary to-primary-dark py-8 text-center text-white">
        <div className="container mx-auto px-5">
          <h1 className="text-4xl font-bold md:text-5xl">Explore os Nossos Roteiros</h1>
          <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
            Encontre a sua próxima grande aventura nos destinos que preparámos para si.
          </p>
        </div>
      </section>

      {/* Secção de Filtros de Categoria com quebra de linha */}
      <section className="py-8 sticky top-[72px] bg-slate-900/80 backdrop-blur-sm z-40 border-b border-slate-700">
        <div className="container mx-auto px-4">
          {/* A classe 'flex-wrap' permite que os itens quebrem para a próxima linha */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              onClick={() => setActiveCategory('Todos')}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors flex-shrink-0 ${activeCategory === 'Todos' ? 'bg-primary text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
            >
              Todos
            </button>
            {RoteiroCategorias.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors flex-shrink-0 ${activeCategory === category ? 'bg-primary text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grelha de Roteiros */}
      <div className="container mx-auto px-4 py-16">
        {filteredRoteiros.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRoteiros.map((roteiro: Roteiro) => (
              <Link 
                href={`/destinos/${roteiro.slug}`} 
                key={roteiro.id} 
                className="group block overflow-hidden rounded-lg bg-slate-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/50"
              >
                <div className="relative w-full h-56">
                  <Image
                    src={roteiro.imagem_url || 'https://placehold.co/600x400/232452/FFF?text=Sem+Imagem'}
                    alt={roteiro.imagem_alt_text || roteiro.titulo}
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
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white">Nenhum roteiro encontrado</h2>
            <p className="mt-4 text-slate-400">Não há roteiros disponíveis para a categoria selecionada.</p>
          </div>
        )}
      </div>
    </div>
  );
}