"use client"

import { Info, RefreshCcw, XCircle, CheckCircle } from "lucide-react"

interface PolicyConditions {
    refund_before_departure?: {
        allowed: boolean
        penalty_amount?: string
        penalty_currency?: string
    }
    change_before_departure?: {
        allowed: boolean
        penalty_amount?: string
        penalty_currency?: string
    }
}

interface PolicyDisplayProps {
    conditions?: PolicyConditions
    checkInDeadline?: string // For hotels
    className?: string
}

export function PolicyDisplay({ conditions, checkInDeadline, className = "" }: PolicyDisplayProps) {
    if (!conditions && !checkInDeadline) {
        return null
    }

    const refund = conditions?.refund_before_departure
    const change = conditions?.change_before_departure

    return (
        <div className={`bg-white/5 border border-white/10 rounded-xl p-5 ${className}`}>
            <div className="flex items-center gap-2 mb-4">
                <Info className="size-5 text-emerald-500" />
                <h3 className="font-semibold text-white">Fare Rules & Cancellation Policy</h3>
            </div>

            <div className="space-y-3">
                {/* Cancellation/Refund Policy */}
                {refund && (
                    <div className="flex items-start gap-3">
                        {refund.allowed ? (
                            <CheckCircle className="size-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        ) : (
                            <XCircle className="size-5 text-red-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                            <p className="text-white font-medium">
                                {refund.allowed ? "Cancellation Allowed" : "Non-Refundable"}
                            </p>
                            <p className="text-sm text-white/60">
                                {refund.allowed ? (
                                    refund.penalty_amount && parseFloat(refund.penalty_amount) > 0 ? (
                                        `Cancel before departure with ${refund.penalty_currency || "USD"} ${refund.penalty_amount} fee`
                                    ) : (
                                        "Free cancellation before departure"
                                    )
                                ) : (
                                    "This fare cannot be refunded after booking"
                                )}
                            </p>
                        </div>
                    </div>
                )}

                {/* Change Policy */}
                {change && (
                    <div className="flex items-start gap-3">
                        {change.allowed ? (
                            <RefreshCcw className="size-5 text-blue-400 mt-0.5 flex-shrink-0" />
                        ) : (
                            <XCircle className="size-5 text-red-400 mt-0.5 flex-shrink-0" />
                        )}
                        <div>
                            <p className="text-white font-medium">
                                {change.allowed ? "Changes Allowed" : "No Changes Permitted"}
                            </p>
                            <p className="text-sm text-white/60">
                                {change.allowed ? (
                                    change.penalty_amount && parseFloat(change.penalty_amount) > 0 ? (
                                        `Change dates/route with ${change.penalty_currency || "USD"} ${change.penalty_amount} fee + fare difference`
                                    ) : (
                                        "Free changes before departure (fare difference may apply)"
                                    )
                                ) : (
                                    "This fare cannot be changed after booking"
                                )}
                            </p>
                        </div>
                    </div>
                )}

                {/* Hotel Check-in Deadline (if applicable) */}
                {checkInDeadline && (
                    <div className="flex items-start gap-3">
                        <Info className="size-5 text-amber-400 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-white font-medium">Free Cancellation Deadline</p>
                            <p className="text-sm text-white/60">
                                Cancel for free until {new Date(checkInDeadline).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                })}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Disclaimer */}
            <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-white/40">
                    By completing this booking, you agree to the fare rules and cancellation policy above.
                    Service fees are non-refundable. Refund timelines vary by airline (typically 5-10 business days).
                </p>
            </div>
        </div>
    )
}
