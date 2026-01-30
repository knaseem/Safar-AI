import { NextRequest, NextResponse } from 'next/server';
import { searchHotels, getHotelOffers } from '@/lib/amadeus';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const cityCode = searchParams.get('cityCode');
    const hotelIds = searchParams.get('hotelIds');
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');
    const adults = parseInt(searchParams.get('adults') || '1');

    try {
        // If hotelIds are provided, fetch specific offers
        if (hotelIds && checkInDate && checkOutDate) {
            const offers = await getHotelOffers({
                hotelIds,
                adults,
                checkInDate,
                checkOutDate
            });

            // Apply Profit Markups
            const { applyMarkup } = await import('@/lib/pricing');
            const offersWithMarkup = offers.map((offer: any) => {
                if (offer.offers) {
                    return {
                        ...offer,
                        offers: offer.offers.map((opt: any) => ({
                            ...opt,
                            price: {
                                ...opt.price,
                                base_total: opt.price.total,
                                total: applyMarkup(opt.price.total, 'hotel').toFixed(2)
                            }
                        }))
                    };
                }
                return offer;
            });

            return NextResponse.json({ data: offersWithMarkup });
        }

        // Otherwise, search for hotels in a city
        if (!cityCode) {
            return NextResponse.json(
                { error: 'Missing cityCode or hotelIds parameter' },
                { status: 400 }
            );
        }

        const hotels = await searchHotels({ cityCode });
        return NextResponse.json({ data: hotels });
    } catch (error) {
        console.error('Hotel Search Route Error:', error);
        return NextResponse.json(
            { error: 'Failed to search hotels' },
            { status: 500 }
        );
    }
}
