"use client"

import { useEffect, useState } from "react"
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    ResponsiveContainer,
} from "recharts"
import { Loader2, Sparkles, Shield, AlertTriangle } from "lucide-react"

interface NeighborhoodRadarProps {
    lat: number
    lng: number
    cityName: string
}

export function NeighborhoodRadar({ lat, lng, cityName }: NeighborhoodRadarProps) {
    const [data, setData] = useState<any[]>([])
    const [safety, setSafety] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchVibes() {
            setLoading(true)
            try {
                const res = await fetch(`/api/intelligence?lat=${lat}&lng=${lng}`)
                const json = await res.json()

                if (json.scores) {
                    // Map Amadeus scores to Radar Chart format
                    const chartData = [
                        { subject: "Sightseeing", A: json.scores.sightseeing * 10 || 40, fullMark: 100 },
                        { subject: "Shopping", A: json.scores.shopping * 10 || 60, fullMark: 100 },
                        { subject: "Dining", A: json.scores.restaurant * 10 || 80, fullMark: 100 },
                        { subject: "Nightlife", A: json.scores.nightlife * 10 || 50, fullMark: 100 },
                    ]
                    setData(chartData)
                }

                if (json.safety) {
                    setSafety(json.safety)
                }
            } catch (error) {
                console.error("Vibe fetch error:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchVibes()
    }, [lat, lng])

    if (loading) {
        return (
            <div className="h-[250px] flex flex-col items-center justify-center gap-3 bg-white/5 rounded-2xl border border-white/10">
                <Loader2 className="size-8 text-emerald-500 animate-spin" />
                <p className="text-xs text-white/40 uppercase tracking-widest">Scanning {cityName} Vibes...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="h-[250px] w-full bg-white/5 rounded-2xl border border-white/10 p-4 relative overflow-hidden group">
                <div className="absolute top-4 left-4 z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="size-3 text-emerald-400" />
                        <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Neighborhood DNA</p>
                    </div>
                    <p className="text-xl font-bold text-white">{cityName}</p>
                </div>

                <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="55%" outerRadius="70%" data={data}>
                        <PolarGrid stroke="#FFFFFF10" />
                        <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fill: "#FFFFFF40", fontSize: 10, fontWeight: 600 }}
                        />
                        <Radar
                            name="Vibe"
                            dataKey="A"
                            stroke="#10b981"
                            fill="#10b981"
                            fillOpacity={0.3}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            </div>

            {/* Safety Pulse */}
            {safety && (
                <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${safety.overall >= 70 ? 'bg-emerald-500/10 text-emerald-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                            {safety.overall >= 70 ? <Shield className="size-4" /> : <AlertTriangle className="size-4" />}
                        </div>
                        <div>
                            <p className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Security Pulse</p>
                            <p className="text-sm font-medium text-white/90">
                                {safety.overall >= 80 ? 'Premium Safety Zone' : safety.overall >= 60 ? 'Standard Security' : 'Exercise Caution'}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-white">{safety.overall}%</p>
                        <p className="text-[8px] text-white/30 uppercase">Safety Rating</p>
                    </div>
                </div>
            )}
        </div>
    )
}
