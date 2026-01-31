import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { name, email, subject, message } = await req.json();

        const data = await resend.emails.send({
            from: 'SafarAI Contact <support@safar-ai.co>', // Verified domain sender
            to: (process.env.NEXT_PUBLIC_ADMIN_EMAILS || 'knaseem@safar-ai.co').split(',').map(e => e.trim()),
            subject: `Contact Form: ${subject || 'New Message'}`,
            replyTo: email, // So you can reply directly to the user
            text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <title>New SafarAI Contact</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f4;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                        
                        <!-- Header -->
                        <div style="background-color: #000000; padding: 20px 40px; text-align: center; border-bottom: 2px solid #D4AF37;">
                            <h1 style="margin: 0; font-family: 'Playfair Display', serif; color: #ffffff; font-size: 28px; letter-spacing: 1px;">
                                SAFAR<span style="color: #D4AF37;">AI</span>
                            </h1>
                            <p style="margin: 5px 0 0; color: #888888; font-size: 10px; text-transform: uppercase; letter-spacing: 2px;">Premium Travel Ops</p>
                        </div>

                        <!-- Content -->
                        <div style="padding: 40px;">
                            <div style="background-color: #f8f9fa; border-left: 4px solid #000000; padding: 15px; margin-bottom: 30px;">
                                <p style="margin: 0; color: #555555; font-size: 12px; font-weight: 600; text-transform: uppercase;">Status</p>
                                <p style="margin: 5px 0 0; color: #000000; font-size: 16px; font-weight: bold;">New Inquiry Recieved</p>
                            </div>

                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; width: 30%; color: #888888; font-size: 12px; font-weight: 600; text-transform: uppercase;">Sender</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #000000; font-size: 16px;">${name}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #888888; font-size: 12px; font-weight: 600; text-transform: uppercase;">Email</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #000000; font-size: 16px;">
                                        <a href="mailto:${email}" style="color: #D4AF37; text-decoration: none;">${email}</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #888888; font-size: 12px; font-weight: 600; text-transform: uppercase;">Subject</td>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #eeeeee; color: #000000; font-size: 16px;">${subject}</td>
                                </tr>
                            </table>

                            <div style="margin-top: 30px;">
                                <p style="margin: 0 0 10px; color: #888888; font-size: 12px; font-weight: 600; text-transform: uppercase;">Message Content</p>
                                <div style="background-color: #fcfcfc; border: 1px solid #eeeeee; border-radius: 4px; padding: 20px; color: #333333; line-height: 1.6; font-size: 15px; white-space: pre-wrap;">${message}</div>
                            </div>

                            <!-- Call to Action -->
                            <div style="margin-top: 40px; text-align: center;">
                                <a href="mailto:${email}" style="background-color: #000000; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; font-size: 14px; display: inline-block;">Reply to Inquiry</a>
                            </div>
                        </div>

                        <!-- Footer -->
                        <div style="background-color: #f8f9fa; padding: 20px 40px; text-align: center; border-top: 1px solid #eeeeee;">
                            <p style="margin: 0; color: #aaaaaa; font-size: 10px;">
                                SECURE TRANSMISSION // SAFAR-AI SYSTEMS<br>
                                © 2026 SafarAI. All rights reserved.
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error }, { status: 500 });
    }
}
