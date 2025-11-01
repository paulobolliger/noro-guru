import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { stripeService } from '@/lib/stripe';
import { subscriptions } from '@/lib/schema';
import { sql } from 'drizzle-orm';

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
    const session = await stripeService.stripe.checkout.sessions.retrieve(session_id, {
      expand: ['subscription']
    });

    if (!session?.metadata?.tenantId || !session?.metadata?.planId) {
      throw new Error('Dados da sessão inválidos');
    }

    // Criar assinatura
    const subscription = session.subscription as any;
    await db.insert(subscriptions).values({
      tenantId: session.metadata.tenantId,
      planId: session.metadata.planId,
      status: subscription.status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      stripeSubscriptionId: subscription.id,
      metadata: {
        stripeCustomerId: session.customer,
        stripeSessionId: session.id
      }
    });

    // Atualizar o tenant
    await db.execute(sql`
      UPDATE cp.tenants
      SET subscription_id = ${subscription.id},
          updated_at = now()
      WHERE id = ${session.metadata.tenantId}
    `);

    return (
      <div className="container max-w-lg py-20">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Assinatura criada com sucesso!
          </h1>
          <p className="text-muted-foreground">
            Sua assinatura foi confirmada e você já pode começar a usar todos os recursos.
          </p>
          <div className="mt-8">
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              Ir para o Dashboard
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
            Não foi possível processar sua assinatura. Por favor, tente novamente ou entre em contato com o suporte.
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