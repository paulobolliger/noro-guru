import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { WebsiteIcon } from '@/components/icons/WebsiteIcon';

const IntelligentWebsitesPage = () => {
    return (
        <div className="container mx-auto px-6 py-20 md:py-28 text-noro-accent/80 relative z-10">
            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-noro-turquoise/20 blur-3xl rounded-full"></div>
                        <div className="inline-block p-4 bg-white/5 backdrop-blur-sm rounded-2xl mb-6 border border-white/10 relative z-10">
                            <WebsiteIcon className="w-16 h-16 text-noro-turquoise" />
                        </div>
                    </div>
                    <div className="mb-2 font-display text-2xl font-bold tracking-widest text-noro-gold uppercase">Intelligent Websites</div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight mb-8 leading-tight">
                        Criação de Sites Inteligentes para <span className="text-noro-turquoise">Agências</span>
                    </h1>
                </div>

                <div className="space-y-12">
                    {/* Intro / Problem */}
                    <Card variant="glass" className="p-8 md:p-12">
                        <p className="text-xl text-white leading-relaxed mb-6 font-medium text-center">
                            Seu site não deve ser apenas um cartão de visitas. <br />
                            Deve ser seu melhor vendedor, trabalhando 24/7 para capturar leads e gerar negócios.
                        </p>
                        <hr className="border-white/10 my-8" />
                        <p className="text-noro-text-secondary text-lg leading-relaxed mb-6 text-center">
                            A maioria dos sites de agências de turismo faz uma coisa muito bem: <br />
                            <span className="text-white font-bold">existir.</span>
                        </p>
                        <p className="text-noro-gold font-bold text-2xl text-center mb-6">
                            Mas existir não paga contas.
                        </p>
                        <p className="text-noro-text-secondary text-lg leading-relaxed text-center">
                            O site de uma agência moderna precisa vender, qualificar, educar e direcionar o cliente — mesmo quando ninguém está online. É exatamente para isso que a Criação de Sites Inteligentes da NORO foi desenvolvida.
                        </p>
                    </Card>

                    {/* Solution Details */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card variant="default" className="bg-noro-dark/50 p-8 border-noro-gray-future/30">
                            <h2 className="text-2xl font-bold text-white mb-6">Um site bonito não basta. <br /><span className="text-noro-turquoise">Ele precisa funcionar.</span></h2>
                            <p className="text-noro-text-secondary mb-6">
                                Layouts genéricos, textos vazios e formulários que ninguém responde não geram negócio.
                            </p>
                            <p className="text-white mb-4">Os sites criados pela NORO são projetados para:</p>
                            <ul className="space-y-3">
                                {[
                                    "Atrair o cliente certo",
                                    "Explicar valor com clareza",
                                    "Capturar leads qualificados",
                                    "Apoiar o processo de venda",
                                    "Integrar diretamente com o CRM"
                                ].map(item => (
                                    <li key={item} className="flex items-start gap-3 text-noro-text-muted text-sm">
                                        <span className="text-noro-gold mt-1">➜</span> {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-6 text-white text-sm italic border-t border-white/5 pt-4">
                                "Seu site deixa de ser um custo. Passa a ser um canal ativo de geração de receita."
                            </p>
                        </Card>

                        <div className="space-y-8">
                            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-4">Inteligência desde o primeiro clique</h3>
                                <p className="text-noro-text-secondary mb-4 text-sm">Cada site criado pela NORO nasce integrado à inteligência da plataforma.</p>
                                <ul className="space-y-2 mb-4">
                                    <li className="flex items-center gap-2 text-white text-sm"><span className="text-noro-turquoise">✓</span> Formulários conectados ao CRM</li>
                                    <li className="flex items-center gap-2 text-white text-sm"><span className="text-noro-turquoise">✓</span> Leads organizados automaticamente</li>
                                    <li className="flex items-center gap-2 text-white text-sm"><span className="text-noro-turquoise">✓</span> Histórico de interações preservado</li>
                                    <li className="flex items-center gap-2 text-white text-sm"><span className="text-noro-turquoise">✓</span> Dados prontos para ação comercial</li>
                                </ul>
                                <p className="text-white font-bold text-sm">Nada se perde. Nada fica solto.</p>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-4">Conteúdo que orienta e converte</h3>
                                <p className="text-noro-text-secondary mb-4 text-sm">
                                    O cliente não quer “ler sobre a agência”. Ele quer entender se você resolve o problema dele.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {["Conteúdo claro", "Linguagem simples", "Foco em conversão", "CTAs estratégicos"].map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-noro-turquoise/10 text-noro-turquoise rounded text-xs font-bold uppercase">{tag}</span>
                                    ))}
                                </div>
                                <p className="mt-4 text-right font-bold text-white text-sm">Menos curiosos. Mais oportunidades reais.</p>
                            </div>
                        </div>
                    </div>

                    {/* Designed for Tourism */}
                    <Card variant="glass" className="p-10 relative overflow-hidden">
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                            <div className="md:w-1/2">
                                <h2 className="text-3xl font-bold text-white mb-6">Experiência pensada para turismo</h2>
                                <p className="text-noro-text-secondary text-lg mb-6">
                                    Agências de turismo têm particularidades que plataformas genéricas ignoram. A NORO desenvolve sites pensados para:
                                </p>
                                <ul className="space-y-3">
                                    {[
                                        "Serviços complexos e personalizados",
                                        "Múltiplos produtos (viagens, seguros, vistos)",
                                        "Jornadas longas de decisão",
                                        "Atendimento humano aliado à tecnologia"
                                    ].map(item => (
                                        <li key={item} className="flex items-center gap-3 text-white">
                                            <span className="w-2 h-2 rounded-full bg-noro-gold"></span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="md:w-1/2 bg-noro-dark/50 p-6 rounded-2xl border border-white/5 text-center">
                                <p className="text-xl font-bold text-white mb-4">Um site que cresce junto com a agência</p>
                                <p className="text-noro-text-muted mb-6">
                                    O site não é um projeto fechado. Ele é parte do ecossistema. Pode evoluir para novas páginas, integrações com IA e fluxos de captação.
                                </p>
                                <p className="text-noro-turquoise font-bold text-lg">
                                    Sem refazer tudo. <br />
                                    Sem trocar de ferramenta.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Target Audience */}
                    <div className="text-center py-8 bg-white/5 rounded-3xl border border-white/5">
                        <h2 className="text-2xl font-bold text-white mb-6">Para quem esse produto faz sentido</h2>
                        <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto">
                            {[
                                "Agências que querem vender mais pelo digital",
                                "Operações que precisam organizar leads",
                                "Empresas que já superaram o 'site institucional'",
                                "Negócios que veem tecnologia como investimento"
                            ].map(item => (
                                <span key={item} className="px-4 py-2 bg-noro-dark/80 rounded-lg border border-white/10 text-white shadow-sm text-sm">
                                    {item}
                                </span>
                            ))}
                        </div>
                        <p className="text-noro-text-muted italic mt-6">"Se o site hoje não gera negócio, ele está subutilizado."</p>
                    </div>

                </div>

                {/* Footer CTA */}
                <div className="text-center mt-20">
                    <div className="mb-8 space-y-4">
                        <h2 className="font-display text-4xl font-bold text-white">Seu melhor vendedor não tira férias</h2>
                        <p className="text-xl text-noro-text-secondary max-w-2xl mx-auto">
                            Enquanto sua equipe atende clientes, negocia e executa, o site trabalha silenciosamente:
                        </p>
                        <div className="flex justify-center gap-4 text-noro-turquoise font-bold text-lg">
                            <span>Apresentando</span> • <span>Filtrando</span> • <span>Capturando</span> • <span>Preparando a venda</span>
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-white mb-8">
                        24 horas por dia. 7 dias por semana.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/contact">
                            <Button variant="primary" size="lg" className="shadow-[0_0_20px_#D4AF37]">
                                Solicitar Proposta
                            </Button>
                        </Link>
                        <Link href="/portfolio">
                            <Button variant="secondary" size="lg">
                                Ver Portfolio
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntelligentWebsitesPage;
