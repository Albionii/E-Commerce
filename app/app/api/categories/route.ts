import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/dal"

export async function GET(request: NextRequest) {
  try {

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const search = searchParams.get("search") || undefined
    const includeProductCount = searchParams.get("includeProductCount") === "true"


    const { getAllCategories } = await import("@/lib/database/categories")

    const result = await getAllCategories({ page, limit, search, includeProductCount })

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {

    const session = await verifySession()

    if (session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const categoryData = await request.json()

    const { createCategory } = await import("@/lib/database/categories")

    const category = await createCategory(categoryData)

    return NextResponse.json(category, { status: 201 })
  } catch (error) {
    console.error("Error creating category:", error)

    if (error.message.includes("already exists")) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }

    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
