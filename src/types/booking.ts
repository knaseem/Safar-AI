// Booking request types for Phase 7.5+

export interface TravelerCount {
    adults: number
    children: number
    infants: number
}

export interface BookingContactInfo {
    firstName: string
    lastName: string
    email: string
    phone: string
}

export interface BookingRequest {
    // Trip reference
    trip_id?: string
    trip_name: string
    destination: string
    is_halal: boolean

    // Travel details
    departure_city: string
    departure_code: string
    check_in: string // ISO date
    check_out: string // ISO date
    travelers: TravelerCount

    // Preferences
    room_type: 'single' | 'double' | 'suite'
    flight_class: 'economy' | 'business' | 'first'
    seat_preference?: 'aisle' | 'window' | 'no_preference'
    baggage?: 'carry_on' | 'checked'

    // Contact
    contact: BookingContactInfo

    // Add-ons
    travel_insurance: boolean
    special_requests?: string

    // Pricing
    estimated_price: number
    insurance_price?: number

    // Status
    status: 'pending' | 'quoted' | 'booked' | 'cancelled'
}

// Phase 8 additions (when APIs are integrated):
// - car_rental: boolean
// - airport_transfer: boolean
// - flexible_dates: boolean
// - loyalty_programs: { airline?: string; hotel?: string }
// - visa_required: boolean

// Major airports for autocomplete
export const MAJOR_AIRPORTS = [
    { code: 'JFK', city: 'New York', name: 'John F. Kennedy International' },
    { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles International' },
    { code: 'ORD', city: 'Chicago', name: "O'Hare International" },
    { code: 'DFW', city: 'Dallas', name: 'Dallas/Fort Worth International' },
    { code: 'DEN', city: 'Denver', name: 'Denver International' },
    { code: 'ATL', city: 'Atlanta', name: 'Hartsfield-Jackson Atlanta' },
    { code: 'SFO', city: 'San Francisco', name: 'San Francisco International' },
    { code: 'SEA', city: 'Seattle', name: 'Seattle-Tacoma International' },
    { code: 'MIA', city: 'Miami', name: 'Miami International' },
    { code: 'BOS', city: 'Boston', name: 'Logan International' },
    { code: 'LHR', city: 'London', name: 'Heathrow' },
    { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle' },
    { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt Airport' },
    { code: 'AMS', city: 'Amsterdam', name: 'Schiphol' },
    { code: 'DXB', city: 'Dubai', name: 'Dubai International' },
    { code: 'SIN', city: 'Singapore', name: 'Changi' },
    { code: 'HKG', city: 'Hong Kong', name: 'Hong Kong International' },
    { code: 'NRT', city: 'Tokyo', name: 'Narita International' },
    { code: 'HND', city: 'Tokyo', name: 'Haneda' },
    { code: 'ICN', city: 'Seoul', name: 'Incheon International' },
    { code: 'SYD', city: 'Sydney', name: 'Kingsford Smith' },
    { code: 'MEL', city: 'Melbourne', name: 'Tullamarine' },
    { code: 'YYZ', city: 'Toronto', name: 'Pearson International' },
    { code: 'YVR', city: 'Vancouver', name: 'Vancouver International' },
    { code: 'MEX', city: 'Mexico City', name: 'Benito Juárez International' },
    { code: 'GRU', city: 'São Paulo', name: 'Guarulhos International' },
    { code: 'EZE', city: 'Buenos Aires', name: 'Ministro Pistarini' },
    { code: 'IST', city: 'Istanbul', name: 'Istanbul Airport' },
    { code: 'DOH', city: 'Doha', name: 'Hamad International' },
    { code: 'JED', city: 'Jeddah', name: 'King Abdulaziz International' },
    { code: 'RUH', city: 'Riyadh', name: 'King Khalid International' },
    { code: 'CAI', city: 'Cairo', name: 'Cairo International' },
    { code: 'JNB', city: 'Johannesburg', name: 'O.R. Tambo International' },
    { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi' },
    { code: 'KUL', city: 'Kuala Lumpur', name: 'Kuala Lumpur International' },
    { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi International' },
    { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj' },
    { code: 'PEK', city: 'Beijing', name: 'Capital International' },
    { code: 'PVG', city: 'Shanghai', name: 'Pudong International' },
    { code: 'FCO', city: 'Rome', name: 'Leonardo da Vinci–Fiumicino' },
    { code: 'MAD', city: 'Madrid', name: 'Adolfo Suárez Madrid–Barajas' },
    { code: 'BCN', city: 'Barcelona', name: 'Josep Tarradellas Barcelona–El Prat' },
    { code: 'MUC', city: 'Munich', name: 'Munich Airport' },
    { code: 'ZRH', city: 'Zurich', name: 'Zurich Airport' },
    { code: 'VIE', city: 'Vienna', name: 'Vienna International' },
    { code: 'CPH', city: 'Copenhagen', name: 'Copenhagen Airport' },
    { code: 'OSL', city: 'Oslo', name: 'Oslo Gardermoen' },
    { code: 'ARN', city: 'Stockholm', name: 'Stockholm Arlanda' },
    { code: 'HEL', city: 'Helsinki', name: 'Helsinki-Vantaa' },
    { code: 'DUB', city: 'Dublin', name: 'Dublin Airport' },
]
