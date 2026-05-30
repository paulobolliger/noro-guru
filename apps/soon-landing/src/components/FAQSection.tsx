import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItemProps {
  question: string;
  answer: string;
  key?: any;
}

function FAQItem({ question, answer }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-noro-purple/15 last:border-b-0 py-4.5">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left py-2 font-bold text-base text-white hover:text-noro-teal transition-colors tracking-tight focus:outline-none"
      >
        <span>{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-noro-teal flex-shrink-0" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
        )}
      </button>
      
      {isOpen && (
        <div className="pt-2 pb-4 text-sm text-gray-400 leading-relaxed animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function FAQSection() {
  const faqs = [
    {
      question: 'O que é o Noro Guru?',
      answer: 'É o primeiro Intelligent Operational Core (IOC) moldado especificamente para agências de viagens brasileiras. Integramos CRM focado em turismo, precificação multi-moedas automática, geração de propostas com IA e ferramentas de faturamento em um único lugar.'
    },
    {
      question: 'Quem pode participar do Beta Fechado?',
      answer: 'Nosso beta fechado é focado em agências de pequeno a grande porte (1 a 15+ agentes) e também em agentes independentes (MEI ou autônomos) brasileiros que faturem mensalmente e queiram evoluir seus processos de venda e margens.'
    },
    {
      question: 'Haverá custo para os primeiros participantes?',
      answer: 'Os pioneiros da lista de espera que entrarem no beta fechado terão condições eternas extremamente exclusivas (descontos vitalícios de até 65% na assinatura) e suporte premium sem taxa de setup.'
    },
    {
      question: 'Como funciona o site de vendas grátis que vocês entregam?',
      answer: 'Ao se cadastrar na plataforma, sua agência ganha um subdomínio profissional público personalizável onde você pode listar pacotes, roteiros criados pela IA e captar leads que caem direto no seu painel operacional.'
    },
    {
      question: 'A IA cria roteiros reais baseados em voos?',
      answer: 'A Inteligência Artificial atua gerando os descritivos dos roteiros (passeios, restaurantes aconselhados e informações locais) com base no perfil de passageiro. A pesquisa de tarifas aéreas e hotéis corre de forma integrada no seu banco de dados e sistemas de consolidação.'
    },
    {
      question: 'Como funciona a integração com o Asaas?',
      answer: 'Oferecemos links de pagamento e cobrança prontos para PIX, boleto bancário e crédito parcelado em até 21x. Você configura seu cadastro em minutos e recebe comissões e pagamentos de passageiros direto na conta da sua agência.'
    }
  ];

  return (
    <section className="py-20 bg-noro-dark-elevated/20 relative" id="faq-section">
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-noro-purple/30 to-transparent" />
      
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-noro-purple-light/10 border border-noro-purple-light/20 text-noro-purple-light text-xs font-semibold uppercase tracking-wider font-mono mb-4">
            <HelpCircle className="w-3.5 h-3.5" /> Dúvidas Frequentes
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tighter leading-tight">
            Perguntas sobre o lançamento do Noro Guru
          </h2>
        </div>

        <div className="bg-noro-dark-card/40 border border-noro-purple/20 p-6 md:p-8 rounded-xl shadow-lg">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
}
