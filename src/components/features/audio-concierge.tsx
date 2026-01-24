"use client"

import { useState, useEffect, useRef } from "react"
import { Play, Pause, Square, Mic2, ChevronDown, Check, Loader2, Volume2, Mic } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"

interface AudioConciergeProps {
    dayData: any
    tripName: string
    isDark?: boolean
}

export function AudioConcierge({ dayData, tripName, isDark = true }: AudioConciergeProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [script, setScript] = useState<string | null>(null)
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null)
    const [showVoiceSelector, setShowVoiceSelector] = useState(false)

    // Audio synthesis refs
    const synth = useRef<SpeechSynthesis | null>(null)
    const utterance = useRef<SpeechSynthesisUtterance | null>(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            synth.current = window.speechSynthesis

            const updateVoices = () => {
                const availableVoices = synth.current?.getVoices() || []
                // Filter for English voices generally good for narrations
                const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'))
                setVoices(englishVoices)

                // Default to a good voice if not selected
                if (!selectedVoice && englishVoices.length > 0) {
                    // Prefer known "premium" sounding browser voices
                    const preferredParams = ["Samantha", "Google US English", "Daniel", "Karen", "Rishi"]
                    const bestVoice = englishVoices.find(v => preferredParams.some(p => v.name.includes(p))) || englishVoices[0]
                    setSelectedVoice(bestVoice)
                }
            }

            updateVoices()
            // Chrome loads voices asynchronously
            window.speechSynthesis.onvoiceschanged = updateVoices
        }

        return () => {
            if (synth.current) {
                synth.current.cancel()
            }
        }
    }, [])

    const generateAndPlay = async () => {
        if (isPlaying) {
            synth.current?.pause()
            setIsPlaying(false)
            return
        }

        if (synth.current?.paused) {
            synth.current.resume()
            setIsPlaying(true)
            return
        }

        if (script) {
            speak(script)
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/generate-script', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ dayData, tripName })
            })

            if (!response.ok) throw new Error('Failed to generate')

            const data = await response.json()
            setScript(data.script)
            speak(data.script)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    const speak = (text: string) => {
        if (!synth.current) return

        // Cancel previous
        synth.current.cancel()

        // Split text into sentences for better stability
        const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text]

        // We'll recursively speak sentences
        let index = 0

        const speakNext = () => {
            if (index >= sentences.length) {
                setIsPlaying(false)
                return
            }

            const sentence = sentences[index]
            if (!sentence.trim()) {
                index++
                speakNext()
                return
            }

            const u = new SpeechSynthesisUtterance(sentence.trim())
            if (selectedVoice) {
                u.voice = selectedVoice
            }

            u.volume = 1.0
            u.rate = 1.0
            u.pitch = 1.0

            u.onstart = () => setIsPlaying(true)
            u.onend = () => {
                index++
                speakNext()
            }
            u.onerror = (e) => {
                console.error("Chunk Error:", e)
                // If one chunk fails, try skipping to next
                if (e.error !== 'interrupted') {
                    index++
                    speakNext()
                } else {
                    setIsPlaying(false)
                }
            }

            utterance.current = u // Keep ref to current chunk
            if (synth.current) {
                synth.current.speak(u)
            }
        }

        speakNext()
    }

    const stop = () => {
        synth.current?.cancel()
        setIsPlaying(false)
    }

    return (
        <div className="relative">
            <div className={`flex items-center gap-2 p-1.5 rounded-full border backdrop-blur-md transition-all ${isDark ? "bg-white/10 border-white/20" : "bg-black/5 border-black/10"
                }`}>
                <Button
                    size="icon"
                    onClick={generateAndPlay}
                    disabled={isLoading}
                    className={`h-8 w-8 rounded-full ${isDark ? "bg-white text-black hover:bg-white/90" : "bg-black text-white hover:bg-black/90"}`}
                >
                    {isLoading ? (
                        <Loader2 className="size-4 animate-spin" />
                    ) : isPlaying ? (
                        <Pause className="size-4 fill-current" />
                    ) : (
                        <Play className="size-4 fill-current ml-0.5" />
                    )}
                </Button>

                {/* Waveform Visualizer (Only visible when playing) */}
                {isPlaying && (
                    <div className="flex items-center gap-0.5 px-2 h-4">
                        {[1, 2, 3, 4, 3, 2, 1].map((h, i) => (
                            <motion.div
                                key={i}
                                animate={{ height: [4, 12, 4] }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 0.8,
                                    delay: i * 0.1,
                                    ease: "easeInOut"
                                }}
                                className={`w-0.5 rounded-full ${isDark ? "bg-emerald-400" : "bg-emerald-600"}`}
                            />
                        ))}
                    </div>
                )}

                {/* Voice Selector Trigger */}
                <button
                    onClick={() => setShowVoiceSelector(!showVoiceSelector)}
                    className={`flex items-center gap-1.5 px-2 text-xs font-medium transition-colors ${isDark ? "text-white/70 hover:text-white" : "text-black/60 hover:text-black"
                        }`}
                >
                    <Mic className="size-3" />
                    <span className="max-w-[60px] truncate">{selectedVoice?.name.split(' ')[0] || "Voice"}</span>
                    <ChevronDown className="size-3 opacity-50" />
                </button>
            </div>

            {/* Voice Dropdown */}
            <AnimatePresence>
                {showVoiceSelector && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowVoiceSelector(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className={`absolute bottom-full mb-2 left-0 w-64 p-2 rounded-xl border shadow-xl z-50 max-h-64 overflow-y-auto ${isDark ? "bg-neutral-900 border-white/10" : "bg-white border-black/10"
                                }`}
                        >
                            <div className="px-2 py-1.5 text-xs font-medium opacity-50 mb-1">Select AI Voice</div>
                            {voices.map((voice) => (
                                <button
                                    key={voice.voiceURI}
                                    onClick={() => {
                                        setSelectedVoice(voice)
                                        setShowVoiceSelector(false)
                                        // Stop current audio if playing so next play uses new voice
                                        if (isPlaying) stop()
                                    }}
                                    className={`w-full flex items-center justify-between px-2 py-2 rounded-lg text-xs text-left transition-colors ${selectedVoice?.name === voice.name
                                        ? (isDark ? "bg-emerald-500/20 text-emerald-400" : "bg-emerald-50 text-emerald-600")
                                        : (isDark ? "hover:bg-white/5 text-white/80" : "hover:bg-neutral-100 text-neutral-700")
                                        }`}
                                >
                                    <span className="truncate">{voice.name}</span>
                                    {selectedVoice?.name === voice.name && <Check className="size-3" />}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}
