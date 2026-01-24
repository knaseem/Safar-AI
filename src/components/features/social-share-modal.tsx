"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Check, Twitter, Facebook, Linkedin, Mail } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface SocialShareModalProps {
    isOpen: boolean
    onClose: () => void
    tripName: string
    shareUrl: string
}

export function SocialShareModal({ isOpen, onClose, tripName, shareUrl }: SocialShareModalProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shareLinks = [
        {
            name: "X (Twitter)",
            icon: <Twitter className="size-5" />,
            color: "hover:bg-black hover:text-white border-white/10",
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my trip to ${tripName} designed by SafarAI!`)}&url=${encodeURIComponent(shareUrl)}`
        },
        {
            name: "Facebook",
            icon: <Facebook className="size-5" />,
            color: "hover:bg-[#1877F2] hover:text-white border-white/10",
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        },
        {
            name: "LinkedIn",
            icon: <Linkedin className="size-5" />,
            color: "hover:bg-[#0A66C2] hover:text-white border-white/10",
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`
        },
        {
            name: "Email",
            icon: <Mail className="size-5" />,
            color: "hover:bg-emerald-500 hover:text-white border-white/10",
            url: `mailto:?subject=${encodeURIComponent(`Trip to ${tripName}`)}&body=${encodeURIComponent(`Check out this amazing itinerary I created with SafarAI: ${shareUrl}`)}`
        },
        // WhatsApp is tricky on desktop without special handling, often better to just copy link or use generic share if mobile.
        // We'll stick to these core 4 plus copy link.
    ]

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-neutral-900/95 backdrop-blur-xl border border-white/10 text-white p-0 gap-0 overflow-hidden max-w-md">
                <div className="p-6">
                    <DialogHeader className="mb-6 relative">
                        <DialogTitle className="text-xl font-bold text-center">Share Your Adventure</DialogTitle>
                        <button
                            onClick={onClose}
                            className="absolute -top-2 -right-2 p-2 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                        >
                            <X className="size-4" />
                        </button>
                    </DialogHeader>

                    <div className="space-y-6">
                        {/* Preview Card (Visual candy) */}
                        <div className="relative h-32 rounded-xl overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-black/80 z-10" />
                            {/* Assuming we might want an image here later, for now just a nice gradient/pattern */}
                            <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
                            <div className="absolute bottom-4 left-4 z-20">
                                <p className="text-xs text-emerald-400 font-medium tracking-wider uppercase mb-1">Itinerary</p>
                                <h3 className="text-lg font-bold text-white max-w-[280px] leading-tight text-balance">{tripName}</h3>
                            </div>
                        </div>

                        {/* Social Icons Grid */}
                        <div className="grid grid-cols-4 gap-3">
                            {shareLinks.map((platform) => (
                                <a
                                    key={platform.name}
                                    href={platform.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border bg-white/5 transition-all duration-300 group ${platform.color}`}
                                >
                                    <div className="text-white/60 group-hover:scale-110 transition-transform duration-300">
                                        {platform.icon}
                                    </div>
                                    <span className="text-[10px] font-medium text-white/40 group-hover:text-white/90">
                                        {platform.name}
                                    </span>
                                </a>
                            ))}
                        </div>

                        {/* Copy Link Input */}
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-lg blur opacity-20" />
                            <div className="relative flex items-center bg-black/50 border border-white/10 rounded-lg p-1.5 pl-4 group focus-within:border-emerald-500/50 transition-colors">
                                <span className="text-sm text-white/40 truncate flex-1 font-mono selection:bg-emerald-500/30">
                                    {shareUrl}
                                </span>
                                <Button
                                    size="sm"
                                    onClick={handleCopy}
                                    className={`ml-2 min-w-[90px] transition-all duration-300 ${copied
                                        ? "bg-emerald-500 text-black hover:bg-emerald-400"
                                        : "bg-white/10 text-white hover:bg-white/20"
                                        }`}
                                >
                                    {copied ? (
                                        <>
                                            <Check className="size-3.5 mr-1.5" />
                                            Copied
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="size-3.5 mr-1.5" />
                                            Copy
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
