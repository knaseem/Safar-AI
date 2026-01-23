"use client"

import * as React from "react"
import { Plane, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { MAJOR_AIRPORTS } from "@/types/booking"

interface AirportInputProps {
    value: { code: string; city: string } | null
    onChange: (airport: { code: string; city: string } | null) => void
    className?: string
}

export function AirportInput({ value, onChange, className }: AirportInputProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const inputRef = React.useRef<HTMLInputElement>(null)

    const filteredAirports = React.useMemo(() => {
        if (!search) return MAJOR_AIRPORTS.slice(0, 10)
        const query = search.toLowerCase()
        return MAJOR_AIRPORTS.filter(
            airport =>
                airport.code.toLowerCase().includes(query) ||
                airport.city.toLowerCase().includes(query) ||
                airport.name.toLowerCase().includes(query)
        ).slice(0, 10)
    }, [search])

    const handleSelect = (airport: typeof MAJOR_AIRPORTS[0]) => {
        onChange({ code: airport.code, city: airport.city })
        setSearch("")
        setIsOpen(false)
    }

    const handleFocus = () => {
        setIsOpen(true)
    }

    const handleBlur = () => {
        // Delay to allow click on option
        setTimeout(() => setIsOpen(false), 200)
    }

    return (
        <div className={cn("relative", className)}>
            <label className="text-xs text-white/50 uppercase tracking-wider block mb-2">Departing From</label>

            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Plane className="size-5 text-emerald-400" />
                </div>

                {value ? (
                    <button
                        type="button"
                        onClick={() => {
                            onChange(null)
                            setTimeout(() => inputRef.current?.focus(), 0)
                        }}
                        className="w-full flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-left hover:bg-white/10 transition-colors"
                    >
                        <div className="flex-1">
                            <div className="text-white font-medium">{value.city}</div>
                            <div className="text-xs text-emerald-400">{value.code}</div>
                        </div>
                        <span className="text-white/40 text-sm">Change</span>
                    </button>
                ) : (
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-white/30" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search city or airport..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                        />
                    </div>
                )}
            </div>

            {isOpen && !value && (
                <div className="absolute z-50 mt-2 w-full bg-neutral-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    {filteredAirports.length > 0 ? (
                        <div className="max-h-64 overflow-y-auto">
                            {filteredAirports.map((airport) => (
                                <button
                                    key={airport.code}
                                    type="button"
                                    onMouseDown={() => handleSelect(airport)}
                                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left"
                                >
                                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                        <span className="text-emerald-400 font-bold text-sm">{airport.code}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-white font-medium">{airport.city}</div>
                                        <div className="text-xs text-white/40">{airport.name}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 text-center text-white/40">
                            No airports found
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
