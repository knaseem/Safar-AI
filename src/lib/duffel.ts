import { Duffel } from '@duffel/api';

let duffelInstance: Duffel | null = null;

/**
 * Initialize and get the Duffel client
 */
export function getDuffel() {
    if (!duffelInstance) {
        const accessToken = process.env.DUFFEL_ACCESS_TOKEN;

        if (!accessToken) {
            console.warn('DUFFEL_ACCESS_TOKEN missing. Booking features will use mock data.');
            return null;
        }

        duffelInstance = new Duffel({
            token: accessToken,
        });
    }
    return duffelInstance;
}

/**
 * Create a flight offer request (Search)
 */
export async function createFlightSearch(params: {
    origin: string;
    destination: string;
    departureDate: string;
    returnDate?: string;
    adults: number;
}) {
    const duffel = getDuffel();
    if (!duffel) {
        // Return mock search results if no API key
        return {
            id: 'mock_search_' + Math.random().toString(36).substring(7),
            offers: [
                {
                    id: 'off_mock_1',
                    total_amount: '517.50', // Mock with 15% markup manual for demo
                    total_currency: 'USD',
                    owner: { name: 'Safar Airways' },
                    itineraries: []
                }
            ]
        };
    }

    try {
        const response = await duffel.offerRequests.create({
            slices: [
                {
                    origin: params.origin,
                    destination: params.destination,
                    departure_date: params.departureDate,
                } as any, // Bypass strict slice types for POC
                ...(params.returnDate ? [{
                    origin: params.destination,
                    destination: params.origin,
                    departure_date: params.returnDate,
                } as any] : []),
            ],
            passengers: Array(params.adults).fill({ type: 'adult' }),
            cabin_class: 'economy',
        });

        // Apply Markups to real search results
        const { applyMarkup } = await import('./pricing');
        const dataWithMarkup = {
            ...response.data,
            offers: response.data.offers.map((offer: any) => ({
                ...offer,
                base_amount: offer.total_amount,
                total_amount: applyMarkup(offer.total_amount, 'flight').toFixed(2)
            }))
        };

        return dataWithMarkup;
    } catch (error) {
        console.error('Duffel Search Error:', error);
        throw error;
    }
}

/**
 * Create a secure Duffel Link Session (Hosted Search & Book)
 */
export async function createLinkSession(params: {
    reference: string;
    travellerCurrency?: string;
    enableFlights?: boolean;
    enableStays?: boolean;
}) {
    const duffel = getDuffel();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.safar-ai.co';

    if (!duffel) {
        // Mock link for sandbox/demo - Points to our local mock page
        return {
            url: `${appUrl}/trips/mock-checkout?reference=${params.reference}`,
            id: 'lnk_mock_' + Math.random().toString(36).substring(7)
        };
    }

    try {
        // Use the sessions endpoint as documented: https://duffel.com/docs/guides/duffel-links
        const response = await (duffel as any).links.sessions.create({
            reference: params.reference,
            success_url: `${appUrl}/trips/success`,
            failure_url: `${appUrl}/trips/failure`,
            abandonment_url: `${appUrl}/`,
            logo_url: 'https://safar-ai.com/logo.png', // Replace with your actual branded logo
            primary_color: '#10b981', // Safar AI Emerald
            traveller_currency: params.travellerCurrency || 'USD',
            flights: {
                enabled: params.enableFlights ?? true
            },
            stays: {
                enabled: params.enableStays ?? true
            }
        });
        return response.data;
    } catch (error) {
        console.error('Duffel Link Session Error:', error);
        throw error;
    }
}

/**
 * Create a Hotel Search (Duffel Stays)
 */
export async function searchStays(params: {
    location: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
}) {
    const duffel = getDuffel();
    if (!duffel) return [];

    try {
        // Duffel Stays API is currently in specific access/beta for some regions
        // This is a placeholder for the implementation
        const response = await (duffel as any).stays.search({
            location: params.location,
            check_in_date: params.checkInDate,
            check_out_date: params.checkOutDate,
            adults: params.adults,
        });
        return response.data || [];
    } catch (error) {
        console.error('Duffel Stays Error:', error);
        return [];
    }
}

// ============================================
// ORDER MANAGEMENT APIs (Custom Checkout)
// ============================================

export interface Passenger {
    type: 'adult' | 'child' | 'infant_without_seat';
    given_name: string;
    family_name: string;
    gender: 'male' | 'female';
    born_on: string; // YYYY-MM-DD
    email: string;
    phone_number?: string;
    title?: 'mr' | 'ms' | 'mrs' | 'miss' | 'dr';
}

