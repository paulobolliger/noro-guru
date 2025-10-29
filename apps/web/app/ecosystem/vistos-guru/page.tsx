import React from 'react';
import { PassportIcon } from '@/components/icons/PassportIcon';

const VistosGuruPage = () => {
    return (
        <div className="container mx-auto px-6 py-20 md:py-28 text-noro-accent/80">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="inline-block p-4 bg-noro-dark-2 rounded-xl mb-6 border border-noro-gray-future">
                        <PassportIcon className="w-16 h-16 text-noro-turquoise" />
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
                        Inteligência de Dados para Vistos
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                        Transforme a complexidade de processos de vistos em uma vantagem competitiva com dados precisos e automação inteligente.
                    </p>
                </div>

                <div className="space-y-10 bg-noro-dark-2/50 border border-noro-dark-2 rounded-xl p-8 md:p-12">
                    <section>
                        <h2 className="font-display text-3xl font-bold text-noro-turquoise mb-4">O Problema</h2>
                        <p className="text-lg">
                            Agências de vistos e turismo lidam com um volume massivo de informações, regulamentações em constante mudança e processos manuais que consomem tempo e são propensos a erros. A falta de dados centralizados e análise preditiva resulta em perda de eficiência e oportunidades.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-3xl font-bold text-noro-turquoise mb-4">Nossa Solução</h2>
                        <p className="text-lg">
                            A plataforma de Inteligência de Dados para Vistos da NORO centraliza todas as informações, automatiza tarefas repetitivas e utiliza IA para prever tendências e otimizar processos. Oferecemos dashboards intuitivos que fornecem uma visão clara do status de cada processo, gargalos operacionais e performance da equipe.
                        </p>
                    </section>

                     <section>
                        <h2 className="font-display text-3xl font-bold text-noro-turquoise mb-4">Benefícios</h2>
                        <ul className="list-disc list-inside text-lg space-y-2">
                            <li>Redução de mais de 50% no tempo de processamento manual.</li>
                            <li>Análise preditiva para antecipar mudanças em consulados.</li>
                            <li>Dashboards centralizados para uma visão 360° da operação.</li>
                            <li>Melhora na comunicação e satisfação do cliente.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default VistosGuruPage;
