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
             {etapaAtual === 1 && ( <div className="animate-fade-in"> <h3 className="text-lg font-semibold text-white mb-4">👋 Como você se chama?</h3> <input type="text" value={formData.nome} onChange={(e) => setFormData({ ...formData, nome: e.target.value })} placeholder="Digite seu nome..." required autoFocus className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" /> <button type="button" onClick={avancarEtapa} disabled={!formData.nome} className="w-full mt-6 p-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"> Continuar → </button> </div> )}
             {etapaAtual === 2 && ( <div className="animate-fade-in"> <h3 className="text-lg font-semibold text-white mb-4">📧 Qual seu melhor e-mail?</h3> <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="seu@email.com" required autoFocus className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" /> <div className="flex gap-4 mt-6"> <button type="button" onClick={voltarEtapa} className="w-1/3 p-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-500 transition-colors"> ← Voltar </button> <button type="button" onClick={avancarEtapa} disabled={!formData.email} className="w-2/3 p-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"> Continuar → </button> </div> </div> )}
             {etapaAtual === 3 && ( <div className="animate-fade-in"> <h3 className="text-lg font-semibold text-white mb-4">🌍 Para onde você quer ir?</h3> <input type="text" value={formData.destino} onChange={(e) => setFormData({...formData, destino: e.target.value})} placeholder="Ex: Japão, Paris, Patagônia..." required autoFocus className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" /> <div className="flex gap-4 mt-6"> <button type="button" onClick={voltarEtapa} className="w-1/3 p-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-500 transition-colors"> ← Voltar </button> <button type="button" onClick={avancarEtapa} disabled={!formData.destino} className="w-2/3 p-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"> Continuar → </button> </div> </div> )}
             {etapaAtual === 4 && ( <div className="animate-fade-in"> <h3 className="text-lg font-semibold text-white mb-4">📅 Quantos dias de viagem?</h3> <input type="number" value={formData.duracao} onChange={(e) => setFormData({...formData, duracao: e.target.value})} placeholder="Ex: 7" min="1" required autoFocus className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary" /> <div className="flex gap-4 mt-6"> <button type="button" onClick={voltarEtapa} className="w-1/3 p-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-500 transition-colors"> ← Voltar </button> <button type="button" onClick={avancarEtapa} disabled={!formData.duracao} className="w-2/3 p-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"> Continuar → </button> </div> </div> )}
             {etapaAtual === 5 && ( <div className="animate-fade-in"> <h3 className="text-lg font-semibold text-white mb-4">🎯 Quais serviços você precisa?</h3> <div className="grid grid-cols-2 gap-3 text-sm"> {['Passagem Aérea', 'Hotel', 'Aluguel de Temporada', 'Passeios', 'Seguro Viagem', 'Aluguel de Carro', 'Transfer', 'Outros'].map(service => ( <label key={service} className="flex items-center p-3 bg-slate-700 rounded-lg cursor-pointer hover:bg-slate-600 transition-colors has-[:checked]:bg-primary has-[:checked]:text-white"> <input type="checkbox" className="sr-only" checked={formData.interesses.includes(service)} onChange={() => handleServiceToggle(service)} /> <span>{service}</span> </label> ))} </div> <div className="flex gap-4 mt-6"> <button type="button" onClick={voltarEtapa} className="w-1/3 p-3 bg-slate-600 text-white rounded-lg font-semibold hover:bg-slate-500 transition-colors">← Voltar</button> <button type="submit" disabled={loading || !formData.interesses} className="w-2/3 p-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed">{loading ? '✨ Gerando...' : '✨ Gerar Roteiro'}</button> </div> </div> )}
             {etapaAtual === 6 && resultado && ( <div className="animate-fade-in"> <h3 className="text-xl font-bold text-white mb-4">🎉 Seu roteiro está pronto!</h3> <div className="prose prose-invert prose-sm max-h-60 overflow-y-auto bg-slate-900/50 p-4 rounded-lg" dangerouslySetInnerHTML={{ __html: resultado }} /> <button type="button" onClick={() => { setShowPopup(false); setEtapaAtual(1); setFormData({ nome: '', email: '', destino: '', duracao: '', interesses: '' }); setResultado(''); }} className="w-full mt-6 p-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors">Fechar</button> </div> )}
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
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-snug">
            Viaje com propósito, viva com liberdade
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8">
            Crie seu roteiro personalizado e descubra novas fronteiras com a força da IA e o toque da nossa curadoria humana.
          </p>
          <button onClick={() => setShowPopup(true)} className="bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 px-10 rounded-full text-lg hover:scale-105 transition-transform">
            Experimente Agora ✨
          </button>
        </div>
      </section>

      {/* Seção de Diferenciais */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold text-white mb-4">Por Que Escolher a Nomade Guru</h2>
             <p className="text-slate-400 mb-12 max-w-3xl mx-auto">Porque viajar vai muito além do destino — é sobre viver experiências com propósito.</p>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 max-w-6xl mx-auto">
                {/* Item 1 */}
                <div className="text-center">
                    <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-slate-800 text-primary text-3xl">
                      <i className="fa-solid fa-microchip"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Tecnologia com propósito</h3>
                    <p className="text-slate-400">IA avançada cria roteiros únicos em segundos — combinando dados, preferências e inspiração real.</p>
                </div>
                {/* Item 2 */}
                <div className="text-center">
                    <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-slate-800 text-primary text-3xl">
                      <i className="fa-solid fa-user-check"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Curadoria humana especializada</h3>
                    <p className="text-slate-400">Nossos especialistas refinam cada detalhe da sua jornada, garantindo experiências com alma e excelência.</p>
                </div>
                {/* Item 3 */}
                <div className="text-center">
                    <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-slate-800 text-primary text-3xl">
                      <i className="fa-solid fa-map-signs"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Roteiros autênticos e exclusivos</h3>
                    <p className="text-slate-400">Nada de pacotes genéricos: criamos viagens originais, que revelam o verdadeiro espírito de cada destino.</p>
                </div>
                {/* Item 4 */}
                <div className="text-center">
                    <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-slate-800 text-primary text-3xl">
                      <i className="fa-solid fa-headset"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Suporte inteligente e humano</h3>
                    <p className="text-slate-400">Um acompanhamento híbrido — tecnologia ágil com atenção humana em cada etapa da sua viagem.</p>
                </div>
                {/* Item 5 */}
                <div className="text-center">
                    <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-slate-800 text-primary text-3xl">
                      <i className="fa-solid fa-leaf"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Viagens com propósito e impacto positivo</h3>
                    <p className="text-slate-400">Conecte-se a experiências sustentáveis que valorizam culturas locais e respeitam o planeta.</p>
                </div>
                {/* Item 6 */}
                <div className="text-center">
                    <div className="flex items-center justify-center h-16 w-16 mx-auto mb-4 rounded-full bg-slate-800 text-primary text-3xl">
                      <i className="fa-solid fa-compass-drafting"></i>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Liberdade total para personalizar</h3>
                    <p className="text-slate-400">Escolha o ritmo, o estilo e os destinos. A Nomade Guru cuida do resto — para você viajar no seu próprio compasso.</p>
                </div>
             </div>
        </div>
      </section>

       {/* Seção Destinos em Destaque */}
      <section className="py-16 bg-slate-800/50">
          <div className="container mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Destinos que contam histórias</h2>
              <p className="text-slate-400 mb-12 max-w-2xl mx-auto">Roteiros autênticos, experiências memoráveis, curadoria com propósito.</p>
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
              <div className="mt-12">
                <Link href="/destinos" className="bg-slate-700 text-white font-bold py-3 px-8 rounded-full hover:bg-slate-600 transition-colors">
                    Ver Todos os Destinos
                </Link>
              </div>
          </div>
      </section>

      {/* NOVA SEÇÃO COMBINADA: COMO FUNCIONA + CTA */}
      <section className="py-16 bg-slate-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-12">Como Criamos a Sua Jornada</h2>
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto mb-20">
            {/* Passo 1 */}
            <div className="text-center">
              <div className="relative mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-slate-800 text-primary font-bold text-2xl ring-4 ring-slate-700">1</div>
              <h3 className="text-xl font-semibold text-white mb-2">Compartilhe seus sonhos</h3>
              <p className="text-slate-400">Conte-nos o estilo, o ritmo e o propósito da sua próxima viagem.</p>
            </div>
            {/* Passo 2 */}
            <div className="text-center">
              <div className="relative mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-slate-800 text-primary font-bold text-2xl ring-4 ring-slate-700">2</div>
              <h3 className="text-xl font-semibold text-white mb-2">A IA dá vida ao seu roteiro</h3>
              <p className="text-slate-400">Em segundos, criamos uma proposta exclusiva, feita sob medida para você.</p>
            </div>
            {/* Passo 3 */}
            <div className="text-center">
              <div className="relative mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full bg-slate-800 text-primary font-bold text-2xl ring-4 ring-slate-700">3</div>
              <h3 className="text-xl font-semibold text-white mb-2">Curadoria humana refina cada detalhe</h3>
              <p className="text-slate-400">Nossos especialistas transformam o plano em uma experiência inesquecível.</p>
            </div>
          </div>

          {/* CTA Inserido Aqui */}
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl bg-gradient-to-r from-primary to-primary-dark p-10 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Pronto para sua próxima aventura?</h2>
                <p className="text-lg text-white/90 mb-6">Crie seu roteiro personalizado agora mesmo com nossa IA.</p>
                <button onClick={() => setShowPopup(true)} className="inline-block rounded-full bg-white px-10 py-3 font-bold text-primary shadow-lg transition-transform hover:scale-105">
                    Começar Agora ✨
                </button>
            </div>
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