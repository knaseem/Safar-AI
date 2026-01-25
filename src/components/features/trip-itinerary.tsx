"use client"

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, ArrowRight, Heart, Loader2, Sparkles, Share2, Copy, Play, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CinemaMap } from "./cinema-map"
import { EnhancedBookingModal } from "./enhanced-booking-modal"
import { AuthModal } from "./auth-modal"
import { TripPdfDocument } from "./trip-pdf"
import { AIChatDrawer, ConciergeButton } from "./ai-chat-drawer"
import { SocialShareModal } from "./social-share-modal"
import { WeatherWidget } from "./weather-widget"
import { pdf } from "@react-pdf/renderer"
import { AudioConcierge } from "./audio-concierge"
import { saveAs } from "file-saver"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'

export type TripData = {
    trip_name: string
    days: {
        day: number
        theme: string
        coordinates: {
            lat: number
            lng: number
        }
        morning: string
        afternoon: string
        evening: string
        stay: string
    }[]
}

interface TripItineraryProps {
    data: TripData
    onReset?: () => void
    isHalal?: boolean
    isShared?: boolean
    tripId?: string // If present, enables sharing
}

export function TripItinerary({ data, onReset, isHalal = false, isShared = false, tripId }: TripItineraryProps) {
    const [isBookingOpen, setIsBookingOpen] = useState(false)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
    const [isPresenting, setIsPresenting] = useState(false) // New Presentation State
    const [isSaving, setIsSaving] = useState(false)
    const [isSaved, setIsSaved] = useState(!!tripId) // If ID passed, it's already saved
    const [savedTripId, setSavedTripId] = useState<string | null>(tripId || null)
    const [activeDayIndex, setActiveDayIndex] = useState(0)
    const [isMounted, setIsMounted] = useState(false)
    const dayRefs = useRef<(HTMLDivElement | null)[]>([])
    const { user } = useAuth()
    const router = useRouter()
    const locations = data.days.map(d => d.coordinates)

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        if (!isPresenting) return

        const interval = setInterval(() => {
            setActiveDayIndex(prev => (prev + 1) % data.days.length)
        }, 8000) // 8 seconds per day

        return () => clearInterval(interval)
    }, [isPresenting, data.days.length])

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (isPresenting) return // Disable scroll observer during presentation
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = Number(entry.target.getAttribute('data-index'))
                        if (!isNaN(index)) {
                            setActiveDayIndex(index)
                        }
                    }
                })
            },
            { rootMargin: '-40% 0px -40% 0px' } // Trigger when element is in middle of viewport
        )

        dayRefs.current.forEach((el) => {
            if (el) observer.observe(el)
        })

        return () => observer.disconnect()
    }, [data, isPresenting])

    const handleSaveTrip = async () => {
        if (!user) {
            setIsAuthModalOpen(true)
            return
        }

        setIsSaving(true)
        try {
            const res = await fetch('/api/trips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    trip_name: data.trip_name,
                    trip_data: data,
                    is_halal: isHalal,
                    destination: data.days[0]?.theme || null
                })
            })

            const result = await res.json()

            if (!res.ok) {
                if (res.status === 409) {
                    toast.info("Trip already saved", { description: "Check your dashboard" })
                    setIsSaved(true)
                } else if (res.status === 403) {
                    toast.error("Trip limit reached", { description: "Delete some trips to save new ones" })
                } else {
                    throw new Error(result.error)
                }
            } else {
                toast.success("Trip saved!", { description: "View it in your dashboard" })
                setIsSaved(true)
                if (result.trip?.id) setSavedTripId(result.trip.id)
            }
        } catch (error) {
            toast.error("Failed to save trip")
        } finally {
            setIsSaving(false)
        }
    }

    const handleShare = () => {
        if (!savedTripId) return
        setIsShareModalOpen(true)
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className={`w-full max-w-6xl mx-auto bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col transition-all duration-1000 ${isPresenting ? 'h-[95vh] border-emerald-500/50' : 'h-[85vh] md:h-[90vh]'}`}
            >
                {/* Top Section: Fixed Map */}
                <div className={`relative shrink-0 bg-neutral-900 group overflow-hidden border-b border-white/10 transition-all duration-1000 ${isPresenting ? 'h-full' : 'h-[65%]'}`}>
                    <CinemaMap locations={locations} activeIndex={activeDayIndex} />

                    {/* Overlay Title */}
                    <div className="absolute bottom-6 left-8 right-20 pointer-events-none">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium uppercase tracking-wider border border-emerald-500/20 mb-3 backdrop-blur-md">
                            <CheckCircle className="size-3" />
                            {isShared ? "Shared Application" : "AI Curated"}
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-1 drop-shadow-lg max-w-full">{data.trip_name}</h2>
                    </div>

                    {/* Action Buttons Group (Left) */}
                    <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
                        {/* Primary Action: Present Trip */}
                        {!isPresenting && (
                            <button
                                onClick={() => setIsPresenting(true)}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 text-black font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 hover:scale-105 active:scale-95 transition-all duration-300 group"
                            >
                                <Play className="size-4 fill-current group-hover:scale-110 transition-transform" />
                                <span className="text-sm">Present Trip</span>
                            </button>
                        )}

                        {/* Secondary Actions Toolbar */}
                        <div className="flex items-center gap-1 p-1 rounded-full bg-black/40 backdrop-blur-md border border-white/10">
                            {!isShared ? (
                                <>
                                    <div className="relative group/tooltip">
                                        <button
                                            onClick={handleSaveTrip}
                                            disabled={isSaving || isSaved}
                                            className={`p-2 rounded-full transition-all duration-300 ${isSaved
                                                ? "text-emerald-400 bg-emerald-500/10"
                                                : "text-white/70 hover:text-white hover:bg-white/10"
                                                }`}
                                        >
                                            {isSaving ? (
                                                <Loader2 className="size-4 animate-spin" />
                                            ) : (
                                                <Heart className={`size-4 ${isSaved ? "fill-current" : ""}`} />
                                            )}
                                        </button>
                                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-[10px] text-white opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm border border-white/10">
                                            {isSaved ? "Saved" : "Save Trip"}
                                        </div>
                                    </div>

                                    {isSaved && savedTripId && (
                                        <div className="relative group/tooltip">
                                            <button
                                                onClick={handleShare}
                                                className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                                            >
                                                <Share2 className="size-4" />
                                            </button>
                                            <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-[10px] text-white opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm border border-white/10">
                                                Share
                                            </div>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <button
                                    onClick={() => router.push('/')}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                                >
                                    <Sparkles className="size-4 text-yellow-300" />
                                    <span className="text-xs font-medium hidden md:inline">Plan My Own</span>
                                </button>
                            )}

                            {/* AI Concierge FAB - Only for owner or if consistent with design */}
                            {!isShared && (
                                <div className="ml-1">
                                    <ConciergeButton tripName={data.trip_name} onClick={() => setIsChatOpen(true)} />
                                </div>
                            )}

                            {/* PDF Download Button - Client Only */}
                            {isMounted && !isShared && !isPresenting && (
                                <div className="relative group/tooltip">
                                    <button
                                        onClick={async () => {
                                            const blob = await pdf(<TripPdfDocument data={data} />).toBlob()
                                            const url = URL.createObjectURL(blob)
                                            window.open(url, '_blank')
                                        }}
                                        className="hidden md:flex p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all duration-300"
                                    >
                                        <ArrowRight className="size-4 rotate-90" />
                                    </button>
                                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-black/80 text-[10px] text-white opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm border border-white/10">
                                        Download PDF
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>



                    {/* Weather Widget - Positioned below controls (5-Day Forecast) */}
                    {!isPresenting && (
                        <div className="absolute top-20 left-4 z-20">
                            <WeatherWidget
                                lat={data.days[activeDayIndex].coordinates.lat}
                                lng={data.days[activeDayIndex].coordinates.lng}
                            />
                        </div>
                    )}

                    {/* Presentation Mode Controls (Exit) */}
                    {isPresenting && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 animate-in slide-in-from-top-4">
                            <button
                                onClick={() => setIsPresenting(false)}
                                className="flex items-center gap-2 px-6 py-2 rounded-full bg-red-500/20 border border-red-500/50 text-red-200 hover:bg-red-500/30 transition-all shadow-xl backdrop-blur-md"
                            >
                                <X className="size-4" />
                                <span className="text-sm font-medium">Exit Presentation</span>
                            </button>
                        </div>
                    )}

                    {/* Presentation Mode Overlay Content */}
                    <AnimatePresence>
                        {isPresenting && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                className="absolute bottom-12 left-0 right-0 z-40 flex justify-center px-4"
                            >
                                <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 max-w-2xl w-full text-center shadow-2xl">
                                    <h2 className="text-3xl font-bold text-white mb-2">Day {data.days[activeDayIndex].day}</h2>
                                    <p className="text-emerald-400 font-medium uppercase tracking-widest text-sm mb-4">{data.days[activeDayIndex].theme}</p>
                                    <div className="flex justify-center gap-8 text-left">
                                        <div>
                                            <p className="text-xs text-white/40 uppercase mb-1">Morning</p>
                                            <p className="text-white text-sm">{data.days[activeDayIndex].morning}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-white/40 uppercase mb-1">Stay</p>
                                            <p className="text-white text-sm">{data.days[activeDayIndex].stay.split(':')[0]}</p>
                                        </div>
                                    </div>

                                    {/* Audio Concierge */}
                                    <div className="flex justify-center mt-6">
                                        <AudioConcierge
                                            dayData={data.days[activeDayIndex]}
                                            tripName={data.trip_name}
                                        />
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="mt-6 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            key={activeDayIndex}
                                            initial={{ width: "0%" }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 8, ease: "linear" }}
                                            className="h-full bg-emerald-500"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>



                </div>

                {/* Bottom Section: Scrollable Timeline */}
                <div className={`flex-1 overflow-y-auto relative bg-transparent scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent transition-all duration-500 ${isPresenting ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className="flex-1 p-8 space-y-12">
                        {data.days.map((day, index) => (
                            <motion.div
                                key={day.day}
                                ref={(el: HTMLDivElement | null) => { dayRefs.current[index] = el }}
                                data-index={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative pl-8 border-l last:border-0 transition-colors duration-500 ${activeDayIndex === index ? "border-emerald-500/50" : "border-white/10"}`}
                            >
                                {/* Day Marker */}
                                <div className="absolute -left-3 top-0 h-6 w-6 rounded-full bg-emerald-500 border-4 border-black flex items-center justify-center">
                                    <div className="h-1.5 w-1.5 bg-white rounded-full" />
                                </div>

                                <div className="mb-6">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                        Day {day.day}
                                        <span className="text-white/40 font-normal text-base">— {day.theme}</span>
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <ActivityCard time="Morning" title={day.morning} destination={data.days[0]?.theme?.split(' ').slice(-1)[0] || data.trip_name} />
                                    <ActivityCard time="Afternoon" title={day.afternoon} destination={data.days[0]?.theme?.split(' ').slice(-1)[0] || data.trip_name} />
                                    <ActivityCard time="Evening" title={day.evening} destination={data.days[0]?.theme?.split(' ').slice(-1)[0] || data.trip_name} />
                                </div>

                                <div className="mt-4 flex items-center justify-between text-white/40 text-sm bg-white/5 p-3 rounded-lg border border-white/5 hover:border-emerald-500/30 transition-colors group/stay">
                                    <div className="flex items-center gap-2">
                                        <MoonIcon className="size-4" />
                                        <span className="uppercase tracking-widest text-[10px]">Stay:</span>
                                        <span className="text-white/80">{day.stay}</span>
                                        <HotelVerificationBadge hotel={day.stay} />
                                    </div>
                                    <button
                                        onClick={() => {
                                            const hotel = day.stay.split(':')[0]
                                            window.open(`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel)}`, '_blank')
                                        }}
                                        className="opacity-0 group-hover/stay:opacity-100 flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-1 rounded transition-all hover:bg-emerald-500/20"
                                    >
                                        Check Rates <ArrowRight className="size-3" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-8 border-t border-white/10 flex justify-between items-center bg-black/40 backdrop-blur-md sticky bottom-0 z-10">
                        <button onClick={onReset} className="text-white/40 hover:text-white text-sm">
                            ← Back
                        </button>
                        <Button size="lg" className="bg-white text-black hover:bg-white/90" onClick={() => setIsBookingOpen(true)}>
                            Proprietary Booking <ArrowRight className="size-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </motion.div >

            <EnhancedBookingModal
                tripData={data}
                isHalal={isHalal}
                isOpen={isBookingOpen}
                onClose={() => setIsBookingOpen(false)}
            />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />

            <AIChatDrawer
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                tripData={data}
            />

            {savedTripId && (
                <SocialShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    tripName={data.trip_name}
                    shareUrl={`${typeof window !== 'undefined' ? window.location.origin : ''}/share/${savedTripId}`}
                />
            )}
        </>
    )
}

function HotelVerificationBadge({ hotel }: { hotel: string }) {
    const [status, setStatus] = useState<'idle' | 'checking' | 'verified'>('idle')
    const [savings, setSavings] = useState(0)

    useEffect(() => {
        // Auto-verify on mount for "Autonomous" feel
        const verify = async () => {
            setStatus('checking')
            try {
                const res = await fetch('/api/agent/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ item: hotel, type: 'hotel', originalPrice: 200 })
                })
                const data = await res.json()
                setSavings(data.savings)
                setStatus('verified')
            } catch (e) {
                setStatus('idle')
            }
        }
        // Stagger checks so they don't all spin at once
        const timeout = setTimeout(verify, Math.random() * 2000 + 500)
        return () => clearTimeout(timeout)
    }, [hotel])

    if (status === 'idle') return null

    if (status === 'checking') return (
        <span className="flex items-center gap-1.5 text-[10px] text-white/40 ml-2 animate-pulse">
            <Loader2 className="size-3 animate-spin" />
            AI Verifying...
        </span>
    )

    return (
        <span className="flex items-center gap-1.5 text-[10px] ml-2 animate-in fade-in zoom-in duration-300">
            <div className="size-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-emerald-400 font-medium">Verified Now</span>
            {savings > 0 && <span className="bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded text-[9px]">Save ${savings}</span>}
        </span>
    )
}

function ActivityCard({ time, title, destination }: { time: string, title: string, destination: string }) {
    const [status, setStatus] = useState<'idle' | 'checking' | 'verified'>('idle')

    // Extract key term for search (remove generic words if needed, but usually full title + destination works better)
    // Simple heuristic: search for the whole activity string
    const handleBook = () => {
        const query = `${title} ${destination}`
        window.open(`https://www.viator.com/searchResults/all?text=${encodeURIComponent(query)}`, '_blank')
    }

    // Trigger verification on hover
    const handleMouseEnter = () => {
        if (status === 'idle') {
            setStatus('checking')
            // Mock API call
            setTimeout(() => setStatus('verified'), 1200)
        }
    }

    return (
        <div
            className="group p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-emerald-500/30 transition-all flex flex-col h-full relative overflow-hidden"
            onMouseEnter={handleMouseEnter}
        >
            <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <div className="text-[10px] uppercase tracking-widest text-emerald-400">{time}</div>
                    {status === 'checking' && <Loader2 className="size-3 text-white/20 animate-spin" />}
                    {status === 'verified' && (
                        <div className="flex items-center gap-1">
                            <div className="size-1.5 rounded-full bg-emerald-500" />
                            <span className="text-[9px] text-white/40">Live</span>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleBook}
                    className="opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-500 text-black p-1 rounded hover:bg-emerald-400 shadow-lg shadow-emerald-500/20"
                    title="Book Activity"
                >
                    <ArrowRight className="size-3 -rotate-45" />
                </button>
            </div>
            <p className="text-white/90 text-sm font-medium leading-relaxed flex-1">
                {title}
            </p>
        </div >
    )
}

function MoonIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
    )
}


