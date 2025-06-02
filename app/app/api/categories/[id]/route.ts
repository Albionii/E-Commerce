import mongoose from "mongoose"
import { type NextRequest, NextResponse } from "next/server"
import { verifySession } from "@/lib/dal"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const { getCategoryById } = await import("@/lib/database/categories")
    const category = await getCategoryById(params.id)

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error fetching category:", error)

    if (error.message === "Category not found") {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const session = await verifySession()

    if (session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const categoryData = await request.json()

    const { updateCategory } = await import("@/lib/database/categories")
    const category = await updateCategory(params.id, categoryData)

    return NextResponse.json(category)
  } catch (error) {
    console.error("Error updating category:", error)

    if (error.message === "Category not found") {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

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

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {

    const session = await verifySession()

    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

  
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Invalid category ID format" }, { status: 400 })
    }

    const { deleteCategory } = await import("@/lib/database/categories")

    try {
      await deleteCategory(params.id)
      return NextResponse.json({ success: true })
    } catch (error) {
      if (error.message === "Category not found") {
        return NextResponse.json({ error: "Category not found" }, { status: 404 })
      }

      if (error.message.includes("Cannot delete category")) {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }

      throw error 
    }
  } catch (error) {
    console.error("Error in DELETE category API:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
