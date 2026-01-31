"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Lock, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Check for error in URL (e.g., expired link)
    useEffect(() => {
        const errorCode = searchParams.get('error')
        const errorDesc = searchParams.get('error_description')
        if (errorCode) {
            setError(errorDesc || 'The reset link is invalid or has expired.')
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast.error("Passwords don't match")
            return
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters")
            return
        }

        setLoading(true)
        try {
            const supabase = createClient()
            const { error } = await supabase.auth.updateUser({ password })

            if (error) throw error

            setSuccess(true)
            toast.success("Password updated!", {
                description: "You can now sign in with your new password"
            })

            // Redirect to home after 2 seconds
            setTimeout(() => {
                router.push('/')
            }, 2000)
        } catch (err: any) {
            toast.error("Failed to update password", {
                description: err.message || "Please try again"
            })
        } finally {
            setLoading(false)
        }
    }

    if (error) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-neutral-900 border border-white/10 rounded-2xl p-8 text-center"
                >
                    <div className="size-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="size-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Link Expired</h1>
                    <p className="text-white/60 mb-6">{error}</p>
                    <Button
                        onClick={() => router.push('/')}
                        className="bg-white text-black hover:bg-white/90"
                    >
                        Return Home
                    </Button>
                </motion.div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-md w-full bg-neutral-900 border border-white/10 rounded-2xl p-8 text-center"
                >
                    <div className="size-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="size-8 text-emerald-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Password Updated!</h1>
                    <p className="text-white/60">Redirecting you to the homepage...</p>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-gradient-to-b from-neutral-900 to-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="px-8 pt-8 pb-6 text-center border-b border-white/5">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                        <Lock className="size-7 text-emerald-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Set New Password</h1>
                    <p className="text-white/50 text-sm mt-1">
                        Enter your new password below
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-4">
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="New password"
                            required
                            minLength={6}
                            autoFocus
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirm new password"
                            required
                            minLength={6}
                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-colors"
                        />
                    </div>

                    <p className="text-white/40 text-xs">
                        Password must be at least 6 characters
                    </p>

                    <Button
                        type="submit"
                        disabled={loading || !password || !confirmPassword}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-colors mt-2"
                    >
                        {loading ? (
                            <Loader2 className="size-5 animate-spin" />
                        ) : (
                            "Update Password"
                        )}
                    </Button>
                </form>
            </motion.div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="size-8 text-emerald-500 animate-spin" />
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}
