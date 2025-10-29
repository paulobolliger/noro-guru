import React from 'react';
import NoroLogo from '@/components/icons/NoroLogo';

const AboutPage = () => {
    return (
        <div className="container mx-auto px-6 py-20 md:py-28 text-noro-accent/80">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <NoroLogo className="w-24 h-24 mx-auto mb-6 opacity-80" />
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white">
                        O Cérebro por Trás da Operação
                    </h1>
                    <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                        NORO é mais do que uma plataforma; é o núcleo inteligente que unifica o ecossistema .guru, transformando complexidade em simplicidade.
                    </p>
                </div>

                <div className="space-y-10 bg-noro-dark-2/50 border border-noro-dark-2 rounded-xl p-8 md:p-12">
                    <section>
                        <h2 className="font-display text-3xl font-bold text-noro-turquoise mb-4">Nossa Missão</h2>
                        <p className="text-lg">
                            Capacitar negócios com inteligência acessível, integrando automação, dados e design funcional para que possam focar no que realmente importa: criar valor e crescer com propósito.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-3xl font-bold text-noro-turquoise mb-4">Nossa Visão</h2>
                        <p className="text-lg">
                            Ser o hub de tecnologia que não apenas unifica o ecossistema de marcas Guru, mas também impulsiona outras agências a trabalharem com autonomia, clareza e inovação sustentável.
                        </p>
                    </section>

                    <section>
                        <h2 className="font-display text-3xl font-bold text-noro-turquoise mb-4">Nosso Arquétipo: O Mago-Estrategista</h2>
                        <p className="text-lg">
                            Atuamos como o Mago-Estrategista, o arquétipo que transforma caos em ordem, dados brutos em sabedoria acionável e desafios complexos em soluções elegantes. Nossa magia está na lógica, na precisão e na capacidade de ver padrões onde outros veem apenas ruído.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
