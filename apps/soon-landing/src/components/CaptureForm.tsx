import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Users, ShieldCheck, CheckCircle2, Ticket, Sparkles, AlertCircle } from 'lucide-react';
import { WaitlistLead, FeedbackMessage } from '../types';

interface CaptureFormProps {
  onLeadCaptured: (newLead: WaitlistLead) => void;
}

export default function CaptureForm({ onLeadCaptured }: CaptureFormProps) {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [teamSize, setTeamSize] = useState<'1' | '2-5' | '6-15' | '15+'>('1');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [ticketNumber, setTicketNumber] = useState(42);
  const [feedback, setFeedback] = useState<FeedbackMessage | null>(null);

  // Check if they already submitted on this device previously
  useEffect(() => {
    const existingSubmission = localStorage.getItem('noroguru_my_submission');
    if (existingSubmission) {
      try {
        const parsed = JSON.parse(existingSubmission);
        setIsSuccess(true);
        if (parsed.ticketNumber) {
          setTicketNumber(parsed.ticketNumber);
        }
      } catch (e) {
        // Safe fallback
      }
    }
  }, []);

  const validateEmail = (e: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(e);
  };

  const maskWhatsApp = (val: string) => {
    // Only allow numbers
    const cleanNumbers = val.replace(/\D/g, '');
    
    // Format as (XX) XXXXX-XXXX
    if (cleanNumbers.length <= 2) {
      return cleanNumbers;
    } else if (cleanNumbers.length <= 7) {
      return `(${cleanNumbers.slice(0, 2)}) ${cleanNumbers.slice(2)}`;
    } else {
      return `(${cleanNumbers.slice(0, 2)}) ${cleanNumbers.slice(2, 7)}-${cleanNumbers.slice(7, 11)}`;
    }
  };

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const masked = maskWhatsApp(e.target.value);
    setWhatsapp(masked);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    // Initial validation
    if (!email || !validateEmail(email)) {
      setFeedback({
        type: 'error',
        text: 'Por favor, insira um e-mail corporativo válido (ex: seu_nome@agencia.com).'
      });
      return;
    }

    const cleanWhatsapp = whatsapp.replace(/\D/g, '');
    if (cleanWhatsapp.length < 10) {
      setFeedback({
        type: 'error',
        text: 'Por favor, insira um número de WhatsApp válido com DDD (mínimo 10 dígitos).'
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulate network request to provide premium feedback UX
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newLead: WaitlistLead = {
        id: 'lead_' + Math.random().toString(36).substr(2, 9),
        email: email.trim().toLowerCase(),
        whatsapp: whatsapp,
        teamSize: teamSize,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
      };

      // Read existing leads array
      const existingLeadsJSON = localStorage.getItem('noroguru_leads');
      let leadsArray: WaitlistLead[] = [];
      if (existingLeadsJSON) {
        try {
          leadsArray = JSON.parse(existingLeadsJSON);
        } catch (e) {
          leadsArray = [];
        }
      }

      // Check if email already registered in mock database array to prevent duplicates
      const isDuplicate = leadsArray.some(l => l.email === newLead.email);
      const computedTicket = leadsArray.length + 38; // base ticket shift for exclusivity vibe

      if (isDuplicate) {
        setFeedback({
          type: 'error',
          text: 'Este e-mail já está cadastrado em nosso sistema de Beta Fechado!'
        });
        setIsLoading(false);
        return;
      }

      // Add to array
      leadsArray.push(newLead);
      localStorage.setItem('noroguru_leads', JSON.stringify(leadsArray));
      
      // Save item specific to author to remember submission state
      localStorage.setItem('noroguru_my_submission', JSON.stringify({
        email: newLead.email,
        ticketNumber: computedTicket
      }));

      setTicketNumber(computedTicket);
      onLeadCaptured(newLead);
      setIsSuccess(true);
    } catch (err) {
      setFeedback({
        type: 'error',
        text: 'Erro ao processar sua inscrição. Por favor, tente novamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-noro-dark relative" id="waitlist-section">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-noro-teal/30 to-transparent" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-noro-purple/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl mx-auto px-6 relative z-10">
        
        {!isSuccess ? (
          <div className="bg-noro-dark-card border border-white/10 p-8 rounded-3xl relative shadow-2xl overflow-hidden glow-purple">
            <div className="absolute -top-3.5 -right-3.5 bg-noro-teal text-noro-dark px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest shadow-lg z-20">
              Vagas Limitadas
            </div>
            
            <div className="text-center mb-8">
              <span className="text-[10px] font-mono tracking-widest font-bold text-noro-teal bg-noro-teal/10 py-1.5 px-3 rounded-full uppercase border border-noro-teal/20 inline-block mb-3">
                ACESSO ANTECIPADO EXCLUSIVO
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tighter mb-2">
                Entre no Beta Fechado
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Seja o primeiro a testar o futuro da gestão de turismo no Brasil.
              </p>
            </div>

            {feedback && (
              <div className={`p-4 mb-6 rounded-lg text-xs leading-relaxed flex items-start gap-2.5 ${
                feedback.type === 'success' 
                  ? 'bg-noro-teal/10 border border-noro-teal/20 text-noro-teal' 
                  : 'bg-red-500/10 border border-red-500/20 text-red-400'
              }`}>
                {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />}
                <span>{feedback.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-extrabold ml-1">
                  E-mail Profissional
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nome@agencia.com.br"
                    className="w-full bg-noro-dark border border-white/10 focus:border-noro-purple rounded-xl pl-11 pr-4 py-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-1 focus:ring-noro-teal"
                  />
                </div>
              </div>

              {/* WhatsApp Input */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-extrabold ml-1">
                  WhatsApp com DDD
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-500" />
                  <input
                    type="text"
                    required
                    maxLength={15}
                    value={whatsapp}
                    onChange={handleWhatsappChange}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-noro-dark border border-white/10 focus:border-noro-purple rounded-xl pl-11 pr-4 py-4 text-sm text-white placeholder-gray-500 outline-none transition-all focus:ring-1 focus:ring-noro-teal"
                  />
                </div>
              </div>

              {/* Team Size Selector (Radio-pills as request) */}
              <div className="space-y-2.5 text-left">
                <label className="block text-[10px] uppercase tracking-widest text-slate-400 font-extrabold ml-1">
                  Quantos agentes na sua equipe?
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { val: '1', label: 'Só eu' },
                    { val: '2-5', label: '2 a 5' },
                    { val: '6-15', label: '6 a 15' },
                    { val: '15+', label: 'Mais de 15' }
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      type="button"
                      onClick={() => setTeamSize(opt.val as any)}
                      className={`py-3 px-2 border rounded-xl text-xs font-bold font-mono tracking-tight text-center transition-all ${
                        teamSize === opt.val
                          ? 'border-noro-teal bg-noro-teal/10 text-noro-teal'
                          : 'border-white/10 bg-noro-dark/40 hover:border-noro-purple text-gray-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit CTA Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-noro-purple hover:bg-noro-purple-hover disabled:bg-noro-purple/50 text-white font-extrabold py-4 px-6 rounded-xl text-sm md:text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-noro-purple/20 active:scale-[0.98] cursor-pointer"
                  id="waitlist-submit"
                >
                  {isLoading ? 'Registrando dados...' : 'Quero meu acesso antecipado →'}
                </button>
                
                {/* Micro-copy directly below the button as strictly requested */}
                <p className="text-[10px] text-slate-500 text-center font-medium mt-3.5">
                  Sem cartão de crédito. Sem compromisso. Só você na frente da fila.
                </p>
              </div>
            </form>
          </div>
        ) : (
          /* GLORIOUS SUCCESS STATE TICKET CARD */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-noro-dark-card border border-noro-teal/30 p-8 rounded-2xl relative shadow-2xl text-center glow-teal"
            id="success-ticket"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-noro-teal" />
            
            <div className="w-16 h-16 rounded-full bg-noro-teal/10 flex items-center justify-center mx-auto mb-6 border border-noro-teal/30">
              <CheckCircle2 className="w-10 h-10 text-noro-teal" />
            </div>

            <span className="text-[10px] font-mono tracking-widest font-bold text-noro-teal bg-noro-teal/10 py-1 px-3 rounded uppercase border border-noro-teal/20 inline-block mb-3">
              HOMOLOGADO COM SUCESSO!
            </span>
            
            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
              Inscrição Registrada!
            </h3>
            
            <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
              Seu perfil de agência foi recebido em nosso servidor. Prepare-se para experimentar a revolução no turismo.
            </p>

            {/* Virtual HUD Ticket */}
            <div className="bg-noro-dark/75 border border-noro-purple/20 rounded-xl p-5 mb-6 text-left relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-noro-teal/5 rounded-full blur-xl pointer-events-none" />
              
              <div className="flex items-center justify-between border-b border-noro-purple/10 pb-3.5 mb-3.5">
                <Ticket className="w-6 h-6 text-noro-teal" />
                <div className="text-right">
                  <p className="text-[9px] font-mono text-gray-500 uppercase">Lista de Espera Q4</p>
                  <p className="text-xs font-bold text-noro-teal font-mono">#0{ticketNumber}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status operacional:</span>
                  <span className="font-mono text-noro-teal font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-noro-teal animate-pulse" /> FILA PRIORITÁRIA
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">E-mail registrado:</span>
                  <span className="font-mono text-gray-300">{email || 'Inscrito'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tamanho da Equipe:</span>
                  <span className="font-mono text-gray-300 uppercase">
                    {teamSize === '1' ? 'Só Eu' : teamSize === '2-5' ? '2 a 5 Agentes' : teamSize === '6-15' ? '6 a 15 Agentes' : 'Mais de 15'}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-noro-purple-light font-bold flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-noro-teal" />
              Entramos em contato no WhatsApp em breve com os próximos passos.
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
