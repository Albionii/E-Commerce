import { type NextRequest, NextResponse } from "next/server"
import { getProductById, updateProduct, deleteProduct } from "@/lib/database/products"
import { verifySession } from "@/lib/dal"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("GET /api/products/[id] - Product ID:", params.id)

    const product = await getProductById(params.id)

    if (!product) {
      console.log("Product not found:", params.id)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    console.log("Product found:", product.name)
    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("PATCH /api/products/[id] - Product ID:", params.id)

    const session = await verifySession()
    console.log("Session verified:", { userId: session.userId, role: session.role })

    if (session.role !== "admin") {
      console.log("Unauthorized access attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updateData = await request.json()
    console.log("Update data received:", updateData)

    if (!updateData.name || !updateData.description || !updateData.price || !updateData.category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const product = await updateProduct(params.id, updateData)

    if (!product) {
      console.log("Product not found for update:", params.id)
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    console.log("Product updated successfully:", product.name)
    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log("DELETE /api/products/[id] - Product ID:", params.id)

    const session = await verifySession()

    if (session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const product = await deleteProduct(params.id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    console.log("Product deleted successfully")
    return NextResponse.json({ message: "Product deleted successfully" })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
