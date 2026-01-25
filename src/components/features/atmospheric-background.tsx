"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AtmosphericBackgroundProps {
    destination: string
    timeOfDay: 'Morning' | 'Afternoon' | 'Evening'
}

// Curated high-quality fallbacks to ensure premium look immediately
const FALLBACK_IMAGES: Record<string, Record<string, string>> = {
    'default': {
        'Morning': 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?q=80&w=2070&auto=format&fit=crop', // Sunrise nature
        'Afternoon': 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=2070&auto=format&fit=crop', // Bright nature
        'Evening': 'https://images.unsplash.com/photo-1519608400483-aa24742dac08?q=80&w=2074&auto=format&fit=crop', // Starry night
    },
    'Tokyo': {
        'Morning': 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop', // Shibuya bright
        'Afternoon': 'https://images.unsplash.com/photo-1526481280693-3bfa1368062e?q=80&w=2071&auto=format&fit=crop', // Gardens
        'Evening': 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1974&auto=format&fit=crop', // Neon Cyberpunk
    },
    'Paris': {
        'Morning': 'https://images.unsplash.com/photo-1471623320832-752e8bbf8413?q=80&w=1955&auto=format&fit=crop', // Louvre sunrise
        'Afternoon': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop', // Eiffel bright
        'Evening': 'https://images.unsplash.com/photo-1492136344046-866c85e0bf04?q=80&w=2028&auto=format&fit=crop', // Paris Night
    },
    'Dubai': {
        'Morning': 'https://images.unsplash.com/photo-1547667865-68097b973b7e?q=80&w=2070&auto=format&fit=crop', // Desert sunrise
        'Afternoon': 'https://images.unsplash.com/photo-1512453979798-5ea90b7cad11?q=80&w=1974&auto=format&fit=crop', // Burj Khalifa
        'Evening': 'https://images.unsplash.com/photo-1518684079-3c830dcef637?q=80&w=1974&auto=format&fit=crop', // Dubai Night
    }
}

export function AtmosphericBackground({ destination, timeOfDay }: AtmosphericBackgroundProps) {
    const [imageUrl, setImageUrl] = useState(FALLBACK_IMAGES['default']['Morning'])
    const [debouncedTime, setDebouncedTime] = useState(timeOfDay)

    // Debounce state updates to prevent rapid flickering during fast scrolls
    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedTime(timeOfDay)
        }, 500)
        return () => clearTimeout(timeout)
    }, [timeOfDay])

    // Update Image based on props
    useEffect(() => {
        // Try to find specific city match
        let selectedUrl = ''
        const cityKey = Object.keys(FALLBACK_IMAGES).find(k => destination.toLowerCase().includes(k.toLowerCase()))

        if (cityKey) {
            selectedUrl = FALLBACK_IMAGES[cityKey][debouncedTime]
        } else {
            // Fallback to searching Unsplash dynamically if we don't have hardcoded city
            // For safety in this MVP, we stick to generic nature/city fallbacks if not matched
            selectedUrl = FALLBACK_IMAGES['default'][debouncedTime]
        }

        if (selectedUrl) setImageUrl(selectedUrl)
    }, [destination, debouncedTime])

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
            <AnimatePresence mode='popLayout'>
                <motion.div
                    key={imageUrl}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-full h-full"
                >
                    {/* The Background Image */}
                    <img
                        src={imageUrl}
                        alt="Atmospheric Background"
                        className="w-full h-full object-cover opacity-60"
                    />

                    {/* Overlays for readability */}
                    {/* 1. Global Darkener */}
                    <div className="absolute inset-0 bg-black/50" />

                    {/* 2. Gradient Vignette */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

                    {/* 3. Grain/Noise for texture */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Ambient Color tints based on time */}
            <motion.div
                animate={{
                    backgroundColor: debouncedTime === 'Evening' ? 'rgba(0,0,30,0.4)' : 'rgba(255,200,100,0.1)'
                }}
                transition={{ duration: 2 }}
                className="absolute inset-0 mix-blend-overlay"
            />
        </div>
    )
}
