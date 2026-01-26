import Amadeus from 'amadeus';

let amadeusInstance: Amadeus | null = null;

export function getAmadeus() {
    if (!amadeusInstance) {
        const clientId = process.env.AMADEUS_CLIENT_ID;
        const clientSecret = process.env.AMADEUS_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            console.warn('Amadeus API keys missing. Intelligence features will be limited.');
            return null;
        }

        amadeusInstance = new Amadeus({
            clientId,
            clientSecret,
            hostname: 'test' // Change to 'production' when keys are ready
        });
    }
    return amadeusInstance;
}

export default getAmadeus;

/**
 * Interface for Location Score data from Amadeus
 */
export interface AmadeusLocationScore {
    sightseeing: number;
    shopping: number;
    nightlife: number;
    restaurant: number;
}

/**
 * Fetch safety and vibe intelligence for a set of coordinates
 */
export async function fetchLocationIntelligence(lat: number, lng: number) {
    const amadeus = getAmadeus();
    if (!amadeus) return { scores: null, safety: null };

    try {
        // 1. Fetch Location Scores (Neighborhood Vibes)
        const locationResponse = await amadeus.location.analytics.categoryRatedAreas.get({
            latitude: lat,
            longitude: lng
        });

        // 2. Fetch Safety Scores (Safe Place)
        const safetyResponse = await amadeus.safety.safetyRatedLocations.get({
            latitude: lat,
            longitude: lng
        });

        return {
            scores: locationResponse.data?.[0]?.categoryScores || null,
            safety: safetyResponse.data?.[0]?.safetyScores || null
        };
    } catch (error) {
        console.error('Amadeus Intelligence Error:', error);
        return { scores: null, safety: null };
    }
}

/**
 * Fetch sentiment analysis for a hotel
 */
export async function fetchHotelSentiment(hotelIds: string[]) {
    const amadeus = getAmadeus();
    if (!amadeus) return [];

    try {
        const response = await (amadeus as any).ereputation.hotelSentiments.get({
            hotelIds: hotelIds.join(',')
        });
        return response.data || [];
    } catch (error) {
        console.error('Amadeus Sentiment Error:', error);
        return [];
    }
}
