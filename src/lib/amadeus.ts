import Amadeus from 'amadeus';

// Create a singleton instance of the Amadeus client
// We use the TEST environment by default to protect the user
const amadeus = new Amadeus({
    clientId: process.env.AMADEUS_CLIENT_ID || '',
    clientSecret: process.env.AMADEUS_CLIENT_SECRET || '',
    hostname: 'test' // Change to 'production' when keys are ready
});

export default amadeus;

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
