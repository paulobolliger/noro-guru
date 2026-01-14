import React from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import { CrmErpIcon } from '@/components/icons/CrmErpIcon';

const CrmErpPage = () => {
    return (
        <div className="container mx-auto px-6 py-20 md:py-28 text-noro-accent/80 relative z-10">
            <div className="max-w-4xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-noro-purple-light/20 blur-3xl rounded-full"></div>
                        <div className="inline-block p-4 bg-white/5 backdrop-blur-sm rounded-2xl mb-6 border border-white/10 relative z-10">
                            <CrmErpIcon className="w-16 h-16 text-noro-turquoise" />
                        </div>
                    </div>
                    <div className="mb-2 font-display text-2xl font-bold tracking-widest text-noro-gold uppercase">NORO Core</div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight mb-8 leading-tight">
                        O CRM/ERP inteligente criado para a <span className="text-transparent bg-clip-text bg-gradient-to-r from-noro-turquoise to-noro-purple-light">realidade das agências de turismo</span>
                    </h1>
                </div>

                <div className="space-y-12">
                    {/* Problem Statement */}
                    <Card variant="glass" className="p-8 md:p-12">
                        <p className="text-xl text-white leading-relaxed mb-6 font-medium">
                            Agências de turismo não falham por falta de vendas. <br />
                            <span className="text-noro-turquoise">Elas falham por falta de estrutura.</span>
                        </p>
                        <p className="text-noro-text-secondary text-lg leading-relaxed mb-6">
                            Leads espalhados, orçamentos perdidos no WhatsApp, tarefas sem dono, controle financeiro frágil, múltiplas ferramentas que não conversam entre si. O resultado é retrabalho, perda de margem e decisões tomadas no escuro.
                        </p>
                        <div className="border-l-4 border-noro-gold pl-6 py-2">
                            <p className="text-xl font-bold text-white italic">
                                "O NORO Core nasceu para resolver exatamente isso."
                            </p>
                        </div>
                    </Card>

                    {/* One System */}
                    <Card variant="default" className="bg-noro-dark/50 p-8 md:p-12 border-noro-gray-future/30">
                        <h2 className="text-3xl font-bold text-white mb-6">Um sistema. Toda a operação.</h2>
                        <p className="text-noro-text-secondary text-lg leading-relaxed mb-6">
                            O NORO Core é uma plataforma integrada de CRM + ERP inteligente, desenvolvida especificamente para agências de turismo que querem crescer com controle, clareza e previsibilidade.
                        </p>
                        <p className="text-noro-text-secondary text-lg leading-relaxed mb-6">
                            Ele centraliza comercial, vendas, financeiro, marketing e inteligência artificial em um único ambiente — simples de usar, poderoso por trás.
                        </p>
                        <div className="flex items-center gap-4 text-white font-medium bg-white/5 p-4 rounded-xl">
                            <span className="text-noro-gold text-2xl">⚠</span>
                            <p>Não é um software genérico adaptado ao turismo. <br /><span className="text-noro-text-muted text-sm font-normal">Ele foi pensado desde o início para esse setor.</span></p>
                        </div>
                    </Card>

                    {/* CRM Real Cycle */}
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">CRM que entende o ciclo real de vendas da agência</h2>
                            <p className="text-noro-text-secondary text-lg leading-relaxed mb-6">
                                No NORO Core, o CRM não é só um cadastro de contatos. Ele acompanha o fluxo completo da relação com o cliente.
                            </p>
                            <ul className="space-y-3">
                                {[
                                    "Gestão de leads, clientes e histórico de interações",
                                    "Central de comunicação integrada",
                                    "Tarefas e agenda conectadas à operação",
                                    "Visão clara do funil comercial"
                                ].map(item => (
                                    <li key={item} className="flex items-start gap-3 text-white">
                                        <span className="text-noro-turquoise mt-1">✓</span> {item}
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-6 text-noro-text-muted italic">
                                "Tudo organizado para que nenhum contato se perca e nenhuma oportunidade dependa apenas da memória do agente."
                            </p>
                        </div>
                        <Card variant="bordered" className="flex flex-col justify-center bg-noro-dark/30">
                            <div className="text-center">
                                <h3 className="text-2xl font-bold text-white mb-4">Orçamentos, pedidos e financeiro no mesmo lugar</h3>
                                <p className="text-noro-text-secondary mb-6">
                                    A venda não termina no “ok do cliente”. E o NORO sabe disso.
                                </p>
                                <ul className="text-left space-y-2 inline-block">
                                    <li className="text-white">🔹 Orçamentos e propostas</li>
                                    <li className="text-white">🔹 Pedidos de venda</li>
                                    <li className="text-white">🔹 Controle de contas a pagar e a receber</li>
                                    <li className="text-white">🔹 Visão financeira conectada à operação</li>
                                </ul>
                                <p className="mt-8 text-lg font-bold text-noro-turquoise">
                                    Sem planilhas paralelas. <br />
                                    Sem surpresas no fim do mês.
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* AI Integration */}
                    <Card variant="glass" className="p-8 md:p-12 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                            <div className="text-9xl">✨</div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-6">Inteligência Artificial integrada ao dia a dia</h2>
                        <p className="text-noro-text-secondary text-lg leading-relaxed mb-6">
                            O NORO Core não usa IA como enfeite. Ela está dentro do fluxo operacional.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4 mb-8">
                            {[
                                "Geração de conteúdos, textos e materiais",
                                "Apoio à criação de propostas e comunicações",
                                "Controle transparente de custos de IA e consumo de tokens",
                                "Inteligência aplicada onde gera ganho real de tempo"
                            ].map((item, i) => (
                                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
                                    <p className="text-white text-sm">{item}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-white font-medium text-lg text-center">IA como ferramenta de produtividade — não como risco financeiro invisível.</p>
                    </Card>

                    {/* Marketing & Content */}
                    <section className="grid md:grid-cols-2 gap-8 items-center border-t border-white/10 pt-12">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">Marketing, conteúdo e social integrados</h2>
                            <p className="text-noro-text-secondary text-lg mb-6">
                                Agências modernas precisam produzir conteúdo, comunicar e se posicionar.
                            </p>
                            <p className="text-noro-text-secondary text-lg mb-6">
                                No NORO Core, você encontra gestão de campanhas, organização de ativos digitais e integração com canais sociais, tudo conectado ao CRM.
                            </p>
                            <p className="font-bold text-noro-turquoise text-lg">Marketing deixa de ser algo solto e passa a fazer parte da estratégia comercial.</p>
                        </div>
                        <div className="space-y-6">
                            <div className="bg-noro-dark/50 p-6 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-2">Relatórios, dados e decisões claras</h3>
                                <p className="text-noro-text-muted mb-4">O NORO Core transforma operação em informação estratégica.</p>
                                <div className="flex flex-wrap gap-2">
                                    {["Relatórios e analytics", "Visão consolidada", "Indicadores reais", "Dados confiáveis"].map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-noro-turquoise/10 text-noro-turquoise rounded-full text-xs font-bold uppercase">{tag}</span>
                                    ))}
                                </div>
                                <p className="mt-4 text-right font-bold text-white">Menos “achismo”. Mais visão.</p>
                            </div>

                            <div className="bg-noro-dark/50 p-6 rounded-2xl border border-white/5">
                                <h3 className="text-xl font-bold text-white mb-2">Multiusuário, multiempresa, sob controle</h3>
                                <p className="text-noro-text-muted">
                                    Configurações por tenant, preferências por usuário, idioma, moeda, controle de acesso e governança.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Invisible / Essential */}
                    <div className="text-center py-12 bg-noro-gold/5 rounded-3xl border border-noro-gold/20">
                        <h2 className="text-3xl font-bold text-white mb-4">Invisível para o cliente final. Essencial para a agência.</h2>
                        <p className="text-lg text-noro-text-secondary max-w-2xl mx-auto mb-8">
                            O viajante não vê o NORO. Ele sente. Sente quando a agência responde rápido, entrega com clareza, evita erros e transmite confiança.
                        </p>
                        <p className="text-noro-gold font-bold text-xl uppercase tracking-widest">O NORO trabalha nos bastidores para que a experiência final seja impecável.</p>
                    </div>

                    {/* Target Audience List */}
                    <section>
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">Feito para agências que querem crescer</h2>
                        <div className="grid sm:grid-cols-4 gap-4">
                            {[
                                "Já ultrapassaram o limite das planilhas",
                                "Querem profissionalizar a gestão",
                                "Operam múltiplos fluxos e serviços",
                                "Buscam escala sem perder controle"
                            ].map((item, i) => (
                                <Card key={i} variant="default" className="p-6 bg-white/5 border-white/5 text-center flex items-center justify-center h-full">
                                    <p className="text-white font-medium">{item}</p>
                                </Card>
                            ))}
                        </div>
                    </section>
                </div>

                {/* Footer CTA */}
                <div className="text-center mt-20">
                    <div className="mb-8">
                        <h2 className="font-display text-4xl font-bold text-white mb-2">NORO Core</h2>
                        <p className="text-xl text-noro-turquoise">CRM e ERP inteligente para o turismo moderno.</p>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/contact">
                            <Button variant="primary" size="lg" className="shadow-[0_0_20px_#D4AF37]">
                                Agendar Demonstração
                            </Button>
                        </Link>
                        <Link href="/pricing">
                            <Button variant="secondary" size="lg">
                                Ver Planos
                            </Button>
                        </Link>
                    </div>
                    <p className="mt-6 text-sm text-noro-text-secondary">
                        Ele não substitui o agente. Ele organiza o negócio para o agente vender melhor.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CrmErpPage;
