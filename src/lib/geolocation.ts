/**
 * IP-based geolocation utility for detecting user's origin city
 * Uses ip-api.com (free tier: 45 requests per minute)
 */

export interface GeoLocation {
    city: string
    cityCode: string
    country: string
    countryCode: string
    lat: number
    lon: number
}

// Mapping of major cities to their nearest major airport codes
const CITY_TO_AIRPORT: Record<string, string> = {
    // United States
    'New York': 'JFK',
    'Los Angeles': 'LAX',
    'Chicago': 'ORD',
    'Houston': 'IAH',
    'Phoenix': 'PHX',
    'Philadelphia': 'PHL',
    'San Antonio': 'SAT',
    'San Diego': 'SAN',
    'Dallas': 'DFW',
    'San Jose': 'SJC',
    'Austin': 'AUS',
    'Jacksonville': 'JAX',
    'Fort Worth': 'DFW',
    'Columbus': 'CMH',
    'Charlotte': 'CLT',
    'San Francisco': 'SFO',
    'Indianapolis': 'IND',
    'Seattle': 'SEA',
    'Denver': 'DEN',
    'Washington': 'DCA',
    'Boston': 'BOS',
    'Nashville': 'BNA',
    'Detroit': 'DTW',
    'Oklahoma City': 'OKC',
    'Portland': 'PDX',
    'Las Vegas': 'LAS',
    'Memphis': 'MEM',
    'Louisville': 'SDF',
    'Baltimore': 'BWI',
    'Milwaukee': 'MKE',
    'Albuquerque': 'ABQ',
    'Tucson': 'TUS',
    'Fresno': 'FAT',
    'Sacramento': 'SMF',
    'Kansas City': 'MCI',
    'Atlanta': 'ATL',
    'Miami': 'MIA',
    'Raleigh': 'RDU',
    'Omaha': 'OMA',
    'Minneapolis': 'MSP',
    'Cleveland': 'CLE',
    'Tampa': 'TPA',
    'St. Louis': 'STL',
    'Pittsburgh': 'PIT',
    'Cincinnati': 'CVG',
    'Orlando': 'MCO',
    'New Orleans': 'MSY',
    'Salt Lake City': 'SLC',
    'Honolulu': 'HNL',
    'Anchorage': 'ANC',
    // International
    'London': 'LHR',
    'Paris': 'CDG',
    'Tokyo': 'NRT',
    'Dubai': 'DXB',
    'Singapore': 'SIN',
    'Hong Kong': 'HKG',
    'Sydney': 'SYD',
    'Toronto': 'YYZ',
    'Vancouver': 'YVR',
    'Mumbai': 'BOM',
    'Delhi': 'DEL',
    'Shanghai': 'PVG',
    'Beijing': 'PEK',
    'Seoul': 'ICN',
    'Bangkok': 'BKK',
    'Kuala Lumpur': 'KUL',
    'Jakarta': 'CGK',
    'Manila': 'MNL',
    'Istanbul': 'IST',
    'Frankfurt': 'FRA',
    'Amsterdam': 'AMS',
    'Madrid': 'MAD',
    'Barcelona': 'BCN',
    'Rome': 'FCO',
    'Milan': 'MXP',
    'Zurich': 'ZRH',
    'Munich': 'MUC',
    'Vienna': 'VIE',
    'Brussels': 'BRU',
    'Dublin': 'DUB',
    'Lisbon': 'LIS',
    'Stockholm': 'ARN',
    'Oslo': 'OSL',
    'Copenhagen': 'CPH',
    'Helsinki': 'HEL',
    'Warsaw': 'WAW',
    'Prague': 'PRG',
    'Budapest': 'BUD',
    'Athens': 'ATH',
    'Cairo': 'CAI',
    'Johannesburg': 'JNB',
    'Cape Town': 'CPT',
    'Nairobi': 'NBO',
    'Lagos': 'LOS',
    'Casablanca': 'CMN',
    'São Paulo': 'GRU',
    'Rio de Janeiro': 'GIG',
    'Buenos Aires': 'EZE',
    'Lima': 'LIM',
    'Bogota': 'BOG',
    'Mexico City': 'MEX',
    'Cancun': 'CUN'
}

const DEFAULT_LOCATION: GeoLocation = {
    city: 'New York',
    cityCode: 'JFK',
    country: 'United States',
    countryCode: 'US',
    lat: 40.7128,
    lon: -74.0060
}

/**
 * Get nearest airport code for a city name
 */
function getCityCode(city: string): string {
    // Direct match
    if (CITY_TO_AIRPORT[city]) {
        return CITY_TO_AIRPORT[city]
    }

    // Partial match (case insensitive)
    const lowerCity = city.toLowerCase()
    for (const [knownCity, code] of Object.entries(CITY_TO_AIRPORT)) {
        if (knownCity.toLowerCase().includes(lowerCity) || lowerCity.includes(knownCity.toLowerCase())) {
            return code
        }
    }

    // Default to JFK for unknown cities
    return 'JFK'
}

/**
 * Detect user's location based on IP address
 * Uses ip-api.com free tier
 */
export async function detectUserLocation(): Promise<GeoLocation> {
    try {
        const response = await fetch('http://ip-api.com/json/?fields=status,city,country,countryCode,lat,lon', {
            cache: 'no-store'
        })

        if (!response.ok) {
            console.warn('Geolocation API returned non-OK status:', response.status)
            return DEFAULT_LOCATION
        }

        const data = await response.json()

        if (data.status !== 'success' || !data.city) {
            console.warn('Geolocation API returned invalid data:', data)
            return DEFAULT_LOCATION
        }

        return {
            city: data.city,
            cityCode: getCityCode(data.city),
            country: data.country,
            countryCode: data.countryCode,
            lat: data.lat,
            lon: data.lon
        }
    } catch (error) {
        console.error('Failed to detect user location:', error)
        return DEFAULT_LOCATION
    }
}

/**
 * Get a dynamic check-in date (30 days from now)
 */
export function getDynamicCheckInDate(): string {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30)
    return futureDate.toISOString().split('T')[0]
}

/**
 * Get a dynamic check-out date (X days after check-in)
 */
export function getDynamicCheckOutDate(nights: number = 5): string {
    const futureDate = new Date()
    futureDate.setDate(futureDate.getDate() + 30 + nights)
    return futureDate.toISOString().split('T')[0]
}
