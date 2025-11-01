'use client';

import { useState } from 'react';
import { BookOpen, FileText, Video, Code, ArrowRight } from 'lucide-react';

const knowledgeBaseCategories = [
  {
    title: 'Guias de Início Rápido',
    icon: BookOpen,
    color: 'text-blue-400',
    articles: [
      {
        title: 'Primeiros passos com Noro.control',
        description: 'Aprenda a configurar seu primeiro tenant e começar a gerenciar seu negócio',
        readTime: '5 min',
        link: '#'
      },
      {
        title: 'Como capturar leads com Noro.leads',
        description: 'Configure formulários e webhooks para capturar leads automaticamente',
        readTime: '7 min',
        link: '#'
      },
      {
        title: 'Gestão financeira com Noro.financeiro',
        description: 'Organize suas finanças, categorias e relatórios',
        readTime: '10 min',
        link: '#'
      },
    ]
  },
  {
    title: 'Tutoriais em Vídeo',
    icon: Video,
    color: 'text-purple-400',
    articles: [
      {
        title: 'Tour completo pela plataforma',
        description: 'Vídeo demonstrando todos os recursos principais',
        readTime: '15 min',
        link: '#'
      },
      {
        title: 'Automações com IA - Tutorial',
        description: 'Como configurar automações inteligentes passo a passo',
        readTime: '12 min',
        link: '#'
      },
      {
        title: 'Integrações com APIs externas',
        description: 'Conecte suas ferramentas favoritas ao Noro.guru',
        readTime: '8 min',
        link: '#'
      },
    ]
  },
  {
    title: 'Documentação Técnica',
    icon: Code,
    color: 'text-green-400',
    articles: [
      {
        title: 'API Reference - Endpoints',
        description: 'Documentação completa da API REST do Noro.guru',
        readTime: '20 min',
        link: '#'
      },
      {
        title: 'Webhooks e Callbacks',
        description: 'Como configurar e receber eventos em tempo real',
        readTime: '10 min',
        link: '#'
      },
      {
        title: 'Autenticação e Segurança',
        description: 'Guia sobre API keys, tokens e boas práticas',
        readTime: '8 min',
        link: '#'
      },
    ]
  },
  {
    title: 'Casos de Uso',
    icon: FileText,
    color: 'text-orange-400',
    articles: [
      {
        title: 'E-commerce: Do lead à venda',
        description: 'Fluxo completo de captura, qualificação e conversão',
        readTime: '12 min',
        link: '#'
      },
      {
        title: 'Agências: Gestão de múltiplos clientes',
        description: 'Como usar tenants para organizar clientes separadamente',
        readTime: '10 min',
        link: '#'
      },
      {
        title: 'SaaS: Automação de onboarding',
        description: 'Automatize o processo de boas-vindas de novos usuários',
        readTime: '15 min',
        link: '#'
      },
    ]
  },
];

export default function KnowledgeBase() {
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
      {knowledgeBaseCategories.map((category, categoryIndex) => {
        const Icon = category.icon;
        const isHovered = hoveredCategory === categoryIndex;
        
        return (
          <div
            key={categoryIndex}
            onMouseEnter={() => setHoveredCategory(categoryIndex)}
            onMouseLeave={() => setHoveredCategory(null)}
            className="bg-[#2E2E3A]/30 border border-[#2E2E3A] rounded-2xl p-6 transition-all hover:border-[#6C5CE7]/50 hover:shadow-xl hover:shadow-[#6C5CE7]/10"
          >
            {/* Category Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className={`${category.color} transition-transform ${isHovered ? 'scale-110' : ''}`}>
                <Icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-[#E0E3FF]">
                {category.title}
              </h3>
            </div>

            {/* Articles */}
            <div className="space-y-4">
              {category.articles.map((article, articleIndex) => (
                <a
                  key={articleIndex}
                  href={article.link}
                  className="group block bg-[#2E2E3A]/50 hover:bg-[#2E2E3A] border border-transparent hover:border-[#6C5CE7]/30 rounded-xl p-4 transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="text-[#E0E3FF] font-semibold mb-1 group-hover:text-[#6C5CE7] transition-colors">
                        {article.title}
                      </h4>
                      <p className="text-[#B8C1E0] text-sm mb-2">
                        {article.description}
                      </p>
                      <span className="text-[#6C5CE7] text-xs font-medium">
                        ⏱️ {article.readTime} de leitura
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#B8C1E0] group-hover:text-[#6C5CE7] group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                  </div>
                </a>
              ))}
            </div>

            {/* View All Link */}
            <button className="w-full mt-4 text-[#6C5CE7] hover:text-[#5F4FD1] font-semibold text-sm flex items-center justify-center gap-2 py-2 transition-colors">
              Ver todos os artigos
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
