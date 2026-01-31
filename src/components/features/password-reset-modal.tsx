"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Mail, Loader2, CheckCircle, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"

interface PasswordResetModalProps {
    isOpen: boolean
    onClose: () => void
    onBackToSignIn: () => void
}

export function PasswordResetModal({ isOpen, onClose, onBackToSignIn }: PasswordResetModalProps) {
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const { resetPassword } = useAuth()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setLoading(true)
        try {
            const { error } = await resetPassword(email)
            if (error) throw error

            setSent(true)
            toast.success("Reset link sent!", {
                description: "Check your email for the password reset link"
            })
        } catch (err: any) {
            toast.error("Failed to send reset link", {
                description: err.message || "Please try again"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleClose = () => {
        setEmail("")
        setSent(false)
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    onClick={handleClose}
                >
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="relative w-full max-w-md bg-gradient-to-b from-neutral-900 to-black border border-white/10 rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors z-10"
                        >
                            <X className="size-4" />
                        </button>

                        {/* Header */}
                        <div className="px-8 pt-8 pb-6 text-center border-b border-white/5">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/20 mb-4">
                                {sent ? (
                                    <CheckCircle className="size-7 text-emerald-400" />
                                ) : (
                                    <Mail className="size-7 text-amber-400" />
                                )}
                            </div>
                            <h2 className="text-2xl font-bold text-white">
                                {sent ? "Check Your Email" : "Reset Password"}
                            </h2>
                            <p className="text-white/50 text-sm mt-1">
                                {sent
                                    ? "We've sent a password reset link to your email"
                                    : "Enter your email and we'll send you a reset link"}
                            </p>
                        </div>

                        <div className="p-8">
                            {sent ? (
                                <div className="space-y-6">
                                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                        <p className="text-emerald-400 text-sm text-center">
                                            Reset link sent to <strong>{email}</strong>
                                        </p>
                                    </div>

                                    <p className="text-white/40 text-xs text-center">
                                        Didn't receive the email? Check your spam folder or try again.
                                    </p>

                                    <Button
                                        onClick={() => {
                                            setSent(false)
                                            setEmail("")
                                        }}
                                        variant="outline"
                                        className="w-full py-3 border-white/10 text-white hover:bg-white/5"
                                    >
                                        Try a different email
                                    </Button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-white/40" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email address"
                                            required
                                            autoFocus
                                            className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-colors"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={loading || !email}
                                        className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-black font-semibold rounded-xl transition-colors"
                                    >
                                        {loading ? (
                                            <Loader2 className="size-5 animate-spin" />
                                        ) : (
                                            "Send Reset Link"
                                        )}
                                    </Button>
                                </form>
                            )}

                            {/* Back to Sign In */}
                            <button
                                onClick={onBackToSignIn}
                                className="mt-6 w-full flex items-center justify-center gap-2 text-sm text-white/50 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="size-4" />
                                Back to Sign In
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
