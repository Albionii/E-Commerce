import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/dal"

export async function GET(request: NextRequest) {
  try {
    const session = await verifySession()
    console.log("Session verified:", { userId: session.userId, role: session.role })

    if (session.role !== "admin") {
      console.log("Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Import here to avoid early connection issues
    const { getTotalRevenue } = await import("@/lib/database/orders")

    console.log("Fetching order stats...")
    const stats = await getTotalRevenue()
    console.log("Stats fetched successfully:", stats)

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
