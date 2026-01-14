import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import NoroLogo from '@/components/icons/NoroLogo';

const AboutPage = () => {
    return (
        <div className="container mx-auto px-6 py-20 md:py-28 text-noro-accent/80 relative z-10">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-16">
                    <div className="relative inline-block mb-8">
                        <div className="absolute inset-0 bg-noro-turquoise/20 blur-3xl rounded-full"></div>
                        <NoroLogo className="w-24 h-24 relative z-10 opacity-90" />
                    </div>
                    <div className="mb-2 font-display text-2xl font-bold tracking-widest text-noro-gold uppercase">NORO</div>
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight mb-8 leading-tight">
                        Tecnologia inteligente para <span className="text-noro-turquoise">agências de turismo</span> que querem crescer com controle
                    </h1>
                </div>

                <div className="space-y-12">
                    {/* Intro */}
                    <Card variant="glass" className="p-8 md:p-12">
                        <p className="text-xl text-white leading-relaxed mb-6">
                            A NORO nasceu dentro do turismo — e por isso entende o que softwares genéricos nunca entenderam:
                            <span className="text-noro-turquoise font-bold"> a complexidade real da operação de uma agência de viagens.</span>
                        </p>
                        <p className="text-noro-text-secondary text-lg leading-relaxed">
                            Cotações, fornecedores, comissões, prazos, documentos, clientes, múltiplos canais de venda, integrações externas e decisões rápidas. Quando tudo isso cresce sem estrutura, o resultado é retrabalho, perda de margem e risco operacional.
                        </p>
                        <div className="mt-8 border-l-4 border-noro-gold pl-6 py-2">
                            <p className="text-xl font-bold text-white italic">
                                "A NORO existe para colocar ordem inteligente na operação turística, sem engessar o negócio."
                            </p>
                        </div>
                    </Card>

                    {/* Brain Section */}
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-6">Um cérebro para agências que operam de verdade</h2>
                            <p className="text-noro-text-secondary text-lg leading-relaxed mb-6">
                                A NORO funciona como um <strong>control plane</strong> especializado em turismo, desenhado para centralizar e orquestrar tudo o que acontece no dia a dia de uma agência.
                            </p>
                            <p className="text-noro-text-secondary text-lg leading-relaxed">
                                Ela conecta dados, processos, automações e inteligência artificial em um único núcleo, permitindo que a agência:
                            </p>
                            <ul className="mt-4 space-y-2">
                                <li className="flex items-center gap-2 text-white font-medium"><span className="text-noro-turquoise">✓</span> Opere com clareza</li>
                                <li className="flex items-center gap-2 text-white font-medium"><span className="text-noro-turquoise">✓</span> Escale com segurança</li>
                                <li className="flex items-center gap-2 text-white font-medium"><span className="text-noro-turquoise">✓</span> Mantenha controle total da operação</li>
                            </ul>
                        </div>
                        <Card variant="bordered" className="bg-noro-dark/50">
                            <p className="text-center text-lg font-medium text-white">
                                "Cada marca, produto ou frente de atuação mantém sua identidade e experiência própria. <br />
                                <span className="text-noro-turquoise text-xl block mt-2">A NORO cuida do que está por trás."</span>
                            </p>
                        </Card>
                    </div>

                    {/* Features List */}
                    <section>
                        <h2 className="text-3xl font-bold text-white mb-8 text-center">O que a NORO faz, na prática</h2>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {[
                                "Centraliza clientes, leads, propostas e vendas",
                                "Organiza cotações, fornecedores, comissões e prazos",
                                "Automatiza fluxos comerciais, operacionais e administrativos",
                                "Integra plataformas de turismo, seguros, vistos e pagamentos",
                                "Conecta inteligência artificial aos processos da agência",
                                "Garante rastreabilidade, governança e visão estratégica"
                            ].map((item, i) => (
                                <Card key={i} variant="default" className="p-6 bg-white/5 border-white/5 hover:bg-white/10 transition-colors">
                                    <p className="text-white font-medium">{item}</p>
                                </Card>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <p className="text-2xl font-bold text-noro-gold">
                                Menos improviso. Menos planilha.<br />
                                Mais margem, controle e previsibilidade.
                            </p>
                        </div>
                    </section>

                    {/* Invisible / Essential */}
                    <Card variant="glass" className="p-10 text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">Invisível para o viajante. Essencial para a agência.</h2>
                        <p className="text-lg text-noro-text-secondary max-w-2xl mx-auto mb-8">
                            A NORO não aparece para o cliente final. Ela trabalha nos bastidores, garantindo que a experiência entregue pela agência seja fluida, profissional e confiável.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 md:gap-12 text-xl font-bold text-noro-turquoise">
                            <span>Organiza</span> • <span>Conecta</span> • <span>Automatiza</span> • <span>Aprende</span>
                        </div>
                        <p className="mt-6 text-white text-sm uppercase tracking-widest font-bold">Tudo no tempo certo.</p>
                    </Card>

                    {/* Target Audience */}
                    <section className="bg-noro-gold/10 rounded-3xl p-10 md:p-14 border border-noro-gold/20">
                        <h2 className="text-3xl font-bold text-white mb-8">Feita para agências que querem escalar</h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <p className="text-white text-lg mb-4">A NORO é para agências de turismo que:</p>
                                <ul className="space-y-3">
                                    {["Já ultrapassaram o limite das planilhas", "Operam múltiplos fornecedores e canais", "Querem crescer sem perder controle", "Buscam profissionalizar a gestão sem burocracia"].map(item => (
                                        <li key={item} className="flex items-start gap-3 text-noro-text-secondary">
                                            <span className="text-noro-gold mt-1">➜</span> {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex items-center justify-center border-l border-white/10 pl-8">
                                <p className="text-2xl font-bold text-white text-center">
                                    Ela não substitui o agente.<br />
                                    <span className="text-noro-gold">Ela potencializa a agência.</span>
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Conclusion - Infrastructure */}
                    <div className="text-center space-y-6 pt-8">
                        <h2 className="text-4xl font-bold text-white">NORO é infraestrutura para o turismo moderno</h2>
                        <div className="flex justify-center gap-8 text-noro-text-muted text-lg">
                            <span className="line-through decoration-red-500/50">Não é um CRM genérico</span>
                            <span className="line-through decoration-red-500/50">Não é um ERP engessado</span>
                        </div>
                        <p className="text-xl text-noro-text-secondary max-w-3xl mx-auto">
                            A NORO é uma infraestrutura estratégica, construída para evoluir junto com o negócio — conectando operação, inteligência e decisão em um único sistema coerente.
                        </p>
                        <div className="pt-8">
                            <p className="text-lg font-medium text-white mb-8">
                                Porque no turismo, crescer sem estrutura custa caro.<br />
                                <span className="text-noro-turquoise">E estruturar sem entender o setor custa ainda mais.</span>
                            </p>
                            <Link href="/contact">
                                <Button variant="primary" size="lg" className="shadow-[0_0_20px_#D4AF37]">
                                    Conheça a NORO
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
