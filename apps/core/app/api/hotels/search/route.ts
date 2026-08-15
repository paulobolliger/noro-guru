import { NextRequest, NextResponse } from 'next/server';
import { HotelAggregatorService } from '@noro/lib';

const aggregator = new HotelAggregatorService();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      hid,
      hotelIds,
      checkin,
      checkout,
      residency = 'br',
      guests = [{ adults: 2, children: [] }],
      exchangeRate = 5.60,
      tenantMarkup = 12.0,
    } = body;

    if (!checkin || !checkout) {
      return NextResponse.json(
        { error: 'checkin and checkout dates are required' },
        { status: 400 }
      );
    }

    const result = await aggregator.searchAndAggregate(
      {
        hid: hid ? Number(hid) : undefined,
        hotelIds,
        checkin,
        checkout,
        residency,
        guests,
      },
      {
        exchangeRateUsdToBrl: Number(exchangeRate),
        tenantMarkupPercent: Number(tenantMarkup),
      }
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    console.error('[API /hotels/search Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to aggregate hotel rates' },
      { status: 500 }
    );
  }
}
