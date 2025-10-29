import React from 'react';
import { DatabaseIcon } from '@/components/icons/DatabaseIcon';

const IttdPage = () => {
    return (
        <div className="container mx-auto px-6 py-20 md:py-28 text-noro-accent/80">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                     <div className="inline-block p-4 bg-noro-dark-2 rounded-xl mb-6 border border-noro-gray-future">
                        <DatabaseIcon className="w-16 h-16 text-noro-turquoise" />
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
                        Internet Travel & Tourism Database (ITTD)
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                        O mais completo banco de dados do setor de viagens e turismo, agora acessível através de uma API inteligente.
                    </p>
                </div>

                <div className="space-y-10 bg-noro-dark-2/50 border border-noro-dark-2 rounded-xl p-8 md:p-12">
                    <section>
                        <h2 className="font-display text-3xl font-bold text-noro-turquoise mb-4">Dados como Serviço</h2>
                        <p className="text-lg">
                            O ITTD é um repositório massivo e constantemente atualizado de informações sobre destinos, fornecedores, regulamentações, tendências de mercado e muito mais. Potencialize suas aplicações, pesquisas e estratégias com dados confiáveis e estruturados.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-3xl font-bold text-noro-turquoise mb-4">API Flexível e Poderosa</h2>
                        <p className="text-lg">
                           Nossa API, gerenciada pelo núcleo NORO, permite que você integre os dados do ITTD diretamente em seus sistemas. Realize consultas complexas, receba webhooks sobre atualizações e construa produtos inovadores sobre uma base de dados robusta.
                        </p>
                    </section>

                     <section>
                        <h2 className="font-display text-3xl font-bold text-noro-turquoise mb-4">O que você pode acessar?</h2>
                         <ul className="list-disc list-inside text-lg space-y-2">
                            <li>Dados de companhias aéreas e hotelaria.</li>
                            <li>Requisitos de vistos e vacinas para todos os países.</li>
                            <li>Estatísticas de fluxo turístico e tendências de busca.</li>
                            <li>Informações sobre atrações, eventos e segurança de destinos.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default IttdPage;
