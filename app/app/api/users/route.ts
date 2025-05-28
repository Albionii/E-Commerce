import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/dal"

export async function GET(request: NextRequest) {
  try {
    console.log("Users API route called")

    const session = await verifySession()

    if (session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    console.log("Users API params:", { page, limit })

    const { getAllUsers } = await import("@/lib/database/users")

    const result = await getAllUsers(page, limit)
    console.log("Users fetched successfully, count:", result.users.length)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
