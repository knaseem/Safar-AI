import { createClient } from "@/lib/supabase/server"
import { TripItinerary } from "@/components/features/trip-itinerary"
import { Navbar } from "@/components/layout/navbar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles } from "lucide-react"
import { notFound } from "next/navigation"

export default async function SharedTripPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const supabase = await createClient()

    // Fetch Trip specifically allowing public view (no user_id check)
    // We only select safe fields
    const { data: trip, error } = await supabase
        .from("saved_trips")
        .select("trip_name, trip_data, is_halal, destination")
        .eq("id", params.id)
        .single()

    if (error || !trip) {
        return notFound()
    }

    return (
        <main className="min-h-screen bg-black">
            <Navbar />

            {/* Context Header for Guests */}
            <div className="pt-28 pb-4 text-center px-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-4 animate-in slide-in-from-top-4 fade-in duration-700">
                    <Sparkles className="size-4" />
                    <span>You're viewing a shared SafarAI Trip</span>
                </div>
            </div>

            <div className="container mx-auto px-4 pb-12">
                <TripItinerary
                    data={trip.trip_data as any}
                    isHalal={trip.is_halal}
                    // Enable Shared Mode (Read Only)
                    isShared={true}
                // No ID passed to prevent 'Share' button loop, though logic handles isShared priority
                />
            </div>

            {/* Sticky Floating CTA for Mobile/Desktop */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-sm px-4">
                <Link href="/">
                    <Button className="w-full text-lg h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-bold shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] transition-transform">
                        <Sparkles className="size-5 mr-2" />
                        Plan Your Own Trip
                    </Button>
                </Link>
            </div>
        </main>
    )
}
