import { Info, ArrowLeft, BrainCircuit, Zap, ShieldCheck, Heart } from 'lucide-react';
import Link from 'next/link';

export default function SobreNoroPage() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0';
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#0f1025] text-white selection:bg-blue-500/30">
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20">

        {/* Navigation */}
        <div className="flex items-center justify-between mb-16 animate-fade-in-down">
          <Link
            href="/"
            className="group flex items-center gap-2 text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm border border-white/5"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-medium">Voltar para o Painel</span>
          </Link>
          <div className="text-xs font-bold tracking-widest uppercase text-slate-500 bg-white/5 px-3 py-1 rounded-md border border-white/5">
            Versão {version}
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-24 animate-fade-in-up">
          <div className="inline-flex items-center justify-center p-3 mb-6 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
            <BrainCircuit size={40} className="text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
              NORO
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            O cérebro digital do agente de viagens moderno.
          </p>
        </div>

        {/* Content Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {/* Main Philosophy Card */}
          <div className="md:col-span-2 bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl p-8 md:p-10 backdrop-blur-md">
            <h2 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Por que Noro existe?
            </h2>
            <p className="text-lg text-slate-300 leading-relaxed mb-6">
              Ser agente independente é liberdade, mas também exige gestão eficiente, visão completa e decisões rápidas.
              <span className="text-white font-medium"> Noro resolve isso.</span>
            </p>
            <p className="text-slate-400 leading-relaxed">
              Noro nasceu da ideia de que a vida do agente de viagens independente pode — e deve — ser mais simples, rápida e inteligente.
              É muito mais do que um CRM ou ERP: é o cérebro digital que organiza, conecta e potencializa cada operação, cada cliente e cada oportunidade.
            </p>
          </div>

          {/* Features Grid */}
          <div className="p-8 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors border-l-4 border-l-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-blue-400" size={24} />
              <h3 className="text-xl font-bold text-white">Inteligência Prática</h3>
            </div>
            <p className="text-slate-400">
              Organiza contatos, vendas, passeios e reservas sem complicação. Você decide como trabalhar, o sistema se adapta ao seu fluxo.
            </p>
          </div>

          <div className="p-8 bg-white/[0.03] border border-white/5 rounded-2xl hover:bg-white/[0.05] transition-colors border-l-4 border-l-purple-500">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-purple-400" size={24} />
              <h3 className="text-xl font-bold text-white">Autonomia Real</h3>
            </div>
            <p className="text-slate-400">
              Tecnologia premium sem pesar no bolso. Um app ágil, moderno e seguro, feito para estar na palma da sua mão.
            </p>
          </div>
        </div>

        {/* Quote Section */}
        <div className="relative p-10 md:p-14 rounded-3xl bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-white/10 text-center overflow-hidden mb-20 group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
          <div className="relative z-10">
            <Heart size={32} className="mx-auto text-pink-500/70 mb-6 group-hover:scale-110 transition-transform duration-300" />
            <blockquote className="text-2xl md:text-3xl font-medium text-white mb-6 leading-relaxed">
              &ldquo;Noro pensa como você, mas mais rápido. Você faz negócios, Noro faz o resto.&rdquo;
            </blockquote>
            <cite className="text-slate-400 not-italic uppercase tracking-widest text-sm font-semibold">
              Filosofia .guru
            </cite>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center border-t border-white/10 pt-10">
          <p className="text-slate-500 text-sm">
            &copy; {currentYear} Noro Tecnologia. Todos os direitos reservados.
          </p>
        </footer>

      </div>


    </div>
  );
}