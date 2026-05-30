import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Activity,
  Users,
  Coins,
  MapPin,
  Calendar,
  Plus,
  Search,
  ArrowUpRight,
  Check,
  ChevronRight,
  Globe,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const DASHBOARD_TRIPS_PREVIEW = [
  {
    id: 1,
    client: "Helena Abreu",
    destination: "Lisboa & Évora, Portugal",
    dates: "12 Set - 20 Set",
    margin: "18.5%",
    status: "Roteiro IA Pronto",
    value: "R$ 14.800",
    color: "text-noro-teal border-noro-teal/30 bg-noro-teal/5",
    itinerary: {
      highlights: "Vinícolas do Esporão, Transfer Privativo, Hotel Boutique Évora",
      visto: "Não necessita de visto consular para turismo até 90 dias.",
      exchange: "Bivalente (Euro @ R$ 5,68). Margem de lucro de R$ 2.738 líquida."
    }
  },
  {
    id: 2,
    client: "Rodrigo Silva",
    destination: "Paris & Chamonix, França",
    dates: "04 Out - 12 Out",
    margin: "15.0%",
    status: "Alerta de Visto",
    value: "R$ 22.400",
    color: "text-amber-400 border-amber-400/30 bg-amber-400/5",
    itinerary: {
      highlights: "Subida ao Aiguille du Midi, Trem Paris-Genebra 1ª Classe",
      visto: "Seguro viagem internacional com cobertura mínima de €30.000 é mandatório.",
      exchange: "Bivalente (Euro @ R$ 5,68). Margem de lucro de R$ 3.360 líquida."
    }
  },
  {
    id: 3,
    client: "Ana Paula Melo",
    destination: "Orlando, EUA (Disney)",
    dates: "22 Dez - 05 Jan",
    margin: "19.2%",
    status: "Faturado (Asaas)",
    value: "R$ 38.900",
    color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/5",
    itinerary: {
      highlights: "Ingressos Park Hopper 4 Dias, Resort Disney All-Star",
      visto: "Visto Americano de Turismo (B2) ativo e passaporte válido exigidos.",
      exchange: "Bivalente (Dólar @ R$ 5,24). Margem de lucro de R$ 7.468 líquida."
    }
  }
];

