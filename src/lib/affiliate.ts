export type AffiliateType = 'hotel' | 'activity' | 'flight' | 'general'

export function generateAffiliateLink(
    type: AffiliateType,
    params: {
        destination?: string
        name?: string // Hotel name or Activity title
        checkIn?: string
        checkOut?: string
        origin?: string
    }
): string {
    const { destination = '', name = '', checkIn, checkOut, origin } = params
    const query = encodeURIComponent(`${name} ${destination}`.trim())

    // In a real app, these would be your actual affiliate IDs
    // const BOOKING_AID = '123456'
    // const VIATOR_PID = '78910'

    switch (type) {
        case 'hotel':
            // Booking.com Search
            // https://www.booking.com/searchresults.html?ss=Paris&checkin=2024-10-01&checkout=2024-10-05
            let url = `https://www.booking.com/searchresults.html?ss=${query}`
            if (checkIn) url += `&checkin=${checkIn}`
            if (checkOut) url += `&checkout=${checkOut}`
            return url

        case 'activity':
            // Viator is blocking direct search params from some IPs/Refs (Access Restricted)
            // Fallback to TripAdvisor (Parent co) which is more permissive
            return `https://www.tripadvisor.com/Search?q=${query}`

        case 'flight':
            // Skyscanner or similar
            // For now, simple Skyscanner search
            return `https://www.skyscanner.com/transport/flights/${origin || 'any'}/${destination}/${checkIn || ''}`

        case 'general':
        default:
            // Fallback to Google Search if all else fails, or a generic travel site
            return `https://www.google.com/search?q=${query}+travel`
    }
}
