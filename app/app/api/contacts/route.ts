import { type NextRequest, NextResponse } from "next/server"
import { createContact, getAllContacts } from "@/lib/database/contacts"
import { verifySession } from "@/lib/dal"

export async function POST(request: NextRequest) {
  try {
    console.log("Contact form submission started")

    const body = await request.json()
    console.log("Contact form data received:", { ...body, message: body.message?.substring(0, 50) + "..." })

    const { name, email, subject, message } = body

    // Validation
    if (!name || !email || !subject || !message) {
      console.log("Validation failed: missing required fields")
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    if (name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: "Name must be between 2 and 100 characters" }, { status: 400 })
    }

    if (subject.length < 5 || subject.length > 200) {
      return NextResponse.json({ error: "Subject must be between 5 and 200 characters" }, { status: 400 })
    }

    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json({ error: "Message must be between 10 and 2000 characters" }, { status: 400 })
    }

    console.log("Creating contact message...")
    const contact = await createContact({ name, email, subject, message })
    console.log("Contact message created successfully:", contact._id)

    return NextResponse.json({
      message: "Message sent successfully! We'll get back to you soon.",
      id: contact._id,
    })
  } catch (error: any) {
    console.error("Contact form error:", error)

    if (error.name === "ValidationError") {
      console.log("Mongoose validation error:", error.message)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(
      {
        error: "Failed to send message. Please try again.",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("Contacts API route called")

    const session = await verifySession()

    if (session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const status = searchParams.get("status") || undefined

    console.log("Contacts API params:", { page, limit, status })

    const result = await getAllContacts({ page, limit, status })
    console.log("Contacts fetched successfully, count:", result.contacts.length)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching contacts:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 },
    )
  }
}
