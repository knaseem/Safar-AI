"use client"

import { useState, useCallback, useRef, useEffect } from 'react'

// Type definitions for Web Speech API
interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList
    resultIndex: number
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string
    message?: string
}

interface SpeechRecognition extends EventTarget {
    continuous: boolean
    interimResults: boolean
    lang: string
    start: () => void
    stop: () => void
    abort: () => void
    onresult: ((event: SpeechRecognitionEvent) => void) | null
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
    onend: (() => void) | null
    onstart: (() => void) | null
}

declare global {
    interface Window {
        SpeechRecognition: new () => SpeechRecognition
        webkitSpeechRecognition: new () => SpeechRecognition
    }
}

export interface UseVoiceInputReturn {
    isListening: boolean
    transcript: string
    error: string | null
    isSupported: boolean
    startListening: () => void
    stopListening: () => void
    resetTranscript: () => void
}

export function useVoiceInput(): UseVoiceInputReturn {
    const [isListening, setIsListening] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isSupported, setIsSupported] = useState(false)

    const recognitionRef = useRef<SpeechRecognition | null>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Check browser support on mount
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
        setIsSupported(!!SpeechRecognition)

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition()
            recognition.continuous = false
            recognition.interimResults = true
            recognition.lang = 'en-US'

            recognition.onstart = () => {
                setIsListening(true)
                setError(null)
            }

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let finalTranscript = ''
                let interimTranscript = ''

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const result = event.results[i]
                    if (result.isFinal) {
                        finalTranscript += result[0].transcript
                    } else {
                        interimTranscript += result[0].transcript
                    }
                }

                // Show interim results while speaking, final when done
                setTranscript(finalTranscript || interimTranscript)

                // Reset the silence timeout on each result
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                }

                // Auto-stop after 2 seconds of silence (only for final results)
                if (finalTranscript) {
                    timeoutRef.current = setTimeout(() => {
                        recognition.stop()
                    }, 500)
                }
            }

            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error:', event.error)

                switch (event.error) {
                    case 'no-speech':
                        setError('No speech detected. Please try again.')
                        break
                    case 'audio-capture':
                        setError('No microphone found. Please check your device.')
                        break
                    case 'not-allowed':
                        setError('Microphone access denied. Please allow access in your browser settings.')
                        break
                    case 'network':
                        setError('Network error. Please check your connection.')
                        break
                    default:
                        setError(`Error: ${event.error}`)
                }

                setIsListening(false)
            }

            recognition.onend = () => {
                setIsListening(false)
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current)
                }
            }

            recognitionRef.current = recognition
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort()
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    const startListening = useCallback(() => {
        if (!recognitionRef.current) {
            setError('Speech recognition not supported in this browser')
            return
        }

        setTranscript('')
        setError(null)

        try {
            recognitionRef.current.start()
        } catch (err) {
            // Already started, stop and restart
            recognitionRef.current.stop()
            setTimeout(() => {
                recognitionRef.current?.start()
            }, 100)
        }
    }, [])

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
        }
    }, [isListening])

    const resetTranscript = useCallback(() => {
        setTranscript('')
        setError(null)
    }, [])

    return {
        isListening,
        transcript,
        error,
        isSupported,
        startListening,
        stopListening,
        resetTranscript
    }
}
