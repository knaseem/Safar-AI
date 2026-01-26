"use client"

import { useEffect, useState } from "react"
import { Shield, ShieldAlert, ShieldCheck, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface SafetyBadgeProps {
    lat: number
    lng: number
}

export function SafetyBadge({ lat, lng }: SafetyBadgeProps) {
    const [safety, setSafety] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchSafety() {
            try {
                const res = await fetch(`/api/intelligence?lat=${lat}&lng=${lng}`)
                const json = await res.json()
                if (json.safety) {
                    setSafety(json.safety)
                }
            } catch (e) {
                console.error("Safety fetch error:", e)
            } finally {
                setLoading(false)
            }
        }
        fetchSafety()
    }, [lat, lng])

    if (loading) return (
        <div className="flex items-center gap-2 text-[10px] text-white/40 uppercase tracking-widest animate-pulse">
            <Loader2 className="size-3 animate-spin" />
            Securing Zone...
        </div>
    )

    if (!safety) return null

    const getStatus = () => {
        if (safety.overall >= 80) return { label: 'Secure Zone', color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: <ShieldCheck className="size-3" /> }
        if (safety.overall >= 60) return { label: 'Standard Safety', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: <Shield className="size-3" /> }
        return { label: 'Caution Advised', color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: <ShieldAlert className="size-3" /> }
    }

    const status = getStatus()

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/5 ${status.bg} ${status.color}`}
        >
            {status.icon}
            <span className="text-[10px] font-bold uppercase tracking-wider">{status.label}</span>
            <span className="text-[10px] opacity-40 ml-1">Score: {safety.overall}%</span>
        </motion.div>
    )
}
