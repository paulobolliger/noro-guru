import React from 'react';
import { CrmErpIcon } from '@/components/icons/CrmErpIcon';

const CrmErpPage = () => {
    return (
        <div className="container mx-auto px-6 py-20 md:py-28 text-noro-accent/80">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                     <div className="inline-block p-4 bg-noro-dark-2 rounded-xl mb-6 border border-noro-gray-future">
                        <CrmErpIcon className="w-16 h-16 text-noro-turquoise" />
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
                        CRM/ERP Inteligente para Agências
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                        Unifique suas operações de vendas, marketing e gestão de projetos em uma única plataforma inteligente.
                    </p>
                </div>

                <div className="space-y-10 bg-noro-dark-2/50 border border-noro-dark-2 rounded-xl p-8 md:p-12">
                    <section>
                        <h2 className="font-display text-3xl font-bold text-noro-turquoise mb-4">Gestão Unificada</h2>
                        <p className="text-lg">
                            Chega de alternar entre dezenas de ferramentas. Nosso CRM/ERP, alimentado pelo núcleo NORO, centraliza o gerenciamento de clientes, funis de vendas, projetos, finanças e equipes. Tenha uma visão completa do seu negócio em um só lugar.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-3xl font-bold text-noro-turquoise mb-4">Automação que Trabalha por Você</h2>
                        <p className="text-lg">
                            Automatize o follow-up de leads, a criação de propostas, o faturamento recorrente e a atribuição de tarefas. Nossa plataforma aprende com seus processos para sugerir otimizações e liberar sua equipe para focar em atividades estratégicas.
                        </p>
                    </section>

                     <section>
                        <h2 className="font-display text-3xl font-bold text-noro-turquoise mb-4">Inteligência de Negócios</h2>
                         <ul className="list-disc list-inside text-lg space-y-2">
                            <li>Pipeline de vendas visual e personalizável.</li>
                            <li>Gestão de projetos com metodologias ágeis.</li>
                            <li>Relatórios financeiros e de performance automatizados.</li>
                            <li>Portal do cliente para comunicação transparente.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default CrmErpPage;
