import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { PassportIcon } from '@/components/icons/PassportIcon';

const VistosGuruPage = () => {
    return (
        <div className="container mx-auto px-6 py-20 md:py-28 text-noro-accent/80 relative z-10">
            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-noro-turquoise/20 blur-3xl rounded-full"></div>
                        <div className="inline-block p-4 bg-white/5 backdrop-blur-sm rounded-2xl mb-6 border border-white/10 relative z-10">
                            <PassportIcon className="w-16 h-16 text-noro-turquoise" />
                        </div>
                    </div>
                    <div className="mb-2 font-display text-2xl font-bold tracking-widest text-noro-gold uppercase">Vistos Guru</div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight mb-8 leading-tight">
                        Inteligência de Dados para <span className="text-transparent bg-clip-text bg-gradient-to-r from-noro-turquoise to-noro-purple-light">Processos de Vistos</span>
                    </h1>
                </div>

                <div className="space-y-12">
                    {/* Introduction */}
                    <Card variant="glass" className="p-8 md:p-12">
                        <p className="text-xl text-white leading-relaxed mb-6 font-medium text-center">
                            Transforme complexidade operacional em eficiência, segurança e escala.
                        </p>
                        <hr className="border-white/10 my-8" />
                        <p className="text-noro-text-secondary text-lg leading-relaxed mb-6">
                            Processos de vistos são complexos por definição. <br />
                            Regras variam por país, perfil, tipo de viagem e momento. Quando essa complexidade é tratada manualmente, ela vira gargalo.
                        </p>
                        <p className="text-noro-turquoise font-bold text-lg leading-relaxed mb-6 text-center">
                            Quando é tratada com dados e automação, ela vira vantagem competitiva.
                        </p>
                        <div className="border-l-4 border-noro-gold pl-6 py-2">
                            <p className="text-lg font-bold text-white italic">
                                "A Inteligência de Dados para Processos de Vistos da NORO foi criada para organizar, acelerar e dar segurança a operações que lidam diariamente com exigências migratórias."
                            </p>
                        </div>
                    </Card>

                    {/* Less Risk, More Control */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card variant="default" className="bg-noro-dark/50 p-8 border-noro-gray-future/30">
                            <h2 className="text-2xl font-bold text-white mb-6">Menos risco. Mais controle.</h2>
                            <p className="text-noro-text-secondary mb-6">
                                A NORO centraliza e estrutura todas as informações críticas do processo, permitindo que sua operação trabalhe com:
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Dados confiáveis e atualizados",
                                    "Fluxos claros e previsíveis",
                                    "Redução drástica de erros manuais",
                                    "Visão completa do status"
                                ].map(item => (
                                    <li key={item} className="flex items-start gap-3 text-noro-text-muted text-sm">
                                        <span className="text-noro-turquoise mt-1">●</span> {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-8 text-white font-medium border-t border-white/5 pt-4">
                                Você deixa de "apagar incêndios" e passa a operar com controle.
                            </p>
                        </Card>
                        <Card variant="default" className="bg-noro-dark/50 p-8 border-noro-gray-future/30">
                            <h2 className="text-2xl font-bold text-white mb-6">Dados estruturados que escalam</h2>
                            <p className="text-noro-text-secondary mb-6">
                                Planilhas e checklists soltos não escalam. A NORO organiza regras e requisitos em dados estruturados.
                            </p>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-2 text-white"><span className="text-noro-gold">➜</span> Padronização da operação</li>
                                <li className="flex items-center gap-2 text-white"><span className="text-noro-gold">➜</span> Reaproveitamento inteligente</li>
                                <li className="flex items-center gap-2 text-white"><span className="text-noro-gold">➜</span> Treinamento rápido de equipes</li>
                                <li className="flex items-center gap-2 text-white"><span className="text-noro-gold">➜</span> Crescimento sem perda de qualidade</li>
                            </ul>
                            <p className="mt-8 text-noro-turquoise font-bold text-center border-t border-white/5 pt-4">
                                "O conhecimento passa a ser do sistema — não de pessoas específicas."
                            </p>
                        </Card>
                    </div>

                    {/* Automation & AI */}
                    <Card variant="glass" className="p-8 md:p-12 relative overflow-hidden">
                        <div className="grid md:grid-cols-2 gap-12 relative z-10">
                            <div>
                                <h2 className="text-3xl font-bold text-white mb-6">Automação que acompanha o processo real</h2>
                                <p className="text-noro-text-secondary mb-6">
                                    Cada solicitação de visto segue um caminho lógico. A NORO transforma esse caminho em fluxo operacional.
                                </p>
                                <ul className="space-y-2 mb-6">
                                    {["Guiar cada processo passo a passo", "Automatizar tarefas repetitivas", "Gerar alertas de prazo e pendências", "Acompanhar volumes e gargalos"].map(item => (
                                        <li key={item} className="flex items-center gap-2 text-white font-medium">
                                            <span className="text-noro-turquoise">✓</span> {item}
                                        </li>
                                    ))}
                                </ul>
                                <p className="text-xl font-bold text-white">
                                    Resultado: <br />
                                    <span className="text-noro-gold">Mais produtividade, menos retrabalho.</span>
                                </p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <span className="text-2xl">🤖</span> Inteligência Aplicada
                                </h3>
                                <p className="text-noro-text-muted mb-4">
                                    A NORO utiliza IA como acelerador operacional, não como risco.
                                </p>
                                <p className="text-noro-text-secondary text-sm mb-4">
                                    Ela apoia análises, interpreta cenários e acelera respostas, sempre conectada a regras, dados e validações claras.
                                </p>
                                <p className="mt-6 text-white font-bold text-sm bg-noro-turquoise/20 p-2 rounded text-center">
                                    Mais velocidade, sem abrir mão de segurança.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Professional Operation */}
                    <section className="bg-noro-gold/5 rounded-3xl p-8 md:p-10 border border-noro-gold/20 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">Operação profissional, do início ao fim</h2>
                        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                "Histórico completo por cliente",
                                "Rastreabilidade total",
                                "Controle de acesso por perfil",
                                "Visão consolidada"
                            ].map(item => (
                                <div key={item} className="p-4 rounded-xl bg-noro-dark border border-white/5">
                                    <p className="text-white font-medium text-sm">{item}</p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-8 text-noro-text-secondary">Tudo pensado para quem precisa operar com responsabilidade, volume e previsibilidade.</p>
                    </section>

                    {/* Target Audience */}
                    <div className="text-center py-8">
                        <h2 className="text-2xl font-bold text-white mb-6">Para quem isso faz diferença</h2>
                        <div className="flex flex-wrap justify-center gap-4 mb-4">
                            {[
                                "Empresas com processos em escala",
                                "Operações que querem reduzir risco",
                                "Negócios focados em eficiência",
                                "Equipes com regras complexas"
                            ].map(item => (
                                <span key={item} className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-noro-text-secondary shadow-sm text-sm">
                                    {item}
                                </span>
                            ))}
                        </div>
                        <p className="text-noro-gold font-medium">"Se vistos fazem parte do seu core, estrutura é indispensável."</p>
                    </div>

                </div>

                {/* Footer CTA */}
                <div className="text-center mt-12 bg-gradient-to-t from-noro-turquoise/10 to-transparent pt-16 pb-8 rounded-t-3xl border-t border-white/5">
                    <div className="mb-8 space-y-4">
                        <h2 className="font-display text-4xl font-bold text-white">Complexidade não é o problema.</h2>
                        <p className="text-xl text-noro-text-secondary max-w-3xl mx-auto">
                            Com a NORO, complexidade vira processo, previsibilidade, eficiência e confiança.
                        </p>
                        <p className="text-2xl font-bold text-noro-turquoise">E confiança, nesse mercado, vira vantagem competitiva.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
                        <Link href="/contact">
                            <Button variant="primary" size="lg" className="shadow-[0_0_20px_#D4AF37]">
                                Falar com Especialista
                            </Button>
                        </Link>
                        <Link href="/ecosystem">
                            <Button variant="secondary" size="lg">
                                Ver Outras Soluções
                            </Button>
                        </Link>
                    </div>
                    <p className="mt-8 text-lg font-bold text-white">
                        Inteligência de Dados para Processos de Vistos. <br />
                        <span className="text-noro-text-muted font-normal text-base">Estrutura para quem precisa operar com precisão.</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VistosGuruPage;
