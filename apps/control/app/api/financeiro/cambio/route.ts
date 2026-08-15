import { NextResponse } from 'next/server';
import { getAllLockedRates, updateAndLockDailyRates, fetchLivePtaxRates } from '@noro/lib';

export async function GET() {
  try {
    const lockedRates = getAllLockedRates();
    const liveRates = await fetchLivePtaxRates();
    return NextResponse.json({
      success: true,
      lockedRates,
      liveRates,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { spreads } = body;
    const updatedRates = await updateAndLockDailyRates(spreads);
    return NextResponse.json({
      success: true,
      lockedRates: updatedRates,
      message: 'Cotação PTAX atualizada e travada com sucesso para o dia!',
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
