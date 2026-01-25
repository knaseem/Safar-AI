"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Check, Sparkles, Shirt, Umbrella, Camera, Battery, Book, Map as MapIcon, Moon, X } from "lucide-react"

interface PackingListProps {
    destination: string
    isHalal?: boolean
    days: number
    activities: string[]
    onSkip?: () => void
}

type Category = {
    name: string
    icon: any
    items: string[]
}

export function PackingList({ destination, isHalal = false, days, activities, onSkip }: PackingListProps) {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Simulate AI Generation
        const generateList = async () => {
            await new Promise(resolve => setTimeout(resolve, 1500))

            const isCold = ["Switzerland", "Iceland", "Zermatt"].some(place => destination.includes(place))
            const isHot = ["Dubai", "Maldives", "Qatar", "Saudi"].some(place => destination.includes(place))
            const isRainy = ["London", "Paris", "Ireland"].some(place => destination.includes(place))

            const newCategories: Category[] = [
                {
                    name: "Essentials",
                    icon: Shirt,
                    items: [
                        `${days + 2}x Daily Outfits`,
                        "Comfortable Walking Shoes",
                        "Sleepwear",
                        "Toiletries Bag"
                    ]
                },
                {
                    name: "Gadgets",
                    icon: Battery,
                    items: [
                        "Universal Power Adapter",
                        "Power Bank (20000mAh)",
                        "Noise-Cancelling Headphones"
                    ]
                }
            ]

            // Contextual Additions
            if (isCold) {
                newCategories.push({
                    name: "Winter Gear",
                    icon: Sparkles,
                    items: ["Thermal Layers", "Insulated Jacket", "Warm Gloves", "Beanie/Scarf"]
                })
            }
            if (isHot) {
                newCategories.push({
                    name: "Sun Protection",
                    icon: SunIcon,
                    items: ["Sunscreen (SPF 50+)", "Sunglasses", "Hat/Cap", "Light Linen Clothes"]
                })
            }
            if (isRainy) {
                newCategories.push({
                    name: "Rain Ready",
                    icon: Umbrella,
                    items: ["Compact Umbrella", "Waterproof Jacket", "Water-resistant Shoes"]
                })
            }
            if (isHalal) {
                newCategories.push({
                    name: "Cultural/Faith",
                    icon: Moon,
                    items: ["Modest Clothing Options", "Portable Prayer Mat", "Qibla Compass App (Pre-installed)"]
                })
            }

            // Activity based (Simple heuristic)
            const activtyItems: string[] = []
            if (activities.some(a => a.toLowerCase().includes('hike') || a.toLowerCase().includes('trek'))) activtyItems.push("Hiking Boots", "Reusable Water Bottle")
            if (activities.some(a => a.toLowerCase().includes('swim') || a.toLowerCase().includes('beach'))) activtyItems.push("Swimwear", "Quick-dry Towel")
            if (activities.some(a => a.toLowerCase().includes('dinner') || a.toLowerCase().includes('luxury'))) activtyItems.push("Evening Wear / Formal Attire")

            if (activtyItems.length > 0) {
                newCategories.push({
                    name: "Activities",
                    icon: Camera,
                    items: activtyItems
                })
            }

            setCategories(newCategories)
            setLoading(false)
        }

        generateList()
    }, [destination, isHalal, days, activities])

    if (loading) {
        return (
            <div className="relative">
                {/* Loading State Skip */}
                <button
                    onClick={onSkip}
                    className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/10 text-white/30 hover:text-white transition-colors"
                    title="Skip Generating"
                >
                    <X className="size-4" />
                </button>
                <div className="flex flex-col items-center justify-center p-6 space-y-3 bg-white/5 rounded-xl border border-white/10">
                    <Sparkles className="size-6 text-emerald-400 animate-pulse" />
                    <p className="text-sm text-white/50 font-medium">AI is generating your custom packing list...</p>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full bg-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden"
        >
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-emerald-400" />
                    <h3 className="text-sm font-semibold text-white">Smart Packing List</h3>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase tracking-wider text-white/40">For {destination}</span>
                    <button
                        onClick={onSkip}
                        className="text-white/30 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                        title="Dismiss List"
                    >
                        <X className="size-4" />
                    </button>
                </div>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                {categories.map((cat, i) => (
                    <div key={i} className="space-y-2">
                        <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 uppercase tracking-widest">
                            <cat.icon className="size-3" />
                            {cat.name}
                        </div>
                        <ul className="space-y-1.5">
                            {cat.items.map((item, j) => (
                                <li key={j} className="flex items-start gap-2 group cursor-pointer">
                                    <div className="mt-0.5 size-3.5 rounded-full border border-white/20 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                                        <div className="size-1.5 rounded-full bg-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <span className="text-sm text-white/70 group-hover:text-white transition-colors">{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </motion.div>
    )
}

function SunIcon({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
        </svg>
    )
}
