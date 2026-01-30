import { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react"
import { Footer } from "@/components/layout/footer"

export const metadata: Metadata = {
    title: "Privacy Policy | SafarAI",
    description: "Learn how SafarAI protects your privacy and handles your personal information."
}

export default function PrivacyPage() {
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
                        <Shield className="size-4" />
                        <span className="text-xs uppercase tracking-wider font-medium">Privacy Policy</span>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main className="flex-1 max-w-4xl mx-auto px-6 py-12">
                <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Privacy Policy
                </h1>
                <p className="text-white/40 mb-12">Last updated: January 2026</p>

                <div className="prose prose-invert prose-emerald max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">1. Information We Collect</h2>
                        <p className="text-white/60 leading-relaxed">
                            When you use SafarAI, we may collect the following types of information:
                        </p>
                        <ul className="list-disc list-inside text-white/60 space-y-2 mt-4">
                            <li><strong className="text-white">Account Information:</strong> Email address, name, and authentication data when you create an account</li>
                            <li><strong className="text-white">Travel Preferences:</strong> Your travel style, preferences, and saved itineraries</li>
                            <li><strong className="text-white">Usage Data:</strong> How you interact with our service, features used, and session information</li>
                            <li><strong className="text-white">Location Data:</strong> Approximate location based on IP address for personalized recommendations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                        <p className="text-white/60 leading-relaxed">
                            We use the information we collect to:
                        </p>
                        <ul className="list-disc list-inside text-white/60 space-y-2 mt-4">
                            <li>Provide personalized travel recommendations and itineraries</li>
                            <li>Improve and optimize our AI-powered services</li>
                            <li>Communicate with you about your account and trips</li>
                            <li>Detect and prevent fraud or abuse</li>
                            <li>Comply with legal obligations</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">3. Information Sharing</h2>
                        <p className="text-white/60 leading-relaxed">
                            We may share your information with:
                        </p>
                        <ul className="list-disc list-inside text-white/60 space-y-2 mt-4">
                            <li><strong className="text-white">Booking Partners:</strong> When you choose to book through our affiliate links (Expedia, airlines, hotels)</li>
                            <li><strong className="text-white">Service Providers:</strong> Third parties that help us operate our service (hosting, analytics)</li>
                            <li><strong className="text-white">Legal Requirements:</strong> When required by law or to protect our rights</li>
                        </ul>
                        <p className="text-white/60 leading-relaxed mt-4">
                            We do not sell your personal information to third parties.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">4. Data Security</h2>
                        <p className="text-white/60 leading-relaxed">
                            We implement industry-standard security measures to protect your data, including encryption
                            in transit and at rest. However, no method of transmission over the Internet is 100% secure.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">5. Your Rights</h2>
                        <p className="text-white/60 leading-relaxed">
                            You have the right to:
                        </p>
                        <ul className="list-disc list-inside text-white/60 space-y-2 mt-4">
                            <li>Access your personal data</li>
                            <li>Request correction of inaccurate data</li>
                            <li>Request deletion of your data</li>
                            <li>Export your data in a portable format</li>
                            <li>Opt out of marketing communications</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-semibold text-white mb-4">6. Contact Us</h2>
                        <p className="text-white/60 leading-relaxed">
                            If you have questions about this Privacy Policy or your personal data, please contact us at{" "}
                            <Link href="/contact" className="text-emerald-400 hover:underline">our contact page</Link>.
                        </p>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    )
}
