import { redirect } from 'next/navigation';
import { stripe } from '@/lib/stripe';

interface PageProps {
  searchParams: {
    session_id?: string;
  };
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const { session_id } = searchParams;

  if (!session_id) {
    redirect('/plans');
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (!session?.metadata?.tenantId) {
      throw new Error('Sessão Stripe sem tenantId.');
    }

    return (
      <div className="container max-w-lg py-20">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Assinatura criada com sucesso!
          </h1>
          <p className="text-muted-foreground">
            Sua assinatura foi confirmada pelo Stripe.
          </p>
          <div className="mt-8">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              Voltar para faturamento
            </a>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Erro ao processar checkout:', error);
    return (
      <div className="container max-w-lg py-20">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-red-600">
            Ocorreu um erro
          </h1>
          <p className="text-muted-foreground">
            Não foi possível confirmar a sessão do Stripe.
          </p>
          <div className="mt-8">
            <a
              href="/plans"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              Voltar para Planos
            </a>
          </div>
        </div>
      </div>
    );
  }
}
