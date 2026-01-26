"use client"

import { Sparkles, Coffee, Bed, Users, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"

interface VibeBadgeProps {
    label: string
    type: 'service' | 'dining' | 'sleep' | 'social' | 'safety'
}

export function VibeBadge({ label, type }: VibeBadgeProps) {
    const getIcon = () => {
        switch (type) {
            case 'service': return <Sparkles className="size-3" />
            case 'dining': return <Coffee className="size-3" />
            case 'sleep': return <Bed className="size-3" />
            case 'social': return <Users className="size-3" />
            case 'safety': return <ShieldCheck className="size-3" />
        }
    }

    const getColors = () => {
        switch (type) {
            case 'service': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
            case 'dining': return 'bg-orange-500/10 text-orange-400 border-orange-500/20'
            case 'sleep': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            case 'social': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
            case 'safety': return 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border transition-all ${getColors()}`}
        >
            {getIcon()}
            <span>{label}</span>
        </motion.div>
    )
}
