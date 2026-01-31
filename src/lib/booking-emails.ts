import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Simple HTML escape function to prevent XSS
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

interface BookingEmailData {
    to: string;
    passengerName: string;
    bookingReference: string;
    type: 'flight' | 'stay';
    totalAmount: string;
    currency: string;
    details?: {
        origin?: string;
        destination?: string;
        departureDate?: string;
        airline?: string;
        hotelName?: string;
        checkIn?: string;
        checkOut?: string;
    };
}

interface CancellationEmailData {
    to: string;
    passengerName: string;
    bookingReference: string;
    refundAmount: string;
    currency: string;
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmation(data: BookingEmailData) {
    const safeName = escapeHtml(data.passengerName);
    const safeRef = escapeHtml(data.bookingReference);

    const flightDetails = data.type === 'flight' && data.details ? `
        <tr>
            <td style="color: #666666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 10px 0;">Route</td>
            <td style="color: #ffffff; font-size: 16px; padding: 10px 0;">${escapeHtml(data.details.origin || '')} → ${escapeHtml(data.details.destination || '')}</td>
        </tr>
        <tr>
            <td style="color: #666666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 10px 0;">Departure</td>
            <td style="color: #ffffff; font-size: 16px; padding: 10px 0;">${escapeHtml(data.details.departureDate || '')}</td>
        </tr>
        <tr>
            <td style="color: #666666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 10px 0;">Airline</td>
            <td style="color: #ffffff; font-size: 16px; padding: 10px 0;">${escapeHtml(data.details.airline || '')}</td>
        </tr>
    ` : '';

    const stayDetails = data.type === 'stay' && data.details ? `
        <tr>
            <td style="color: #666666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 10px 0;">Hotel</td>
            <td style="color: #ffffff; font-size: 16px; padding: 10px 0;">${escapeHtml(data.details.hotelName || '')}</td>
        </tr>
        <tr>
            <td style="color: #666666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 10px 0;">Check-in</td>
            <td style="color: #ffffff; font-size: 16px; padding: 10px 0;">${escapeHtml(data.details.checkIn || '')}</td>
        </tr>
        <tr>
            <td style="color: #666666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 10px 0;">Check-out</td>
            <td style="color: #ffffff; font-size: 16px; padding: 10px 0;">${escapeHtml(data.details.checkOut || '')}</td>
        </tr>
    ` : '';

    try {
        await resend.emails.send({
            from: 'SafarAI Bookings <bookings@safar-ai.co>',
            to: data.to,
            subject: `✈️ Booking Confirmed - ${safeRef}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Booking Confirmation</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #111111;">
                    <div style="background-color: #000000; padding: 40px 20px;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: rgba(0, 0, 0, 0.9); border: 1px solid #333333; border-radius: 16px; overflow: hidden;">
                            
                            <!-- Header -->
                            <div style="text-align: center; padding: 40px 0 30px; border-bottom: 1px solid #222222;">
                                <div style="display: inline-block;">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="#ffffff" style="vertical-align: middle;">
                                        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
                                    </svg>
                                </div>
                                <h1 style="display: inline-block; vertical-align: middle; margin: 0 0 0 12px; color: #ffffff; font-size: 26px; font-weight: 700;">
                                    Safar<span style="color: #666666;">AI</span>
                                </h1>
                            </div>

                            <!-- Success Banner -->
                            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
                                <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">Booking Confirmed! ✓</h2>
                                <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Your ${data.type === 'flight' ? 'flight' : 'hotel'} has been successfully booked</p>
                            </div>

                            <!-- Content -->
                            <div style="padding: 40px;">
                                <!-- Confirmation Code -->
                                <div style="text-align: center; margin-bottom: 30px;">
                                    <p style="margin: 0 0 8px; color: #666666; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Confirmation Code</p>
                                    <p style="margin: 0; color: #10b981; font-size: 32px; font-weight: 700; font-family: monospace; letter-spacing: 2px;">${safeRef}</p>
                                </div>

                                <!-- Booking Details -->
                                <table style="width: 100%; border-collapse: separate; border-spacing: 0;">
                                    <tr>
                                        <td style="color: #666666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 10px 0;">Passenger</td>
                                        <td style="color: #ffffff; font-size: 16px; padding: 10px 0;">${safeName}</td>
                                    </tr>
                                    ${flightDetails}
                                    ${stayDetails}
                                    <tr>
                                        <td style="color: #666666; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; padding: 10px 0;">Total Paid</td>
                                        <td style="color: #10b981; font-size: 20px; font-weight: 700; padding: 10px 0;">${data.currency} ${data.totalAmount}</td>
                                    </tr>
                                </table>

                                <!-- CTA Button -->
                                <div style="text-align: center; margin-top: 30px;">
                                    <a href="https://www.safar-ai.co/profile" 
                                       style="display: inline-block; background-color: #10b981; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
                                        View My Bookings
                                    </a>
                                </div>
                            </div>

                            <!-- Footer -->
                            <div style="background-color: #000000; padding: 25px; text-align: center; border-top: 1px solid #222222;">
                                <p style="margin: 0; color: #444444; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">
                                    SafarAI // Your AI Travel Concierge
                                </p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to send booking confirmation email:', error);
        return { success: false, error };
    }
}

/**
 * Send cancellation confirmation email
 */
export async function sendCancellationConfirmation(data: CancellationEmailData) {
    const safeName = escapeHtml(data.passengerName);
    const safeRef = escapeHtml(data.bookingReference);

    try {
        await resend.emails.send({
            from: 'SafarAI Bookings <bookings@safar-ai.co>',
            to: data.to,
            subject: `Booking Cancelled - ${safeRef}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>Booking Cancellation</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #111111;">
                    <div style="background-color: #000000; padding: 40px 20px;">
                        <div style="max-width: 600px; margin: 0 auto; background-color: rgba(0, 0, 0, 0.9); border: 1px solid #333333; border-radius: 16px; overflow: hidden;">
                            
                            <!-- Header -->
                            <div style="text-align: center; padding: 40px 0 30px; border-bottom: 1px solid #222222;">
                                <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 700;">
                                    Safar<span style="color: #666666;">AI</span>
                                </h1>
                            </div>

                            <!-- Cancellation Banner -->
                            <div style="background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); padding: 30px; text-align: center;">
                                <h2 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700;">Booking Cancelled</h2>
                                <p style="margin: 10px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Your cancellation has been processed</p>
                            </div>

                            <!-- Content -->
                            <div style="padding: 40px;">
                                <p style="color: #e0e0e0; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                    Dear ${safeName},
                                </p>
                                <p style="color: #e0e0e0; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                    Your booking <strong style="color: #ffffff;">${safeRef}</strong> has been successfully cancelled.
                                </p>
                                
                                <div style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                                    <p style="margin: 0 0 8px; color: #666666; font-size: 12px; text-transform: uppercase; letter-spacing: 2px;">Refund Amount</p>
                                    <p style="margin: 0; color: #10b981; font-size: 28px; font-weight: 700;">${data.currency} ${data.refundAmount}</p>
                                </div>

                                <p style="color: #888888; font-size: 14px; line-height: 1.6; margin: 0;">
                                    Your refund will be processed within 5-10 business days to your original payment method.
                                </p>
                            </div>

                            <!-- Footer -->
                            <div style="background-color: #000000; padding: 25px; text-align: center; border-top: 1px solid #222222;">
                                <p style="margin: 0; color: #444444; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">
                                    SafarAI // Your AI Travel Concierge
                                </p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to send cancellation email:', error);
        return { success: false, error };
    }
}
