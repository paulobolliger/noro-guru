'use client';

import { useState, useRef, FC } from 'react';

// --- TIPAGEM DOS DADOS ---
interface FaqItemProps {
  question: string;
  answer: string;
}

interface FaqCategory {
  category: string;
  items: FaqItemProps[];
}

// --- DADOS DO FAQ ---
const faqCategories: FaqCategory[] = [
    { category: "Reservas e Roteiros", items: [ { question: "Como faço uma reserva com a Nomade Guru?", answer: "Pode reservar diretamente através do nosso site, escolhendo o roteiro desejado, ou entrando em contacto com a nossa equipa de consultores via WhatsApp ou e-mail. Após a confirmação, receberá um voucher com todos os detalhes da viagem." }, { question: "Posso personalizar o meu roteiro?", answer: "Sim! Todos os roteiros podem ser adaptados ao seu estilo, tempo disponível e preferências pessoais. Entre em contacto com a nossa equipa de especialistas e criaremos um roteiro exclusivo para si." }, { question: "Qual é o prazo para reservas?", answer: "Recomendamos reservar com pelo menos 30 dias de antecedência, mas cada roteiro tem a sua própria disponibilidade. Roteiros sazonais, como auroras boreais ou festivais, devem ser reservados com mais antecedência." }, { question: "Como recebo o meu roteiro e vouchers?", answer: "Após a confirmação da reserva, receberá um e-mail com o roteiro detalhado, vouchers de alojamento e atividades, além de um guia digital com dicas de viagem." } ] },
    { category: "Pagamentos", items: [ { question: "Quais formas de pagamento são aceites?", answer: "Aceitamos cartão de crédito, boleto bancário e transferência. Para reservas internacionais, podemos aceitar PayPal ou transferência internacional." }, { question: "Posso parcelar a minha viagem?", answer: "Sim, em até 12x no cartão de crédito, dependendo do valor e do roteiro escolhido. Consulte as condições específicas no momento da reserva." } ] },
    { category: "Cancelamentos e Reembolsos", items: [ { question: "Qual é a política de cancelamento?", answer: "Cancelamentos até 30 dias antes da viagem têm reembolso total, menos uma taxa administrativa. Entre 15 e 30 dias, o reembolso é de 50%. Menos de 15 dias antes da viagem, não há reembolso. Para eventos excecionais (como pandemias ou desastres naturais), aplicamos políticas especiais." }, { question: "Posso transferir a minha viagem para outra pessoa?", answer: "Sim, mediante aviso prévio e aceitação da nossa equipa, com uma possível taxa administrativa de transferência." } ] },
    { category: "Segurança e Seguro de Viagem", items: [ { question: "As viagens da Nomade Guru incluem seguro?", answer: "Sim! Todos os roteiros incluem um seguro básico contra acidentes, mas recomendamos um seguro de saúde adicional, dependendo do destino." }, { question: "Como a Nomade Guru garante a segurança dos viajantes?", answer: "Trabalhamos apenas com fornecedores confiáveis e locais que seguem normas internacionais de segurança. Além disso, todos os roteiros são acompanhados por especialistas locais quando necessário." } ] },
];

// --- COMPONENTE DO ITEM DO ACORDEÃO ---
const FaqItem: FC<FaqItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-white/10">
      <button 
        className="w-full flex justify-between items-center text-left py-5 text-lg font-semibold text-white cursor-pointer transition hover:text-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{question}</span>
        <span className={`text-2xl text-primary transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      <div
        ref={contentRef}
        style={{ maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : '0px' }}
        className="overflow-hidden transition-all duration-500 ease-in-out"
      >
        <div className="pb-5 text-white/70 leading-relaxed">
          <p>{answer}</p>
        </div>
      </div>
    </div>
  );
};


// --- COMPONENTE PRINCIPAL DA PÁGINA ---
export default function FaqPage() {
  return (
    <main className="pt-20 bg-neutral-dark text-white">
      {/* Cabeçalho da Página */}
      <section className="bg-gradient-to-r from-primary to-primary-dark py-8 text-center text-white">
        <div className="container mx-auto px-5">
          <h1 className="text-4xl font-bold md:text-5xl">Perguntas Frequentes</h1>
          <p className="mt-4 text-lg text-white/90">
            Encontre aqui as respostas para as dúvidas mais comuns sobre os nossos serviços.
          </p>
        </div>
      </section>

      {/* Conteúdo do FAQ */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-5">
          {faqCategories.map((category) => (
            <div key={category.category} className="mb-12">
              <h2 className="text-3xl font-bold text-primary mb-8 text-center">
                {category.category}
              </h2>
              <div className="space-y-2">
                {category.items.map((item, index) => (
                  <FaqItem key={index} question={item.question} answer={item.answer} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}