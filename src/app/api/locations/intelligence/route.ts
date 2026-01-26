import { NextRequest, NextResponse } from 'next/server';
import { fetchLocationIntelligence } from '@/lib/amadeus';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const lat = searchParams.get('latitude');
    const lng = searchParams.get('longitude');

    if (!lat || !lng) {
        return NextResponse.json(
            { error: 'Missing latitude or longitude parameter' },
            { status: 400 }
        );
    }

    try {
        const intel = await fetchLocationIntelligence(parseFloat(lat), parseFloat(lng));
        return NextResponse.json({ data: intel });
    } catch (error) {
        console.error('Location Intelligence Route Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch location intelligence' },
            { status: 500 }
        );
    }
}
