import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProblemSection from './components/ProblemSection';
import BenefitSection from './components/BenefitSection';
import AIIntelligenceSection from './components/AIIntelligenceSection';
import FAQSection from './components/FAQSection';
import CaptureForm from './components/CaptureForm';
import Footer from './components/Footer';
import AdminPanel from './components/AdminPanel';
import NoroChatbot from './components/NoroChatbot';
import { WaitlistLead } from './types';

const INITIAL_MOCK_LEADS: WaitlistLead[] = [
  {
    id: 'lead_demo_1',
    email: 'rodrigo.atendimento@viagemdossonhos.com.br',
    whatsapp: '(11) 98772-1200',
    teamSize: '2-5',
    timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
    userAgent: 'Vercel Chrome Mock'
  },
  {
    id: 'lead_demo_2',
    email: 'fernanda.costa@rotadosolimpes.tur.br',
    whatsapp: '(21) 96554-1188',
    teamSize: '1',
    timestamp: new Date(Date.now() - 14 * 3600000).toISOString(),
    userAgent: 'Stripe Safari Mock'
  },
  {
    id: 'lead_demo_3',
    email: 'diretoria@nordestedestinos.com',
    whatsapp: '(81) 98221-3454',
    teamSize: '15+',
    timestamp: new Date(Date.now() - 25 * 3600000).toISOString(),
    userAgent: 'Linear Firefox Mock'
  },
  {
    id: 'lead_demo_4',
    email: 'financeiro@horizonteoperadora.com.br',
    whatsapp: '(51) 99311-8822',
    teamSize: '6-15',
    timestamp: new Date(Date.now() - 48 * 3600000).toISOString(),
    userAgent: 'Notion Edge Mock'
  }
];

export default function App() {
  const [leads, setLeads] = useState<WaitlistLead[]>([]);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Sync state on mount from localstorage
  useEffect(() => {
    const savedLeads = localStorage.getItem('noroguru_leads');
    if (savedLeads) {
      try {
        const parsed = JSON.parse(savedLeads);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLeads(parsed);
          return;
        }
      } catch (e) {
        // Safe fallback
      }
    }
    
    // Default mock populator for elegant demonstration
    setLeads(INITIAL_MOCK_LEADS);
    localStorage.setItem('noroguru_leads', JSON.stringify(INITIAL_MOCK_LEADS));
  }, []);

  const handleLeadCaptured = (newLead: WaitlistLead) => {
    const updated = [...leads, newLead];
    setLeads(updated);
    // Persist with priority update
    localStorage.setItem('noroguru_leads', JSON.stringify(updated));
  };

  const handleResetDatabase = () => {
    if (window.confirm('Deseja realmente limpar todos os leads coletados no navegador?')) {
      setLeads([]);
      localStorage.setItem('noroguru_leads', JSON.stringify([]));
      // Remove registration ticket cookie too
      localStorage.removeItem('noroguru_my_submission');
      window.location.reload();
    }
  };

  const handleAddSampleLead = () => {
    const preNames = [
      { em: 'atendimento@azulviagens.com.br', size: '15+' },
      { em: 'vendas@maringaturismo.tur.br', size: '6-15' },
      { em: 'marcelo.independente@agente.com', size: '1' },
      { em: 'contato@mundopassaporte.com', size: '2-5' }
    ];
    const picked = preNames[Math.floor(Math.random() * preNames.length)];
    const randomDDD = [11, 21, 31, 81, 51][Math.floor(Math.random() * 5)];
    const randomPhone = `9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const generatedLead: WaitlistLead = {
      id: 'lead_sample_' + Math.random().toString(36).substr(2, 9),
      email: `${Math.random().toString(36).substr(2, 5)}.${picked.em}`,
      whatsapp: `(${randomDDD}) ${randomPhone}`,
      teamSize: picked.size as any,
      timestamp: new Date().toISOString(),
      userAgent: 'System Sample Generator'
    };

    const updated = [generatedLead, ...leads];
    setLeads(updated);
    localStorage.setItem('noroguru_leads', JSON.stringify(updated));
  };

  return (
    <div className="bg-noro-dark text-white min-h-screen relative flex flex-col justify-between font-sans">
      {/* Background decorations */}
      <div className="absolute top-[10%] left-[10%] w-[500px] h-[550px] bg-noro-purple-deep/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[60%] right-[10%] w-[450px] h-[450px] bg-noro-teal/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Main Navigation Header */}
      <Header onAdminClick={() => setIsAdminOpen(true)} leadCount={leads.length} />

      {/* Primary Page Layout Sections */}
      <main className="flex-grow">
        {/* Dynamic Hero banner with preview dashboard console */}
        <Hero />

        {/* Diagnosis / Pain points list */}
        <ProblemSection />

        {/* Core modules & Interactive Bento grid of benefits */}
        <BenefitSection />

        {/* Deep IA generation capabilities showcasing active terminal responses */}
        <AIIntelligenceSection />

        {/* Waitlist Capture form, strictly respecting user parameters */}
        <CaptureForm onLeadCaptured={handleLeadCaptured} />

        {/* Frequently Asked Questions */}
        <FAQSection />
      </main>

      {/* Footnotes & Credits */}
      <Footer />

      {/* Floating interactive AI travel companion */}
      <NoroChatbot onLeadCaptured={handleLeadCaptured} />

      {/* Slide drawer Secret CRM controller for user review */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel
            onClose={() => setIsAdminOpen(false)}
            leads={leads}
            onReset={handleResetDatabase}
            onAddSampleLead={handleAddSampleLead}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

