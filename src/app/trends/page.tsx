"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Globe, TrendingUp, Calendar, Map as MapIcon, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { SeasonalityChart } from "@/components/features/trends/seasonality-chart"
import { DestinationRankings } from "@/components/features/trends/destination-rankings"
import { fetchBusiestPeriods, fetchTrendingDestinations, AnalyticsData, DestinationRanking } from "@/lib/amadeus-trends"

export default function TrendsPage() {
    const router = useRouter()
    const [selectedCity, setSelectedCity] = useState("PAR") // Default Paris
    const [selectedCityName, setSelectedCityName] = useState("Paris")
    const [seasonalityData, setSeasonalityData] = useState<AnalyticsData[]>([])
    const [rankingData, setRankingData] = useState<DestinationRanking[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            try {
                // Parallel fetch
                const [season, ranks] = await Promise.all([
                    fetchBusiestPeriods(selectedCity),
                    fetchTrendingDestinations('LON') // Global trends from London perspective
                ])
                setSeasonalityData(season)
                setRankingData(ranks)
            } catch (error) {
                console.error("Failed to load trends", error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [selectedCity])

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/')}
                            className="text-white/60 hover:text-white hover:bg-white/10 rounded-full"
                        >
                            <ArrowLeft className="size-5" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <div className="bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
                                <TrendingUp className="size-5 text-emerald-500" />
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                Global Market Insights
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            <main className="pt-28 pb-20 max-w-7xl mx-auto px-6 space-y-8">

                {/* Intro Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                    <div className="col-span-2 relative overflow-hidden rounded-3xl bg-neutral-900 border border-white/10 p-8 min-h-[300px] flex flex-col justify-end group">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">The World is Moving.</h2>
                            <p className="text-white/60 max-w-xl text-lg">
                                Real-time travel intelligence powered by Amadeus.
                                Analyze seasonality, discover rising stars, and book at the perfect moment.
                            </p>
                        </div>
                    </div>

                    <div className="bg-neutral-900/50 border border-white/10 rounded-3xl p-6 flex flex-col justify-center">
                        <div className="flex items-center gap-3 mb-6">
                            <Globe className="size-6 text-emerald-400" />
                            <h3 className="text-lg font-bold">Global Pulse</h3>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/60">Total Flights Tracked</span>
                                <span className="font-mono text-emerald-400">248,932</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 w-[75%]" />
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-white/60">Active Routes</span>
                                <span className="font-mono text-emerald-400">12,401</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500 w-[60%]" />
                            </div>
                            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-200 mt-4">
                                Live Data Stream Active
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Seasonality Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="lg:col-span-2 bg-neutral-900/50 border border-white/10 rounded-3xl p-8"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="bg-blue-500/20 p-2 rounded-lg">
                                    <Calendar className="size-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Seasonality Curve</h3>
                                    <p className="text-white/40 text-sm">Visitor volume forecast for {selectedCityName}</p>
                                </div>
                            </div>

                            {/* City Selector (Mock) */}
                            <div className="flex gap-2">
                                {['PAR', 'DXB', 'NYC', 'TYO'].map(code => (
                                    <button
                                        key={code}
                                        onClick={() => {
                                            setSelectedCity(code)
                                            setSelectedCityName(code === 'PAR' ? 'Paris' : code === 'DXB' ? 'Dubai' : code === 'NYC' ? 'New York' : 'Tokyo')
                                        }}
                                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${selectedCity === code ? 'bg-white text-black' : 'bg-white/5 text-white/60 hover:bg-white/10'}`}
                                    >
                                        {code}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="h-[300px] w-full">
                            <SeasonalityChart data={seasonalityData} />
                        </div>
                    </motion.div>

                    {/* Right: Top Destinations */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-neutral-900/50 border border-white/10 rounded-3xl p-8 max-h-[500px] overflow-hidden flex flex-col"
                    >
                        <div className="flex items-center gap-3 mb-6 shrink-0">
                            <div className="bg-purple-500/20 p-2 rounded-lg">
                                <TrendingUp className="size-5 text-purple-400" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Trending Now</h3>
                                <p className="text-white/40 text-sm">Fastest growing destinations</p>
                            </div>
                        </div>

                        <div className="overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
                            <DestinationRankings data={rankingData} />
                        </div>
                    </motion.div>
                </div>

            </main>
        </div>
    )
}
