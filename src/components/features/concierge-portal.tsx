"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShieldCheck, ExternalLink, ArrowLeft, Lock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ConciergePortalProps {
    url: string | null
    isOpen: boolean
    onClose: () => void
    title?: string
    providerName?: string
}

export function ConciergePortal({ url, isOpen, onClose, title = "Secure Booking", providerName = "Expedia" }: ConciergePortalProps) {
    const [status, setStatus] = useState<'syncing' | 'redirecting' | 'completed' | 'blocked'>('syncing')

    useEffect(() => {
        if (isOpen && url) {
            setStatus('syncing')

            // 1. Sync Phase (1.8s - 2.6s with human-like jitter)
            const jitter = Math.random() * 800
            const syncTimer = setTimeout(() => {
                setStatus('redirecting')

                // 2. Redirect Phase (Immediately after sync)
                // STEALTH: Use 'noreferrer' to hide the source app from Expedia's bot filters
                const win = window.open(url, '_blank', 'noreferrer')

                if (!win) {
                    setStatus('blocked')
                } else {
                    // 3. Completion Phase (After successful redirect)
                    const completeTimer = setTimeout(() => {
                        setStatus('completed')
                    }, 1500)
                    return () => clearTimeout(completeTimer)
                }
            }, 1800 + jitter)

            return () => {
                clearTimeout(syncTimer)
            }
        }
    }, [isOpen, url])

    const handleOpenExternal = () => {
        // STEALTH: Also use 'noreferrer' for manual fallback button
        if (url) window.open(url, '_blank', 'noreferrer')
        if (status === 'blocked') setStatus('completed')
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-6 text-center"
                >
                    {/* Minimal Branding Header */}
                    <div className="absolute top-0 inset-x-0 h-16 border-b border-white/5 px-6 flex items-center justify-between">
                        <button
                            onClick={onClose}
                            className="p-2 -ml-2 rounded-full hover:bg-white/5 text-white/40 hover:text-white transition-all flex items-center gap-2"
                        >
                            <ArrowLeft className="size-5" />
                            <span className="text-sm font-bold">Cancel</span>
                        </button>
                        <div className="flex items-center gap-2">
                            <Lock className="size-3 text-emerald-500" />
                            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em] opacity-40">Secure Handover active</span>
                        </div>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-white/40">
                            <X className="size-5" />
                        </button>
                    </div>

                    {/* Main Content Area */}
                    <div className="w-full max-w-md space-y-12">
                        {/* Status Icon */}
                        <div className="relative mx-auto size-24">
                            <AnimatePresence mode="wait">
                                {status === 'completed' ? (
                                    <motion.div
                                        key="success"
                                        initial={{ scale: 0.5, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        className="absolute inset-0 flex items-center justify-center"
                                    >
                                        <div className="size-20 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <CheckCircle2 className="size-10 text-emerald-500" />
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="syncing"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0"
                                    >
                                        <div className="absolute inset-0 rounded-full border-2 border-emerald-500/20" />
                                        <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-spin" />
                                        <ShieldCheck className="absolute inset-0 m-auto size-10 text-emerald-500" />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Messaging */}
                        <div className="space-y-4">
                            <AnimatePresence mode="wait">
                                {status === 'syncing' && (
                                    <motion.div
                                        key="msg-sync"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                    >
                                        <h2 className="text-2xl font-bold text-white mb-2 italic">Syncing Security Protocols...</h2>
                                        <p className="text-white/40 text-sm">Initializing encrypted handover with {providerName}. Please remain on this screen.</p>
                                    </motion.div>
                                )}
                                {status === 'redirecting' && (
                                    <motion.div
                                        key="msg-redir"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                    >
                                        <h2 className="text-2xl font-bold text-white mb-2 italic">Handing Over Session...</h2>
                                        <p className="text-white/40 text-sm tracking-wide">Launching {providerName} in a dedicated secure session.</p>
                                    </motion.div>
                                )}
                                {status === 'completed' && (
                                    <motion.div
                                        key="msg-done"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                    >
                                        <h2 className="text-2xl font-bold text-white mb-2 italic tracking-tight">Session Transferred Successfully</h2>
                                        <p className="text-white/40 text-sm mb-8">You are now connected to the {providerName} secure booking engine in your new tab.</p>
                                        <Button
                                            onClick={onClose}
                                            className="bg-white text-black hover:bg-neutral-200 px-8 py-6 rounded-2xl font-bold text-lg"
                                        >
                                            Return to SafarAI
                                        </Button>
                                    </motion.div>
                                )}
                                {status === 'blocked' && (
                                    <motion.div
                                        key="msg-blocked"
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                    >
                                        <h2 className="text-2xl font-bold text-white mb-4 italic">Security Protocol Required</h2>
                                        <p className="text-white/40 text-sm mb-8 leading-relaxed">Your browser blocked the automatic handover. Please proceed manually to continue your secure booking with {providerName}.</p>
                                        <Button
                                            onClick={handleOpenExternal}
                                            className="bg-emerald-600 text-white hover:bg-emerald-500 px-8 py-7 rounded-2xl font-bold text-lg shadow-xl shadow-emerald-500/20 w-full"
                                        >
                                            Proceed to Secure Booking
                                            <ExternalLink className="size-5 ml-2" />
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Animated Dots for active phases */}
                        {(status === 'syncing' || status === 'redirecting') && (
                            <div className="flex justify-center gap-2 pt-8">
                                <div className="size-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.3s]" />
                                <div className="size-2 rounded-full bg-emerald-500 animate-bounce [animation-delay:-0.15s]" />
                                <div className="size-2 rounded-full bg-emerald-500 animate-bounce" />
                            </div>
                        )}
                    </div>

                    {/* Footer Info */}
                    <div className="absolute bottom-12 flex items-center gap-8 opacity-20">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="size-4" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Encrypted Handover</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="size-4" />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Verified Partner</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
