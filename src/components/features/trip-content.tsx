"use client"

import { useState, useEffect } from "react"
import { BudgetDashboard } from "@/components/features/budget-dashboard"
import { TripItinerary } from "@/components/features/trip-itinerary"
import { motion } from "framer-motion"
import { toast } from "sonner"

interface TripContentProps {
    tripId: string
    tripData: any
    isHalal: boolean
}

export function TripContent({ tripId, tripData, isHalal }: TripContentProps) {
    const [budgetData, setBudgetData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBudget = async () => {
            try {
                const res = await fetch(`/api/budgets?tripId=${tripId}`)
                const data = await res.json()
                setBudgetData(data)
            } catch (err) {
                console.error("Failed to fetch budget:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchBudget()
    }, [tripId])

    const handleSaveBudget = async (categories: any) => {
        try {
            const res = await fetch("/api/budgets", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tripId,
                    total_budget: budgetData.total_budget,
                    currency: budgetData.currency,
                    categories
                })
            })
            if (res.ok) {
                toast.success("Budget Synced", { description: "Your savings have been updated." })
            }
        } catch (err) {
            toast.error("Sync Failed", { description: "Please try again later." })
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
        )
    }

    return (
        <div className="space-y-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <BudgetDashboard
                    totalBudget={budgetData?.total_budget || 2500}
                    currency={budgetData?.currency || "USD"}
                    initialCategories={budgetData?.categories}
                    onSave={handleSaveBudget}
                />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <TripItinerary
                    data={tripData}
                    isHalal={isHalal}
                    isShared={false}
                    tripId={tripId}
                />
            </motion.div>
        </div>
    )
}
