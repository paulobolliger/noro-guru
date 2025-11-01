import React from 'react';

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
        <section id="values" className="bg-[#F8F9FB] py-20 md:py-28">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="font-extrabold text-4xl md:text-5xl text-[#342CA4] tracking-wide">
                        Por que empresas escolhem NORO?
                    </h2>
                    <p className="mt-6 max-w-3xl mx-auto text-lg text-[#342CA4] font-medium">
                        Mais de 1.000 empresas já transformaram sua gestão com nossa plataforma. 
                        Descubra o que nos torna diferentes.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {values.map((value) => (
                        <div 
                          key={value.title} 
                          className="bg-white rounded-2xl p-8 shadow-[0_2px_8px_rgba(0,0,0,0.25)] border border-[#342CA4]/10 hover:border-[#1DD3C0] transition-all duration-300 hover:shadow-[0_0_15px_rgba(29,211,192,0.3)] hover:-translate-y-2"
                        >
                            <div className="text-5xl mb-4">{value.icon}</div>
                            <h3 className="font-bold text-2xl text-[#342CA4] mb-3">{value.title}</h3>
                            <p className="text-[#342CA4] leading-relaxed font-medium">{value.description}</p>
                        </div>
                    ))}
                </div>

                {/* Philosophy section */}
                <div className="mt-20 max-w-4xl mx-auto text-center">
                    <blockquote className="text-2xl md:text-3xl font-bold text-[#342CA4] leading-relaxed">
                        "Não vendemos software. Entregamos <span className="text-[#D4AF37]">tempo, clareza e crescimento</span> para sua empresa."
                    </blockquote>
                    <p className="mt-4 text-[#342CA4] font-medium">
                        — Equipe NORO
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Values;
