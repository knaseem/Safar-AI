import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { getOrder, getOrderCancellationQuote, confirmOrderCancellation } from "@/lib/duffel"

// GET - Get single order details
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            )
        }

        const { id } = await params

        // Get from our database first
        const { data: order, error } = await supabase
            .from("orders")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .single()

        if (error || !order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            )
        }

        // Optionally fetch fresh data from Duffel
        let duffelOrder = null
        try {
            duffelOrder = await getOrder(order.duffel_order_id)
        } catch (e) {
            console.warn("Could not fetch Duffel order:", e)
        }

        return NextResponse.json({
            ...order,
            duffel_data: duffelOrder,
        })
    } catch (error: any) {
        console.error("Get order error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to fetch order" },
            { status: 500 }
        )
    }
}

// DELETE - Cancel an order
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json(
                { error: "Authentication required" },
                { status: 401 }
            )
        }

        const { id } = await params
        const { searchParams } = new URL(request.url)
        const confirmCancel = searchParams.get("confirm") === "true"

        // Get order from database
        const { data: order, error } = await supabase
            .from("orders")
            .select("*")
            .eq("id", id)
            .eq("user_id", user.id)
            .single()

        if (error || !order) {
            return NextResponse.json(
                { error: "Order not found" },
                { status: 404 }
            )
        }

        if (order.status === "cancelled") {
            return NextResponse.json(
                { error: "Order is already cancelled" },
                { status: 400 }
            )
        }

        // Step 1: Get cancellation quote
        const quote = await getOrderCancellationQuote(order.duffel_order_id)

        // If not confirming, just return the quote
        if (!confirmCancel) {
            return NextResponse.json({
                quote: {
                    id: quote.id,
                    refund_amount: quote.refund_amount,
                    refund_currency: quote.refund_currency,
                    expires_at: quote.expires_at,
                },
                message: "Add ?confirm=true to confirm cancellation",
            })
        }

        // Step 2: Confirm cancellation
        const cancellation = await confirmOrderCancellation(quote.id)

        // Step 3: Update database
        await supabase
            .from("orders")
            .update({
                status: "cancelled",
                cancelled_at: new Date().toISOString(),
                metadata: {
                    ...order.metadata,
                    refund_amount: cancellation.refund_amount,
                    cancellation_id: cancellation.id,
                },
            })
            .eq("id", id)

        return NextResponse.json({
            success: true,
            refund_amount: cancellation.refund_amount,
            refund_currency: cancellation.refund_currency,
            message: "Order cancelled successfully. Refund will be processed within 5-10 business days.",
        })
    } catch (error: any) {
        console.error("Cancel order error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to cancel order" },
            { status: 500 }
        )
    }
}
