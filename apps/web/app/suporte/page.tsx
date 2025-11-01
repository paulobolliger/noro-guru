import { Metadata } from 'next';
import { MessageCircle, HelpCircle, Book, Send } from 'lucide-react';
import FAQSection from '@/components/support/FAQSection';
import ContactForm from '@/components/support/ContactForm';
import KnowledgeBase from '@/components/support/KnowledgeBase';
import ChatWidget from '@/components/support/ChatWidget';

export const metadata: Metadata = {
  title: 'Central de Ajuda | Noro.guru',
  description: 'Encontre respostas rápidas, acesse nossa base de conhecimento ou fale diretamente com nossa equipe de suporte.',
  openGraph: {
    title: 'Central de Ajuda | Noro.guru',
    description: 'Estamos aqui para ajudar. Tire suas dúvidas ou entre em contato com nosso time.',
  },
};

export default function SuportePage() {
  return (
    <main className="min-h-screen bg-[#0B1220] pt-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#6C5CE7]/10 to-transparent"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-[#6C5CE7]/10 px-4 py-2 rounded-full mb-6 animate-fade-in">
              <HelpCircle className="w-5 h-5 text-[#6C5CE7]" />
              <span className="text-[#E0E3FF] text-sm font-medium">Central de Ajuda</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-[#E0E3FF] mb-6 animate-fade-in">
              Como podemos <span className="text-[#6C5CE7]">ajudar você</span>?
            </h1>
            
            <p className="text-xl text-[#B8C1E0] mb-8 animate-fade-in">
              Encontre respostas rápidas no FAQ, explore nossa base de conhecimento ou fale diretamente com nossa equipe.
            </p>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto animate-slide-in-right">
              <button className="group bg-[#2E2E3A]/50 hover:bg-[#2E2E3A] border border-[#2E2E3A] rounded-xl p-6 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#6C5CE7]/20">
                <MessageCircle className="w-8 h-8 text-[#6C5CE7] mb-3 mx-auto group-hover:animate-bounce-subtle" />
                <h3 className="text-[#E0E3FF] font-semibold mb-2">Chat ao Vivo</h3>
                <p className="text-[#B8C1E0] text-sm">Resposta em minutos</p>
              </button>

              <button className="group bg-[#2E2E3A]/50 hover:bg-[#2E2E3A] border border-[#2E2E3A] rounded-xl p-6 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#6C5CE7]/20">
                <Book className="w-8 h-8 text-[#6C5CE7] mb-3 mx-auto group-hover:animate-bounce-subtle" />
                <h3 className="text-[#E0E3FF] font-semibold mb-2">Base de Conhecimento</h3>
                <p className="text-[#B8C1E0] text-sm">Artigos e tutoriais</p>
              </button>

              <button className="group bg-[#2E2E3A]/50 hover:bg-[#2E2E3A] border border-[#2E2E3A] rounded-xl p-6 transition-all hover:scale-105 hover:shadow-xl hover:shadow-[#6C5CE7]/20">
                <Send className="w-8 h-8 text-[#6C5CE7] mb-3 mx-auto group-hover:animate-bounce-subtle" />
                <h3 className="text-[#E0E3FF] font-semibold mb-2">Abrir Ticket</h3>
                <p className="text-[#B8C1E0] text-sm">Suporte via e-mail</p>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#E0E3FF] mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-[#B8C1E0] text-lg max-w-2xl mx-auto">
              Respostas rápidas para as dúvidas mais comuns sobre a plataforma Noro.guru
            </p>
          </div>
          
          <FAQSection />
        </div>
      </section>

      {/* Knowledge Base */}
      <section className="py-20 bg-gradient-to-b from-transparent to-[#2E2E3A]/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#E0E3FF] mb-4">
              Base de Conhecimento
            </h2>
            <p className="text-[#B8C1E0] text-lg max-w-2xl mx-auto">
              Explore guias detalhados, tutoriais e documentação completa
            </p>
          </div>
          
          <KnowledgeBase />
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-[#E0E3FF] mb-4">
                Ainda precisa de ajuda?
              </h2>
              <p className="text-[#B8C1E0] text-lg">
                Envie sua dúvida ou problema e nossa equipe responderá em até 24 horas
              </p>
            </div>
            
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Chat Widget - Floating */}
      <ChatWidget />
    </main>
  );
}
