"use client"

import { useState, useCallback, useRef, useEffect } from 'react'

export interface UseTextToSpeechReturn {
    speak: (text: string) => void
    stop: () => void
    isSpeaking: boolean
    isSupported: boolean
    voices: SpeechSynthesisVoice[]
}

export function useTextToSpeech(): UseTextToSpeechReturn {
    const [isSpeaking, setIsSpeaking] = useState(false)
    const [isSupported, setIsSupported] = useState(false)
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])

    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

    // Initialize on mount
    useEffect(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setIsSupported(true)

            // Load voices (may be async in some browsers)
            const loadVoices = () => {
                const availableVoices = window.speechSynthesis.getVoices()
                setVoices(availableVoices)
            }

            loadVoices()

            // Chrome loads voices asynchronously
            window.speechSynthesis.onvoiceschanged = loadVoices
        }

        return () => {
            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel()
            }
        }
    }, [])

    const speak = useCallback((text: string) => {
        if (!isSupported || !text.trim()) return

        // Cancel any ongoing speech
        window.speechSynthesis.cancel()

        // Clean text for speech (remove markdown, emojis, etc.)
        const cleanText = text
            .replace(/\*\*/g, '') // Remove bold markers
            .replace(/\*/g, '') // Remove italic markers
            .replace(/#{1,6}\s/g, '') // Remove headers
            .replace(/```[\s\S]*?```/g, '') // Remove code blocks
            .replace(/`[^`]*`/g, '') // Remove inline code
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert links to text
            .replace(/[•\-]\s/g, '') // Remove bullet points
            .replace(/\n+/g, '. ') // Convert newlines to pauses
            .trim()

        if (!cleanText) return

        const utterance = new SpeechSynthesisUtterance(cleanText)

        // Select a natural-sounding voice (prefer Google or Microsoft voices)
        const preferredVoices = voices.filter(v =>
            v.name.includes('Google') ||
            v.name.includes('Microsoft') ||
            v.name.includes('Samantha') || // macOS
            v.name.includes('Alex') // macOS
        )

        // Prefer female voices for a concierge feel
        const femaleVoice = preferredVoices.find(v =>
            v.name.toLowerCase().includes('female') ||
            v.name.includes('Samantha') ||
            v.name.includes('Google UK English Female')
        )

        utterance.voice = femaleVoice || preferredVoices[0] || voices[0] || null
        utterance.rate = 1.0
        utterance.pitch = 1.0
        utterance.volume = 1.0

        utterance.onstart = () => {
            setIsSpeaking(true)
        }

        utterance.onend = () => {
            setIsSpeaking(false)
        }

        utterance.onerror = (event) => {
            // "interrupted" and "canceled" are expected when we stop speech manually
            if (event.error === 'interrupted' || event.error === 'canceled') {
                setIsSpeaking(false)
                return
            }
            console.error('TTS Error:', event.error)
            setIsSpeaking(false)
        }

        utteranceRef.current = utterance
        window.speechSynthesis.speak(utterance)
    }, [isSupported, voices])

    const stop = useCallback(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel()
            setIsSpeaking(false)
        }
    }, [])

    return {
        speak,
        stop,
        isSpeaking,
        isSupported,
        voices
    }
}
