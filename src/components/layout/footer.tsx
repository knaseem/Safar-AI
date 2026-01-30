"use client"

import Link from "next/link"
import { Plane } from "lucide-react"

export function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full bg-black/60 backdrop-blur-xl border-t border-white/10 mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4 group">
                            <div className="size-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                                <Plane className="size-5 text-white -rotate-45" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                SafarAI
                            </span>
                        </Link>
                        <p className="text-white/40 text-sm leading-relaxed max-w-md">
                            Your AI-powered travel concierge. Experience the world effortlessly with personalized itineraries,
                            real-time deals, and intelligent trip planning.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Explore</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/trends" className="text-white/40 hover:text-emerald-400 text-sm transition-colors">
                                    Travel Trends
                                </Link>
                            </li>
                            <li>
                                <Link href="/world" className="text-white/40 hover:text-emerald-400 text-sm transition-colors">
                                    World Map
                                </Link>
                            </li>
                            <li>
                                <Link href="/blog" className="text-white/40 hover:text-emerald-400 text-sm transition-colors">
                                    Travel Blog
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Legal</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/privacy" className="text-white/40 hover:text-emerald-400 text-sm transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-white/40 hover:text-emerald-400 text-sm transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-white/40 hover:text-emerald-400 text-sm transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-white/30 text-xs">
                        © {currentYear} SafarAI. All rights reserved.
                    </p>
                    <p className="text-white/20 text-[10px] max-w-lg text-center md:text-right">
                        Prices shown are estimates and may vary at time of booking. SafarAI earns commissions from partner bookings.
                    </p>
                </div>
            </div>
        </footer>
    )
}
