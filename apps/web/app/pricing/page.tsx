import { Metadata } from 'next';
import PricingCards from '@/components/PricingCards';
import Link from 'next/link';
import StructuredData from '@/components/StructuredData';
import { getWebPageSchema, getSoftwareApplicationSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Planos e Preços | NORO',
  description: 'Escolha o plano ideal para sua empresa. Preços transparentes e flexíveis para todos os tamanhos de negócio.',
  openGraph: {
    title: 'Planos e Preços | NORO',
    description: 'Escolha o plano ideal para sua empresa.',
  },
};

export default function PricingPage() {
  return (
    <>
      <StructuredData 
        data={[
          getWebPageSchema({
            url: 'https://noro.guru/pricing',
            title: 'Planos e Preços | NORO',
            description: 'Escolha o plano ideal para sua empresa. Preços transparentes e flexíveis para todos os tamanhos de negócio.',
          }),
          getSoftwareApplicationSchema(),
        ]} 
      />
      <div className="min-h-screen bg-[#0B1220]">
        {/* Hero Section */}
        <section className="gradient-noro-hero py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="font-extrabold text-4xl md:text-6xl text-white tracking-wide mb-6">
            Planos que crescem com você
          </h1>
          <p className="text-xl text-[#E0E3FF] max-w-3xl mx-auto mb-8">
            Escolha o plano ideal para o seu negócio. Sem surpresas, sem taxas ocultas.
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-[#B8C1E0]">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#1DD3C0]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Teste grátis por 14 dias</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#1DD3C0]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-[#1DD3C0]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Suporte prioritário</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6">
          <PricingCards />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#2E2E3A]/30">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
            Perguntas Frequentes
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            <details className="bg-[#0B1220]/80 rounded-2xl p-6 border border-[#1DD3C0]/20">
              <summary className="text-lg font-semibold text-white cursor-pointer">
                Posso trocar de plano a qualquer momento?
              </summary>
              <p className="mt-4 text-[#B8C1E0]">
                Sim! Você pode fazer upgrade ou downgrade do seu plano a qualquer momento. As alterações são aplicadas imediatamente e o valor é ajustado proporcionalmente.
              </p>
            </details>
            
            <details className="bg-[#0B1220]/80 rounded-2xl p-6 border border-[#1DD3C0]/20">
              <summary className="text-lg font-semibold text-white cursor-pointer">
                O que acontece após o período de teste?
              </summary>
              <p className="mt-4 text-[#B8C1E0]">
                Após os 14 dias de teste gratuito, você será cobrado automaticamente de acordo com o plano escolhido. Você pode cancelar a qualquer momento durante o período de teste sem nenhum custo.
              </p>
            </details>
            
            <details className="bg-[#0B1220]/80 rounded-2xl p-6 border border-[#1DD3C0]/20">
              <summary className="text-lg font-semibold text-white cursor-pointer">
                Quais formas de pagamento são aceitas?
              </summary>
              <p className="mt-4 text-[#B8C1E0]">
                Aceitamos todas as principais bandeiras de cartão de crédito (Visa, Mastercard, American Express) e PIX. Os pagamentos são processados de forma segura através do Stripe.
              </p>
            </details>
            
            <details className="bg-[#0B1220]/80 rounded-2xl p-6 border border-[#1DD3C0]/20">
              <summary className="text-lg font-semibold text-white cursor-pointer">
                Há desconto para pagamento anual?
              </summary>
              <p className="mt-4 text-[#B8C1E0]">
                Sim! Ao optar pelo plano anual, você economiza até 20% em comparação com o pagamento mensal. Entre em contato para planos empresariais customizados.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ainda tem dúvidas?
          </h2>
          <p className="text-xl text-[#E0E3FF] mb-8 max-w-2xl mx-auto">
            Nossa equipe está pronta para ajudar você a escolher o melhor plano para o seu negócio.
          </p>
          <Link 
            href="/contact"
            className="inline-block btn-noro-secondary font-semibold py-4 px-10 rounded-2xl text-lg"
          >
            Fale com um especialista
          </Link>
        </div>
      </section>
    </div>
    </>
  );
}
