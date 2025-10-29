import React from 'react';
import { CheckCircleIcon } from './icons/CheckCircleIcon';

const values = [
    { title: 'Clareza', description: 'Transformamos dados em insights compreensíveis.' },
    { title: 'Conexão', description: 'Integramos sistemas, pessoas e ideias de forma fluida.' },
    { title: 'Autonomia', description: 'Capacitamos equipes para que trabalhem com independência.' },
    { title: 'Inovação', description: 'Buscamos constantemente o futuro da tecnologia.' },
    { title: 'Precisão', description: 'Foco em resultados exatos e performance otimizada.' },
    { title: 'Simplicidade', description: 'Design e experiência sempre intuitivos e acessíveis.' },
];

const Values: React.FC = () => {
    return (
        <section id="values" className="bg-noro-dark-2/30 py-20 md:py-28">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="font-display text-4xl md:text-5xl font-bold">Nossos Valores</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-noro-accent/80">
                        Os pilares que guiam nossa inteligência e impulsionam nosso crescimento.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {values.map((value) => (
                        <div key={value.title} className="flex items-start gap-4 p-6 bg-noro-dark-2/50 rounded-lg">
                            <CheckCircleIcon className="w-6 h-6 text-noro-turquoise flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-bold text-xl text-noro-accent">{value.title}</h3>
                                <p className="text-noro-accent/70 mt-1">{value.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Values;
