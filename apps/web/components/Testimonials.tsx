'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar?: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Carlos Alberto Silva',
    role: 'CEO',
    company: 'Tech Solutions Ltda',
    content: 'A NORO transformou nossa gestão empresarial. Em 3 meses, aumentamos a produtividade em 40% e reduzimos custos em 25%. A plataforma é intuitiva, poderosa e o suporte é excepcional.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Marina Costa',
    role: 'Diretora de Operações',
    company: 'Innovare Consultoria',
    content: 'Testamos 5 sistemas diferentes antes de escolher NORO. A integração total entre CRM, Financeiro e Operações nos deu uma visão 360º que revolucionou nossa tomada de decisão.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Roberto Fernandes',
    role: 'Gerente de TI',
    company: 'Global Services',
    content: 'Implementação em uma semana, sem dor de cabeça. A arquitetura cloud da NORO é robusta, segura e incrivelmente rápida. Nosso TI aprovou com louvor!',
    rating: 5,
  },
  {
    id: 4,
    name: 'Ana Paula Santos',
    role: 'Head de Vendas',
    company: 'Prime Marketing',
    content: 'Nossas vendas decolaram! A automação de follow-ups, pipeline visual e relatórios em tempo real nos ajudaram a aumentar as conversões em 60% nos últimos 6 meses.',
    rating: 5,
  },
  {
    id: 5,
    name: 'Felipe Oliveira',
    role: 'CFO',
    company: 'Fintech Brasil',
    content: 'Controle financeiro total. Conciliação automática, fluxo de caixa preciso e dashboards que facilitam decisões estratégicas. Como CFO, posso dizer: NORO é referência.',
    rating: 5,
  },
  {
    id: 6,
    name: 'Juliana Almeida',
    role: 'Founder',
    company: 'StartUp XYZ',
    content: 'Startup enxuta, mas com gestão profissional. NORO nos deu ferramentas de empresa grande, com preço justo e sem complicação. Escalamos de 5 para 50 pessoas sem trocar de sistema.',
    rating: 5,
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-5 h-5 ${i < rating ? 'text-[#D4AF37]' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-white via-gray-50 to-white">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#342CA4] to-[#1DD3C0] bg-clip-text text-transparent">
            Mais de 1.000 empresas confiam na NORO
          </h2>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            Histórias reais de transformação digital e crescimento acelerado
          </p>
        </div>

        {/* Grid de Testimonials */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-2xl border-2 border-gray-200 hover:border-[#1DD3C0] hover:shadow-xl transition-all group"
            >
              {renderStars(testimonial.rating)}
              
              <p className="text-gray-700 mb-6 leading-relaxed font-medium">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#342CA4] to-[#1DD3C0] flex items-center justify-center text-white font-bold text-lg">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">
                    {testimonial.role} • {testimonial.company}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-[#342CA4] mb-2">1000+</div>
            <div className="text-gray-600">Clientes Satisfeitos</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#1DD3C0] mb-2">4.9/5</div>
            <div className="text-gray-600">Avaliação Média</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#D4AF37] mb-2">98%</div>
            <div className="text-gray-600">Taxa de Retenção</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-[#342CA4] mb-2">24/7</div>
            <div className="text-gray-600">Suporte Disponível</div>
          </div>
        </div>
      </div>
    </section>
  );
}
