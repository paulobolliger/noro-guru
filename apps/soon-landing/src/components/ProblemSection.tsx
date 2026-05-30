import React from 'react';
import { motion } from 'motion/react';
import { AlertCircle, Smartphone, ArrowRight, RefreshCw, Layers, FileX, Globe, Calendar } from 'lucide-react';

export default function ProblemSection() {
  const painPoints = [
    {
      icon: <Layers className="w-5 h-5 text-red-400" />,
      title: 'Ferramentas Totalmente Desconectadas',
      description: 'Hoje você salta do WhatsApp Web para planilhas de clientes, depois para o e-mail, e por fim digita tudo em sistemas legados sem integração nenhuma.',
      tag: 'Caos Operacional',
      statText: 'Média de 4 ferramentas por venda'
    },
    {
      icon: <RefreshCw className="w-5 h-5 text-red-400" />,
      title: 'Controle de Margem e Câmbio manual',
      description: 'Calcular flutuação de moedas no papel ou no Excel traz risco de prejuízo a cada venda de pacote internacional. Margens desprotegidas em segundos.',
      tag: 'Risco Financeiro',
      statText: 'Erros custam até 15% da margem'
    },
    {
      icon: <FileX className="w-5 h-5 text-red-400" />,
      title: 'Roteiros e Propostas do absoluto Zero',
      description: 'Cada cliente exige horas pesquisando passeios, hotéis e voos para criar um PDF longo. Sem catálogo reaproveitável, o trabalho é repetitivo e lento.',
      tag: 'Ineficiência Temporal',
      statText: '2 a 3 horas gastas por orçamento'
    },
    {
      icon: <Globe className="w-5 h-5 text-red-400" />,
      title: 'Sem Canal de Vendas Escrito ou Online',
      description: 'Ou você paga mensalidades absurdas por um site corporativo desatualizado ou não tem presença digital para fechar pacotes online de forma autônoma.',
      tag: 'Baixa Conversão',
      statText: '72% dos clientes pedem site para confiar'
    }
  ];

  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('waitlist-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section className="py-20 bg-noro-dark relative" id="problems-section">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-noro-purple/30 to-transparent" />
      
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider font-mono mb-4">
            <AlertCircle className="w-3.5 h-3.5" /> O Diagnóstico das Agências
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tighter mb-4 leading-[1.15]">
            O status quo que está destruindo sua margem.
          </h2>
          
          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Profissionais e agências de turismo gastam mais tempo brigando com planilhas e softwares antigos do que fechando novos roteiros de sonhos.
          </p>
        </div>

        {/* Pain points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {painPoints.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-noro-dark-elevated/30 border border-noro-purple/15 p-6 rounded-xl hover:border-red-500/30 transition-all flex flex-col justify-between relative group"
            >
              {/* Corner Tag */}
              <div className="absolute top-4 right-4 text-[9px] font-mono font-bold tracking-wider uppercase text-red-400 bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                {item.tag}
              </div>

              <div>
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2 tracking-tight group-hover:text-red-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Stat footer */}
              <div className="pt-4 border-t border-noro-purple/10 flex items-center justify-between text-xs font-mono font-medium text-gray-500">
                <span className="text-red-400/80">{item.statText}</span>
                <span className="flex items-center gap-1 text-[10px]">VERIFICADO 100%</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mini CTA banner leading to solution */}
        <div className="bg-gradient-to-r from-noro-purple-deep/30 to-noro-dark-card/50 border border-noro-purple/20 p-6 md:p-8 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h4 className="text-base font-bold text-white tracking-tight mb-1">
              Quer parar de perder tempo com tarefas repetitivas hoje mesmo?
            </h4>
            <p className="text-xs text-gray-400">
              O Noro Guru consolida tudo em um único ambiente integrado guiado por inteligência artificial.
            </p>
          </div>
          
          <button
            onClick={scrollToForm}
            className="group flex items-center gap-1.5 text-xs font-bold text-noro-teal hover:text-white bg-noro-teal/10 hover:bg-noro-teal border border-noro-teal/30 hover:border-noro-teal py-3 px-5 rounded-lg transition-all"
            id="problems-cta"
          >
            Quero garantir minha vaga
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
}
