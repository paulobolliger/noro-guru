import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contato | NORO',
  description: 'Entre em contato com a equipe NORO. Estamos prontos para ajudar você a transformar seu negócio.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#0B1220]">
      {/* Hero Section */}
      <section className="gradient-noro-hero py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-extrabold text-4xl md:text-6xl text-white tracking-wide mb-6">
              Vamos conversar?
            </h1>
            <p className="text-xl text-[#E0E3FF] mb-8">
              Nossa equipe está pronta para entender suas necessidades e apresentar as melhores soluções.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form + Info */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Formulário */}
            <div>
              <ContactForm />
            </div>

            {/* Informações de Contato */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-white mb-6">
                  Outras formas de contato
                </h2>
                <p className="text-[#B8C1E0] mb-8">
                  Escolha a melhor forma de se conectar com nossa equipe.
                </p>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 p-6 bg-[#2E2E3A]/30 rounded-2xl border border-[#1DD3C0]/20 hover:border-[#1DD3C0]/40 transition-colors">
                <div className="bg-[#1DD3C0]/10 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-[#1DD3C0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Email</h3>
                  <a href="mailto:contato@noro.guru" className="text-[#1DD3C0] hover:underline">
                    contato@noro.guru
                  </a>
                  <p className="text-[#B8C1E0] text-sm mt-1">
                    Respondemos em até 24h úteis
                  </p>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4 p-6 bg-[#2E2E3A]/30 rounded-2xl border border-[#1DD3C0]/20 hover:border-[#1DD3C0]/40 transition-colors">
                <div className="bg-[#1DD3C0]/10 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-[#1DD3C0]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">WhatsApp</h3>
                  <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer" className="text-[#1DD3C0] hover:underline">
                    +55 (11) 99999-9999
                  </a>
                  <p className="text-[#B8C1E0] text-sm mt-1">
                    Seg-Sex, 9h às 18h
                  </p>
                </div>
              </div>

              {/* Endereço */}
              <div className="flex items-start gap-4 p-6 bg-[#2E2E3A]/30 rounded-2xl border border-[#1DD3C0]/20">
                <div className="bg-[#1DD3C0]/10 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-[#1DD3C0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white font-bold mb-1">Escritório</h3>
                  <p className="text-[#B8C1E0]">
                    São Paulo, SP<br />
                    Brasil
                  </p>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="mt-8 p-6 bg-gradient-to-br from-[#342CA4]/10 to-[#1DD3C0]/10 rounded-2xl border border-[#1DD3C0]/30">
                <h3 className="text-white font-bold mb-2">Perguntas Frequentes</h3>
                <p className="text-[#B8C1E0] mb-4">
                  Talvez sua dúvida já esteja respondida.
                </p>
                <Link 
                  href="/pricing#faq"
                  className="inline-flex items-center text-[#1DD3C0] hover:underline font-semibold"
                >
                  Ver FAQ
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
