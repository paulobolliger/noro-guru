import { NextRequest, NextResponse } from 'next/server';

// Redireciona todas as requisições de webhook para o Control Plane
export async function POST(req: NextRequest) {
  const controlPlaneUrl = process.env.CONTROL_PLANE_URL || 'http://localhost:3000';
  
  try {
    const response = await fetch(`${controlPlaneUrl}/api/webhooks/stripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'stripe-signature': req.headers.get('stripe-signature') || '',
      },
      body: await req.text()
    });

    // Se a resposta não for ok, retorna o erro original do Control Plane
    if (!response.ok) {
      const error = await response.text();
      return new NextResponse(error, { status: response.status });
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error forwarding webhook:', error);
    return new NextResponse('Webhook forwarding failed', { status: 500 });
  }
}