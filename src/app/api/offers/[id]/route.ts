import { NextResponse } from "next/server"
import { getOffer } from "@/lib/duffel"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const offer = await getOffer(id)

        return NextResponse.json(offer)
    } catch (error: any) {
        console.error("Get offer error:", error)
        return NextResponse.json(
            { error: error.message || "Failed to fetch offer" },
            { status: 500 }
        )
    }
}
