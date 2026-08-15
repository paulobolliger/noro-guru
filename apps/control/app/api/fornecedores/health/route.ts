import { NextResponse } from 'next/server';
import { HotelAggregatorService } from '@noro/lib';

const aggregator = new HotelAggregatorService();

export async function GET() {
  try {
    const healthResults = await aggregator.checkAllSuppliersHealth();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      suppliers: healthResults,
    });
  } catch (error: any) {
    console.error('[API /fornecedores/health Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to check supplier health' },
      { status: 500 }
    );
  }
}
