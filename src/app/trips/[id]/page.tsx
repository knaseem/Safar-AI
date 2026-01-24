import { createClient } from "@/lib/supabase/server"
import { TripItinerary } from "@/components/features/trip-itinerary"
import { Navbar } from "@/components/layout/navbar"
import { redirect } from "next/navigation"

export default async function TripPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect("/")
    }

    // Fetch Trip ensuring ownership
    // Fetch Trip ensuring ownership
    const { data: trip, error } = await supabase
        .from("saved_trips")
        .select("*")
        .eq("id", params.id)
        .eq("user_id", user.id)
        .single()

    if (error || !trip) {
        redirect("/profile")
    }

    return (
        <main className="min-h-screen bg-black">
            <Navbar />

            <div className="container mx-auto px-4 pt-24 pb-12">
                <TripItinerary
                    data={trip.trip_data as any}
                    isHalal={trip.is_halal}
                    // Not shared, so "Save" (already saved) and "Share" buttons appear
                    isShared={false}
                    tripId={trip.id}
                />
            </div>
        </main>
    )
}