export default function Hero() {
  const [selectedTripId, setSelectedTripId] = useState(1);
  const activeTrip = DASHBOARD_TRIPS_PREVIEW.find(t => t.id === selectedTripId) || DASHBOARD_TRIPS_PREVIEW[0];

  const handleOpenAICapturer = (e: React.MouseEvent) => {
    e.preventDefault();
    // Dispatch a custom event to trigger the AI-guided lead capture conversation
    const event = new CustomEvent('open-noro-chatbot-lead-flow');
    window.dispatchEvent(event);
  };

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden" id="hero-section">
      {/* Background Gradients & Grid */}
      <div className="absolute inset-0 grid-bg opacity-40 pointer-events-none" />
      
      {/* Radial ambient glow representing the "Intelligent Core" */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-noro-purple-light/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-noro-teal/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto font-sans">
          {/* Prominent glowing brand showcase with user's customized logo */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex flex-col sm:flex-row items-center gap-4 px-4 py-2.5 rounded-2xl bg-[#0D0B2A]/90 border border-[#8B7CF8]/40 backdrop-blur-md mb-8 shadow-[0_0_50px_rgba(107,84,232,0.3)] relative overflow-hidden group/herologo"
          >
            {/* Ambient inner lines decoration */}
            <div className="absolute -inset-x-20 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#1DD3C0]/40 to-transparent" />
            <div className="absolute -inset-x-20 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#8B7CF8]/25 to-transparent" />
            
            <img 
              src="https://res.cloudinary.com/dhqvjxgue/image/upload/v1780108595/copy_of_captura_de_tela_2026-05-29_232740-removebg-preview_efky7aaa.png"
              alt="Noro Logo"
              referrerPolicy="no-referrer"
              className="h-13 sm:h-16 w-auto object-contain transition-all duration-700 group-hover/herologo:scale-105"
            />
            
            <div className="hidden sm:block w-[1px] h-8 bg-white/10" />
            
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1DD3C0] animate-pulse" />
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-purple-200 uppercase font-mono">
                SISTEMA OPERACIONAL EXPERT • BETA ATIVADO
              </span>
            </div>
          </motion.div>

          {/* Main Display Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter leading-[1.05] mb-6 text-white"
          >
            O núcleo <span className="text-noro-teal">inteligente</span> para{' '}
            agências de viagens modernas.
          </motion.h1>

          {/* Sub-heading / Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-base sm:text-lg md:text-xl text-purple-200/80 font-normal max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            O sistema operacional completo da sua agência de turismo — CRM, financeiro, propostas com IA e site de vendas integrados numa única plataforma.
          </motion.p>

          {/* Call to Actions & Micro-copy */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col items-center gap-3.5 mb-14"
          >
            <button
              onClick={handleOpenAICapturer}
              className="group bg-noro-teal text-noro-dark font-black text-sm md:text-base px-8 py-4.5 rounded-lg flex items-center gap-2.5 transition-all shadow-[0_0_30px_rgba(29,211,192,0.4)] hover:scale-[1.03] active:scale-[0.98] cursor-pointer"
              id="hero-main-cta"
            >
              Quero meu acesso antecipado
              <ArrowRight className="w-4 h-4 text-noro-dark transition-transform group-hover:translate-x-1" />
            </button>
            
            <div className="flex flex-col items-center sm:flex-row sm:gap-4 text-xs font-medium text-gray-400">
              <span className="flex items-center gap-1">✨ Sem cartão de crédito.</span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className="flex items-center gap-1">🔒 Sem compromisso.</span>
              <span className="hidden sm:inline text-gray-600">•</span>
              <span className="flex items-center gap-1 text-noro-teal font-semibold">🥇 Só você na frente da fila.</span>
            </div>
          </motion.div>

          {/* Meta metrics/badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto mb-16 text-center"
          >
            <div className="bg-noro-dark-elevated/40 glow-border py-4 px-3 rounded-lg flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-noro-teal" />
              <span className="text-white font-bold text-sm tracking-tight">Foco B2B Brasil</span>
              <span className="text-[10px] text-gray-400">Agências & Independentes</span>
            </div>
            <div className="bg-noro-dark-elevated/40 glow-border py-4 px-3 rounded-lg flex flex-col items-center gap-1">
              <Zap className="w-5 h-5 text-noro-teal" />
              <span className="text-white font-bold text-sm tracking-tight">Vagas Limitadas</span>
              <span className="text-[10px] text-gray-400">Filtro de qualificação</span>
            </div>
            <div className="bg-noro-dark-elevated/40 glow-border py-4 px-3 rounded-lg flex flex-col items-center gap-1">
              <Activity className="w-5 h-5 text-noro-teal" />
              <span className="text-white font-bold text-sm tracking-tight">Câmbio Automático</span>
              <span className="text-[10px] text-gray-400">Margem protegida</span>
            </div>
            <div className="bg-noro-dark-elevated/40 glow-border py-4 px-3 rounded-lg flex flex-col items-center gap-1">
              <Sparkles className="w-5 h-5 text-noro-teal" />
              <span className="text-white font-bold text-sm tracking-tight">Roteiros com IA</span>
              <span className="text-[10px] text-gray-400">Criados em minutos</span>
            </div>
          </motion.div>
        </div>

        {/* Dashboard Frame Mockup - Interactive Elements */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Accent glow elements */}
          <div className="absolute -inset-1.5 bg-gradient-to-r from-noro-purple via-noro-teal to-noro-purple-light rounded-xl blur-lg opacity-25 group-hover:opacity-35 transition-opacity duration-1000 -z-10" />
          
          <div className="bg-noro-dark-card border border-noro-purple/40 rounded-xl overflow-hidden shadow-2xl glow-purple relative flex flex-col">
            {/* Header / HUD Details */}
            <div className="bg-noro-dark-elevated px-4 py-2.5 border-b border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-noro-teal animate-pulse" />
                </span>
                <span className="hidden sm:inline text-[10px] text-noro-teal/70 pl-2">SYSTEM: CORE_ONLINE</span>
              </div>
              <div className="bg-noro-dark/60 border border-white/5 px-3 py-1 rounded text-[10px] text-purple-200">
                app.noroguru.com.br/dashboard
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-noro-teal animate-ping" />
                <span className="text-[10px]">PRESTAÇÃO DE CONTAS INTERATIVA</span>
              </div>
            </div>
            
            {/* Real Interactive Dashboard Frame in High-Contrast Slate/Teal CSS */}
            <div className="bg-[#0c0a23] p-4.5 sm:p-6 grid grid-cols-12 gap-5 text-left font-sans text-white">
              
              {/* SIDEBAR NAVIGATION GRID */}
              <div className="col-span-12 md:col-span-3 flex flex-row md:flex-col justify-between md:justify-start gap-2 border-b md:border-b-0 md:border-r border-white/10 pb-4 md:pb-0 md:pr-4">
                <div className="flex items-center gap-2 mb-0 md:mb-6 pl-1">
                  <div className="w-7 h-7 bg-[#342CA4] rounded-lg flex items-center justify-center">
                    <div className="w-3.5 h-3.5 bg-[#1DD3C0] rotate-45" />
                  </div>
                  <span className="text-sm font-bold tracking-tight">noro guru</span>
                </div>

                <nav className="flex flex-row md:flex-col gap-1.5 overflow-x-auto md:overflow-x-visible w-full py-1 md:py-0">
                  <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg bg-[#342CA4]/50 border border-[#342CA4] text-noro-teal font-mono tracking-tight text-left">
                    <Activity className="w-3.5 h-3.5" />
                    <span>CRM Operacional</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left">
                    <Coins className="w-3.5 h-3.5" />
                    <span>Gestão Câmbio</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    <span>Copiloto de IA</span>
                  </button>
                  <button className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg text-slate-400 hover:bg-white/5 hover:text-white transition-all text-left">
                    <Users className="w-3.5 h-3.5" />
                    <span>Meus Clientes</span>
                  </button>
                </nav>
              </div>

              {/* MAIN workspace area WITH DYNAMIC DATA GRAPHICS */}
              <div className="col-span-12 md:col-span-9 space-y-4">
                
                {/* METRIC NUMBERS BAR */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-[#15133d] p-3.5 rounded-xl border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Vendas / Faturamento</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-extrabold text-white">R$ 76.100</span>
                      <span className="text-[10px] text-noro-teal font-bold font-mono">+12.4%</span>
                    </div>
                  </div>
                  <div className="bg-[#15133d] p-3.5 rounded-xl border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Câmbio Turismo Oficial</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-extrabold text-white">USD 5,24 • EUR 5,68</span>
                      <span className="text-[10px] text-noro-teal font-mono">Bivalente</span>
                    </div>
                  </div>
                  <div className="bg-[#15133d] p-3.5 rounded-xl border border-white/5">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block mb-1">Margem Média Líquida</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-extrabold text-noro-teal">17.6%</span>
                      <span className="text-[10px] text-purple-300 font-mono">Blindada</span>
                    </div>
                  </div>
                </div>

                {/* TRIP MASTER GRID LISTS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  {/* CRM Table List */}
                  <div className="lg:col-span-7 bg-[#15133d] p-4 rounded-xl border border-white/10 flex flex-col gap-3">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-noro-teal" /> Viagens em Andamento (CRM)
                      </span>
                      <span className="text-[9px] font-mono text-slate-400 font-bold">Modulador interativo</span>
                    </div>

                    <div className="space-y-2">
                      {DASHBOARD_TRIPS_PREVIEW.map((trip) => (
                        <div
                          key={trip.id}
                          onClick={() => setSelectedTripId(trip.id)}
                          className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                            selectedTripId === trip.id
                              ? 'bg-noro-purple-deep/40 border-noro-teal'
                              : 'bg-noro-dark/30 border-white/5 hover:border-noro-purple-light/20'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-[#342CA4]/30 border border-noro-purple/40 flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-noro-teal" />
                            </div>
                            <div className="text-left">
                              <p className="text-xs font-extrabold text-white leading-tight">{trip.client}</p>
                              <p className="text-[10px] text-slate-400">{trip.destination}</p>
                            </div>
                          </div>
                          
                          <div className="text-right flex flex-col items-end gap-1">
                            <span className="text-xs font-bold font-mono text-white">{trip.value}</span>
                            <span className={`text-[9px] font-semibold font-mono uppercase px-1.5 py-0.5 rounded border ${trip.color}`}>
                              {trip.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dynamic Copilot Workspace detailing travel agent perks */}
                  <div className="lg:col-span-5 bg-[#14113d]/90 p-4 rounded-xl border border-noro-teal/20 relative overflow-hidden flex flex-col justify-between min-h-[220px]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-noro-teal/5 rounded-full blur-xl pointer-events-none" />
                    
                    <div>
                      {/* Active header */}
                      <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-white/5">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-noro-teal animate-pulse" />
                          <span className="text-[10px] font-bold font-mono tracking-wider text-noro-teal uppercase">
                            Noro IA Assistente
                          </span>
                        </div>
                        <span className="text-[8px] tracking-widest font-mono text-slate-400 bg-white/5 py-0.5 px-2 rounded-full uppercase">
                          Ativo para: {activeTrip.client.split(' ')[0]}
                        </span>
                      </div>

                      {/* Display Trip parameters */}
                      <div className="space-y-3.5 text-xs">
                        <div>
                          <p className="text-[9px] font-semibold font-mono uppercase text-slate-400 mb-1">
                            ✈️ Foco do Roteiro Gerado
                          </p>
                          <p className="text-xs text-white font-medium leading-relaxed bg-[#0c0a23] p-2.5 rounded border border-white/5">
                            "{activeTrip.itinerary.highlights}"
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] font-semibold font-mono uppercase text-slate-400 mb-1">
                            🛂 Requisitos de Vistos & Saúde
                          </p>
                          <div className="flex gap-2 items-start bg-noro-teal/5 border border-noro-teal/10 p-2.5 rounded text-[11px] text-gray-300 leading-snug">
                            <Check className="w-3.5 h-3.5 text-noro-teal flex-shrink-0 mt-0.5" />
                            <span>{activeTrip.itinerary.visto}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer simulation detailing high exchange pricing composition */}
                    <div className="mt-4 pt-2 border-t border-white/5 text-[10px] font-mono text-purple-200">
                      💰 {activeTrip.itinerary.exchange}
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Simulated Live status and active control bar */}
            <div className="bg-noro-dark-elevated/75 px-4 py-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-noro-teal animate-ping" />
                CONVERSÃO CAMBIAL: BIVALENTE EM REAL-TIME
              </span>
              <span>DASHBOARD OPERACIONAL FACILITADO</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
