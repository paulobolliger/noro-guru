import { NextRequest, NextResponse } from 'next/server';
import { CieloService } from '@/lib/cielo';

export async function POST(req: NextRequest) {
  try {
    await req.json();
    
    const cieloService = new CieloService({
      merchantId: process.env.CIELO_MERCHANT_ID!,
      merchantKey: process.env.CIELO_MERCHANT_KEY!,
      sandbox: process.env.NODE_ENV !== 'production'
    });

    void cieloService;

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error('Error processing Cielo webhook:', error);
    return new NextResponse('Webhook handler failed', { status: 500 });
  }
}
