import React from 'react';

const TermsOfServicePage = () => {
    return (
        <div className="container mx-auto px-6 py-20 md:py-28 text-noro-accent/80">
            <div className="max-w-4xl mx-auto bg-noro-dark-2/50 border border-noro-dark-2 rounded-xl p-8 md:p-12">
                <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-8">Termos de Serviço</h1>
                
                <div className="space-y-6 prose prose-invert max-w-none">
                    <p>Última atualização: {new Date().toLocaleDateString()}</p>

                    <h2 className="text-2xl font-bold text-white">1. Acordo com os Termos</h2>
                    <p>
                        Ao acessar nosso site, você concorda em ficar vinculado por estes Termos de Serviço, todas as leis e regulamentos aplicáveis, e concorda que é responsável pelo cumprimento de quaisquer leis locais aplicáveis. Se você não concordar com algum destes termos, está proibido de usar ou acessar este site.
                    </p>

                    <h2 className="text-2xl font-bold text-white">2. Licença de Uso</h2>
                    <p>
                        É concedida permissão para baixar temporariamente uma cópia dos materiais (informações ou software) no site da NORO, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título, e sob esta licença você não pode:
                        <ul>
                            <li>modificar ou copiar os materiais;</li>
                            <li>usar os materiais para qualquer finalidade comercial ou para qualquer exibição pública (comercial ou não comercial);</li>
                            <li>tentar descompilar ou fazer engenharia reversa de qualquer software contido no site da NORO;</li>
                            <li>remover quaisquer direitos autorais ou outras notações de propriedade dos materiais; ou</li>
                            <li>transferir os materiais para outra pessoa ou 'espelhar' os materiais em qualquer outro servidor.</li>
                        </ul>
                    </p>

                    <h2 className="text-2xl font-bold text-white">3. Limitações</h2>
                    <p>
                        Em nenhum caso a NORO ou seus fornecedores serão responsáveis por quaisquer danos (incluindo, sem limitação, danos por perda de dados ou lucro, ou devido a interrupção dos negócios) decorrentes do uso ou da incapacidade de usar os materiais no site da NORO, mesmo que a NORO ou um representante autorizado da NORO tenha sido notificado oralmente ou por escrito da possibilidade de tais danos.
                    </p>
                    
                    <p>
                        Se tiver alguma dúvida sobre estes termos, entre em contato conosco.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
