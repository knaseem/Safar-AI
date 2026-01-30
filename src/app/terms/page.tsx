import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, FileText } from "lucide-react"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
    title: "Terms of Service | SafarAI",
    description: "Read the terms and conditions for using SafarAI travel planning services."
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white flex flex-col">
            {/* Header */}
            <header className="border-b border-white/10 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="size-4" />
                        <span className="text-sm">Back to SafarAI</span>
                    </Link>
                    <div className="flex items-center gap-2 text-emerald-400">
                        <FileText className="size-4" />
                        <span className="text-xs uppercase tracking-wider font-medium">Terms of Service</span>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Terms of Service
                </h1>
                <p className="text-white/40 mb-12">Last updated: January 2026</p>

                <div className="prose prose-invert prose-emerald max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                        <p className="text-white/60 leading-relaxed">
                            By accessing or using SafarAI ("Service"), you agree to be bound by these Terms of Service.
                            If you do not agree to these terms, please do not use our Service.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">2. Description of Service</h2>
                        <p className="text-white/60 leading-relaxed">
                            SafarAI provides AI-powered travel planning and recommendation services. Our Service includes:
                        </p>
                        <ul className="list-disc list-inside text-white/60 space-y-2 mt-4">
                            <li>Personalized travel itinerary generation</li>
                            <li>Travel style assessment and matching</li>
                            <li>Flight and hotel search aggregation</li>
                            <li>Affiliate booking referrals to third-party providers</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">3. User Accounts</h2>
                        <p className="text-white/60 leading-relaxed">
                            To access certain features, you may need to create an account. You are responsible for:
                        </p>
                        <ul className="list-disc list-inside text-white/60 space-y-2 mt-4">
                            <li>Maintaining the confidentiality of your account credentials</li>
                            <li>All activities that occur under your account</li>
                            <li>Providing accurate and current information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">4. Booking and Payments</h2>
                        <p className="text-white/60 leading-relaxed">
                            SafarAI does not directly process bookings or payments for travel services. When you click
                            a booking link, you are redirected to third-party providers (such as Expedia, airlines, or hotels)
                            who handle the actual booking and payment. Your transaction is governed by that provider's terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">5. Pricing and Accuracy</h2>
                        <p className="text-white/60 leading-relaxed">
                            Prices displayed on SafarAI are estimates provided by third-party APIs and may change at the
                            time of booking. We strive for accuracy but cannot guarantee that all information is current
                            or error-free. Always verify pricing on the booking provider's site before completing a purchase.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">6. Disclaimer of Warranties</h2>
                        <p className="text-white/60 leading-relaxed">
                            THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                            EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED,
                            SECURE, OR ERROR-FREE.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
                        <p className="text-white/60 leading-relaxed">
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW, SAFARAI SHALL NOT BE LIABLE FOR ANY INDIRECT,
                            INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS,
                            DATA, OR GOODWILL, ARISING FROM YOUR USE OF THE SERVICE.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">8. Intellectual Property</h2>
                        <p className="text-white/60 leading-relaxed">
                            All content, features, and functionality of the Service are owned by SafarAI and are
                            protected by international copyright, trademark, and other intellectual property laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">9. Changes to Terms</h2>
                        <p className="text-white/60 leading-relaxed">
                            We reserve the right to modify these Terms at any time. We will notify users of significant
                            changes by posting the new Terms on this page. Your continued use of the Service after
                            changes constitutes acceptance of the new Terms.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">10. Contact</h2>
                        <p className="text-white/60 leading-relaxed">
                            If you have questions about these Terms, please contact us at{" "}
                            <Link href="/contact" className="text-emerald-400 hover:underline">our contact page</Link>.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}
