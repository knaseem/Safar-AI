/**
 * Simple lookup table for major destination coordinates
 * In a real app, this would use a Geocoding API or store coordinates in the DB
 */
export const destinationCoordinates: Record<string, { lat: number, lng: number }> = {
    'Abu Dhabi': { lat: 24.4539, lng: 54.3773 },
    'London': { lat: 51.5074, lng: -0.1278 },
    'Paris': { lat: 48.8566, lng: 2.3522 },
    'Tokyo': { lat: 35.6762, lng: 139.6503 },
    'Dubai': { lat: 25.2048, lng: 55.2708 },
    'New York': { lat: 40.7128, lng: -74.0060 },
    'Singapore': { lat: 1.3521, lng: 103.8198 },
    'Rome': { lat: 41.9028, lng: 12.4964 },
    'Bali': { lat: -8.4095, lng: 115.1889 },
    'Sydney': { lat: -33.8688, lng: 151.2093 }
}

/**
 * Returns coordinates for a destination string
 */
export function getCoordinates(destination: string) {
    // Try exact match
    if (destinationCoordinates[destination]) return destinationCoordinates[destination];

    // Try partial match
    const key = Object.keys(destinationCoordinates).find(k =>
        destination.toLowerCase().includes(k.toLowerCase())
    );

    if (key) return destinationCoordinates[key];

    // Default to a scenic spot if unknown (or return null)
    return null;
}
