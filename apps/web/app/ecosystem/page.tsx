import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import StructuredData from '@/components/StructuredData';
import { getWebPageSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Ecossistema NORO | Soluções Integradas .guru',
  description: 'Conheça o ecossistema completo de soluções NORO: Vistos.guru, Sites Inteligentes, CRM/ERP e ITTD Database. Tudo integrado para seu sucesso.',
  keywords: 'ecossistema noro, vistos guru, sites inteligentes, crm erp, ittd, soluções integradas',
};

const products = [
  {
    id: 'vistos-guru',
    name: 'Vistos.guru',
    tagline: 'Inteligência de Dados para Vistos',
    description: 'Plataforma completa para gestão de processos de visto com IA e automação.',
    icon: '🛂',
    color: 'from-blue-500 to-cyan-500',
    features: [
      'Análise automatizada de documentos',
      'Tracking em tempo real',
      'Dashboard de métricas',
      'Integração com embaixadas',
      'Previsão de aprovação com IA',
    ],
    href: '/ecosystem/vistos-guru',
  },
  {
    id: 'intelligent-websites',
    name: 'Sites Inteligentes',
    tagline: 'Criação de Sites com IA',
    description: 'Desenvolvimento de websites modernos, rápidos e inteligentes para seu negócio.',
    icon: '🌐',
    color: 'from-purple-500 to-pink-500',
    features: [
      'Design responsivo e moderno',
      'SEO otimizado automaticamente',
      'Performance de alto nível',
      'Integração com Analytics',
      'Manutenção e suporte inclusos',
    ],
    href: '/ecosystem/intelligent-websites',
  },
  {
    id: 'crm-erp',
    name: 'CRM/ERP Inteligente',
    tagline: 'Gestão Completa do Seu Negócio',
    description: 'Sistema unificado de gestão com CRM, ERP, Financeiro e muito mais.',
    icon: '📊',
    color: 'from-green-500 to-emerald-500',
    features: [
      'CRM com automação de vendas',
      'ERP completo e integrado',
      'Gestão financeira avançada',
      'Relatórios e dashboards',
      'Multi-tenant e escalável',
    ],
    href: '/ecosystem/intelligent-crm-erp',
  },
  {
    id: 'ittd',
    name: 'ITTD Database',
    tagline: 'Travel & Tourism Database',
    description: 'Base de dados completa para o setor de turismo e viagens.',
    icon: '✈️',
    color: 'from-orange-500 to-red-500',
    features: [
      'Dados de destinos globais',
      'Informações de hotéis e acomodações',
      'Preços e disponibilidade em tempo real',
      'API RESTful completa',
      'Integração facilitada',
    ],
    href: '/ecosystem/ittd',
  },
];

export default function EcosystemPage() {
  return (
    <>
      <StructuredData 
        data={getWebPageSchema({
          url: 'https://noro.guru/ecosystem',
          title: 'Ecossistema NORO | Soluções Integradas .guru',
          description: 'Conheça o ecossistema completo de soluções NORO: Vistos.guru, Sites Inteligentes, CRM/ERP e ITTD Database. Tudo integrado para seu sucesso.',
        })} 
      />
      <div className="min-h-screen bg-gradient-to-b from-[#0B1220] via-[#1a2332] to-[#0B1220]">
        {/* Hero */}
        <section className="pt-24 pb-16 px-6 md:px-12">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-[#1DD3C0] via-[#D4AF37] to-[#342CA4] bg-clip-text text-transparent">
            Ecossistema NORO
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Soluções integradas e inteligentes para transformar seu negócio. 
            Todas as ferramentas que você precisa, em um único ecossistema.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <span className="px-4 py-2 rounded-full bg-[#1DD3C0]/20 text-[#1DD3C0] border border-[#1DD3C0]/30">
              100% Integrado
            </span>
            <span className="px-4 py-2 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30">
              IA Incluída
            </span>
            <span className="px-4 py-2 rounded-full bg-[#342CA4]/20 text-[#342CA4] border border-[#342CA4]/30">
              Multi-tenant
            </span>
          </div>
        </div>
      </section>

      {/* Produtos */}
      <section className="py-16 px-6 md:px-12">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group relative bg-gradient-to-br from-white/5 to-white/10 rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all hover:shadow-2xl hover:shadow-[#1DD3C0]/20"
              >
                {/* Icon com gradient */}
                <div className={`w-20 h-20 mb-6 rounded-2xl bg-gradient-to-br ${product.color} flex items-center justify-center text-4xl shadow-lg`}>
                  {product.icon}
                </div>

                {/* Conteúdo */}
                <h3 className="text-3xl font-bold text-white mb-2">{product.name}</h3>
                <p className="text-[#1DD3C0] font-semibold mb-4">{product.tagline}</p>
                <p className="text-gray-300 mb-6">{product.description}</p>

                {/* Features */}
                <ul className="space-y-2 mb-8">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-gray-400">
                      <svg className="w-5 h-5 mr-2 text-[#1DD3C0] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={product.href}
                  className="inline-flex items-center gap-2 text-[#1DD3C0] font-semibold hover:gap-4 transition-all group-hover:text-[#D4AF37]"
                >
                  Saiba mais
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>

                {/* Glow effect on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${product.color} opacity-0 group-hover:opacity-10 blur-xl transition-opacity -z-10`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integração */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-r from-[#342CA4]/20 via-[#1DD3C0]/20 to-[#D4AF37]/20">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Tudo Integrado, Tudo Conectado
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
            Todos os produtos do ecossistema NORO se comunicam perfeitamente. 
            Dados fluem automaticamente entre sistemas, eliminando trabalho manual e retrabalho.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-white mb-2">Sincronização Automática</h3>
              <p className="text-gray-400">
                Dados sincronizados em tempo real entre todos os produtos
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-white mb-2">Login Único (SSO)</h3>
              <p className="text-gray-400">
                Um único login para acessar todo o ecossistema
              </p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-white mb-2">Dashboard Unificado</h3>
              <p className="text-gray-400">
                Veja todas as métricas em um único lugar
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-6 md:px-12">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Pronto para o Ecossistema Completo?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Escolha os produtos que você precisa ou contrate o pacote completo
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="bg-gradient-to-r from-[#1DD3C0] to-[#342CA4] text-white font-bold py-4 px-8 rounded-2xl hover:shadow-[0_0_20px_#1DD3C0] transition-all"
            >
              Ver Planos
            </Link>
            <Link
              href="/contact"
              className="bg-white/10 text-white border-2 border-white/30 font-bold py-4 px-8 rounded-2xl hover:bg-white/20 transition-all"
            >
              Falar com Consultor
            </Link>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
