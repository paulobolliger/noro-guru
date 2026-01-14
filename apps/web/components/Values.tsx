import React from 'react';
import Card from './ui/Card';

const values = [
    {
        title: 'Simplicidade na complexidade',
        description: 'Gestão empresarial não precisa ser complicada. Transformamos dados em ações claras e objetivas.',
        icon: '💎'
    },
    {
        title: 'Tecnologia que faz sentido',
        description: 'Ferramentas poderosas com interface intuitiva. Sua equipe aprende em minutos, não em semanas.',
        icon: '✨'
    },
    {
        title: 'Resultados que você vê',
        description: 'Métricas claras, automação real e ROI mensurável. Seu crescimento é nosso sucesso.',
        icon: '�'
    },
];

const Values: React.FC = () => {
    return (
        <section id="values" className="bg-noro-dark py-20 md:py-28 relative">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-noro-dark-2/20 pointer-events-none"></div>
            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="font-extrabold text-4xl md:text-5xl text-white tracking-wide">
                        Por que empresas escolhem NORO?
                    </h2>
                    <p className="mt-6 max-w-3xl mx-auto text-lg text-noro-text-secondary font-medium">
                        Mais de 1.000 empresas já transformaram sua gestão com nossa plataforma.
                        Descubra o que nos torna diferentes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {values.map((value) => (
                        <Card
                            key={value.title}
                            variant="glass"
                            className="hover:border-noro-turquoise"
                        >
                            <div className="text-5xl mb-4">{value.icon}</div>
                            <h3 className="font-bold text-2xl text-white mb-3">{value.title}</h3>
                            <p className="text-noro-text-muted leading-relaxed font-medium">{value.description}</p>
                        </Card>
                    ))}
                </div>

                {/* Philosophy section */}
                <div className="mt-20 max-w-4xl mx-auto text-center">
                    <blockquote className="text-2xl md:text-3xl font-bold text-white leading-relaxed">
                        "Não vendemos software. Entregamos <span className="text-noro-gold">tempo, clareza e crescimento</span> para sua empresa."
                    </blockquote>
                    <p className="mt-4 text-noro-text-secondary font-medium">
                        — Equipe NORO
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Values;
