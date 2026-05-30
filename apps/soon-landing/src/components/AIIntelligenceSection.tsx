import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, Sparkles, Check, ChevronRight, Terminal } from 'lucide-react';

export default function AIIntelligenceSection() {
  const bulletPoints = [
    'Sugestão inteligente de upgrades baseada no perfil do passageiro',
    'Análise preditiva de cancelamentos e alertas automáticos de Churn',
    'Geração automatizada de descritivos ricos e artísticos de roteiro em segundos',
    'Consulta de vistos e exigências sanitárias integrada em tempo real'
  ];

  return (
    <section className="py-20 bg-noro-dark relative" id="ai-intelligence-section">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[350px] h-[350px] bg-noro-teal/5 rounded-full blur-[90px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Texts - Column */}
        <div className="lg:col-span-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-noro-purple-deep/30 border border-noro-purple-light/20 mb-6">
            <BrainCircuit className="w-4 h-4 text-noro-teal" />
            <span className="text-xs font-mono font-semibold tracking-wider text-noro-teal uppercase">
              AI CORE INTEGRATION
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tighter leading-[1.12] mb-6">
            Criada para operações de turismo assistidas por Inteligência Artificial.
          </h2>

          <p className="text-sm sm:text-base text-gray-300 mb-8 leading-relaxed">
            Não viemos substituir consultores de viagens; viemos entregar superpoderes a eles. O NORO Guru utiliza modelos de linguagem otimizados para analisar padrões de consumo históricos, automatizar tarefas operacionais enfadonhas e sugerir upgrades perfeitamente alinhados com o desejo do seu cliente.
          </p>

          <ul className="space-y-4">
            {bulletPoints.map((text, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-300">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-noro-teal/15 border border-noro-teal/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-3.5 h-3.5 text-noro-teal" />
                </span>
                <span className="leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Shell Console - Column */}
        <div className="lg:col-span-6">
          <div className="relative group">
            {/* Soft pink/cyan ambient glow around console */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-noro-purple to-noro-teal rounded-2xl opacity-15 blur-xl group-hover:opacity-20 transition-opacity duration-700" />
            
            <div className="bg-noro-dark-card border border-noro-purple/40 rounded-2xl overflow-hidden shadow-2xl relative glow-purple">
              {/* Header */}
              <div className="bg-noro-dark-elevated px-4 py-3 border-b border-noro-purple/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                  <span className="w-2.5 h-2.5 rounded-full bg-noro-teal animate-pulse" />
                  <span className="text-[10px] font-mono text-gray-400 pl-2">neural_agent_v1.0.sh</span>
                </div>
                <span className="text-[9px] font-mono bg-noro-teal/10 text-noro-teal px-1.5 py-0.5 rounded border border-noro-teal/20">
                  ONLINE
                </span>
              </div>

              {/* Console logs */}
              <div className="p-6 font-mono text-xs space-y-4 text-left">
                {/* Simulated command 1 */}
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                    <Terminal className="w-3.5 h-3.5 text-noro-purple-light" />
                    <span>noro-agent --search-history --passenger-id=99281</span>
                  </div>
                  <div className="bg-noro-dark/60 p-3 rounded border border-noro-purple/10 text-gray-400 leading-relaxed italic">
                    "Analisando perfil de viagem para passageira Helena Abreu... Idade: 34. Histórico: 3 viagens corporativas e 1 lua-de-mel de luxo na Itália. Preferência explícita por vinhos e gastronomia local."
                  </div>
                </div>

                {/* Simulated Suggestion 1 */}
                <div className="space-y-1 border-l-2 border-noro-teal pl-3 py-0.5">
                  <div className="text-noro-teal font-bold flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3 h-3" /> RECOMENDAÇÃO DE UPGRADE DISPARADA:
                  </div>
                  <p className="text-gray-300 leading-normal">
                    "Sugerindo passeio privativo de degustação na vinícola Herdade do Esporão em Évora. Upgrade de quarto comum para Suite Superior com vista ao vinhedo."
                  </p>
                </div>

                {/* Simulated command 2 */}
                <div className="pt-2 space-y-1">
                  <div className="flex items-center gap-1.5 text-gray-500 text-[11px]">
                    <Terminal className="w-3.5 h-3.5 text-noro-purple-light" />
                    <span>noro-agent --predict-churn --pnr-code=H92X8F</span>
                  </div>
                  <div className="bg-noro-dark/60 p-3 rounded border border-noro-purple/10 text-gray-400 leading-relaxed italic ml-2">
                    "Controle de Risco: Voo TAP desviado por intempérie política. Probabilidade de descontentamento: 84%. Churn estático previsto em andamento."
                  </div>
                </div>

                {/* Simulated Suggestion 2 */}
                <div className="space-y-1 border-l-2 border-noro-purple-light pl-3 py-0.5 ml-2">
                  <div className="text-noro-purple-light font-bold flex items-center gap-1 text-[11px]">
                    <Terminal className="w-3 h-3" /> DECISÃO AUTOMATIZADA:
                  </div>
                  <p className="text-gray-300 leading-normal">
                    "Enviando justificativa personalizada + cupom de transfer privativo cortesia diretamente ao WhatsApp da cliente. Alerta disparado na tela do agente."
                  </p>
                </div>
              </div>

              {/* Status bar */}
              <div className="bg-noro-dark-elevated/70 px-4 py-2 border-t border-noro-purple/15 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span>SPEED: 18.2ms/query</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-noro-teal animate-ping" />
                  AGENTE INTELIGENTE AUTÔNOMO ATIVO
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
