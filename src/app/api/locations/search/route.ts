import { NextRequest, NextResponse } from 'next/server';
import { searchLocations } from '@/lib/amadeus';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');

    if (!keyword) {
        return NextResponse.json({ error: 'Missing keyword parameter' }, { status: 400 });
    }

    try {
        const locations = await searchLocations(keyword);
        console.log('Amadeus locations for:', keyword, locations.length, 'results');
        if (locations.length > 0) {
            console.log('First result:', JSON.stringify(locations[0], null, 2));
        }
        return NextResponse.json({ data: locations });
    } catch (error) {
        console.error('Location Search Route Error:', error);
        return NextResponse.json({ error: 'Failed to search locations' }, { status: 500 });
    }
}
