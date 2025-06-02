import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/dal"

export async function GET(request: NextRequest) {
  try {
    console.log("Products API route called")

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "12")
    const category = searchParams.get("category") || undefined
    const featured = searchParams.get("featured") === "true" ? true : undefined
    const search = searchParams.get("search") || undefined
    const excludeId = searchParams.get("excludeId") || undefined

    console.log("Products API params:", { page, limit, category, featured, search })

    const { getAllProducts } = await import("@/lib/database/products")

    const result = await getAllProducts({ page, limit, category, featured, search, excludeId })
    console.log("Products fetched successfully, count:", result.products.length)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching products:", error)
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
    console.log("Create product API route called")

    const session = await verifySession()

    if (session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const productData = await request.json()
    console.log("Creating product with data:", { ...productData, _id: undefined })

    const { createProduct } = await import("@/lib/database/products")

    const product = await createProduct(productData)
    console.log("Product created successfully:", product._id)

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
