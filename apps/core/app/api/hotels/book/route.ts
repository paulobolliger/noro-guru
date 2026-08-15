import { NextRequest, NextResponse } from 'next/server';
import { RateHawkProvider, LiteApiHotelProvider } from '@noro/lib';

const rateHawkProvider = new RateHawkProvider();
const liteApiProvider = new LiteApiHotelProvider();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      supplierId = 'ratehawk',
      partnerOrderId,
      bookHash,
      userEmail,
      userPhone,
      rooms,
    } = body;

    if (!partnerOrderId || !bookHash || !userEmail || !rooms) {
      return NextResponse.json(
        { error: 'Missing required booking fields (partnerOrderId, bookHash, userEmail, rooms)' },
        { status: 400 }
      );
    }

    let bookingResponse;

    if (supplierId === 'liteapi') {
      bookingResponse = await liteApiProvider.createBooking({
        partnerOrderId,
        bookHash,
        userEmail,
        userPhone: userPhone || '+5511999999999',
        rooms,
      });
    } else {
      bookingResponse = await rateHawkProvider.createBooking({
        partnerOrderId,
        bookHash,
        userEmail,
        userPhone: userPhone || '+5511999999999',
        rooms,
      });
    }

    return NextResponse.json({
      success: true,
      data: bookingResponse,
    });
  } catch (error: any) {
    console.error('[API /hotels/book Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to complete hotel booking' },
      { status: 500 }
    );
  }
}
