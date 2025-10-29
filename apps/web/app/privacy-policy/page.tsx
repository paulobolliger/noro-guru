import React from 'react';

const PrivacyPolicyPage = () => {
    return (
        <div className="container mx-auto px-6 py-20 md:py-28 text-noro-accent/80">
            <div className="max-w-4xl mx-auto bg-noro-dark-2/50 border border-noro-dark-2 rounded-xl p-8 md:p-12">
                <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-8">Política de Privacidade</h1>
                
                <div className="space-y-6 prose prose-invert max-w-none">
                    <p>Última atualização: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-2xl font-bold text-white">1. Introdução</h2>
                    <p>
                        Bem-vindo à NORO. Nós respeitamos sua privacidade e estamos comprometidos em proteger seus dados pessoais. Esta política de privacidade informará como cuidamos dos seus dados pessoais quando você visita nosso site e informa sobre seus direitos de privacidade e como a lei o protege.
                    </p>

                    <h2 className="text-2xl font-bold text-white">2. Dados que Coletamos</h2>
                    <p>
                        Podemos coletar, usar, armazenar e transferir diferentes tipos de dados pessoais sobre você, que agrupamos da seguinte forma:
                        <ul>
                            <li><strong>Dados de Identidade:</strong> Inclui nome, sobrenome, nome de usuário ou identificador semelhante.</li>
                            <li><strong>Dados de Contato:</strong> Inclui endereço de e-mail e números de telefone.</li>
                            <li><strong>Dados Técnicos:</strong> Inclui endereço de protocolo da Internet (IP), seus dados de login, tipo e versão do navegador, configuração e localização do fuso horário, tipos e versões de plug-in do navegador, sistema operacional e plataforma e outras tecnologias nos dispositivos que você usa para acessar este site.</li>
                        </ul>
                    </p>

                    <h2 className="text-2xl font-bold text-white">3. Como Usamos Seus Dados</h2>
                    <p>
                        Usaremos seus dados pessoais apenas quando a lei nos permitir. Mais comumente, usaremos seus dados pessoais nas seguintes circunstâncias:
                        <ul>
                            <li>Onde precisamos executar o contrato que estamos prestes a celebrar ou celebramos com você.</li>
                            <li>Onde for necessário para nossos interesses legítimos (ou de terceiros) e seus interesses e direitos fundamentais não se sobreponham a esses interesses.</li>
                            <li>Onde precisamos cumprir uma obrigação legal ou regulatória.</li>
                        </ul>
                    </p>
                    
                    <p>
                        Se tiver alguma dúvida sobre esta política de privacidade, entre em contato conosco.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
