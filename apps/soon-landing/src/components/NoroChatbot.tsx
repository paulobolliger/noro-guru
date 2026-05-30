import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Send, X, Sparkles, RotateCcw, Compass, HelpCircle, Briefcase, ChevronDown } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface NoroChatbotProps {
  onLeadCaptured?: (lead: any) => void;
}

const STARTER_PROMPTS = [
  {
    icon: <Compass className="w-4 h-4 text-emerald-400" />,
    label: "✨ Roteiro: Fernando de Noronha",
    text: "Crie um roteiro de 4 dias para Fernando de Noronha focado em ecoturismo e casais."
  },
  {
    icon: <Sparkles className="w-4 h-4 text-purple-400" />,
    label: "✈️ Itinerário: 5 Dias em Paris",
    text: "Quero um roteiro de 5 dias em Paris bem otimizado e elegante para uma proposta comercial."
  },
  {
    icon: <Briefcase className="w-4 h-4 text-blue-400" />,
    label: "💼 Como o Noro Guru poupa tempo?",
    text: "De que formas o Noro Guru automatiza o dia a dia e a criação de roteiros em relação ao processo manual?"
  },
  {
    icon: <HelpCircle className="w-4 h-4 text-pink-400" />,
    label: "💰 Dicas: Captação de Leads",
    text: "Como uma agência de viagens pode usar as redes sociais e o Noro Guru para atrair novos leads de turismo?"
  }
];

