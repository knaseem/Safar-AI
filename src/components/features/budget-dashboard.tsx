"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Wallet,
    TrendingDown,
    AlertCircle,
    Sparkles,
    ChevronDown,
    ChevronUp,
    Plane,
    Hotel,
    Utensils,
    Activity,
    Plus
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface BudgetCategory {
    id: string
    label: string
    value: number
    color: string
    icon: any
}

interface BudgetDashboardProps {
    totalBudget: number
    currency?: string
    initialCategories?: Record<string, number>
    onSave?: (data: any) => void
    className?: string
}

export function BudgetDashboard({
    totalBudget,
    currency = "USD",
    initialCategories,
    onSave,
    className
}: BudgetDashboardProps) {
    const [spentCategories, setSpentCategories] = useState<Record<string, number>>(initialCategories || {
        lodging: 0,
        flights: 0,
        food: 0,
        activities: 0,
        other: 0
    })
    const [isExpanded, setIsExpanded] = useState(true)

    const categories: BudgetCategory[] = [
        { id: 'flights', label: 'Flights', value: spentCategories.flights, color: '#3b82f6', icon: Plane },
        { id: 'lodging', label: 'Lodging', value: spentCategories.lodging, color: '#10b981', icon: Hotel },
        { id: 'food', label: 'Gastronomy', value: spentCategories.food, color: '#f59e0b', icon: Utensils },
        { id: 'activities', label: 'Activities', value: spentCategories.activities, color: '#8b5cf6', icon: Activity },
        { id: 'other', label: 'Other', value: spentCategories.other, color: '#6b7280', icon: Plus },
    ]

    const totalSpent = useMemo(() =>
        Object.values(spentCategories).reduce((a, b) => a + b, 0),
        [spentCategories])

    const remaining = totalBudget - totalSpent
    const spentPercentage = (totalSpent / totalBudget) * 100

    // AI Recommendation Logic
    const getAIRecommendation = () => {
        if (totalSpent > totalBudget) {
            const highest = categories.reduce((a, b) => a.value > b.value ? a : b)
            return {
                type: "warning",
                message: `You are over budget by ${currency} ${Math.abs(remaining).toLocaleString()}. Consider reducing "${highest.label}" to stay on track.`,
                tip: "Try switching to a Premium Economy flight or a Boutique Villa."
            }
        }
        if (spentPercentage > 80) {
            return {
                type: "caution",
                message: "You have used 80% of your budget. High-value adventure bookings are still pending.",
                tip: "Prioritize your 'Must-Have' activities now."
            }
        }
        return {
            type: "success",
            message: "Your budget is perfectly optimized for a high-vibe experience.",
            tip: "You have room for a luxury spa upgrade!"
        }
    }

    const reco = getAIRecommendation()

    return (
        <div className={cn("glass-dark rounded-3xl p-6 border border-white/10 shadow-2xl", className)}>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                        <Wallet className="size-5 text-emerald-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white leading-none">Budget Optimizer</h3>
                        <p className="text-xs text-white/40 mt-1">SafarAI Intelligent Tracking</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                >
                    {isExpanded ? <ChevronUp className="size-5 text-white/40" /> : <ChevronDown className="size-5 text-white/40" />}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Visual Section: Spending Rings */}
                <div className="relative flex items-center justify-center p-4">
                    <svg className="size-64 -rotate-90">
                        {/* Background Rings */}
                        {categories.map((cat, i) => (
                            <circle
                                key={`bg-${cat.id}`}
                                cx="128"
                                cy="128"
                                r={110 - i * 18}
                                fill="transparent"
                                stroke="rgba(255,255,255,0.05)"
                                strokeWidth="12"
                            />
                        ))}
                        {/* Progress Rings */}
                        {categories.map((cat, i) => {
                            const radius = 110 - i * 18
                            const circum = 2 * Math.PI * radius
                            const perc = Math.min((cat.value / totalBudget) * 100, 100)
                            const offset = circum - (perc / 100) * circum

                            return (
                                <motion.circle
                                    key={`val-${cat.id}`}
                                    cx="128"
                                    cy="128"
                                    r={radius}
                                    fill="transparent"
                                    stroke={cat.color}
                                    strokeWidth="12"
                                    strokeDasharray={circum}
                                    initial={{ strokeDashoffset: circum }}
                                    animate={{ strokeDashoffset: offset }}
                                    transition={{ duration: 1.5, ease: "easeOut", delay: i * 0.1 }}
                                    strokeLinecap="round"
                                />
                            )
                        })}
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <div className="text-3xl font-bold text-white">
                            {currency} {totalSpent.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-white/40 uppercase tracking-[0.2em] mt-1">
                            Spent / {currency} {totalBudget.toLocaleString()}
                        </div>
                    </div>
                </div>

                {/* Details Section */}
                <div className="space-y-6">
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-4"
                            >
                                {categories.map((cat) => (
                                    <div key={cat.id} className="group">
                                        <div className="flex justify-between items-center mb-1.5 px-1">
                                            <div className="flex items-center gap-2">
                                                <cat.icon className="size-3 text-white/40 group-hover:text-white transition-colors" />
                                                <span className="text-xs text-white/60 font-medium">{cat.label}</span>
                                            </div>
                                            <span className="text-xs font-mono text-white/80">
                                                {currency} {cat.value.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min((cat.value / totalBudget) * 100, 100)}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: cat.color }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* AI Logic Alert */}
                    <div className={cn(
                        "p-4 rounded-2xl border flex gap-4",
                        reco.type === 'warning' ? "bg-red-500/10 border-red-500/20" :
                            reco.type === 'caution' ? "bg-yellow-500/10 border-yellow-500/20" :
                                "bg-emerald-500/10 border-emerald-500/20"
                    )}>
                        <div className={cn(
                            "p-2 rounded-xl h-fit",
                            reco.type === 'warning' ? "bg-red-500/20 text-red-400" :
                                reco.type === 'caution' ? "bg-yellow-500/20 text-yellow-400" :
                                    "bg-emerald-500/20 text-emerald-400"
                        )}>
                            {reco.type === 'success' ? <Sparkles className="size-4" /> : <AlertCircle className="size-4" />}
                        </div>
                        <div>
                            <p className="text-xs text-white font-medium mb-1">{reco.message}</p>
                            <p className="text-[10px] text-white/40 italic leading-tight">TIP: {reco.tip}</p>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full border-white/10 hover:bg-white/5 text-white/60 hover:text-white"
                        onClick={() => onSave?.(spentCategories)}
                    >
                        Sync with Trip Ledger
                    </Button>
                </div>
            </div>
        </div>
    )
}
