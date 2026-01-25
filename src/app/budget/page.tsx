"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Wallet, Plus, ArrowRight, Sparkles, AlertCircle } from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { BudgetDashboard } from "@/components/features/budget-dashboard"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { toast } from "sonner"

export default function BudgetPage() {
    const [tripsWithBudgets, setTripsWithBudgets] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch trips first
                const tripsRes = await fetch("/api/trips")
                const tripsData = await tripsRes.json()

                if (tripsData.trips) {
                    const enrichedTrips = await Promise.all(
                        tripsData.trips.map(async (trip: any) => {
                            const budgetRes = await fetch(`/api/budgets?tripId=${trip.id}`)
                            const budgetData = await budgetRes.json()
                            return { ...trip, budget: budgetData }
                        })
                    )
                    setTripsWithBudgets(enrichedTrips)
                }
            } catch (err) {
                console.error("Failed to fetch budgets:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleSaveBudget = async (tripId: string, categories: any, totalBudget: number, currency: string) => {
        try {
            const res = await fetch("/api/budgets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tripId,
                    total_budget: totalBudget,
                    currency,
                    categories
                })
            })
            if (res.ok) {
                toast.success("Budget Updated", { description: "Changes saved to cloud." })
            }
        } catch (err) {
            toast.error("Save Failed")
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-black text-white">
            <Navbar />

            <div className="container mx-auto px-6 pt-32 pb-20">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-400 mb-2">
                            <Sparkles className="size-4" />
                            <span className="text-xs uppercase tracking-[0.2em] font-bold">Financial Intelligence</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold">Budget Optimizer</h1>
                        <p className="text-white/40 mt-4 max-w-xl">
                            Consolidated view of your travel investments. Manage spending across all active expeditions and optimize your value-to-vibe ratio.
                        </p>
                    </div>
                    <Link href="/">
                        <Button className="bg-white text-black hover:bg-white/90 font-bold rounded-xl px-6">
                            Plan New Trip
                        </Button>
                    </Link>
                </div>

                {tripsWithBudgets.length === 0 ? (
                    <div className="glass-dark rounded-3xl p-20 text-center border border-white/5">
                        <Wallet className="size-16 text-white/10 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold mb-2">No active budgets found</h2>
                        <p className="text-white/40 mb-8">Save an itinerary to start optimizing your travel spend.</p>
                        <Link href="/">
                            <Button variant="outline" className="border-white/10 text-white hover:bg-white/5">
                                Discover Destinations
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-12">
                        {tripsWithBudgets.map((trip) => (
                            <motion.div
                                key={trip.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                                className="space-y-6"
                            >
                                <div className="flex items-center justify-between px-2">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                            <Plus className="size-6 text-white/40" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold">{trip.trip_name || trip.destination}</h2>
                                            <p className="text-xs text-white/40 uppercase tracking-widest">{new Date(trip.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <Link href={`/trips/${trip.id}`}>
                                        <Button variant="link" className="text-emerald-400 hover:text-emerald-300 gap-2 p-0">
                                            View Itinerary <ArrowRight className="size-4" />
                                        </Button>
                                    </Link>
                                </div>

                                <BudgetDashboard
                                    totalBudget={trip.budget?.total_budget || 2500}
                                    currency={trip.budget?.currency || "USD"}
                                    initialCategories={trip.budget?.categories}
                                    onSave={(cats) => handleSaveBudget(trip.id, cats, trip.budget?.total_budget || 2500, trip.budget?.currency || "USD")}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Disclaimer Section */}
            <div className="container mx-auto px-6 pb-20">
                <div className="p-8 rounded-3xl bg-neutral-900/50 border border-white/5 flex gap-6 items-start">
                    <AlertCircle className="size-6 text-white/20 mt-1" />
                    <div className="text-sm text-white/40 leading-relaxed">
                        <p className="font-bold text-white/60 mb-1">Financial Disclaimer</p>
                        <p>Rates and estimations provided by the SafarAI Budget Optimizer are based on live market averages and current affiliate data. Actual prices may fluctuate at time of final booking through service providers. All transactions are handled securely through our verified booking partners.</p>
                    </div>
                </div>
            </div>
        </main>
    )
}
