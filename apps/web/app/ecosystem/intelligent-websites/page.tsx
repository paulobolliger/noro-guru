import React from 'react';
import { WebsiteIcon } from '@/components/icons/WebsiteIcon';

const IntelligentWebsitesPage = () => {
    return (
        <div className="container mx-auto px-6 py-20 md:py-28 text-noro-accent/80">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                     <div className="inline-block p-4 bg-noro-dark-2 rounded-xl mb-6 border border-noro-gray-future">
                        <WebsiteIcon className="w-16 h-16 text-noro-turquoise" />
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
                        Criação de Sites Inteligentes para Agências
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                        Seu site não deve ser apenas um cartão de visitas. Deve ser seu melhor vendedor, trabalhando 24/7 para capturar leads e gerar negócios.
                    </p>
                </div>

                <div className="space-y-10 bg-noro-dark-2/50 border border-noro-dark-2 rounded-xl p-8 md:p-12">
                    <section>
                        <h2 className="font-display text-3xl font-bold text-noro-turquoise mb-4">Além do Design</h2>
                        <p className="text-lg">
                           Construímos sites que são mais do que bonitos. Eles são máquinas de conversão, integrados com ferramentas de automação, análise de dados e personalização de conteúdo. Cada visitante recebe uma experiência única, projetada para guiá-lo pela jornada de compra.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-3xl font-bold text-noro-turquoise mb-4">Tecnologia de Ponta</h2>
                        <p className="text-lg">
                            Utilizamos as mais recentes tecnologias de front-end e back-end para garantir performance, segurança e escalabilidade. Nossos sites são otimizados para motores de busca (SEO) e totalmente responsivos, proporcionando uma experiência perfeita em qualquer dispositivo.
                        </p>
                    </section>

                     <section>
                        <h2 className="font-display text-3xl font-bold text-noro-turquoise mb-4">Recursos Principais</h2>
                         <ul className="list-disc list-inside text-lg space-y-2">
                            <li>Design focado em UX e conversão (CRO).</li>
                            <li>Integração nativa com CRMs e ferramentas de marketing.</li>
                            <li>Análise de comportamento do usuário em tempo real.</li>
                            <li>Personalização de conteúdo baseada em IA.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default IntelligentWebsitesPage;
