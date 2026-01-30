import { NextRequest, NextResponse } from 'next/server';
import { searchFlights } from '@/lib/amadeus';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const originLocationCode = searchParams.get('origin');
    const destinationLocationCode = searchParams.get('destination');
    const departureDate = searchParams.get('departureDate');
    const returnDate = searchParams.get('returnDate');
    const adults = parseInt(searchParams.get('adults') || '1');

    if (!originLocationCode || !destinationLocationCode || !departureDate) {
        return NextResponse.json(
            { error: 'Missing required parameters: origin, destination, departureDate' },
            { status: 400 }
        );
    }

    try {
        const flights = await searchFlights({
            originLocationCode,
            destinationLocationCode,
            departureDate,
            returnDate: returnDate || undefined,
            adults,
            max: 10
        });

        // Apply Profit Markups
        const { applyMarkup } = await import('@/lib/pricing');
        const flightsWithMarkup = flights.map((flight: any) => {
            if (flight.price) {
                return {
                    ...flight,
                    price: {
                        ...flight.price,
                        base_total: flight.price.total, // Store original for reference if needed
                        total: applyMarkup(flight.price.total, 'flight').toFixed(2)
                    }
                };
            }
            return flight;
        });

        return NextResponse.json({ data: flightsWithMarkup });
    } catch (error) {
        console.error('Flight Search Route Error:', error);
        return NextResponse.json(
            { error: 'Failed to search flights' },
            { status: 500 }
        );
    }
}
