"use client"

import * as React from "react"
import { Users, Plus, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import { TravelerCount } from "@/types/booking"

interface TravelerSelectorProps {
    travelers: TravelerCount
    onChange: (travelers: TravelerCount) => void
    className?: string
}

export function TravelerSelector({ travelers, onChange, className }: TravelerSelectorProps) {
    const [isOpen, setIsOpen] = React.useState(false)

    const updateCount = (type: keyof TravelerCount, delta: number) => {
        const limits = {
            adults: { min: 1, max: 8 },
            children: { min: 0, max: 6 },
            infants: { min: 0, max: 2 }
        }

        const newValue = Math.max(limits[type].min, Math.min(limits[type].max, travelers[type] + delta))
        onChange({ ...travelers, [type]: newValue })
    }

    const getSummary = () => {
        const parts = []
        if (travelers.adults > 0) parts.push(`${travelers.adults} Adult${travelers.adults > 1 ? 's' : ''}`)
        if (travelers.children > 0) parts.push(`${travelers.children} Child${travelers.children > 1 ? 'ren' : ''}`)
        if (travelers.infants > 0) parts.push(`${travelers.infants} Infant${travelers.infants > 1 ? 's' : ''}`)
        return parts.join(', ')
    }

    const totalTravelers = travelers.adults + travelers.children + travelers.infants

    return (
        <div className={cn("relative", className)}>
            <label className="text-xs text-white/50 uppercase tracking-wider block mb-2">Travelers</label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-left hover:bg-white/10 transition-colors"
            >
                <Users className="size-5 text-emerald-400" />
                <div className="flex-1">
                    <div className="text-white">{getSummary()}</div>
                    <div className="text-xs text-white/40">{totalTravelers} traveler{totalTravelers > 1 ? 's' : ''} total</div>
                </div>
            </button>

            {isOpen && (
                <div className="absolute z-50 mt-2 w-full bg-neutral-900 border border-white/10 rounded-xl shadow-2xl p-4 space-y-4">
                    {/* Adults */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-white font-medium">Adults</div>
                            <div className="text-xs text-white/40">Age 13+</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => updateCount('adults', -1)}
                                disabled={travelers.adults <= 1}
                                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <Minus className="size-4 text-white" />
                            </button>
                            <span className="text-white font-medium w-6 text-center">{travelers.adults}</span>
                            <button
                                type="button"
                                onClick={() => updateCount('adults', 1)}
                                disabled={travelers.adults >= 8}
                                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus className="size-4 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-white font-medium">Children</div>
                            <div className="text-xs text-white/40">Age 2-12</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => updateCount('children', -1)}
                                disabled={travelers.children <= 0}
                                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <Minus className="size-4 text-white" />
                            </button>
                            <span className="text-white font-medium w-6 text-center">{travelers.children}</span>
                            <button
                                type="button"
                                onClick={() => updateCount('children', 1)}
                                disabled={travelers.children >= 6}
                                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus className="size-4 text-white" />
                            </button>
                        </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-white font-medium">Infants</div>
                            <div className="text-xs text-white/40">Under 2</div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => updateCount('infants', -1)}
                                disabled={travelers.infants <= 0}
                                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <Minus className="size-4 text-white" />
                            </button>
                            <span className="text-white font-medium w-6 text-center">{travelers.infants}</span>
                            <button
                                type="button"
                                onClick={() => updateCount('infants', 1)}
                                disabled={travelers.infants >= 2}
                                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            >
                                <Plus className="size-4 text-white" />
                            </button>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="w-full py-2 bg-emerald-500 text-black font-medium rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        Done
                    </button>
                </div>
            )}
        </div>
    )
}
