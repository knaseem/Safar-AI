"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Globe, Map, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { generateAffiliateLink } from '@/lib/affiliate'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

const MAP_STYLES = {
    dark: 'mapbox://styles/mapbox/dark-v11',
    satellite: 'mapbox://styles/mapbox/satellite-streets-v12',
}

interface TripMarker {
    id: string
    title: string
    coordinates: { lat: number; lng: number }
    status: 'past' | 'future' | 'current'
    date: string
    stats?: {
        miles: number
        days: number
        photos: number
    }
}

export function WorldGlobe() {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<mapboxgl.Map | null>(null)
    const [isSatellite, setIsSatellite] = useState(true)
    const [selectedTrip, setSelectedTrip] = useState<TripMarker | null>(null)
    const [trips, setTrips] = useState<TripMarker[]>([])
    const [loading, setLoading] = useState(true)

    // CSS override for minimal attribution (consistent with CinemaMap)
    const mapboxStyles = `
    .mapboxgl-ctrl-attrib { display: none !important; }
    .mapboxgl-ctrl-logo { display: none !important; }
    `

    // Fetch Trips on mount
    useEffect(() => {
        const fetchTrips = async () => {
            try {
                // Fetch both Saved Trips and Bookings (Future: combine them)
                const res = await fetch('/api/trips')
                const data = await res.json()

                if (data.trips) {
                    const mappedTrips: TripMarker[] = data.trips.map((trip: any) => {
                        // Extract first day coordinates as trip location
                        const firstDay = trip.trip_data?.days?.[0]
                        const lat = firstDay?.coordinates?.lat || 0
                        const lng = firstDay?.coordinates?.lng || 0

                        // Calculate basic stats
                        const days = trip.trip_data?.days?.length || 0
                        // Rough estimate: 50 miles per day of activity + flight (placeholder)
                        const miles = days * 120

                        return {
                            id: trip.id,
                            title: trip.trip_name,
                            coordinates: { lat, lng },
                            status: 'past', // Defaulting to past/saved for now. In real app, check dates.
                            date: new Date(trip.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                            stats: {
                                miles,
                                days,
                                photos: Math.floor(Math.random() * 50) + 10 // Mock photo count
                            }
                        }
                    })

                    // Add a "Home Base" (NYC for demo) if not present
                    mappedTrips.push({
                        id: 'home',
                        title: 'Home Base (NYC)',
                        coordinates: { lat: 40.7128, lng: -74.0060 },
                        status: 'current',
                        date: 'Now',
                        stats: { miles: 0, days: 0, photos: 0 }
                    })

                    setTrips(mappedTrips)
                }
            } catch (e) {
                console.error("Failed to fetch world data", e)
            } finally {
                setLoading(false)
            }
        }

        fetchTrips()
    }, [])

    useEffect(() => {
        if (!mapContainer.current || !MAPBOX_TOKEN) return
        if (trips.length === 0 && loading) return // Wait for data... except if empty?

        mapboxgl.accessToken = MAPBOX_TOKEN

        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: isSatellite ? MAP_STYLES.satellite : MAP_STYLES.dark,
            projection: 'globe', // Enable 3D Globe
            center: [-20, 20], // Atlantic view
            zoom: 1.5,
            pitch: 0,
            bearing: 0,
            interactive: true
        })

        const m = map.current

        m.on('style.load', () => {
            // Deep Space Atmosphere
            m.setFog({
                color: 'rgb(5, 5, 10)', // Deep dark blue horizon
                'high-color': 'rgb(0, 0, 0)', // Pitch black upper sky
                'horizon-blend': 0.2, // Smoother blend
                'space-color': 'rgb(0, 0, 0)', // Black space
                'star-intensity': 1.0 // Max stars
            } as any)
        })

        m.on('load', () => {
            if (trips.length === 0) return

            // Add Flight Arcs
            const home = trips.find(t => t.status === 'current') || trips[0]

            if (home) {
                trips.filter(t => t.id !== home.id).forEach((trip, i) => {
                    // Create Great Circle Arc
                    const start = [home.coordinates.lng, home.coordinates.lat]
                    const end = [trip.coordinates.lng, trip.coordinates.lat]

                    // Simple distinct ID for each arc
                    const arcId = `arc-${i}`

                    // Generate points for the arc
                    // In a real implementation, we'd use a great-circle calculation library
                    // For now, Mapbox GL's globe projection handles straight lines as great circles automatically!
                    // We just need a LineString.

                    m.addSource(arcId, {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'LineString',
                                coordinates: [start, end]
                            }
                        }
                    })

                    // Animated Dash Effect
                    m.addLayer({
                        id: arcId,
                        type: 'line',
                        source: arcId,
                        layout: {
                            'line-cap': 'round',
                            'line-join': 'round'
                        },
                        paint: {
                            'line-color': '#ffffff', // White
                            'line-width': 2,
                            'line-opacity': 0.6,
                            'line-dasharray': [0, 4, 3] // Dashed line
                        }
                    })

                    // Optional: Animate the dash offset in a requestAnimationFrame loop if we want movement
                })
            }

            // 3D Beacons (Extrusions)
            const beaconFeatures = trips.map((trip) => {
                const isPast = trip.status === 'past'
                const color = isPast ? '#f59e0b' : '#38bdf8' // Amber-500 : Sky-400
                const height = isPast ? 800000 : 400000 // Past trips are taller beacons

                // Create a small polygon (hexagon) around the point for extrusion
                const radius = 0.5 // Degrees
                const center = [trip.coordinates.lng, trip.coordinates.lat]
                const points = []
                for (let i = 0; i < 6; i++) {
                    const angle = (i * 60 * Math.PI) / 180
                    points.push([
                        center[0] + radius * Math.cos(angle),
                        center[1] + radius * Math.sin(angle)
                    ])
                }
                points.push(points[0]) // Close ring

                return {
                    type: 'Feature',
                    properties: { color, height, base_height: 0 },
                    geometry: {
                        type: 'Polygon',
                        coordinates: [points]
                    }
                }
            })

            m.addSource('beacons', {
                type: 'geojson',
                data: {
                    type: 'FeatureCollection',
                    features: beaconFeatures as any
                }
            })

            m.addLayer({
                id: 'beacons-extrusion',
                type: 'fill-extrusion',
                source: 'beacons',
                paint: {
                    'fill-extrusion-color': ['get', 'color'],
                    'fill-extrusion-height': ['get', 'height'],
                    'fill-extrusion-base': ['get', 'base_height'],
                    'fill-extrusion-opacity': 0.6
                }
            })

            // Add Markers (UI Overlays)
            trips.forEach((trip) => {
                const el = document.createElement('div')
                const isPast = trip.status === 'past'
                const isCurrent = trip.status === 'current'

                let color = 'rgb(56, 189, 248)' // Future: Blue
                if (isPast) color = 'rgb(251, 191, 36)' // Past: Gold
                if (isCurrent) color = 'rgb(255, 255, 255)' // Current: White

                const glow = color.replace('rgb', 'rgba').replace(')', ', 0.4)')

                el.className = 'marker-container group cursor-pointer'
                el.innerHTML = `
                    <div class="relative flex items-center justify-center w-8 h-8">
                        <div class="absolute inset-0 rounded-full animate-ping opacity-75" style="background-color: ${glow}"></div>
                        <div class="relative w-3 h-3 rounded-full shadow-[0_0_15px_${glow}]" style="background-color: ${color}"></div>
                        
                        <!-- Tooltip -->
                        <div class="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 backdrop-blur border border-white/10 rounded text-[10px] text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            ${trip.title}
                        </div>
                    </div>
                `

                // Click handler
                el.addEventListener('click', (e) => {
                    e.stopPropagation()
                    setSelectedTrip(trip)
                    m.flyTo({
                        center: [trip.coordinates.lng, trip.coordinates.lat],
                        zoom: 4,
                        duration: 2000,
                        essential: true
                    })
                })

                new mapboxgl.Marker(el)
                    .setLngLat([trip.coordinates.lng, trip.coordinates.lat])
                    .addTo(m)
            })
        })

        return () => m.remove()
    }, [trips, loading]) // Re-run when trips loaded

    // Update style without full reload if possible
    useEffect(() => {
        if (!map.current) return
        map.current.setStyle(isSatellite ? MAP_STYLES.satellite : MAP_STYLES.dark)
    }, [isSatellite])

    // Calculate Stats
    const totalMiles = trips.reduce((acc, t) => acc + (t.stats?.miles || 0), 0)
    const countriesConquered = trips.filter(t => t.status === 'past').length

    return (
        <div className="relative h-screen w-screen bg-black overflow-hidden">
            <style dangerouslySetInnerHTML={{ __html: mapboxStyles }} />
            <div ref={mapContainer} className="h-full w-full" />

            {/* Overlay UI - Top Left: Back Button */}
            <div className="absolute top-6 left-6 z-10">
                <Button variant="outline" className="rounded-full bg-black/40 backdrop-blur-md border-white/10 text-white hover:bg-white/10" onClick={() => window.history.back()}>
                    <ArrowRight className="size-4 rotate-180 mr-2" /> Back to Dashboard
                </Button>
            </div>

            {/* Top Right: Controls */}
            <div className="absolute top-6 right-6 z-10 flex flex-col gap-2">
                <Button size="icon" className="rounded-full bg-black/40 backdrop-blur-md border-white/10 hover:bg-white/10" onClick={() => setIsSatellite(!isSatellite)}>
                    {isSatellite ? <Map className="size-4" /> : <Globe className="size-4" />}
                </Button>
            </div>

            {/* Title / Header - Floating */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none text-center">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 mb-2">
                    <Globe className="size-3 text-emerald-400 mr-2" />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-white/60">SafarAI World Log</span>
                </div>
                <h1 className="text-3xl font-bold text-white drop-shadow-2xl tracking-tight">Global Connectivity</h1>
            </div>

            {/* Bottom Stats HUD */}
            <div className="absolute bottom-8 left-8 z-10 hidden md:flex items-center gap-6">
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-white/40 tracking-wider">Countries Conquered</span>
                    <span className="text-2xl font-mono text-emerald-400">{countriesConquered}</span>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex flex-col">
                    <span className="text-[10px] uppercase text-white/40 tracking-wider">Total Distance</span>
                    <span className="text-2xl font-mono text-blue-400">{totalMiles.toLocaleString()} <span className="text-sm text-white/20">mi</span></span>
                </div>
            </div>

            {/* Selected Trip Modal */}
            <AnimatePresence>
                {selectedTrip && (
                    <motion.div
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        className="absolute top-24 right-6 z-20 w-80"
                    >
                        <div className="bg-black/60 backdrop-blur-xl border border-white/10 p-6 rounded-2xl shadow-2xl relative overflow-hidden">
                            {/* Close button */}
                            <button onClick={() => setSelectedTrip(null)} className="absolute top-4 right-4 text-white/40 hover:text-white">
                                <X className="size-4" />
                            </button>

                            {/* Content */}
                            <div className="mb-4">
                                <div className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium mb-2 ${selectedTrip.status === 'past' ? 'bg-amber-500/20 text-amber-300' : 'bg-blue-500/20 text-blue-300'}`}>
                                    {selectedTrip.status === 'past' ? 'Completed Mission' : 'Upcoming Target'}
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-1">{selectedTrip.title}</h2>
                                <p className="text-white/40 text-sm">{selectedTrip.date}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="bg-white/5 rounded-lg p-3">
                                    <span className="text-[10px] text-white/30 block mb-1">Duration</span>
                                    <span className="text-lg text-white">{selectedTrip.stats?.days} Days</span>
                                </div>
                                <div className="bg-white/5 rounded-lg p-3">
                                    <span className="text-[10px] text-white/30 block mb-1">Memories</span>
                                    <span className="text-lg text-white">{selectedTrip.stats?.photos} Photos</span>
                                </div>
                            </div>

                            <Button
                                onClick={() => {
                                    if (!selectedTrip) return
                                    const url = generateAffiliateLink('general', {
                                        destination: selectedTrip.title,
                                        name: 'Full Trip Package'
                                    })
                                    window.open(url, '_blank')
                                }}
                                className="w-full bg-white text-black hover:bg-emerald-400 hover:text-black font-medium transition-colors"
                            >
                                Book Full Itinerary
                            </Button>

                            {/* Background Glow */}
                            <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] pointer-events-none opacity-20 ${selectedTrip.status === 'past' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
