import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cases de Sucesso - NORO | Transformação Digital Comprovada',
  description: 'Conheça histórias reais de empresas que transformaram sua gestão com a NORO. Resultados mensuráveis e impacto real nos negócios.',
  keywords: 'cases de sucesso, clientes noro, depoimentos, resultados, transformação digital',
};

const cases = [
  {
    id: 1,
    company: 'Tech Solutions Ltda',
    industry: 'Tecnologia',
    size: '50-100 funcionários',
    challenge: 'Processos manuais fragmentados entre múltiplas ferramentas causavam retrabalho e perda de dados. Equipe de vendas sem visibilidade do funil e dificuldade em prever receita.',
    solution: 'Implementação completa do CRM + ERP NORO com migração de dados históricos e treinamento da equipe em 2 semanas.',
    results: [
      { metric: '40%', description: 'Aumento de Produtividade' },
      { metric: '60%', description: 'Redução no Tempo de Fechamento' },
      { metric: '25%', description: 'Redução de Custos Operacionais' },
      { metric: '3 meses', description: 'ROI Positivo' },
    ],
    testimonial: 'A NORO não é apenas uma ferramenta, é um parceiro estratégico. Em 3 meses já tínhamos ROI positivo.',
    author: 'Carlos Silva, CEO',
    color: 'from-blue-500 to-cyan-500',
    icon: '💻',
  },
  {
    id: 2,
    company: 'Innovare Consultoria',
    industry: 'Consultoria',
    size: '20-50 funcionários',
    challenge: 'Dificuldade em gerenciar múltiplos projetos simultaneamente. Falta de integração entre gestão de tempo, faturamento e controle financeiro.',
    solution: 'Módulos de Gestão de Projetos + Financeiro + Time Tracking integrados, com dashboards personalizados por cliente.',
    results: [
      { metric: '85%', description: 'Melhoria no Time-to-Invoice' },
      { metric: '30%', description: 'Aumento de Projetos Simultâneos' },
      { metric: '50%', description: 'Redução de Erros de Faturamento' },
      { metric: '100%', description: 'Visibilidade Financeira' },
    ],
    testimonial: 'Finalmente conseguimos escalar sem perder controle. Cada projeto tem seu próprio dashboard e os números batem automaticamente.',
    author: 'Marina Costa, COO',
    color: 'from-purple-500 to-pink-500',
    icon: '📊',
  },
  {
    id: 3,
    company: 'Prime Marketing',
    industry: 'Marketing Digital',
    size: '10-20 funcionários',
    challenge: 'Funil de vendas desorganizado, follow-ups perdidos e taxa de conversão baixa. Time gastava mais tempo com administrativo do que com clientes.',
    solution: 'CRM com automação de marketing, sequências de email e integração com WhatsApp. Dashboards de performance em tempo real.',
    results: [
      { metric: '180%', description: 'Aumento em Conversões' },
      { metric: '75%', description: 'Redução em Follow-ups Perdidos' },
      { metric: '4x', description: 'Mais Leads Qualificados' },
      { metric: '2 horas/dia', description: 'Economizadas por Vendedor' },
    ],
    testimonial: 'Nossa taxa de conversão triplicou! A automação nos deu tempo para focar no que realmente importa: atender bem os clientes.',
    author: 'Ana Paula Santos, Head de Vendas',
    color: 'from-green-500 to-emerald-500',
    icon: '🎯',
  },
  {
    id: 4,
    company: 'Global Services',
    industry: 'Serviços Corporativos',
    size: '100+ funcionários',
    challenge: 'Sistema legado lento e inflexível. Impossibilidade de customizar processos e relatórios. Custos de manutenção altíssimos.',
    solution: 'Migração completa para NORO com customização de workflows e integração com sistemas existentes via API.',
    results: [
      { metric: '65%', description: 'Redução de Tempo em Relatórios' },
      { metric: '90%', description: 'Redução de Custos de TI' },
      { metric: '99.9%', description: 'Uptime Garantido' },
      { metric: '< 1 sem', description: 'Tempo de Implementação' },
    ],
    testimonial: 'A migração foi surpreendentemente rápida e indolor. Em uma semana estávamos 100% operacionais com performance infinitamente superior.',
    author: 'Roberto Fernandes, CTO',
    color: 'from-orange-500 to-red-500',
    icon: '⚡',
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Hero */}
      <section className="pt-24 pb-16 px-6 md:px-12 bg-gradient-to-br from-[#342CA4] via-[#1DD3C0]/20 to-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#342CA4]">
            Cases de Sucesso
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Histórias reais de empresas que transformaram sua gestão com a NORO. 
            Resultados mensuráveis, impacto real.
          </p>
        </div>
      </section>

      {/* Stats Overview */}
      <section className="py-12 px-6 md:px-12 bg-[#342CA4]">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-white/80">Empresas Atendidas</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">68%</div>
              <div className="text-white/80">Média de Aumento em Produtividade</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3 meses</div>
              <div className="text-white/80">ROI Médio</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-white/80">Satisfação dos Clientes</div>
            </div>
          </div>
        </div>
      </section>

      {/* Cases */}
      <section className="py-20 px-6 md:px-12">
        <div className="container mx-auto max-w-6xl space-y-20">
          {cases.map((caseStudy, index) => (
            <article
              key={caseStudy.id}
              className={`relative ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`}
            >
              {/* Card */}
              <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-100 overflow-hidden hover:shadow-3xl transition-all">
                {/* Header */}
                <div className={`bg-gradient-to-r ${caseStudy.color} p-8 text-white`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-5xl mb-4">{caseStudy.icon}</div>
                      <h2 className="text-3xl font-bold mb-2">{caseStudy.company}</h2>
                      <div className="flex flex-wrap gap-4 text-sm">
                        <span className="px-3 py-1 bg-white/20 rounded-full">{caseStudy.industry}</span>
                        <span className="px-3 py-1 bg-white/20 rounded-full">{caseStudy.size}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Challenge */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-2xl">🎯</span> Desafio
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{caseStudy.challenge}</p>
                  </div>

                  {/* Solution */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="text-2xl">💡</span> Solução
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{caseStudy.solution}</p>
                  </div>

                  {/* Results */}
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-2xl">📈</span> Resultados
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {caseStudy.results.map((result, idx) => (
                        <div key={idx} className="text-center p-4 bg-gray-50 rounded-xl">
                          <div className="text-3xl font-bold text-[#342CA4] mb-1">{result.metric}</div>
                          <div className="text-sm text-gray-600">{result.description}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Testimonial */}
                  <div className="bg-gradient-to-br from-[#342CA4]/5 to-[#1DD3C0]/5 p-6 rounded-2xl border-l-4 border-[#1DD3C0]">
                    <p className="text-gray-700 italic mb-4">"{caseStudy.testimonial}"</p>
                    <p className="text-sm text-gray-600 font-semibold">— {caseStudy.author}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-br from-[#342CA4] to-[#1DD3C0]">
        <div className="container mx-auto max-w-4xl text-center text-white">
          <h2 className="text-4xl font-bold mb-6">
            Quer Ser Nosso Próximo Case de Sucesso?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Agende uma demonstração e veja como podemos transformar seu negócio
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-[#342CA4] font-bold py-4 px-8 rounded-2xl hover:shadow-[0_0_20px_white] transition-all"
            >
              Agendar Demonstração
            </Link>
            <Link
              href="/pricing"
              className="bg-white/10 text-white border-2 border-white font-bold py-4 px-8 rounded-2xl hover:bg-white/20 transition-all"
            >
              Ver Planos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
