'use client';

import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const faqs = [
  {
    category: 'Primeiros Passos',
    questions: [
      {
        question: 'Como faço para criar minha conta?',
        answer: 'Para criar sua conta, clique em "Começar agora" na página inicial, preencha seus dados básicos (nome, e-mail e senha) e você receberá um e-mail de confirmação. Após confirmar, você terá acesso imediato ao painel de controle.'
      },
      {
        question: 'Quanto tempo leva para configurar tudo?',
        answer: 'A configuração inicial leva cerca de 10-15 minutos. Nosso assistente de onboarding guia você pelas etapas essenciais: criar seu primeiro tenant, importar dados (opcional) e configurar suas primeiras automações. Você pode personalizar ainda mais depois.'
      },
      {
        question: 'Preciso de conhecimentos técnicos?',
        answer: 'Não! A plataforma Noro.guru foi projetada para ser intuitiva. Todas as configurações são feitas através de interfaces visuais simples. Se você sabe usar e-mail e navegador, conseguirá usar nossa plataforma sem problemas.'
      },
      {
        question: 'Como funciona o período de teste gratuito?',
        answer: 'O teste gratuito de 14 dias inclui acesso completo a todos os recursos do plano Professional. Não pedimos cartão de crédito para começar. Ao final do período, você pode escolher um plano ou continuar no plano gratuito com recursos limitados.'
      },
    ]
  },
  {
    category: 'Planos e Pagamentos',
    questions: [
      {
        question: 'Posso mudar de plano a qualquer momento?',
        answer: 'Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. No caso de upgrade, você paga apenas a diferença proporcional. No downgrade, o crédito restante é aplicado ao próximo ciclo.'
      },
      {
        question: 'Quais formas de pagamento são aceitas?',
        answer: 'Aceitamos cartão de crédito (Visa, Mastercard, Elo), PIX e boleto bancário. Para planos anuais, também oferecemos pagamento via transferência bancária. Todos os pagamentos são processados de forma segura.'
      },
      {
        question: 'Há desconto para pagamento anual?',
        answer: 'Sim! Ao optar pelo pagamento anual, você recebe 20% de desconto sobre o valor total. Isso equivale a 2 meses grátis. Além disso, você garante o preço por 12 meses sem reajustes.'
      },
      {
        question: 'Posso cancelar a qualquer momento?',
        answer: 'Sim, você pode cancelar sua assinatura a qualquer momento sem multas ou taxas. Ao cancelar, você continuará tendo acesso até o final do período já pago. Seus dados ficam salvos por 90 dias caso queira reativar.'
      },
    ]
  },
  {
    category: 'Recursos e Funcionalidades',
    questions: [
      {
        question: 'Como funciona a integração entre os módulos?',
        answer: 'Todos os módulos do ecossistema Noro.guru compartilham dados automaticamente. Por exemplo: um lead capturado no Noro.leads aparece automaticamente no Noro.control, pode gerar um orçamento no Noro.financeiro e ser acompanhado no Noro.marketing - tudo sincronizado em tempo real.'
      },
      {
        question: 'Posso importar dados de outras ferramentas?',
        answer: 'Sim! Oferecemos importação de dados via CSV/Excel para leads, clientes, produtos e transações. Também temos integrações diretas com ferramentas populares como RD Station, HubSpot, Bling e Omie. Nossa equipe pode ajudar com migrações maiores.'
      },
      {
        question: 'Como funciona a automação com IA?',
        answer: 'Nossa IA analisa seus dados históricos para sugerir automações inteligentes: categorização automática de leads, previsão de vendas, sugestões de follow-up, detecção de anomalias financeiras e muito mais. Você pode aprovar ou ajustar cada sugestão.'
      },
      {
        question: 'Os dados ficam seguros na nuvem?',
        answer: 'Absolutamente. Usamos criptografia de ponta a ponta, servidores redundantes em múltiplas regiões, backups diários automáticos e conformidade com LGPD. Seus dados são isolados em um tenant exclusivo e nunca são compartilhados.'
      },
    ]
  },
  {
    category: 'Suporte e Assistência',
    questions: [
      {
        question: 'Como posso entrar em contato com o suporte?',
        answer: 'Oferecemos múltiplos canais: chat ao vivo (disponível de seg-sex, 9h-18h), e-mail (suporte@noro.guru com resposta em até 4 horas úteis), base de conhecimento 24/7 e vídeo-tutoriais. Clientes Enterprise têm suporte prioritário e gerente de conta dedicado.'
      },
      {
        question: 'Vocês oferecem treinamento?',
        answer: 'Sim! Todos os planos incluem acesso à nossa Academy com vídeos, webinars e guias. Planos Professional e Enterprise incluem sessões de treinamento ao vivo com nossa equipe. Também criamos materiais personalizados para seu time.'
      },
      {
        question: 'Qual o tempo de resposta do suporte?',
        answer: 'Chat ao vivo: resposta imediata durante horário comercial. E-mail: até 4 horas úteis no plano Professional, até 2 horas no Enterprise. Problemas críticos são priorizados e tratados em até 1 hora em qualquer plano.'
      },
      {
        question: 'Posso solicitar novos recursos?',
        answer: 'Com certeza! Temos um roadmap público onde você pode sugerir e votar em novos recursos. Priorizamos funcionalidades mais votadas. Clientes Enterprise podem solicitar desenvolvimentos customizados mediante orçamento.'
      },
    ]
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  // Filter FAQs based on search
  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(q =>
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Bar */}
      <div className="mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8C1E0]" />
          <input
            type="text"
            placeholder="Buscar nas perguntas frequentes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#2E2E3A]/50 border border-[#2E2E3A] rounded-xl pl-12 pr-4 py-4 text-[#E0E3FF] placeholder:text-[#B8C1E0] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7] transition-all"
            aria-label="Buscar perguntas frequentes"
          />
        </div>
      </div>

      {/* FAQ Categories */}
      {filteredFaqs.length > 0 ? (
        <div className="space-y-8">
          {filteredFaqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-2xl font-bold text-[#E0E3FF] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-[#6C5CE7] rounded-full"></span>
                {category.category}
              </h3>
              
              <div className="space-y-3">
                {category.questions.map((faq, questionIndex) => {
                  const key = `${categoryIndex}-${questionIndex}`;
                  const isOpen = openIndex === key;
                  
                  return (
                    <div
                      key={questionIndex}
                      className="bg-[#2E2E3A]/30 border border-[#2E2E3A] rounded-xl overflow-hidden transition-all hover:border-[#6C5CE7]/50"
                    >
                      <button
                        onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left group"
                        aria-expanded={isOpen}
                      >
                        <span className="text-[#E0E3FF] font-semibold group-hover:text-[#6C5CE7] transition-colors">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`w-5 h-5 text-[#B8C1E0] transition-transform ${
                            isOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      
                      {isOpen && (
                        <div className="px-6 pb-4 animate-fade-in">
                          <p className="text-[#B8C1E0] leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-[#B8C1E0] text-lg">
            Nenhuma pergunta encontrada para "{searchQuery}"
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-4 text-[#6C5CE7] hover:underline"
          >
            Limpar busca
          </button>
        </div>
      )}
    </div>
  );
}
