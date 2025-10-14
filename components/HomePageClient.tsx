'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Roteiro } from '@/lib/types';
import { useSearchParams } from 'next/navigation';

// --- Componente do Pop-up (isolado para clareza) ---
function RoteiroPopup({ showPopup, setShowPopup }: { showPopup: boolean, setShowPopup: (show: boolean) => void }) {
  // (Toda a lógica do formulário de várias etapas, como estava antes)
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState('');
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    destino: '',
    duracao: '',
    interesses: ''
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setResultado('');

    try {
      await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const response = await fetch('/api/gerar-roteiro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Falha na resposta do servidor');
      }

      setResultado(result.roteiro);
      setEtapaAtual(6);

    } catch (error) {
      setResultado(`<p style="color: red;">${(error as Error).message}</p>`);
    } finally {
      setLoading(false);
    }
  };

    const avancarEtapa = () => { if (etapaAtual < 5) setEtapaAtual(etapaAtual + 1); };
    const voltarEtapa = () => { if (etapaAtual > 1) setEtapaAtual(etapaAtual - 1); };
    const handleServiceToggle = (serviceName: string) => {
      const currentInteresses = formData.interesses ? formData.interesses.split(', ') : [];
      const index = currentInteresses.indexOf(serviceName);
      if (index > -1) { currentInteresses.splice(index, 1); } else { currentInteresses.push(serviceName); }
      setFormData({...formData, interesses: currentInteresses.join(', ')});
    };

  if (!showPopup) return null;

  return (
     <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in" onClick={() => setShowPopup(false)}>
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl max-w-md w-11/12 max-h-[85vh] overflow-y-auto relative shadow-2xl shadow-primary/20 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors text-2xl z-10" onClick={() => setShowPopup(false)}>✕</button>
        <div className="p-8">
          <h2 className="text-2xl font-bold text-white mb-2">✨ Criar Roteiro Mágico</h2>
          <div className="w-full bg-slate-700 rounded-full h-1.5 mb-6">
            <div className="bg-primary h-1.5 rounded-full transition-all duration-500" style={{ width: `${(etapaAtual / 5) * 100}%` }}></div>
          </div>
          <p className="text-sm text-slate-400 mb-6">Etapa {etapaAtual} de 5</p>
          <form onSubmit={handleSubmit}>
            {/* Etapas 1 a 6 do formulário, exatamente como antes */}
             {etapaAtual === 1 && ( <div className="animate-fade-in"> <h3 className="text-lg font-semibold text-white mb-4">👋 Como você se chama?</h3> <input type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} placeholder="Digite seu nome..." required autoFocus className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" /> <button type="button" onClick={avancarEtapa} disabled={!formData.nome} className="w-full mt-6 p-3 bg-primary text-white rounded-lg font-semibold hover:bg-denary transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"> Continuar → </button> </div> )}
             {etapaAtual === 2 && ( <div className="animate-fade-in"> <h3 className="text-lg font-semibold text-white mb-4">📧 Qual seu melhor e-mail?</h3> <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="seu@email.com" required autoFocus className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" /> <div className="flex gap-4 mt-6"> <button type="button" onClick={voltarEtapa} className="w-1/3 p-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-500 transition-colors"> ← Voltar </button> <button type="button" onClick={avancarEtapa} disabled={!formData.email} className="w-2/3 p-3 bg-primary text-white rounded-lg font-semibold hover:bg-denary transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"> Continuar → </button> </div> </div> )}
             {etapaAtual === 3 && ( <div className="animate-fade-in"> <h3 className="text-lg font-semibold text-white mb-4">🌍 Para onde você quer ir?</h3> <input type="text" value={formData.destino} onChange={(e) => setFormData({...formData, destino: e.target.value})} placeholder="Ex: Japão, Paris, Patagônia..." required autoFocus className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" /> <div className="flex gap-4 mt-6"> <button type="button" onClick={voltarEtapa} className="w-1/3 p-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-500 transition-colors"> ← Voltar </button> <button type="button" onClick={avancarEtapa} disabled={!formData.destino} className="w-2/3 p-3 bg-primary text-white rounded-lg font-semibold hover:bg-denary transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"> Continuar → </button> </div> </div> )}
             {etapaAtual === 4 && ( <div className="animate-fade-in"> <h3 className="text-lg font-semibold text-white mb-4">📅 Quantos dias de viagem?</h3> <input type="number" value={formData.duracao} onChange={(e) => setFormData({...formData, duracao: e.target.value})} placeholder="Ex: 7" min="1" required autoFocus className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" /> <div className="flex gap-4 mt-6"> <button type="button" onClick={voltarEtapa} className="w-1/3 p-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-500 transition-colors"> ← Voltar </button> <button type="button" onClick={avancarEtapa} disabled={!formData.duracao} className="w-2/3 p-3 bg-primary text-white rounded-lg font-semibold hover:bg-denary transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"> Continuar → </button> </div> </div> )}
             {etapaAtual === 5 && ( <div className="animate-fade-in"> <h3 className="text-lg font-semibold text-white mb-4">🎯 Quais serviços você precisa?</h3> <div className="grid grid-cols-2 gap-3 text-sm"> {['Passagem Aérea', 'Hotel', 'Aluguel de Temporada', 'Passeios', 'Seguro Viagem', 'Aluguel de Carro', 'Transfer', 'Outros'].map(service => ( <label key={service} className="flex items-center p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors has-[:checked]:bg-primary has-[:checked]:text-white"> <input type="checkbox" className="sr-only" checked={formData.interesses.includes(service)} onChange={() => handleServiceToggle(service)} /> <span>{service}</span> </label> ))} </div> <div className="flex gap-4 mt-6"> <button type="button" onClick={voltarEtapa} className="w-1/3 p-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-500 transition-colors">← Voltar</button> <button type="submit" disabled={loading || !formData.interesses} className="w-2/3 p-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">{loading ? '✨ Gerando...' : '✨ Gerar Roteiro'}</button> </div> </div> )}
             {etapaAtual === 6 && resultado && ( <div className="animate-fade-in"> <h3 className="text-xl font-bold text-white mb-4">🎉 Seu roteiro está pronto!</h3> <div className="prose prose-invert prose-sm max-h-60 overflow-y-auto bg-slate-900/50 p-4 rounded-lg" dangerouslySetInnerHTML={{ __html: resultado }} /> <button type="button" onClick={() => { setShowPopup(false); setEtapaAtual(1); setFormData({ nome: '', email: '', destino: '', duracao: '', interesses: '' }); setResultado(''); }} className="w-full mt-6 p-3 bg-primary text-white rounded-lg font-semibold hover:bg-denary transition-colors">Fechar</button> </div> )}
          </form>
        </div>
      </div>
    </div>
  );
}


// --- Componente principal da UI da Home (Client) ---
function HomePageContent({ destinosDestaque }: { destinosDestaque: Roteiro[] }) {
  const [showPopup, setShowPopup] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get('popup') === 'true') {
      setShowPopup(true);
    }
  }, [searchParams]);

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center text-center px-4">
        <div className="absolute inset-0">
          <Image 
            src="https://res.cloudinary.com/dhqvjxgue/image/upload/v1744155476/imagem-impactante_1_nv98cg.png"
            alt="Paisagem montanhosa dramática com um lago"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        <div className="relative z-10 max-w-3xl animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Viaje com propósito, viva com liberdade
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8">
            Crie seu roteiro personalizado e descubra novas fronteiras com nossa tecnologia de IA e curadoria humana.
          </p>
          <button onClick={() => setShowPopup(true)} className="bg-gradient-to-r from-primary to-denary text-white font-bold py-4 px-10 rounded-full text-lg hover:scale-105 transition-transform">
            Experimente Agora ✨
          </button>
        </div>
      </section>

      {/* Seção de Diferenciais */}
      <section className="py-20 bg-slate-900">
        <div className="container mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold text-white mb-12">Nossos Diferenciais</h2>
             <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {/* Item 1 */}
                <div className="bg-slate-800 p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Tecnologia com Propósito</h3>
                    <p className="text-slate-400">IA avançada para criar roteiros únicos em segundos.</p>
                </div>
                {/* Item 2 */}
                <div className="bg-slate-800 p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Curadoria Humana</h3>
                    <p className="text-slate-400">Especialistas refinam cada detalhe da sua jornada.</p>
                </div>
                {/* Item 3 */}
                <div className="bg-slate-800 p-8 rounded-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Experiências Autênticas</h3>
                    <p className="text-slate-400">Roteiros exclusivos que vão além do óbvio.</p>
                </div>
             </div>
        </div>
      </section>

       {/* Seção Destinos em Destaque */}
      <section className="py-20 bg-slate-800/50">
          <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white mb-12">Destinos em Destaque</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {destinosDestaque.map(roteiro => (
                      <Link href={`/destinos/${roteiro.slug}`} key={roteiro.id} className="block bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-primary/50 transition-shadow">
                          <div className="relative h-56">
                            <Image src={roteiro.imagem_url || ''} alt={roteiro.titulo} fill className="object-cover"/>
                          </div>
                          <div className="p-6">
                              <h3 className="text-xl font-bold text-white">{roteiro.titulo}</h3>
                              <p className="text-slate-400 mt-2">{roteiro.duracao_dias} dias</p>
                          </div>
                      </Link>
                  ))}
              </div>
          </div>
      </section>

      <RoteiroPopup showPopup={showPopup} setShowPopup={setShowPopup} />
    </>
  );
}

// O componente final que usa Suspense para lidar com o useSearchParams
export default function HomePageClient({ destinosDestaque }: { destinosDestaque: Roteiro[] }) {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Carregando...</div>}>
      <HomePageContent destinosDestaque={destinosDestaque} />
    </Suspense>
  );
}
