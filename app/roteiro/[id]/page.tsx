"use client"; // Esta página é interativa (galeria de fotos), por isso é um Componente Cliente.

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound, useRouter } from 'next/navigation';

import Header from '@/components/Header';
import Footer from '@/components/Footer';

// --- DEFINIÇÃO DE TIPOS ---
interface Foto {
  url: string;
  formats?: {
    large?: { url: string };
    thumbnail?: { url: string };
  };
}

interface PlanoDiario {
  Numero_do_Dia: number;
  Titulo_do_Dia: string;
  Descricao_do_Dia: string;
}

interface Roteiro {
  id: string;
  Titulo: string;
  Introducao: string;
  Duracao: string;
  Preco: number;
  GaleriaDeFotos: Foto[];
  PlanoDiario: PlanoDiario[];
}

// --- COMPONENTE DA PÁGINA ---
export default function RoteiroDetalhesPage({ params }: { params: { id: string } }) {
  const [roteiro, setRoteiro] = useState<Roteiro | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imagemAtual, setImagemAtual] = useState(0);
  const router = useRouter(); // Hook para navegação

  useEffect(() => {
    async function fetchRoteiro() {
      const apiUrl = process.env.NEXT_PUBLIC_STRAPI_API_URL;
      if (!apiUrl) {
        setError('Configuração do servidor incompleta.');
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch(`${apiUrl}/api/roteiros?filters[documentId][$eq]=${params.id}&populate=*`);
        if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);
        
        const data = await res.json();
        if (!data.data || data.data.length === 0) {
          // notFound() é um hook do Next.js que renderiza a página not-found.tsx mais próxima
          return notFound();
        }
        
        setRoteiro(data.data[0]);
      } catch (err) {
        setError('Não foi possível carregar o roteiro.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchRoteiro();
  }, [params.id]);

  const handleCrieRoteiroClick = () => {
    router.push('/#contato');
  };

  if (loading) {
    return (
        <>
            <Header onCrieRoteiroClick={() => {}}/>
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-lg">A carregar roteiro...</p>
            </div>
            <Footer />
        </>
    );
  }
  
  if (error || !roteiro) {
     return (
        <>
            <Header onCrieRoteiroClick={() => {}}/>
            <div className="flex flex-col items-center justify-center min-h-screen text-center">
                <h1 className="text-3xl font-bold mb-4">Roteiro não encontrado</h1>
                <p className="mb-6">{error || "Não foi possível encontrar o roteiro solicitado."}</p>
                <Link href="/destinos" className="text-primary hover:underline">← Voltar para Destinos</Link>
            </div>
            <Footer />
        </>
    );
  }
  
  const galeriaFotos = roteiro.GaleriaDeFotos || [];
  const fotoPrincipal = galeriaFotos[imagemAtual]?.formats?.large?.url || galeriaFotos[imagemAtual]?.url;

  return (
    <>
      <Header onCrieRoteiroClick={handleCrieRoteiroClick} />

      <main className="pt-24 md:pt-32 bg-neutral-dark text-white">
        <div className="container mx-auto max-w-5xl px-5 py-12">
          
          {/* Botão de Voltar */}
          <div className="mb-8">
            <Link href="/destinos" className="text-primary hover:text-primary-light transition-colors">
              ← Voltar para Destinos
            </Link>
          </div>

          {/* Cabeçalho do Roteiro */}
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{roteiro.Titulo}</h1>
            <div className="flex flex-wrap gap-x-8 gap-y-2 text-white/80">
              <p><strong>Duração:</strong> {roteiro.Duracao || 'Consulte-nos'}</p>
              <p><strong>Preço:</strong> {roteiro.Preco > 0 ? `US$ ${(roteiro.Preco / 100).toFixed(2).replace('.', ',')}` : 'Sob consulta'}</p>
            </div>
          </div>

          {/* Galeria de Fotos */}
          {galeriaFotos.length > 0 && (
            <div className="mb-12">
              <div className="relative mb-4 overflow-hidden rounded-2xl">
                <Image 
                  src={fotoPrincipal}
                  alt={`${roteiro.Titulo} - Foto ${imagemAtual + 1}`}
                  width={1200}
                  height={675}
                  className="w-full h-auto max-h-[600px] object-cover"
                />
                
                {galeriaFotos.length > 1 && (
                  <>
                    <button onClick={() => setImagemAtual(imagemAtual > 0 ? imagemAtual - 1 : galeriaFotos.length - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/80 text-black text-2xl shadow-lg transition hover:bg-white">‹</button>
                    <button onClick={() => setImagemAtual(imagemAtual < galeriaFotos.length - 1 ? imagemAtual + 1 : 0)} className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-white/80 text-black text-2xl shadow-lg transition hover:bg-white">›</button>
                  </>
                )}
              </div>
              
              {galeriaFotos.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {galeriaFotos.map((foto, index) => (
                    <button key={index} onClick={() => setImagemAtual(index)} className={`flex-shrink-0 rounded-lg overflow-hidden transition-all ${imagemAtual === index ? 'ring-4 ring-primary' : 'opacity-70 hover:opacity-100'}`}>
                      <Image
                        src={foto.formats?.thumbnail?.url || foto.url}
                        alt={`Miniatura ${index + 1}`}
                        width={100}
                        height={100}
                        className="h-24 w-24 object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Introdução */}
          {roteiro.Introducao && (
            <div className="mb-12 rounded-2xl bg-secondary-dark p-8 text-lg leading-relaxed text-white/90">
              <p>{roteiro.Introducao}</p>
            </div>
          )}

          {/* Plano Dia a Dia */}
          {roteiro.PlanoDiario && roteiro.PlanoDiario.length > 0 && (
            <div className="mb-16">
              <h2 className="text-3xl font-bold text-primary mb-8">📅 Roteiro Dia a Dia</h2>
              <div className="space-y-6">
                {roteiro.PlanoDiario.map((dia) => (
                  <div key={dia.Numero_do_Dia} className="rounded-2xl border-l-4 border-primary bg-secondary-dark p-8">
                    <div className="mb-3 inline-block rounded-full bg-primary px-4 py-1 font-bold text-white">
                      Dia {dia.Numero_do_Dia}
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-3">{dia.Titulo_do_Dia}</h3>
                    <p className="leading-relaxed text-white/80">{dia.Descricao_do_Dia}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Final */}
          <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-10 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Pronto para essa aventura?</h2>
            <p className="text-lg text-white/90 mb-6">Entre em contacto para personalizar este roteiro.</p>
            <Link href="/#contato" className="inline-block rounded-full bg-white px-10 py-3 font-bold text-primary shadow-lg transition-transform hover:scale-105">
              Fale Conosco
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