export default function NoroChatbot({ onLeadCaptured }: NoroChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  // Guided conversational lead capture wizard states
  const [leadFlowStep, setLeadFlowStep] = useState<'NONE' | 'EMAIL' | 'WHATSAPP' | 'TEAM_SIZE' | 'COMPLETED'>('NONE');
  const [tempLeadEmail, setTempLeadEmail] = useState('');
  const [tempLeadWhatsapp, setTempLeadWhatsapp] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen to the custom event dispatched from the main hero CTA
  useEffect(() => {
    const handleTriggerLeadFlow = (e: Event) => {
      setIsOpen(true);
      setErrorStatus(null);
      setLeadFlowStep('EMAIL');
      setMessages([
        {
          role: 'assistant',
          content: '👋 Olá! Sou o **Noro Copilot**, sua inteligência especialista em turismo integrada.\n\nFico muito feliz em guiar seu acesso antecipado ao **Noro Guru**! Para garantir sua vaga na nossa lista pioneira de agências selecionadas, qual o seu melhor **E-mail** corporativo ou de contato?'
        }
      ]);
    };

    window.addEventListener('open-noro-chatbot-lead-flow', handleTriggerLeadFlow);
    return () => {
      window.removeEventListener('open-noro-chatbot-lead-flow', handleTriggerLeadFlow);
    };
  }, []);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  // Handle message send
  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', content: textToSend };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);
    setErrorStatus(null);

    // If we're inside the guided Conversational Early Access Capture Flow
    if (leadFlowStep !== 'NONE' && leadFlowStep !== 'COMPLETED') {
      try {
        // High-fidelity natural typing/thinking delay for elite branding feel
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (leadFlowStep === 'EMAIL') {
          const email = textToSend.trim();
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(email)) {
            setMessages(prev => [
              ...prev,
              {
                role: 'assistant',
                content: '⚠️ Hum, esse endereço de e-mail não parece estar no formato correto. Preciso de um e-mail válido para assegurar sua prioridade (exemplo: `nome@agencia.com.br`).\n\nPoderia digitar novamente?'
              }
            ]);
            setIsLoading(false);
            return;
          }

          setTempLeadEmail(email);
          setLeadFlowStep('WHATSAPP');
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: '✨ Perfeito! Salvei seu e-mail corporativo.\n\nAgora, qual o seu número de **WhatsApp** com DDD para avisarmos sobre a liberação do seu painel?'
            }
          ]);
          setIsLoading(false);
          return;
        }

        if (leadFlowStep === 'WHATSAPP') {
          const phone = textToSend.trim();
          if (phone.replace(/\D/g, '').length < 8) {
            setMessages(prev => [
              ...prev,
              {
                role: 'assistant',
                content: '⚠️ Por favor, informe um número de telefone com DDD válido para que possamos enviar seu convite por WhatsApp (exemplo: `(11) 99999-8888`).'
              }
            ]);
            setIsLoading(false);
            return;
          }

          setTempLeadWhatsapp(phone);
          setLeadFlowStep('TEAM_SIZE');
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: 'Incrível! Quase lá.\n\nPara personalizarmos o seu acesso no sistema, qual o **tamanho atual da sua equipe de agentes/consultores**?\n\n- **1 pessoa** (Solo / MEI)\n- **2 a 5 pessoas**\n- **6 a 15 pessoas**\n- **Mais de 15 pessoas**\n\n*(Você pode selecionar clicando em uma destas opções digitando abaixo)*'
            }
          ]);
          setIsLoading(false);
          return;
        }

        if (leadFlowStep === 'TEAM_SIZE') {
          const text = textToSend.toLowerCase();
          let finalSize: '1' | '2-5' | '6-15' | '15+' = '2-5';

          if (text.includes('1') || text.includes('solo') || text.includes('mei') || text.includes('uma') || text.includes('soz')) {
            finalSize = '1';
          } else if (text.includes('15') || text.includes('mais') || text.includes('+')) {
            finalSize = '15+';
          } else if (text.includes('6-15') || text.includes('6') || text.includes('15') || text.includes('quinze')) {
            finalSize = '6-15';
          } else if (text.includes('2') || text.includes('5') || text.includes('cinco')) {
            finalSize = '2-5';
          }

          const parsedLead = {
            id: 'lead_ai_' + Math.random().toString(36).substr(2, 9),
            email: tempLeadEmail,
            whatsapp: tempLeadWhatsapp,
            teamSize: finalSize,
            timestamp: new Date().toISOString(),
            userAgent: 'Noro Copilot conversational collector'
          };

          if (onLeadCaptured) {
            onLeadCaptured(parsedLead);
          }

          localStorage.setItem('noroguru_my_submission', JSON.stringify(parsedLead));
          setLeadFlowStep('COMPLETED');
          setMessages(prev => [
            ...prev,
            {
              role: 'assistant',
              content: '🎉 **Parabéns! Sua vaga prioritária na fila exclusiva foi registrada com sucesso!**\n\nSua agência de turismo agora faz parte da seleta lista pioneira do **Noro Guru**. Nossa assessoria entrará em contato comercial via WhatsApp muito em breve para sua validação.\n\nEnquanto seu convite é emitido, **pode falar comigo à vontade!** Se você tem algum roteiro de viagem, **cole-o aqui** e eu irei transformá-lo em minutos em uma proposta majestosa e hipnotizante de luxo! ✈️🏖️'
            }
          ]);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.error(err);
        setErrorStatus("Ocorreu um erro no fluxo interativo.");
        setIsLoading(false);
        return;
      }
    }

    // Otherwise, normal AI query fallback to our server route!
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: textToSend,
          // Send previous chat messages to preserve state
          history: updatedMessages.slice(0, -1)
        })
      });

      if (!response.ok) {
        throw new Error('Falha na resposta do servidor.');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (err: any) {
      console.error(err);
      setErrorStatus("Erro ao conectar com a IA Core. Verifique se a API está ativa.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([]);
    setErrorStatus(null);
    setLeadFlowStep('NONE');
  };

  // Simple Markdown Helper for rendering Bold, bullet lists, and paragraphs beautifully
  const renderTextMarkdown = (text: string) => {
    const lines = text.split('\n');
    return lines.map((line, lineIdx) => {
      let content = line;
      
      // Determine list item
      const isListItem = content.trim().startsWith('- ') || content.trim().startsWith('* ');
      if (isListItem) {
        content = content.trim().substring(2);
      }

      // Check header
      const isHeader = content.startsWith('### ') || content.startsWith('## ');
      const headerText = isHeader ? content.replace(/^(#{2,3})\s+/, '') : '';

      // Support bold (**text**)
      const parts = (isHeader ? headerText : content).split(/\*\*([^*]+)\*\*/g);
      const renderedText = parts.map((part, index) => {
        // odd indices match our group capture
        if (index % 2 !== 0) {
          return <strong key={index} className="text-white font-extrabold">{part}</strong>;
        }
        return part;
      });

      if (isHeader) {
        return (
          <h4 key={lineIdx} className="text-sm font-bold text-[#1DD3C0] mt-3 mb-1 border-b border-white/[0.05] pb-0.5">
            {renderedText}
          </h4>
        );
      }

      if (isListItem) {
        return (
          <li key={lineIdx} className="ml-4 list-disc text-gray-300 text-[11.5px] leading-relaxed mb-0.5">
            {renderedText}
          </li>
        );
      }

      // Return normal line or spacious line break
      return content === '' ? (
        <div key={lineIdx} className="h-2" />
      ) : (
        <p key={lineIdx} className="text-gray-200 text-[11.5px] leading-relaxed mb-1">
          {renderedText}
        </p>
      );
    });
  };

  return (
    <>
      {/* Floating CTA Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          id="noro-chatbot-toggle-btn"
          className="relative w-14 h-14 bg-gradient-to-tr from-[#6B54E8] to-[#8B7CF8] hover:from-[#593fd1] hover:to-[#7869ec] text-white rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(107,84,232,0.4)] hover:shadow-[0_0_25px_rgba(107,84,232,0.6)] cursor-pointer border border-[#8B7CF8]/30 transition-all duration-300 group/btn"
          title="Fale com a IA Core"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform group-hover/btn:rotate-90 duration-300" />
          ) : (
            <>
              {/* Glowing ring animation */}
              <span className="absolute inset-0 rounded-full bg-[#6B54E8] animate-ping opacity-25 scale-110 pointer-events-none" />
              <div className="relative">
                <MessageSquare className="w-6 h-6 m-auto" />
                <span className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#1DD3C0] border-2 border-[#0D0B2A] rounded-full animate-pulse" />
              </div>
            </>
          )}
        </button>
      </div>

      {/* Main Chat Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="noro-chatbot-panel"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] h-[550px] max-h-[80vh] bg-[#0E0C2B] border border-white/[0.08] rounded-2.5xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 flex flex-col overflow-hidden"
          >
            {/* Ambient Background Glow inside chat panel */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#6B54E8]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#1DD3C0]/5 rounded-full blur-2xl pointer-events-none" />

            {/* Chat Header */}
            <div className="p-4 bg-gradient-to-r from-[#0D0B2A] to-[#120F3A] border-b border-white/[0.06] flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                {/* SVG Labyrinth icon for branding */}
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                  <svg className="w-5 h-5 text-[#8B7CF8]" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M 50 10 A 40 40 0 1 1 20 22" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 13 32 A 40 40 0 0 1 45 10" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="10" fill="#1DD3C0" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wider flex items-center gap-1.5 uppercase font-sans">
                    Noro Copilot
                    <span className="inline-flex items-center text-[8px] bg-indigo-500/20 text-[#8B7CF8] px-1.5 py-0.5 rounded font-mono font-normal">
                      CORE
                    </span>
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#1DD3C0] animate-pulse" />
                    <span className="text-[10px] text-gray-400 font-medium">Turismo Expert</span>
                  </div>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <button
                    onClick={handleReset}
                    className="p-1.5 hover:bg-white/[0.05] rounded-lg text-gray-400 hover:text-white transition-colors"
                    title="Limpar conversa"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-white/[0.05] rounded-lg text-gray-400 hover:text-white transition-colors"
                  title="Minimizar"
                >
                  <ChevronDown className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>

            {/* Chat Logs / Feed */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4 relative z-10 custom-scrollbar">
              {messages.length === 0 ? (
                /* Welcome Introduction state */
                <div className="space-y-4 py-2">
                  <div className="bg-gradient-to-b from-white/[0.02] to-transparent p-4 rounded-xl border border-white/[0.04]">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mb-3 text-[#8B7CF8]">
                      <Sparkles className="w-4.5 h-4.5" />
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1.5 font-sans">
                      Olá! Como posso acelerar suas propostas hoje?
                    </h4>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      Sou a inteligência oficial do Noro Guru, especialista em reformatar propostas majestosas, criar roteiros de luxo estruturados e tirar dúvidas sobre como nossa plataforma otimiza o faturamento da sua agência.
                    </p>
                  </div>

                  {/* Suggestion Starter prompts */}
                  <div className="space-y-2">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500 font-bold">
                      Pergunte ou otimize um roteiro:
                    </p>
                    <div className="grid grid-cols-1 gap-2">
                      {STARTER_PROMPTS.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSend(prompt.text)}
                          className="flex items-center gap-2.5 p-3 text-left bg-[#131038]/50 hover:bg-[#1C184D] border border-white/[0.04] rounded-xl text-gray-300 hover:text-white text-xs transition-all duration-200 cursor-pointer hover:border-[#6B54E8]/30 group/prompt"
                        >
                          <div className="p-1.5 bg-white/[0.04] rounded-lg group-hover/prompt:bg-[#6B54E8]/20 transition-colors">
                            {prompt.icon}
                          </div>
                          <span className="font-medium">{prompt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                /* Active Chat messages list */
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-2 max-w-[85%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] uppercase font-bold font-mono tracking-tighter ${
                          message.role === 'user'
                            ? 'bg-gradient-to-tr from-[#6B54E8] to-[#8B7CF8] text-white'
                            : 'bg-white/[0.06] border border-white/[0.1] text-[#1DD3C0]'
                        }`}>
                          {message.role === 'user' ? 'ME' : 'AI'}
                        </div>

                        {/* Content Bubble */}
                        <div className={`px-3.5 py-2.5 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-[#6B54E8] text-white rounded-tr-sm'
                            : 'bg-[#181545]/70 border border-white/[0.04] text-gray-200 rounded-tl-sm'
                        }`}>
                          <div className="space-y-1">
                            {renderTextMarkdown(message.content)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Loading Response state */}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex gap-2 max-w-[85%]">
                        <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] uppercase bg-white/[0.06] border border-white/[0.1] text-[#1DD3C0] font-bold">
                          AI
                        </div>
                        <div className="px-4 py-3 rounded-2xl bg-[#181545]/70 border border-white/[0.04] text-gray-300 rounded-tl-sm">
                          <div className="flex items-center gap-1.5 py-1">
                            <span className="w-2 h-2 rounded-full bg-[#1DD3C0] animate-bounce" />
                            <span className="w-2 h-2 rounded-full bg-[#8B7CF8] animate-bounce [animation-delay:0.2s]" />
                            <span className="w-2 h-2 rounded-full bg-[#6B54E8] animate-bounce [animation-delay:0.4s]" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error display */}
                  {errorStatus && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-center text-xs">
                      {errorStatus}
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Form Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3.5 bg-[#0D0B2A] border-t border-white/[0.06] flex items-center gap-2 relative z-10"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Envie uma mensagem ou cole o roteiro..."
                disabled={isLoading}
                className="flex-grow bg-[#131038] border border-white/[0.05] focus:border-[#6B54E8] text-white placeholder-gray-500 text-xs rounded-xl px-3.5 py-2.5 outline-none transition-all disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 bg-gradient-to-tr from-[#6B54E8] to-[#8B7CF8] text-white rounded-xl hover:from-[#5c44cf] hover:to-[#7b6ced] disabled:opacity-30 disabled:from-gray-700 disabled:to-gray-700 transition-all flex items-center justify-center flex-shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
