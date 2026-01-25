"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Cloud, CloudRain, Sun, CloudLightning, CloudSnow, Loader2, Wind, Droplets, ChevronDown } from "lucide-react"

interface WeatherWidgetProps {
    lat: number
    lng: number
}

type WeatherData = {
    current: {
        temperature_2m: number
        weather_code: number
        wind_speed_10m: number
        relative_humidity_2m: number
    }
    daily: {
        time: string[]
        weather_code: number[]
        temperature_2m_max: number[]
        temperature_2m_min: number[]
    }
}



// Enhanced icon set with gradients
const getWeatherIcon = (code: number, className: string = "size-5") => {
    if (code === 0 || code === 1) return <Sun className={`${className} text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]`} />
    if (code === 2 || code === 3) return <Cloud className={`${className} text-gray-300 fill-white/20 drop-shadow-md`} />
    if ([45, 48].includes(code)) return <Cloud className={`${className} text-slate-400`} />
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className={`${className} text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]`} />
    if ([71, 73, 75, 77, 85, 86].includes(code)) return <CloudSnow className={`${className} text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`} />
    if ([95, 96, 99].includes(code)) return <CloudLightning className={`${className} text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)]`} />
    return <Sun className={`${className} text-amber-400`} />
}

const getWeatherLabel = (code: number) => {
    if (code === 0) return "Clear Sky"
    if (code > 0 && code < 4) return "Partly Cloudy"
    if ([45, 48].includes(code)) return "Fog"
    if (code >= 51 && code <= 67) return "Heavy Rain"
    if (code >= 71 && code <= 77) return "Snowfall"
    if (code >= 95) return "Thunderstorm"
    return "Fair"
}

// Background gradient based on weather
const getWeatherGradient = (code: number) => {
    if (code === 0 || code === 1) return "from-amber-500/20 to-orange-500/5"
    if (code >= 51) return "from-blue-500/20 to-cyan-500/5"
    if (code >= 95) return "from-purple-500/20 to-indigo-500/5"
    return "from-white/10 to-white/5" // Default/Cloudy
}

export function WeatherWidget({ lat, lng }: WeatherWidgetProps) {
    const [weather, setWeather] = useState<WeatherData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
    const [showForecast, setShowForecast] = useState(false)
    const [unit, setUnit] = useState<'C' | 'F'>('C')

    useEffect(() => {
        const interval = setInterval(() => {
            setUnit(prev => prev === 'C' ? 'F' : 'C')
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Fetch from Open-Meteo including wind and humidity AND daily forecast
                const res = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=6`
                )
                if (!res.ok) throw new Error("Failed to fetch weather")
                const data = await res.json()
                setWeather(data)
            } catch (err) {
                console.error("Weather fetch failed", err)
                setError(true)
            } finally {
                setLoading(false)
            }
        }

        fetchWeather()
    }, [lat, lng])

    if (error) return null

    if (loading) {
        return (
            <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 text-white/50 text-xs shadow-lg">
                <Loader2 className="size-3 animate-spin text-emerald-500" />
                <span className="hidden sm:inline font-medium tracking-wide">Analysing Atmosphere...</span>
            </div>
        )
    }

    if (!weather) return null

    const { temperature_2m, weather_code, wind_speed_10m, relative_humidity_2m } = weather.current
    const daily = weather.daily
    const bgGradient = getWeatherGradient(weather_code)

    const formatTemp = (temp: number) => {
        if (unit === 'F') {
            return Math.round((temp * 9 / 5) + 32)
        }
        return Math.round(temp)
    }

    return (
        <div
            className="relative flex flex-col items-start gap-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Current Weather - Main Widget */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ scale: 1.02, y: -2 }}
                onClick={() => setShowForecast(!showForecast)}
                className={`relative group cursor-pointer overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl transition-all duration-500`}
                style={{ perspective: 1000 }}
            >
                {/* Dynamic Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-50 group-hover:opacity-70 transition-opacity duration-500`} />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-500" />

                {/* Glowing Border specific to weather on hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r ${getWeatherGradient(weather_code).replace('/20', '/40')} blur-xl -z-10`} />

                <div className="relative px-4 py-2 flex items-center gap-3">
                    {/* Main Icon & Temp */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            {getWeatherIcon(weather_code, "size-6")}
                            {/* Animated ping for 'live' feeling */}
                            <div className="absolute -top-1 -right-1 size-1.5 bg-emerald-500 rounded-full border border-black animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <div className="text-xl font-bold text-white leading-none tracking-tight">
                                    {formatTemp(temperature_2m)}°
                                    <span className="text-[10px] text-white/40 ml-0.5 uppercase">{unit}</span>
                                </div>
                                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[9px] font-bold text-white/50 tracking-wider uppercase">
                                    Today
                                </span>
                            </div>
                            <div className="text-[9px] uppercase tracking-widest text-white/60 font-medium mt-0">
                                {getWeatherLabel(weather_code)}
                            </div>
                        </div>
                    </div>

                    {/* Expanded Details (Show on hover/desktop) */}
                    <AnimatePresence>
                        {isHovered && !showForecast && (
                            <motion.div
                                initial={{ width: 0, opacity: 0, marginLeft: 0 }}
                                animate={{ width: "auto", opacity: 1, marginLeft: 12 }}
                                exit={{ width: 0, opacity: 0, marginLeft: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                                className="overflow-hidden h-8 flex items-center gap-4"
                            >
                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                    <Wind className="size-3 text-cyan-400" />
                                    <span className="text-xs text-white/80">{Math.round(wind_speed_10m || 0)} <span className="text-[9px] text-white/40">km/h</span></span>
                                </div>
                                <div className="flex items-center gap-1.5 whitespace-nowrap">
                                    <Droplets className="size-3 text-blue-400" />
                                    <span className="text-xs text-white/80">{relative_humidity_2m || 0}<span className="text-[9px] text-white/40">%</span></span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Chevron for toggle indication */}
                    <motion.div
                        animate={{ rotate: showForecast ? 180 : 0 }}
                        className="ml-2 text-white/40"
                    >
                        <ChevronDown className="size-4" />
                    </motion.div>
                </div>
            </motion.div>

            {/* 5-Day Forecast Vertical Pane - Appears on Click */}
            <AnimatePresence>
                {showForecast && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -10 }}
                        animate={{ opacity: 1, height: "auto", y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="mt-1 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl origin-top-left"
                    >
                        {/* Container */}
                        <motion.div
                            className="flex flex-col p-2 space-y-1 cursor-default min-w-[200px]"
                        >
                            <div className="text-[10px] uppercase tracking-widest text-white/40 font-medium px-2 py-1 mb-1">
                                5-Day Forecast
                            </div>

                            {daily?.time.map((date: string, i: number) => {
                                // Skip today (i === 0) as it's displayed in main widget
                                if (i === 0) return null
                                // Show next 5 days (indices 1-5)
                                if (i > 5) return null

                                const dateObj = new Date(date)
                                const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj)

                                return (
                                    <motion.div
                                        key={date}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`group/day flex items-center justify-between rounded-lg px-2 py-1 transition-colors hover:bg-white/5`}
                                    >
                                        {/* Left side: Day & Icon */}
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-medium w-8 text-white/70">
                                                {dayName}
                                            </span>
                                            {getWeatherIcon(daily.weather_code[i], "size-4")}
                                        </div>

                                        {/* Right side: Temps & Condition */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center gap-2 text-xs whitespace-nowrap">
                                                <span className="text-white font-medium">{formatTemp(daily.temperature_2m_max[i])}°</span>
                                                <span className="text-white/30">{formatTemp(daily.temperature_2m_min[i])}°</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
