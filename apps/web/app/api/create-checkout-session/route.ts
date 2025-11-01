import { NextRequest, NextResponse } from 'next/server';

// Mapeamento de planos para preços do Stripe
const PRICE_IDS = {
  starter: {
    monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY,
    annual: process.env.STRIPE_PRICE_STARTER_ANNUAL,
  },
  professional: {
    monthly: process.env.STRIPE_PRICE_PROFESSIONAL_MONTHLY,
    annual: process.env.STRIPE_PRICE_PROFESSIONAL_ANNUAL,
  },
};

export async function POST(req: NextRequest) {
  try {
    const { planId, billingPeriod } = await req.json();

    // Validação
    if (!planId || !billingPeriod) {
      return NextResponse.json(
        { error: 'Plano e período de cobrança são obrigatórios' },
        { status: 400 }
      );
    }

    // Para plano Enterprise, redirecionar para contato
    if (planId === 'enterprise') {
      return NextResponse.json({ url: '/contact' });
    }

    // Obter o price_id do Stripe
    const priceId = PRICE_IDS[planId as keyof typeof PRICE_IDS]?.[billingPeriod as 'monthly' | 'annual'];

    if (!priceId) {
      return NextResponse.json(
        { error: 'Plano não encontrado' },
        { status: 404 }
      );
    }

    // TODO: Criar sessão do Stripe Checkout
    // Isso requer integração com o módulo /billing
    // Por enquanto, retornar URL de exemplo
    
    /*
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
    */

    // Por enquanto, retornar mensagem de desenvolvimento
    return NextResponse.json({
      message: 'Checkout em desenvolvimento. Integração com Stripe será ativada em breve.',
      url: '/pricing',
    });

  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    return NextResponse.json(
      { error: 'Erro ao processar checkout' },
      { status: 500 }
    );
  }
}