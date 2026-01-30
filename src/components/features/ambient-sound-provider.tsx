"use client"

import { useEffect, useRef, useState, createContext, useContext } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

// Context to allow other components to trigger mood changes
type SoundTheme = 'city' | 'nature' | 'ocean' | 'desert' | 'cafe' | 'quiet'

interface SoundContextType {
    setTheme: (theme: SoundTheme) => void
    isMuted: boolean
    toggleMute: () => void
}

const SoundContext = createContext<SoundContextType>({
    setTheme: () => { },
    isMuted: true,
    toggleMute: () => { }
})

export const useSound = () => useContext(SoundContext)

// Local sound files
const SOUND_ASSETS: Record<string, string> = {
    city: '/sounds/city.ogg',
    nature: '/sounds/nature.mp3',
    ocean: '/sounds/ocean.ogg',
    desert: '/sounds/desert.ogg',
    cafe: '/sounds/cafe.ogg',
    quiet: ''
}

export function AmbientSoundProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<SoundTheme>('ocean') // Default to ocean (soothing waves)
    const [isMuted, setIsMuted] = useState(true)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const isPlayingRef = useRef(false) // Ref to track if we're in the middle of a play operation

    // Initial setup
    useEffect(() => {
        audioRef.current = new Audio()
        audioRef.current.loop = true
        audioRef.current.volume = 0

        return () => {
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
        }
    }, [])

    // Effect for volume cross-fading ONLY (not playing/pausing)
    useEffect(() => {
        if (!audioRef.current) return

        // If muted or quiet, desired vol is 0
        const targetVol = (isMuted || theme === 'quiet') ? 0 : 0.4

        const fade = setInterval(() => {
            if (!audioRef.current) return

            const current = audioRef.current.volume

            if (Math.abs(current - targetVol) < 0.05) {
                audioRef.current.volume = targetVol
                if (targetVol === 0 && !audioRef.current.paused) {
                    audioRef.current.pause()
                    isPlayingRef.current = false
                }
                clearInterval(fade)
            } else if (current < targetVol) {
                audioRef.current.volume += 0.05
            } else {
                audioRef.current.volume -= 0.05
            }
        }, 50)

        return () => clearInterval(fade)
    }, [isMuted, theme])

    // Effect for changing source track (only when already playing and theme changes)
    useEffect(() => {
        if (theme === 'quiet' || !audioRef.current || isMuted) return
        if (!isPlayingRef.current) return // Don't play if not already playing

        // User changed theme while already listening
        audioRef.current.src = SOUND_ASSETS[theme]
        audioRef.current.play().catch((e) => {
            console.log("Theme switch interrupted:", e.name)
        })
    }, [theme])

    const toggleMute = async () => {
        if (!audioRef.current) return

        if (isMuted) {
            // Unmuting - start playback
            try {
                isPlayingRef.current = true
                audioRef.current.src = SOUND_ASSETS[theme]
                audioRef.current.volume = 0.2 // Start audible, will fade to 0.4
                await audioRef.current.play()
                setIsMuted(false)
                console.log("SafarAI Soundscape playing:", theme)
            } catch (e) {
                console.error("Playback failed:", e)
                isPlayingRef.current = false
                setIsMuted(true)
            }
        } else {
            // Muting - will fade out via effect
            setIsMuted(true)
        }
    }

    return (
        <SoundContext.Provider value={{ setTheme, isMuted, toggleMute }}>
            {children}
        </SoundContext.Provider>
    )
}