export interface CreateOrderParams {
    offerId: string;
    passengers: Passenger[];
    paymentType: 'balance' | 'arc_bsp_cash';
    totalAmount: string; // Your marked-up price
    currency: string;
    metadata?: Record<string, string>;
}

/**
 * Create an order (Book a flight with payment)
 * This is where YOUR marked-up price gets charged
 */
export async function createOrder(params: CreateOrderParams) {
    const duffel = getDuffel();

    if (!duffel) {
        // Mock order for testing without API key
        return {
            id: 'ord_mock_' + Math.random().toString(36).substring(7),
            booking_reference: 'SFRMCK',
            status: 'confirmed',
            total_amount: params.totalAmount,
            total_currency: params.currency,
            passengers: params.passengers,
            created_at: new Date().toISOString(),
        };
    }

    try {
        const response = await duffel.orders.create({
            type: 'instant',
            selected_offers: [params.offerId],
            passengers: params.passengers.map((p, i) => ({
                ...p,
                id: `pas_${i}`, // Duffel requires passenger IDs
            })),
            payments: [{
                type: params.paymentType,
                amount: params.totalAmount,
                currency: params.currency,
            }],
            metadata: params.metadata,
        } as any);

        return response.data;
    } catch (error) {
        console.error('Duffel Create Order Error:', error);
        throw error;
    }
}

/**
 * Get a single order by ID
 */
export async function getOrder(orderId: string) {
    const duffel = getDuffel();

    if (!duffel) {
        return {
            id: orderId,
            booking_reference: 'SFRMCK',
            status: 'confirmed',
            total_amount: '525.00',
            total_currency: 'USD',
            created_at: new Date().toISOString(),
            slices: [],
            passengers: [],
        };
    }

    try {
        const response = await duffel.orders.get(orderId);
        return response.data;
    } catch (error) {
        console.error('Duffel Get Order Error:', error);
        throw error;
    }
}

/**
 * Get cancellation quote for an order (check refund amount)
 */
export async function getOrderCancellationQuote(orderId: string) {
    const duffel = getDuffel();

    if (!duffel) {
        return {
            id: 'occ_mock_' + Math.random().toString(36).substring(7),
            order_id: orderId,
            refund_amount: '500.00',
            refund_currency: 'USD',
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            confirmed_at: null,
        };
    }

    try {
        // Create a cancellation request to get the quote
        const response = await duffel.orderCancellations.create({
            order_id: orderId,
        });
        return response.data;
    } catch (error) {
        console.error('Duffel Cancellation Quote Error:', error);
        throw error;
    }
}

/**
 * Confirm order cancellation (actually cancel and refund)
 */
export async function confirmOrderCancellation(cancellationId: string) {
    const duffel = getDuffel();

    if (!duffel) {
        return {
            id: cancellationId,
            status: 'confirmed',
            refund_amount: '500.00',
            refund_currency: 'USD',
            confirmed_at: new Date().toISOString(),
        };
    }

    try {
        const response = await duffel.orderCancellations.confirm(cancellationId);
        return response.data;
    } catch (error) {
        console.error('Duffel Confirm Cancellation Error:', error);
        throw error;
    }
}

/**
 * Get an offer by ID (to display on checkout page)
 */
export async function getOffer(offerId: string) {
    const duffel = getDuffel();

    if (!duffel) {
        // Mock offer for testing
        return {
            id: offerId,
            total_amount: '525.00',
            total_currency: 'USD',
            base_amount: '500.00',
            owner: { name: 'Safar Airways' },
            slices: [{
                origin: { iata_code: 'JFK', name: 'John F. Kennedy International' },
                destination: { iata_code: 'DXB', name: 'Dubai International' },
                departure_date: '2026-03-15',
                duration: 'PT14H30M',
                segments: [{
                    operating_carrier: { name: 'Emirates' },
                    operating_carrier_flight_number: 'EK204',
                    departure: { at: '2026-03-15T22:00:00' },
                    arrival: { at: '2026-03-16T12:30:00' },
                }]
            }],
            passengers: [{ type: 'adult' }],
            conditions: {
                refund_before_departure: {
                    allowed: true,
                    penalty_amount: '150.00',
                    penalty_currency: 'USD',
                },
                change_before_departure: {
                    allowed: true,
                    penalty_amount: '75.00',
                    penalty_currency: 'USD',
                }
            },
            expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
        };
    }

    try {
        const response = await duffel.offers.get(offerId);

        // Apply markup to the offer
        const { applyMarkup } = await import('./pricing');
        const offer = response.data;

        return {
            ...offer,
            base_amount: offer.total_amount,
            total_amount: applyMarkup(offer.total_amount, 'flight').toFixed(2),
        };
    } catch (error) {
        console.error('Duffel Get Offer Error:', error);
        throw error;
    }
}
